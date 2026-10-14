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
		label: "Manhwa",
		badge: "MANHWA",
		color: "#ec4899", // pink-500
		icon: "material-symbols:menu-book-rounded",
	},
	manga: {
		label: "Manga",
		badge: "MANGA",
		color: "#3b82f6", // blue-500
		icon: "material-symbols:book-2-outline-rounded",
	},
	webtoon: {
		label: "Webtoon",
		badge: "WEBTOON",
		color: "#10b981", // emerald-500
		icon: "material-symbols:phone-android-outline-rounded",
	},
	manhua: {
		label: "Manhua",
		badge: "MANHUA",
		color: "#f59e0b", // amber-500
		icon: "material-symbols:import-contacts-rounded",
	},
} as const;

/**
 * Get manga list with automatic AniList/Jikan enrichment for missing covers/synopses
 */
export async function getMangaList(): Promise<MangaItem[]> {
	const items = [...mangaData];

	const enriched = await Promise.all(
		items.map(async (item) => {
			if (item.cover && item.cover.trim() && item.description && item.author) {
				return item;
			}

			try {
				const meta = await fetchMediaMetadata(item.title, item.type || "manhwa");
				if (meta) {
					return {
						...item,
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
