# EmiBonnie & Any

Fan portal for **EmiBonnie & Any** — schedule, dashboard, and a cyberpunk-style landing page. Schedule data is sourced from Notion when configured.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- Notion API (`@notionhq/client` v5)
- Tailwind CSS v4
- Deployed on [Vercel](https://vercel.com)

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

## Deploy

Push to GitHub and connect the repo on Vercel. Set `NOTION_API_KEY` and `NOTION_DATABASE_ID` in the project environment variables.
