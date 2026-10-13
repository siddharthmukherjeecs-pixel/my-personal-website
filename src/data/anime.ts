/**
 * 番剧收藏数据（本地数据源）。
 * 用于番剧页：src/pages/anime.astro → organisms/AnimeSection → molecules/AnimeCard。
 *
 * 添加条目：在 animeData 中追加一项即可，状态筛选 chips 与计数自动生成。
 */

import type { AnimeIdentity } from "../types/animeConfig.ts";

/** 收藏状态（Bangumi 领域通行五态） */
export type AnimeStatus =
	| "watching"
	| "completed"
	| "planned"
	| "onHold"
	| "dropped";

export interface AnimeItem {
	title: string;
	cover?: string;
	link?: string;
	status: AnimeStatus;
	rating: number;
	progress?: { watched: number; total: number };
	description?: string;
	year: string;
	studio?: string;
	genres: string[];
	period?: { start: string; end: string };
	identity?: AnimeIdentity;
}

export const animeData: AnimeItem[] = [];
