# Technical Brief — HarborOS

## Product

HarborOS is a mission-control cockpit for ocean-freight operators. It helps fleet managers
and routing analysts understand:

- which vessels are underway, anchored, or delayed,
- which ports are under stress and how long the wait is,
- which voyages carry the highest risk and lowest on-time score,
- which disruptions (weather, strike, congestion, mechanical, geopolitical) are open,
- what an AI routing analyst would recommend next.

This is a prototype. It is not a production backend.

- Live demo: https://harbor.radai-1984.dev
- GitHub: https://github.com/basisabp1984/harboros-logistics-intel

## Architecture

The project uses Next.js 16 App Router with React 19, TypeScript 5, and Tailwind CSS 3.

```
src/
  app/                       App Router root
    api/                     Mock API route handlers
      vessels/route.ts
      ports/route.ts
      voyages/route.ts
      voyages/plan/route.ts
      disruptions/route.ts
      ai/analyze/route.ts
    page.tsx                 Cockpit dashboard
    fleet/page.tsx
    ports/page.tsx
    voyages/page.tsx
    disruptions/page.tsx
    settings/page.tsx
    layout.tsx               Root layout, mounts the Shell
    globals.css              Dark mission-control theme
  components/
    layout/                  Shell, Sidebar, Topbar, MobileTabs
    cockpit/                 Cockpit composition
    ui/                      MetricTile, StatusPill, Gauge, Sparkbars, WorldMap
    portals/                 AnalystPanel, CommandPalette, VoyagePlannerModal, ToastDeck, Portal
  lib/
    mock-data.ts             Single source of truth for the mock layer
    api.ts                   Typed client for the route handlers
    utils.ts                 Small formatting helpers
  types/index.ts             Shared TS types for vessels, ports, voyages, disruptions
```

## API-First Design

The cockpit consumes API endpoints as if a real backend already existed:

- `GET /api/vessels` — list of vessels + cockpit KPIs
- `GET /api/ports` — port congestion + dwell + anchorage
- `GET /api/voyages` — voyage ledger
- `GET /api/disruptions` — open disruption feed
- `POST /api/voyages/plan` — plan a mock new voyage
- `POST /api/ai/analyze` — routing-analyst Q&A

Today these endpoints return mock JSON from `src/lib/mock-data.ts`. Later they can be replaced
with database queries, AIS providers, port APIs, weather and intel feeds, an in-house routing
model, and an LLM provider — without changing a single page in the UI.

## React Portals

The product demonstrates four portal-mounted interactions, all bridged through
`src/components/portals/Portal.tsx`:

1. **Floating Routing Analyst** — `AnalystPanel.tsx` — bottom-right chat panel, mock LLM.
2. **Plan-New-Voyage modal** — `VoyagePlannerModal.tsx` — full-screen overlay form.
3. **Command Palette** — `CommandPalette.tsx` — `Ctrl+K` global navigation + quick actions.
4. **Toast deck** — `ToastDeck.tsx` — disruption signal + voyage-planned notifications.

Portals are the right tool here: overlays, modals, command palettes, and notifications must
escape the regular layout tree.

## Visual Language

- Dark mission-control surface — slate-950 canvas with subtle radial glows.
- Cyan / emerald / amber / rose / violet accent system mapped to severity.
- `tabular-nums` for every number in the UI to avoid jumping columns.
- A stylized world map with congestion glow markers for ports.
- A pulse animation on critical alerts.
- Mobile: bottom-tab navigation. Desktop: left sidebar + sticky topbar.

This is intentionally different from the typical light SaaS look — operators recognize the
language of trading floors and ops consoles.

## Mock Data

The mock dataset is hand-shaped to read like a real ops snapshot:

- 8 vessels — names, IMOs, flags, capacity, fuel, carbon index, route progress, recent speed.
- 6 ports — UN/LOCODE, congestion tier, anchorage, dwell, weekly trend, recent events.
- 7 voyages — route code, vessel, distance, fuel, on-time score, risk score, window.
- 6 disruptions — weather, strike, congestion, mechanical, geopolitical, with severity + status.

No real Etsy / AIS / TikTok / Marine APIs are called. No keys, no secrets, no scraping.

## Real MVP Path

A practical path from this prototype to production:

1. Add authentication, teams, and tenancy.
2. Add a database (Postgres) for vessels, voyages, alerts, and analyst transcripts.
3. Replace mock route handlers with service-layer calls.
4. Add background jobs (queues + cron) for AIS polling, port refresh, and disruption ingestion.
5. Add provider integrations:
   - AIS (MarineTraffic, VesselFinder, Spire)
   - Port APIs (port authorities, MarineLink)
   - Weather (NOAA, DTN, Tomorrow.io)
   - Geopolitical intel (Dryad, Ambrey)
6. Add an in-house routing optimizer behind `/api/voyages/plan` (bunker-aware, weather-aware).
7. Add an LLM provider abstraction behind `/api/ai/analyze` with a prompt registry and
   retrieval over the operator's own voyages.
8. Add monitoring, audit logs, billing, and admin tools.

## Why This Exists

This prototype is meant to help a founder or hiring manager evaluate product direction quickly.
It shows:

- product thinking for a B2B ops audience,
- SaaS interface structure suited to mission-control work,
- API boundaries that survive being made real,
- agent-style workflows (AI analyst, voyage planner) without faking that mock data is intel.

It intentionally avoids pretending that mock data is production telemetry.
