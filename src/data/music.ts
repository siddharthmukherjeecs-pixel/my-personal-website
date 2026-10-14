import type { TrackDescriptor } from "@/types/musicConfig";

/**
 * 侧栏音乐本地曲目数据源。
 */
export const musicTracks: readonly TrackDescriptor[] = [
	{
		id: "dazbee",
		title: "口笛で愛は歌えない",
		artist: "Dazbee",
		cover: "/assets/music/cover/dazbee.webp",
		source: "/assets/music/url/dazbee.mp3",
		duration: 241,
	},
	{
		id: "hitori",
		title: "ひとり上手",
		artist: "Kaya",
		cover: "/assets/music/cover/hitori.webp",
		source: "/assets/music/url/hitori.mp3",
		duration: 253,
	},
	{
		id: "xryx",
		title: "眩耀夜行",
		artist: "スリーズブーケ",
		cover: "/assets/music/cover/xryx.webp",
		source: "/assets/music/url/xryx.mp3",
		duration: 245,
	},
	{
		id: "cl",
		title: "春雷の頃",
		artist: "22/7",
		cover: "/assets/music/cover/cl.webp",
		source: "/assets/music/url/cl.mp3",
		duration: 242,
	},
];
