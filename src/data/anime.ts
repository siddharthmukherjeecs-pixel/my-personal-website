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

export const animeData: AnimeItem[] = [
	{
		title: "Steins;Gate",
		status: "completed",
		rating: 9.8,
		year: "2011",
		studio: "White Fox",
		genres: ["Sci-Fi", "Thriller", "Psychological"],
		description:
			"A brilliant, harrowing exploration of causality, non-linear timelines, and the immense psychological weight of deterministic systems.",
	},
	{
		title: "Serial Experiments Lain",
		status: "completed",
		rating: 9.5,
		year: "1998",
		studio: "Triangle Staff",
		genres: ["Cyberpunk", "Psychological", "Sci-Fi"],
		description:
			"An avant-garde masterpiece anticipating ubiquitous networked consciousness, digital solitude, and ontological boundary dissolution.",
	},
	{
		title: "Ghost in the Shell: Stand Alone Complex",
		status: "completed",
		rating: 9.6,
		year: "2002",
		studio: "Production I.G",
		genres: ["Cyberpunk", "Action", "Philosophy"],
		description:
			"Philosophically rigorous procedural examining emergent phenomena, distributed social consensus, and human identity in cybernetic bodies.",
	},
	{
		title: "Sousou no Frieren",
		status: "completed",
		rating: 9.7,
		year: "2023",
		studio: "Madhouse",
		genres: ["Fantasy", "Drama", "Slice of Life"],
		description:
			"A quiet, contemplative meditation on time, fleeting human connections, and the lingering residue of past journeys across centuries.",
	},
];
