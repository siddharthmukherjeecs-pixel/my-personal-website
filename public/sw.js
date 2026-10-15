/**
 * Shirone Service Worker — Offline Resilience & Low-Bandwidth Acceleration
 * Cache-First for static assets (fonts, images, hashed CSS/JS)
 * Network-First for HTML pages with offline cache fallback
 */

const STATIC_CACHE = "shirone-static-v1";
const PAGES_CACHE = "shirone-pages-v1";

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.map((key) => {
						if (key !== STATIC_CACHE && key !== PAGES_CACHE) {
							return caches.delete(key);
						}
					}),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (event) => {
	const req = event.request;
	if (req.method !== "GET") return;

	const url = new URL(req.url);

	// Bypass caching for admin, keystatic, API, and preview endpoints
	if (
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/keystatic") ||
		url.pathname.startsWith("/admin")
	) {
		return;
	}

	// 1. HTML Navigation: Network-First with Cache Fallback
	if (req.mode === "navigate") {
		event.respondWith(
			fetch(req)
				.then((res) => {
					if (res && res.status === 200) {
						const clone = res.clone();
						caches.open(PAGES_CACHE).then((cache) => cache.put(req, clone));
					}
					return res;
				})
				.catch(async () => {
					const cached = await caches.match(req);
					if (cached) return cached;
					const fallback = await caches.match("/");
					if (fallback) return fallback;
					return new Response(
						`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Offline · Shirone</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #121212; color: #e0e0e0; text-align: center; padding: 1.5rem; }
    .card { background: #1e1e1e; border: 1px solid #333; border-radius: 16px; padding: 2rem; max-width: 400px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff; }
    p { font-size: 0.95rem; opacity: 0.75; line-height: 1.5; margin-bottom: 1.5rem; }
    button { background: #38bdf8; color: #0f172a; border: none; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 9999px; cursor: pointer; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>You're Offline</h1>
    <p>Please check your internet connection and try again.</p>
    <button onclick="window.location.reload()">Retry</button>
  </div>
</body>
</html>`,
						{ headers: { "Content-Type": "text/html; charset=utf-8" } },
					);
				}),
		);
		return;
	}

	// 2. Static Assets (Fonts, Images, Hashed JS/CSS in /_astro/): Cache-First
	const isStatic =
		req.destination === "font" ||
		req.destination === "image" ||
		req.destination === "style" ||
		req.destination === "script" ||
		url.pathname.startsWith("/_astro/") ||
		url.pathname.startsWith("/images/") ||
		url.pathname.startsWith("/fonts/") ||
		url.pathname.startsWith("/assets/");

	if (isStatic) {
		event.respondWith(
			caches.match(req).then((cached) => {
				if (cached) return cached;
				return fetch(req).then((res) => {
					if (res && res.status === 200) {
						const clone = res.clone();
						caches.open(STATIC_CACHE).then((cache) => cache.put(req, clone));
					}
					return res;
				});
			}),
		);
	}
});
