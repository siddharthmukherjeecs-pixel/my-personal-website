import { type MangaItem, mangaData } from "../data/manga";
import { fetchMediaMetadata } from "./media-fetcher";

export const MANGA_STATUS_META = {
	reading: {
		label: "Reading",
		icon: "material-symbols:auto-stories-outline-rounded",
		color: "var(--primary)",
	},
	completed: {
		label: "Completed",
		icon: "material-symbols:check-circle-outline-rounded",
		color: "var(--tertiary)",
	},
	planned: {
		label: "Plan to Read",
		icon: "material-symbols:bookmark-outline-rounded",
		color: "var(--secondary)",
	},
	onHold: {
		label: "On Hold",
		icon: "material-symbols:pause-circle-outline-rounded",
		color: "var(--outline)",
	},
	dropped: {
		label: "Dropped",
		icon: "material-symbols:cancel-outline-rounded",
		color: "var(--error)",
	},
} as const;

export const MANGA_TYPE_META = {
	manhwa: {
		label: "Manhwa (만화)",
		shortLabel: "Manhwa",
		badge: "MANHWA",
		color: "#ec4899", // pink-500
		icon: "material-symbols:menu-book-rounded",
	},
	webtoon: {
		label: "Webtoon (웹툰)",
		shortLabel: "Webtoon",
		badge: "WEBTOON",
		color: "#10b981", // emerald-500
		icon: "material-symbols:phone-android-outline-rounded",
	},
	manga: {
		label: "Manga (漫画)",
		shortLabel: "Manga",
		badge: "MANGA",
		color: "#3b82f6", // blue-500
		icon: "material-symbols:book-2-outline-rounded",
	},
	manhua: {
		label: "Manhua (漫画)",
		shortLabel: "Manhua",
		badge: "MANHUA",
		color: "#f59e0b", // amber-500
		icon: "material-symbols:import-contacts-rounded",
	},
} as const;

/**
 * Resolves the true comic format by checking countryOfOrigin first:
 * - KR (South Korea) -> manhwa (or webtoon)
 * - JP (Japan) -> manga
 * - CN / TW (China / Taiwan) -> manhua
 */
export function resolveMangaType(item: MangaItem): MangaType {
	if (item.country) {
		const c = item.country.toUpperCase();
		if (c === "KR") return item.type === "webtoon" ? "webtoon" : "manhwa";
		if (c === "JP") return "manga";
		if (c === "CN" || c === "TW") return "manhua";
	}
	return item.type || "manga";
}

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
