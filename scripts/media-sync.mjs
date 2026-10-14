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

async function syncMediaFile(filePath, defaultType, label) {
	if (!existsSync(filePath)) {
		console.log(`[media-sync] ${label} file not found at ${filePath}`);
		return;
	}

	const raw = readFileSync(filePath, "utf-8");
	const data = JSON.parse(raw);
	const items = data.items || [];
	let updatedCount = 0;

	console.log(`\n[media-sync] Checking ${items.length} ${label} items...`);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const type = item.type || defaultType;

		if (!item.cover || !item.cover.trim() || !item.description) {
			process.stdout.write(`  → Looking up "${item.title}" (${type})... `);
			const meta = await queryAniList(item.title, type);
			if (meta && meta.cover) {
				if (!item.cover || !item.cover.trim()) item.cover = meta.cover;
				if (!item.description) item.description = meta.description;
				if (!item.year && meta.year) item.year = meta.year;
				if ((!item.genres || item.genres.length === 0) && meta.genres.length > 0) item.genres = meta.genres;
				if (type === "anime" && !item.studio && meta.authorOrStudio) item.studio = meta.authorOrStudio;
				if (type !== "anime" && !item.author && meta.authorOrStudio) item.author = meta.authorOrStudio;
				if (!item.link && meta.link) item.link = meta.link;

				updatedCount++;
				console.log(`✓ Fetched cover & details!`);
			} else {
				console.log(`⚠ No cover found.`);
			}
			// slight delay to be polite to AniList
			await new Promise((r) => setTimeout(r, 200));
		} else {
			console.log(`  ✓ "${item.title}" already has cover.`);
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
