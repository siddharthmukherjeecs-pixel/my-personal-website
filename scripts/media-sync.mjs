import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ANIME_PATH = resolve(process.cwd(), "src/data/anime.json");
const MANGA_PATH = resolve(process.cwd(), "src/data/manga.json");

async function queryAniList(title, type) {
	const mediaType = type === "anime" ? "ANIME" : "MANGA";
	const query = `
		query ($search: String, $type: MediaType) {
			Media (search: $search, type: $type) {
				id
				title { english romaji native }
				coverImage { extraLarge large medium }
				bannerImage
				description(asHtml: false)
				averageScore
				genres
				format
				countryOfOrigin
				startDate { year }
				siteUrl
				studios(isMain: true) { nodes { name } }
				staff(perPage: 3) {
					edges {
						role
						node { name { full } }
					}
				}
			}
		}
	`;

	try {
		const res = await fetch("https://graphql.anilist.co", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({ query, variables: { search: title, type: mediaType } }),
		});
		if (!res.ok) return null;
		const json = await res.json();
		const m = json.data?.Media;
		if (!m) return null;

		const cover = m.coverImage?.extraLarge || m.coverImage?.large || m.coverImage?.medium || "";
		const authorEdge = m.staff?.edges?.find((e) => /story|art|author|creator/i.test(e.role));
		const authorOrStudio =
			mediaType === "ANIME"
				? m.studios?.nodes?.[0]?.name
				: authorEdge?.node?.name?.full || m.staff?.edges?.[0]?.node?.name?.full;

		const desc = m.description ? m.description.replace(/<[^>]+>/g, "").trim() : "";
		const rating = typeof m.averageScore === "number" ? Math.round((m.averageScore / 10) * 10) / 10 : undefined;

		return {
			title: m.title?.english || m.title?.romaji || title,
			cover,
			description: desc,
			rating,
			year: m.startDate?.year ? String(m.startDate.year) : undefined,
			genres: Array.isArray(m.genres) ? m.genres : [],
			authorOrStudio,
			link: m.siteUrl,
		};
	} catch {
		return null;
	}
}

async function queryJikan(title, type) {
	try {
		const mediaType = type === "anime" ? "anime" : "manga";
		const url = `https://api.jikan.moe/v4/${mediaType}?q=${encodeURIComponent(title)}&limit=1`;
		const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(4000) });
		if (!res.ok) return null;
		const json = await res.json();
		const m = json.data?.[0];
		if (!m) return null;

		const cover = m.images?.webp?.large_image_url || m.images?.jpg?.large_image_url || m.images?.webp?.image_url || "";
		const authorOrStudio = type === "anime" ? m.studios?.[0]?.name : m.authors?.[0]?.name;
		const desc = m.synopsis ? m.synopsis.replace(/<[^>]+>/g, "").trim() : "";
		const genres = Array.isArray(m.genres) ? m.genres.map((g) => g.name) : [];

		return {
			title: m.title_english || m.title || title,
			cover,
			description: desc,
			rating: typeof m.score === "number" ? m.score : undefined,
			year: m.year ? String(m.year) : undefined,
			genres,
			authorOrStudio,
			link: m.url,
		};
	} catch {
		return null;
	}
}

async function isUrlValid(url) {
	if (!url || typeof url !== "string" || !url.startsWith("http")) return false;
	try {
		const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(4000) });
		return res.ok;
	} catch {
		return false;
	}
}

async function syncMediaFile(filePath, defaultType, label) {
	if (!existsSync(filePath)) {
		console.log(`[media-sync] ${label} file not found at ${filePath}`);
		return;
	}

	const raw = readFileSync(filePath, "utf-8");
	const data = JSON.parse(raw);
	const items = data.items || [];
	let updatedCount = 0;
	const force = process.argv.includes("--force");

	console.log(`\n[media-sync] Checking ${items.length} ${label} items...`);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const type = item.type || defaultType;

		const validCover = !force && item.cover && item.cover.trim() ? await isUrlValid(item.cover) : false;

		if (!validCover || !item.description) {
			if (!validCover && item.cover) {
				process.stdout.write(`  ⚠ Cover for "${item.title}" is invalid/broken. Re-fetching... `);
			} else {
				process.stdout.write(`  → Looking up "${item.title}" (${type})... `);
			}

			let meta = await queryAniList(item.title, type);
			if (!meta || !meta.cover) {
				meta = await queryJikan(item.title, type);
			}

			if (meta && meta.cover) {
				item.cover = meta.cover;
				if (!item.description) item.description = meta.description;
				if (!item.year && meta.year) item.year = meta.year;
				if ((!item.genres || item.genres.length === 0) && meta.genres.length > 0) item.genres = meta.genres;
				if (type === "anime" && !item.studio && meta.authorOrStudio) item.studio = meta.authorOrStudio;
				if (type !== "anime" && !item.author && meta.authorOrStudio) item.author = meta.authorOrStudio;
				if (!item.link && meta.link) item.link = meta.link;

				updatedCount++;
				console.log(`✓ Fetched fresh cover & details!`);
			} else {
				console.log(`⚠ No cover found.`);
			}
			await new Promise((r) => setTimeout(r, 200));
		} else {
			console.log(`  ✓ "${item.title}" cover is valid.`);
		}
	}

	if (updatedCount > 0) {
		writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
		console.log(`[media-sync] Updated ${updatedCount} ${label} items in ${filePath}`);
	} else {
		console.log(`[media-sync] All ${label} items are already up to date.`);
	}
}

async function run() {
	console.log("=== AniList / Jikan Media Auto-Sync ===");
	await syncMediaFile(ANIME_PATH, "anime", "Anime");
	await syncMediaFile(MANGA_PATH, "manhwa", "Manga / Manhwa / Webtoon");
	console.log("\n[media-sync] Done!");
}

run();
