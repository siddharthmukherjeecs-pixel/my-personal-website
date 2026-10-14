import { type MangaItem, mangaData } from "../data/manga";
import { fetchMediaMetadata } from "./media-fetcher";

export {
	MANGA_STATUS_META,
	MANGA_TYPE_META,
	resolveMangaType,
} from "./manga/constants";

/**
 * Get manga list with automatic AniList/Jikan enrichment for missing covers/synopses
 */
export async function getMangaList(): Promise<MangaItem[]> {
	const items = [...mangaData];

	const enriched = await Promise.all(
		items.map(async (item) => {
			if (item.cover && item.cover.trim() && item.description && item.author && item.country) {
				return item;
			}

			try {
				const meta = await fetchMediaMetadata(item.title, item.type || "manhwa");
				if (meta) {
					const country = item.country || meta.country || undefined;
					let inferredType = item.type;
					if (!inferredType && country) {
						inferredType = country === "KR" ? "manhwa" : country === "JP" ? "manga" : country === "CN" ? "manhua" : "manga";
					}

					return {
						...item,
						type: inferredType,
						country,
						cover: item.cover || meta.cover || undefined,
						description: item.description || meta.description || undefined,
						author: item.author || meta.authorOrStudio || undefined,
						year: item.year || meta.year || undefined,
						genres:
							item.genres && item.genres.length > 0
								? item.genres
								: meta.genres || [],
						link: item.link || meta.link || undefined,
					};
				}
			} catch {
				// ignore fetch failures
			}

			return item;
		}),
	);

	return enriched;
}
