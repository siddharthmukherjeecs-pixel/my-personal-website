import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "assets/images/demo-avatar.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Siddharth Mukherjee",
	bio: "AI/ML & AIE Undergrad · Bengaluru, IN",
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/siddharthmukherjeecs-pixel",
		},
		{
			name: "Instagram",
			icon: "fa7-brands:instagram",
			url: "https://www.instagram.com/siddharthmukherjee356?exln=MTZjZ2h1MDNmNHlt",
		},
		{
			name: "Email",
			icon: "material-symbols:mail-outline-rounded",
			url: "mailto:siddharthmukherjee.cs@gmail.com",
		},
	],
});
