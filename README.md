# Siddharth Mukherjee — Personal Website

Personal site built with [Astro](https://astro.build), Svelte 5 and Tailwind 4. It is based on the open-source
[Shirone](https://github.com/LyraVoid/Shirone) theme (MIT, see `LICENSE`), with a custom landing page under
`src/components/pro/` and its content in `src/data/proSite.json`.

## Develop

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # production build
```

## Configuration

- Set `SITE_URL` (e.g. `https://yourdomain.com/`) in your host's environment variables so canonical URLs,
  Open Graph tags, RSS and sitemap use your domain. On Vercel the production domain is detected automatically.
- Landing-page text, projects and links: `src/data/proSite.json`.
- Blog posts: `src/content/posts/`.
