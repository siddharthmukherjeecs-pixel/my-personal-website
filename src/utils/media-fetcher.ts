import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface FetchedMediaMeta {
	title: string;
	cover: string;
	banner?: string;
	description?: string;
	rating?: number;
	year?: string;
	genres?: string[];
	authorOrStudio?: string;
	link?: string;
	country?: string;
	format?: string;
}

const CACHE_PATH = resolve(process.cwd(), "node_modules/.cache/media-metadata-cache.json");
const memoryCache = new Map<string, FetchedMediaMeta | null>();

function loadDiskCache(): void {
	try {
		if (existsSync(CACHE_PATH)) {
			const raw = readFileSync(CACHE_PATH, "utf-8");
			const parsed = JSON.parse(raw);
			for (const [k, v] of Object.entries(parsed)) {
				memoryCache.set(k, v as FetchedMediaMeta | null);
			}
		}
	} catch {
		// ignore
	}
}

function saveDiskCache(): void {
	try {
		const dir = dirname(CACHE_PATH);
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}
		const obj: Record<string, FetchedMediaMeta | null> = {};
		for (const [k, v] of memoryCache.entries()) {
			obj[k] = v;
		}
		writeFileSync(CACHE_PATH, JSON.stringify(obj, null, 2), "utf-8");
	} catch {
		// ignore
	}
}

loadDiskCache();

function stripHtml(html?: string): string {
	if (!html) return "";
	return html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/?[^>]+(>|$)/g, "")
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&amp;/g, "&")
		.trim();
}

/**
 * Query AniList GraphQL API for Anime or Manga/Manhwa/Webtoon
 */
export async function queryAniList(
	title: string,
	mediaType: "ANIME" | "MANGA",
): Promise<FetchedMediaMeta | null> {
	const query = `
		query ($search: String, $type: MediaType) {
			Media (search: $search, type: $type) {
				id
				title {
					english
					romaji
					native
				}
				coverImage {
					extraLarge
					large
					medium
				}
				bannerImage
				description(asHtml: false)
				averageScore
				genres
				format
				countryOfOrigin
				startDate {
					year
				}
				siteUrl
				studios(isMain: true) {
					nodes {
						name
					}
				}
				staff(perPage: 3) {
					edges {
						role
						node {
							name {
								full
							}
						}
					}
				}
			}
		}
	`;

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 6000);

		const response = await fetch("https://graphql.anilist.co", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query,
				variables: { search: title, type: mediaType },
			}),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) return null;

		const json = await response.json();
		const media = json.data?.Media;
		if (!media) return null;

		const cover =
			media.coverImage?.extraLarge ||
			media.coverImage?.large ||
			media.coverImage?.medium ||
			"";

		const authorEdge = media.staff?.edges?.find(
			(e: { role: string }) =>
				/story|art|author|creator/i.test(e.role),
		);
		const authorOrStudio =
			mediaType === "ANIME"
				? media.studios?.nodes?.[0]?.name
				: authorEdge?.node?.name?.full || media.staff?.edges?.[0]?.node?.name?.full;

		const rating =
			typeof media.averageScore === "number"
				? Math.round((media.averageScore / 10) * 10) / 10
				: undefined;

		return {
			title: media.title?.english || media.title?.romaji || title,
			cover,
			banner: media.bannerImage || undefined,
			description: stripHtml(media.description),
			rating,
			year: media.startDate?.year ? String(media.startDate.year) : undefined,
			genres: Array.isArray(media.genres) ? media.genres : [],
			authorOrStudio: authorOrStudio || undefined,
			link: media.siteUrl || undefined,
			country: media.countryOfOrigin || undefined,
			format: media.format || undefined,
		};
	} catch {
		return null;
	}
}

/**
 * Query Jikan (MyAnimeList) API as fallback
 */
export async function queryJikan(
	title: string,
	type: "anime" | "manga",
): Promise<FetchedMediaMeta | null> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 4000);

		const url = `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(title)}&limit=1`;
		const response = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) return null;

		const json = await response.json();
		const item = json.data?.[0];
		if (!item) return null;

		const cover =
			item.images?.webp?.large_image_url ||
			item.images?.jpg?.large_image_url ||
			item.images?.webp?.image_url ||
			"";

		const authorOrStudio =
			type === "anime"
				? item.studios?.[0]?.name
				: item.authors?.[0]?.name;

		const genres = Array.isArray(item.genres)
			? item.genres.map((g: { name: string }) => g.name)
			: [];

		return {
			title: item.title_english || item.title || title,
			cover,
			description: stripHtml(item.synopsis),
			rating: typeof item.score === "number" ? item.score : undefined,
			year: item.year ? String(item.year) : undefined,
			genres,
			authorOrStudio,
			link: item.url,
		};
	} catch {
		return null;
	}
}

/**
 * Unified fetcher that queries AniList first, then falls back to Jikan
 */
export async function fetchMediaMetadata(
	title: string,
	type: "anime" | "manga" | "manhwa" | "webtoon" | "manhua",
): Promise<FetchedMediaMeta | null> {
	const trimmed = title.trim();
	if (!trimmed) return null;

	const cacheKey = `${type}:${trimmed.toLowerCase()}`;
	if (memoryCache.has(cacheKey)) {
		return memoryCache.get(cacheKey) || null;
	}

	const isAnime = type === "anime";
	const aniListType = isAnime ? "ANIME" : "MANGA";

	let meta = await queryAniList(trimmed, aniListType);

	if (!meta || !meta.cover) {
		const jikanType = isAnime ? "anime" : "manga";
		const fallback = await queryJikan(trimmed, jikanType);
		if (fallback && fallback.cover) {
			meta = {
				...fallback,
				...meta,
				cover: fallback.cover,
			};
		}
	}

	memoryCache.set(cacheKey, meta);
	saveDiskCache();
	return meta;
}
