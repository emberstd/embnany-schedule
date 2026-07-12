# EmiBonnie & Any

Fan portal for **EmiBonnie & Any** — schedule, dashboard, and a cyberpunk-style landing page. Schedule data is sourced from Notion when configured.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- Notion API (`@notionhq/client` v5)
- Tailwind CSS v4
- Deployed on [Cloudflare Workers / Pages](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) via [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)

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

## Deploy (Cloudflare)

### Legacy Pages UI (current setup)

If your project only has **Build command** + **Build output directory** (no Deploy command):

| Field | Value |
|-------|-------|
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Framework preset | None |

`wrangler.jsonc` in the repo sets `nodejs_compat` for Pages automatically — do **not** use `npm run cf:deploy` here (that deploys a separate Worker, not your `*.pages.dev` site).

After changing settings, push to `main` or use **Deployments → … → Retry deployment** on the latest commit.

### Workers Builds (OpenNext — future migration)

When your Cloudflare project has separate **Build** and **Deploy** commands:

| Field | Value |
|-------|-------|
| Build command | `npm run cf:build` |
| Deploy command | `npm run deploy` |
| Non-production deploy command | `npm run upload` |
| Build output directory | leave empty |

Copy `wrangler.worker.jsonc` to `wrangler.jsonc` before using Workers Builds (see file comment in repo).

**Environment variables** (Production + Preview):
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`

Schedule data revalidates every 60 seconds (ISR).

### Local Cloudflare preview

```bash
cp env.example .env.local   # Notion vars for next dev
npm run cf:preview          # builds + runs local Workers runtime
```

### CLI deploy (optional)

```bash
npx wrangler login
npm run cf:deploy
```

See **[NOTION_SETUP.md](./NOTION_SETUP.md)** for Notion column mapping and env var details.
