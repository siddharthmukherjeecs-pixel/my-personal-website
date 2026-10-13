/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "c-ray-tracer",
		title: "C Ray Tracer",
		summary:
			"A physically-based path tracer written from scratch in pure C. Implements bounding volume hierarchies (BVH), dielectric glass and metal materials, thin-lens depth of field, and multi-threaded tile rendering with SIMD optimization.",
		category: "graphics",
		phase: "shipped",
		technologies: ["C", "BVH", "Multithreading", "Optics", "Computer Graphics"],
		icon: "material-symbols:wb-iridescent-outline-rounded",
		featured: true,
		repository: "https://github.com",
		year: "2025–2026",
	},
	{
		key: "neural-representations",
		title: "Neural Radiance & Latent Synthesis",
		summary:
			"Research implementation studying coordinate-based neural representations, volumetric rendering, and compact spatial priors for high-fidelity 3D reconstruction.",
		category: "ai-ml",
		phase: "building",
		technologies: ["Python", "PyTorch", "CUDA", "Computer Vision"],
		icon: "material-symbols:psychology-outline-rounded",
		featured: false,
		repository: "https://github.com",
		year: "2026",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
