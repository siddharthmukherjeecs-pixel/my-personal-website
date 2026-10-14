import type { APIRoute } from "astro";

export const prerender = false;

interface Message {
	id: string;
	name: string;
	content: string;
	date: string;
	color: "butter" | "rose" | "mint" | "sky" | "lilac";
}

const STORAGE_KEY = "kanade:guestbook:notes";
const ALLOWED_COLORS = new Set(["butter", "rose", "mint", "sky", "lilac"]);

async function getCredentials() {
	const candidatesUrl = [
		"STORAGE_REDIS_REST_URL",
		"STORAGE_REST_API_URL",
		"STORAGE_URL",
		"KV_REST_API_URL",
		"UPSTASH_REDIS_REST_URL",
	];
	const candidatesToken = [
		"STORAGE_REDIS_REST_TOKEN",
		"STORAGE_REST_API_TOKEN",
		"STORAGE_TOKEN",
		"KV_REST_API_TOKEN",
		"UPSTASH_REDIS_REST_TOKEN",
	];

	let url: string | undefined;
	let token: string | undefined;

	for (const key of candidatesUrl) {
		if (process.env[key]) {
			url = process.env[key];
			break;
		}
	}
	for (const key of candidatesToken) {
		if (process.env[key] && !key.includes("READ_ONLY") && !key.includes("READONLY")) {
			token = process.env[key];
			break;
		}
	}

	if (!url || !token) {
		for (const [k, v] of Object.entries(process.env)) {
			if (!url && typeof v === "string" && v.startsWith("https://") && (k.includes("REST_URL") || k.includes("REDIS") || k.endsWith("_URL"))) {
				url = v;
			}
			if (
				!token &&
				typeof v === "string" &&
				!k.includes("READ_ONLY") &&
				!k.includes("READONLY") &&
				(k.includes("REST_TOKEN") || k.endsWith("_TOKEN"))
			) {
				token = v;
			}
		}
	}

	if (!url || !token) {
		try {
			const { getSecret } = await import("astro:env/server");
			for (const key of candidatesUrl) {
				if (!url) url = getSecret(key);
			}
			for (const key of candidatesToken) {
				if (!token) token = getSecret(key);
			}
		} catch {
			// ignore
		}
	}

	return { url, token };
}

async function runRedisCommand(command: unknown[]): Promise<unknown> {
	const { url, token } = await getCredentials();
	if (!url || !token) {
		return null;
	}

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(command),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Redis error (${response.status}): ${text}`);
	}

	const data = await response.json();
	return data.result;
}

export const GET: APIRoute = async () => {
	try {
		const { url, token } = await getCredentials();
		if (!url || !token) {
			return new Response(
				JSON.stringify({
					success: true,
					synced: false,
					reason:
						"Database not connected. Add Upstash Redis in Vercel Storage to enable live syncing for all visitors.",
					messages: [],
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const raw = await runRedisCommand(["GET", STORAGE_KEY]);
		let messages: Message[] = [];
		if (typeof raw === "string" && raw) {
			try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					messages = parsed;
				}
			} catch {
				messages = [];
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				synced: true,
				messages,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
				},
			},
		);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch messages";
		return new Response(
			JSON.stringify({ success: false, synced: false, error: message }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const { url, token } = await getCredentials();
		const body = await request.json();

		const author = typeof body.name === "string" ? body.name.trim() : "";
		const text =
			typeof body.content === "string" ? body.content.trim() : "";
		const color = ALLOWED_COLORS.has(body.color) ? body.color : "butter";

		if (!author || !text) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Name and message content are required.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		if (author.length > 24 || text.length > 500) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Name max length is 24 and content max length is 500.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const newNote: Message = {
			id:
				globalThis.crypto?.randomUUID?.() ||
				`${Date.now()}-${Math.random().toString(36).slice(2)}`,
			name: author,
			content: text,
			date: new Date().toISOString(),
			color,
		};

		if (!url || !token) {
			return new Response(
				JSON.stringify({
					success: true,
					synced: false,
					message: newNote,
					reason:
						"Database not connected. Note saved locally only until Upstash Redis is connected in Vercel Storage.",
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);
		}

		// Fetch existing, prepend new note, limit to 100 notes
		const raw = await runRedisCommand(["GET", STORAGE_KEY]);
		let current: Message[] = [];
		if (typeof raw === "string" && raw) {
			try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) current = parsed;
			} catch {
				current = [];
			}
		}

		const updated = [newNote, ...current.filter((n) => n.id !== newNote.id)].slice(
			0,
			100,
		);

		await runRedisCommand(["SET", STORAGE_KEY, JSON.stringify(updated)]);

		return new Response(
			JSON.stringify({
				success: true,
				synced: true,
				message: newNote,
			}),
			{ status: 201, headers: { "Content-Type": "application/json" } },
		);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to post message";
		return new Response(
			JSON.stringify({ success: false, error: message }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};

export const DELETE: APIRoute = async ({ request }) => {
	try {
		const { url, token } = await getCredentials();
		if (!url || !token) {
			return new Response(
				JSON.stringify({
					success: true,
					synced: false,
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);
		}

		const body = await request.json();
		const id = typeof body.id === "string" ? body.id : "";
		if (!id) {
			return new Response(
				JSON.stringify({ success: false, error: "Note ID required." }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const raw = await runRedisCommand(["GET", STORAGE_KEY]);
		let current: Message[] = [];
		if (typeof raw === "string" && raw) {
			try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) current = parsed;
			} catch {
				current = [];
			}
		}

		const updated = current.filter((note) => note.id !== id);
		await runRedisCommand(["SET", STORAGE_KEY, JSON.stringify(updated)]);

		return new Response(
			JSON.stringify({ success: true, synced: true }),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to delete message";
		return new Response(
			JSON.stringify({ success: false, error: message }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};
