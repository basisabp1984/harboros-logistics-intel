# Architecture

This document describes how HarborOS is wired internally. It is the technical reference
for a developer joining the project. For product framing, see [README](../README.md). For
the framework intent, see [TECHNICAL_BRIEF](../TECHNICAL_BRIEF.md). For a record of
specific design choices, see the ADRs in [`adr/`](adr/).

---

## 1. System overview

HarborOS is a single Next.js application that runs three roles in one process:

- **UI shell** — the operator-facing cockpit (server-rendered shell, client-hydrated
  surfaces).
- **Mock API surface** — Next.js route handlers under `app/api/*` that return JSON shaped
  like a real ops backend.
- **AI analyst stub** — a pure-function classifier that maps natural-language questions
  to canned analytic answers over the mock dataset.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Operator browser                            │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  React 19 (App Router client surfaces)                           │    │
│  │  • Cockpit / Fleet / Ports / Voyages / Disruptions / Settings    │    │
│  │  • React Portals: AnalystPanel, VoyagePlannerModal,              │    │
│  │    CommandPalette, ToastDeck                                     │    │
│  └────────────────────────────────────────────┬─────────────────────┘    │
│                                               │ fetch JSON               │
└───────────────────────────────────────────────┼──────────────────────────┘
                                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Next.js 16 App Router server (one process)                              │
│                                                                          │
│  app/api/vessels          ──┐                                            │
│  app/api/ports            ──┤                                            │
│  app/api/voyages          ──┤    src/lib/mock-data.ts                    │
│  app/api/voyages/plan     ──┼──► (single source of truth, in-memory)     │
│  app/api/disruptions      ──┤                                            │
│  app/api/ai/analyze       ──┘                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

Everything inside the lower box is what a production deployment would replace — see
[§5 Real-MVP path](#5-real-mvp-path).

## 2. Folder layout

```
src/
  app/
    api/                       Mock API route handlers
      vessels/route.ts         GET vessels + cockpit KPIs
      ports/route.ts           GET port congestion
      voyages/route.ts         GET voyage ledger
      voyages/plan/route.ts    POST plan a new voyage
      disruptions/route.ts     GET disruption feed
      ai/analyze/route.ts      POST routing-analyst Q&A
    page.tsx                   Cockpit dashboard route
    fleet/page.tsx
    ports/page.tsx
    voyages/page.tsx
    disruptions/page.tsx
    settings/page.tsx
    layout.tsx                 Root layout, mounts the Shell
    globals.css                Dark mission-control theme tokens

  components/
    layout/
      Shell.tsx                Frame: sidebar + topbar + portals + main
      Sidebar.tsx              Desktop navigation
      Topbar.tsx               Search trigger + voyage planner shortcut
      MobileTabs.tsx           Mobile bottom navigation
    cockpit/
      Cockpit.tsx              Dashboard composition
    portals/
      Portal.tsx               createPortal wrapper that waits for mount
      AnalystPanel.tsx         Floating Routing Analyst chat
      VoyagePlannerModal.tsx   Plan-New-Voyage form
      CommandPalette.tsx       Ctrl+K command palette
      ToastDeck.tsx            Notification deck
    ui/
      MetricTile.tsx           KPI card with optional delta arrow
      StatusPill.tsx           Severity/status badge with optional glow dot
      Gauge.tsx                Circular progress indicator
      Sparkbars.tsx            Compact 7-bar sparkline
      WorldMap.tsx             Stylized world map with port glow markers

  lib/
    mock-data.ts               Single source of truth for the mock layer
    api.ts                     Typed client for the route handlers
    utils.ts                   Formatting helpers (hours, ETA, numbers)

  types/index.ts               Shared TS types: Vessel, Port, Voyage,
                               Disruption, CockpitKpis
```

## 3. Request flow

When the user opens `/` (Cockpit):

1. Next.js renders `app/layout.tsx` (server). The layout mounts the `<Shell />` client
   component, which renders the sidebar, topbar, mobile tabs, and the four portals.
2. `<Cockpit />` mounts and fires `useEffect` to fetch in parallel:
   `/api/vessels`, `/api/ports`, `/api/voyages`, `/api/disruptions`.
3. Each route handler imports the relevant slice of `src/lib/mock-data.ts` and returns
   `NextResponse.json({ data: ..., kpis?: ... })`.
4. The cockpit composes KPI tiles, the world map, the disruption feed, the fleet table,
   and the port watchlist from the four responses.

Posting:

- **`POST /api/voyages/plan`** — `VoyagePlannerModal` calls it on submit. Handler
  fabricates a deterministic-but-fresh `Voyage` and returns it. The toast deck then
  surfaces a "voyage planned" notification.
- **`POST /api/ai/analyze`** — `AnalystPanel` calls it on each user question. Handler
  inspects the question string for trigger keywords (delay/congest/disruption/fuel/
  brief) and returns a templated answer over the mock dataset.

## 4. State, routing, and rendering choices

- **App Router with route handlers** instead of `pages/api`. See
  [ADR-0001](adr/0001-nextjs-app-router-and-route-handlers.md).
- **All data flows through the route handlers**, not direct imports from
  `mock-data.ts`. The UI never sees `mock-data.ts` directly. This is what lets the mock
  layer be replaced without touching pages. See
  [ADR-0002](adr/0002-api-first-mock-layer.md).
- **Portals for overlay UI** rather than DOM siblings. Modals, command palette, chat,
  and toasts escape the layout tree. See
  [ADR-0003](adr/0003-react-portals-for-overlays.md).
- **Pure CSS dark theme via Tailwind tokens**. No theming library, no runtime
  switching — production cockpits don't switch themes. See
  [ADR-0004](adr/0004-dark-mission-control-theme.md).
- **No client-side state library**. Each surface fetches what it needs in `useEffect`
  and renders. `Shell.tsx` is the only place with stateful coordination (portals,
  command palette, toasts) and it uses local `useState` + a hook. No Redux/Zustand —
  the prototype doesn't have enough cross-cutting state to justify one yet.

## 5. Real-MVP path

This prototype is the carrier. The actual product replaces the shaded box of the
diagram:

| Boundary                         | Today                            | Production replacement                                     |
|----------------------------------|----------------------------------|------------------------------------------------------------|
| `mock-data.ts`                   | hand-shaped TS literals          | Postgres + Prisma/Drizzle; seeded from real feeds          |
| `GET /api/vessels`               | reads `vessels` array            | Reads from DB, last-known position from AIS provider       |
| `GET /api/ports`                 | reads `ports` array              | Aggregates port-authority APIs + crowd-sourced berth data  |
| `GET /api/voyages`               | reads `voyages` array            | Reads voyage ledger + computes on-time/risk from telemetry |
| `GET /api/disruptions`           | reads `disruptions` array        | Aggregates weather + AIS anomalies + intel feeds           |
| `POST /api/voyages/plan`         | fabricates one `Voyage`          | Runs bunker-aware, weather-aware routing optimization      |
| `POST /api/ai/analyze`           | keyword classifier               | LLM with retrieval over the operator's own voyages         |
| Auth                             | none                             | Auth.js / Clerk / custom session                           |
| Background work                  | none                             | Queue (e.g. Inngest, Trigger.dev) for AIS poll, refresh    |
| Observability                    | none                             | Sentry + log shipping + uptime monitoring                  |
| Tenancy                          | single anonymous user            | Teams, RBAC, audit log                                     |

Notice that **no page in `app/` changes** when these swaps happen. That is the value of
the API-first boundary.

## 6. Operational notes

- `npm run dev` — Next.js dev server with Turbopack.
- `npm run lint` — ESLint flat config (`eslint-config-next/core-web-vitals` + typescript).
  Configured with `--max-warnings=0` so any warning fails CI.
- `npm run build` — production build (Turbopack).
- `npm run start` — serves the production build on the configured port.
- Deployment is GitHub-connected to Vercel. Pushes to `master` trigger a production
  deploy. The custom subdomain points at Vercel's anycast IP via Cloudflare DNS
  (see [DEPLOYMENT](../DEPLOYMENT.md)).

## 7. Security & secrets

The prototype carries **no secrets**. There are no API keys, no auth tokens, no
environment variables required to run it locally or in production. If you fork it and
add a real provider integration, route the secret through `process.env` and store it in
the Vercel project settings — never commit `.env.local`.

The Vercel deployment-protection feature is currently *off* on this project so that
hiring managers can open the live URL without an account. If you fork it into a real
product, turn protection back on.

For the full picture — what is intentionally absent, what arrives before production,
and how to report a vulnerability — see [`SECURITY.md`](../SECURITY.md).
