export type MangaStatus =
	| "reading"
	| "completed"
	| "planned"
	| "onHold"
	| "dropped";

export type MangaType = "manhwa" | "manga" | "webtoon" | "manhua";

export interface MangaItem {
	title: string;
	type: MangaType;
	status: MangaStatus;
	rating: number;
	progress?: string;
	cover?: string;
	backupCover?: string;
	author?: string;
	year?: string;
	country?: string;
	genres: string[];
	description?: string;
	link?: string;
}

import mangaJson from "./manga.json";

export const mangaData: MangaItem[] = (mangaJson.items || []) as MangaItem[];
