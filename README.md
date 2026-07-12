# EmiBonnie & Any

Fan portal for **EmiBonnie & Any** — schedule, dashboard, and a cyberpunk-style landing page. Schedule data is sourced from Notion when configured.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- Notion API (`@notionhq/client` v5)
- Tailwind CSS v4
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/) via [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)

## Getting started

```bash
cp env.example .env.local
# Add NOTION_API_KEY and NOTION_DATABASE_ID (see NOTION_SETUP.md)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js routes (`/`, `/schedule`, `/dashboard`, `/api/schedule`) |
| `src/portal/` | Portal home (title, nav cards, footer) |
| `src/components/VideoBackground.tsx` | MP4 background with static poster fallback |
| `schedule/` | Schedule module (Notion client, event cards, timezone picker) |
| `schedule/data/mockSchedule.ts` | Mock events + schedule header profile copy |
| `schedule/lib/notion/` | Server-side Notion fetch and mapping |
| `public/` | Static assets (`background.mp4`, `background-poster.jpg`, icons) |

## Common edits

| What to change | File |
|----------------|------|
| Schedule page title / subtitle | `schedule/data/mockSchedule.ts` → `profile` |
| Dashboard placeholder copy | `src/app/dashboard/page.tsx` |
| Portal nav labels | `src/portal/PortalHome.tsx` |
| Notion column names / exclusions | `.env.local` (see `NOTION_SETUP.md`) |

## Notion setup

See **[NOTION_SETUP.md](./NOTION_SETUP.md)** for integration token, database sharing, column mapping, and deployment env vars.

## Deploy (Cloudflare Pages)

This project is **Cloudflare Pages only**. Build uses [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages).

In [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → your project → **Settings → Builds**:

| Field | Value |
|-------|-------|
| Framework preset | **None** |
| Build command | `npm run pages:build` |
| Build output directory | `.vercel/output/static` |
| Production branch | `main` |
| Node.js version | **20** or **22** |

**Important:** use `npm run pages:build` exactly. Do **not** use `npx @cloudflare/next-on-pages@1` — it can fail dependency resolution on Cloudflare CI.

`wrangler.jsonc` enables `nodejs_compat` automatically. Do not remove it.

**Environment variables** (Production + Preview):

- `NOTION_API_KEY` — Notion integration secret
- `NOTION_DATABASE_ID` — 32-char database id

Push to `main` to trigger a new deployment. Schedule data revalidates every 60 seconds (ISR).

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Node.JS Compatibility Error` / `nodejs_compat` | Ensure `wrangler.jsonc` is in the repo and redeploy latest `main` |
| `Missing script: "cf:deploy"` or `pages:build` | Cloudflare is building an old commit — wait for auto-deploy or push a new commit |
| `ERESOLVE` during build | Build command must be `npm run pages:build`, not raw `npx` |
| Site shows mock data | Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` in Cloudflare env vars |

### Verify build log

A successful deployment should show:

```
HEAD is now at <latest-commit>
Successfully read the Wrangler configuration file.
Executing user command: npm run pages:build
⚡️ Build completed
```

See **[NOTION_SETUP.md](./NOTION_SETUP.md)** for Notion column mapping and env var details.
