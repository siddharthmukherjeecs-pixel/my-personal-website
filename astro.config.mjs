import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import vercel from "@astrojs/vercel";
import shirones from "./src/integration/index.ts";

// The integration drives every mode, this repository included: integrations,
// fonts, markdown, vite aliases/plugins, trailingSlash and the image endpoint
// all come from `src/integration/` and `src/config/integrationsConfig.ts`.
// Do not re-add per-mode config here — update `src/config/` so both modes
// stay in lockstep (see `src/config/README.md`).
export default defineConfig({
	adapter: vercel(),
	devToolbar: {
		enabled: false,
	},
	vite: {
		optimizeDeps: {
			entries: [
				"src/**/*.{jsx,tsx,vue,svelte,html,astro,mdx}",
				"keystatic.config.*",
				".astro/keystatic-imports.js",
			],
		},
	},
	integrations: [react(), keystatic(), shirones()],
});

