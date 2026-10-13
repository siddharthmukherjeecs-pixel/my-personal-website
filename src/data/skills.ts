/**
 * 技能页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/skillsConfig.ts 控制。
 */
import type { SkillItem } from "@/types/skillsConfig";

export const skillsData: SkillItem[] = [
	{
		name: "C / Systems",
		description:
			"Low-level systems programming, memory architecture, SIMD, and multi-threaded path tracing engines.",
		icon: "simple-icons:c",
		category: "backend",
		level: "expert",
	},
	{
		name: "Computer Graphics",
		description:
			"Physically-based rendering (PBR), BVH acceleration structures, dielectric materials, and thin-lens optics.",
		icon: "material-symbols:wb-iridescent-outline-rounded",
		category: "backend",
		level: "expert",
	},
	{
		name: "Python",
		description:
			"Scientific computation, AI/ML pipelines, algorithmic prototyping, and numerical modeling.",
		icon: "simple-icons:python",
		category: "backend",
		level: "expert",
	},
	{
		name: "PyTorch & Deep Learning",
		description:
			"Neural radiance fields (NeRF), coordinate-based networks, and differentiable volumetric synthesis.",
		icon: "simple-icons:pytorch",
		category: "backend",
		level: "advanced",
	},
	{
		name: "CUDA & GPU Compute",
		description:
			"Parallel kernel dispatch, shared memory hierarchies, and hardware acceleration.",
		icon: "simple-icons:nvidia",
		category: "backend",
		level: "intermediate",
	},
	{
		name: "TypeScript",
		description:
			"Strict type contracts, deterministic architecture, and modern reactive application systems.",
		icon: "simple-icons:typescript",
		category: "frontend",
		level: "advanced",
	},
];

/** 获取所有技能数据列表 */
export function getSkillsList(): SkillItem[] {
	return skillsData;
}
