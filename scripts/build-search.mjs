import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const projectRoot = process.cwd();
const distRoot = join(projectRoot, "dist");
const clientDist = join(distRoot, "client");
const targetSite = existsSync(clientDist) ? "dist/client" : "dist";

console.log(`[pagefind] indexing search from ${targetSite}...`);
execSync(`npx pagefind --site ${targetSite}`, { stdio: "inherit" });

// If Vercel deployment output exists, copy the search index so it is served in production
const vercelStatic = join(projectRoot, ".vercel", "output", "static");
if (existsSync(vercelStatic)) {
	const sourcePagefind = join(projectRoot, targetSite, "pagefind");
	const destPagefind = join(vercelStatic, "pagefind");
	if (existsSync(sourcePagefind)) {
		cpSync(sourcePagefind, destPagefind, { recursive: true });
		console.log(`[pagefind] copied search index to .vercel/output/static/pagefind`);
	}
}
