import { makeGenericAPIRouteHandler } from "@keystatic/core/api/generic";
import { getSecret } from "astro:env/server";
import config from "../../../../keystatic.config";
import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async (context) => {
	let clientId: string | undefined;
	let clientSecret: string | undefined;
	let secret: string | undefined;

	try {
		clientId = getSecret("KEYSTATIC_GITHUB_CLIENT_ID") || process.env.KEYSTATIC_GITHUB_CLIENT_ID;
	} catch {
		clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
	}

	try {
		clientSecret = getSecret("KEYSTATIC_GITHUB_CLIENT_SECRET") || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
	} catch {
		clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
	}

	try {
		secret = getSecret("KEYSTATIC_SECRET") || process.env.KEYSTATIC_SECRET;
	} catch {
		secret = process.env.KEYSTATIC_SECRET;
	}

	if (!clientId || !clientSecret || !secret) {
		const missing: string[] = [];
		if (!clientId) missing.push("KEYSTATIC_GITHUB_CLIENT_ID");
		if (!clientSecret) missing.push("KEYSTATIC_GITHUB_CLIENT_SECRET");
		if (!secret) missing.push("KEYSTATIC_SECRET");

		return new Response(
			`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keystatic Setup Required</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px; max-width: 620px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { margin-top: 0; font-size: 22px; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
    p { color: #cbd5e1; line-height: 1.6; font-size: 15px; margin: 12px 0; }
    .box { background: #0f172a; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #fb7185; margin: 16px 0; border: 1px solid #334155; }
    ol { color: #e2e8f0; padding-left: 20px; line-height: 1.8; font-size: 14px; }
    li { margin-bottom: 8px; }
    code { background: #334155; color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    a { color: #38bdf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .btn:hover { background: #1d4ed8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚙️ GitHub Login Setup Needed</h1>
    <p>You clicked <strong>Log in with GitHub</strong>, but your Vercel project does not have your GitHub OAuth keys yet.</p>
    <div class="box">
      <strong>Missing Vercel Environment Variables:</strong><br>
      ${missing.map((m) => `• ${m}`).join("<br>")}
    </div>
    <p><strong>To enable login in 2 minutes:</strong></p>
    <ol>
      <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer">GitHub &rarr; Developer Settings &rarr; OAuth Apps &rarr; New OAuth App</a>.</li>
      <li>Set <strong>Homepage URL</strong>: <code>https://itsmysongmp3.vercel.app</code></li>
      <li>Set <strong>Authorization callback URL</strong>: <code>https://itsmysongmp3.vercel.app/api/keystatic/github/oauth/callback</code></li>
      <li>Click <strong>Register application</strong>, copy the <strong>Client ID</strong>, and generate a <strong>Client Secret</strong>.</li>
      <li>Go to your <a href="https://vercel.com/codenova7/my-personal-website/settings/environment-variables" target="_blank" rel="noreferrer">Vercel Project &rarr; Settings &rarr; Environment Variables</a>, and add the missing variables shown above.</li>
    </ol>
    <a href="/keystatic/" class="btn">&larr; Back to Admin</a>
  </div>
</body>
</html>`,
			{
				status: 200,
				headers: {
					"Content-Type": "text/html; charset=utf-8",
				},
			},
		);
	}

	try {
		const handler = makeGenericAPIRouteHandler(
			{
				config,
				clientId,
				clientSecret,
				secret,
			},
			{
				slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
			},
		);
		const { body, headers, status } = await handler(context.request);
		return new Response(body, {
			status,
			headers,
		});
	} catch (error) {
		return new Response(`Keystatic Error: ${(error as Error).message}`, {
			status: 500,
		});
	}
};

export const all = ALL;
