import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const projectRoot = process.cwd();
const distRoot = join(projectRoot, "dist");
const clientDist = join(distRoot, "client");
const targetSite = existsSync(clientDist) ? "dist/client" : "dist";

// 1. Sanitize browser client chunks (strip accidental node:module imports emitted for browser targets)
function sanitizeBrowserBundles(dir) {
	if (!existsSync(dir)) return;
	const files = readdirSync(dir);
	for (const file of files) {
		if (file.endsWith(".js")) {
			const fullPath = join(dir, file);
			let content = readFileSync(fullPath, "utf8");
			if (
				content.includes('from"node:module"') ||
				content.includes("from 'node:module'") ||
				content.includes('from "node:module"')
			) {
				console.log(`[build] sanitizing browser bundle: ${file}`);
				content = content
					.replace(
						/import\s*\{\s*createRequire(?:\s+as\s+(\w+))?\s*\}\s*from\s*["']node:module["'];?/g,
						(_m, alias) => `const ${alias || "createRequire"}=()=>()=>({});`,
					)
					.replace(/import\s+[^;]*from\s*["']node:module["'];?/g, "");
				writeFileSync(fullPath, content);
			}
		}
	}
}

sanitizeBrowserBundles(join(distRoot, "client", "_astro"));
sanitizeBrowserBundles(join(projectRoot, ".vercel", "output", "static", "_astro"));

// 2. Index search with Pagefind
console.log(`[pagefind] indexing search from ${targetSite}...`);
execSync(`npx pagefind --site ${targetSite}`, { stdio: "inherit" });

// 3. Sync search index to Vercel static deployment output
const vercelStatic = join(projectRoot, ".vercel", "output", "static");
if (existsSync(vercelStatic)) {
	const sourcePagefind = join(projectRoot, targetSite, "pagefind");
	const destPagefind = join(vercelStatic, "pagefind");
	if (existsSync(sourcePagefind)) {
		cpSync(sourcePagefind, destPagefind, { recursive: true });
		console.log(`[pagefind] copied search index to .vercel/output/static/pagefind`);
	}
}
