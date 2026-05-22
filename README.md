# HarborOS — AI Logistics Intelligence Platform

Mission-control cockpit for ocean-freight operators. Built as an API-first MVP prototype to show product direction, UI behavior, and where real data systems can plug in later.

- Live demo: https://harboros-logistics-intel.vercel.app (stable Vercel alias)
- Custom domain target: https://harbor.radai-1984.dev (Vercel project ready, awaiting Cloudflare DNS record — see DEPLOYMENT.md)
- GitHub: https://github.com/basisabp1984/harboros-logistics-intel

The product covers six operator surfaces:

- **Cockpit** — KPIs, live port map, fleet pulse table, disruption feed.
- **Fleet** — vessel cards with status, route progress, fuel, carbon index, speed sparkline.
- **Ports** — congestion radar with map and tabular port-by-port snapshot.
- **Voyages** — route-level ledger with on-time and risk scoring.
- **Disruptions** — open + monitoring signals, weather/strike/congestion/mechanical/geopolitical.
- **Settings** — integration readiness and alert preferences.

Nothing in the demo touches a real API. No real AIS, port, weather, geopolitics, or LLM provider is called. The mock layer is intentionally shaped like a real backend so the route handlers can be swapped for real services without rewriting the cockpit.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3
- lucide-react icons

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API-First Surface

The cockpit consumes Next.js route handlers as if they were real backend endpoints:

- `GET /api/vessels` — fleet list + cockpit KPIs
- `GET /api/ports` — port congestion snapshot
- `GET /api/voyages` — voyage ledger
- `GET /api/disruptions` — open disruption feed
- `POST /api/voyages/plan` — plan a mock new voyage
- `POST /api/ai/analyze` — routing analyst Q&A

The mock source of truth is in [`src/lib/mock-data.ts`](src/lib/mock-data.ts). Route handlers live under [`src/app/api/*/route.ts`](src/app/api).

## React Portals — Four Interactions

All portal UI mounts through [`src/components/portals/Portal.tsx`](src/components/portals/Portal.tsx).

1. **Floating Routing Analyst panel** — [`AnalystPanel.tsx`](src/components/portals/AnalystPanel.tsx)
2. **Plan-New-Voyage modal** — [`VoyagePlannerModal.tsx`](src/components/portals/VoyagePlannerModal.tsx)
3. **Command Palette (Ctrl+K)** — [`CommandPalette.tsx`](src/components/portals/CommandPalette.tsx)
4. **Toast deck (disruption signal, voyage planned)** — [`ToastDeck.tsx`](src/components/portals/ToastDeck.tsx)

## Where Next.js Is Used

- App Router structure in [`src/app`](src/app)
- Route handlers for the mock API in [`src/app/api`](src/app/api)
- File-based routing for each operator surface
- Root layout in [`src/app/layout.tsx`](src/app/layout.tsx)
- Client components where interactivity is needed

## Mock Data

Includes realistic-looking sample data for:

- 8 vessels (container, bulk, tanker, reefer, Ro-Ro) with AIS-like fields
- 6 major ports with congestion, anchorage, dwell, weekly trend
- 7 voyages with route, fuel, on-time and risk scoring
- 6 disruptions across weather / strike / congestion / mechanical / geopolitical
- Cockpit KPIs derived from the above

## How Real Systems Can Be Connected Later

- Replace [`src/lib/mock-data.ts`](src/lib/mock-data.ts) with database queries + seed data.
- Replace the route handlers with calls to real services:
  - MarineTraffic / VesselFinder / Spire for AIS
  - Port authority APIs for berths and schedules
  - NOAA / DTN / Tomorrow.io for weather
  - Insurance / security intel feeds (Dryad, Ambrey)
  - In-house bunker-aware routing model behind `/api/voyages/plan`
  - An LLM provider behind `/api/ai/analyze`
- Add background jobs (queues + cron) for scheduled disruption polling.
- Add authentication (Auth.js / Clerk / custom session).
- Add persistence for voyages, alerts, and analyst transcripts.
- Add tenancy, billing, audit, and admin controls for production deployment.

The current goal is not production infrastructure — it is a credible API-first MVP skeleton that shows product thinking, architecture, and UI behavior.

## Documentation

- [`TECHNICAL_BRIEF.md`](TECHNICAL_BRIEF.md) — architecture and real-MVP path.
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — GitHub + Vercel + custom domain.
