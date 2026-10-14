import type { APIRoute } from "astro";
import { fetchMediaMetadata } from "../../utils/media-fetcher";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
	const title = url.searchParams.get("title") || "";
	const rawType = url.searchParams.get("type") || "manhwa";

	const type =
		rawType === "anime"
			? "anime"
			: rawType === "manga"
				? "manga"
				: rawType === "webtoon"
					? "webtoon"
					: rawType === "manhua"
						? "manhua"
						: "manhwa";

	if (!title.trim()) {
		return new Response(
			JSON.stringify({ error: "Missing required 'title' query parameter" }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	try {
		const meta = await fetchMediaMetadata(title, type);
		if (!meta) {
			return new Response(
				JSON.stringify({
					success: false,
					message: `No metadata found for '${title}'`,
				}),
				{ status: 404, headers: { "Content-Type": "application/json" } },
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: meta,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
				},
			},
		);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Lookup failed";
		return new Response(
			JSON.stringify({ success: false, error: message }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};
