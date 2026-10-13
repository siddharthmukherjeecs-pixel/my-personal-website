/**
 * 时间线页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/timelineConfig.ts 控制。
 */
import type { TimelineItem } from "@/types/timelineConfig";

export const timelineData: TimelineItem[] = [
	{
		title: "The Unordinary — Literary Novel Completed",
		date: "2026.01",
		category: "milestone",
		subtitle: "Literary Fiction",
		description:
			"Completed the manuscript for The Unordinary, exploring the mechanics of perception, memory, and interior solitudes.",
		highlights: [
			"Interrogates the friction between calibrated routines and unspoken realities",
			"Measured, evocative prose treated with structural architectural rigor",
		],
		tags: ["Novel", "Literature", "Writing", "Fiction"],
		icon: "material-symbols:auto-stories-outline-rounded",
		featured: true,
	},
	{
		title: "C Ray Tracer Architecture & Path Tracing Engine",
		date: "2025.08",
		category: "project",
		subtitle: "Systems & Graphics",
		description:
			"Developed a physically-based path tracer from scratch in pure C with BVH spatial acceleration, SIMD optimization, and multithreading.",
		highlights: [
			"Implemented dielectric glass, matte, and metal BSDFs",
			"Thin-lens depth of field and tiled rendering pipeline",
		],
		tags: ["C", "Graphics", "Ray Tracing", "BVH", "Optics"],
		icon: "material-symbols:wb-iridescent-outline-rounded",
		featured: true,
	},
	{
		title: "Neural Radiance & Latent Synthesis Research",
		date: "2025.01",
		category: "project",
		subtitle: "AI/ML Exploration",
		description:
			"Research into coordinate-based neural representations, volumetric rendering, and compact spatial priors for high-fidelity 3D reconstruction.",
		tags: ["Python", "PyTorch", "CUDA", "AI/ML"],
		icon: "material-symbols:psychology-outline-rounded",
		featured: false,
	},
];

/** 获取所有时间线数据列表 */
export function getTimelineList(): TimelineItem[] {
	return timelineData;
}
