# HarborOS — AI Logistics Intelligence Platform

> Mission-control cockpit for ocean-freight operators — vessels, ports, voyages,
> disruptions, and an AI routing analyst. Built as an API-first MVP prototype on
> Next.js + React + TypeScript + Tailwind.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-22c55e)
![Deploy](https://img.shields.io/badge/Vercel-Live-000?logo=vercel)

- **Live demo:** [https://harbor.radai-1984.dev](https://harbor.radai-1984.dev)
- **Vercel alias:** [https://harboros-logistics-intel.vercel.app](https://harboros-logistics-intel.vercel.app)
- **GitHub:** [basisabp1984/harboros-logistics-intel](https://github.com/basisabp1984/harboros-logistics-intel)

> **This is a reusable SaaS MVP skeleton.** The visible product (ocean-freight
> intelligence) is a placeholder — the architecture, API-first contract, React
> Portal interactions, dark theme, build pipeline, and deploy automation are the
> reusable parts. Tell me what your product is — I will swap the mock data,
> brand strings, and AI prompts and give you a live URL in a couple of days.
> See [`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md) for the exact swap checklist.

---

## What is this?

HarborOS is a working prototype of an AI-assisted operations cockpit for ocean-freight
operators. A fleet ops manager opens it in the morning and can see — at a glance — which
vessels are underway, which ports are choking, which voyages carry risk, which
disruptions are open, and what the analyst would do next.

Every screen consumes mock JSON from Next.js route handlers shaped exactly like a real
backend. There is no real AIS, port, weather, geopolitical, database, auth, or LLM
provider in this repo. The architecture is intentionally built so each of those layers
can be replaced without touching the cockpit. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) §5.

## What you'll see

The product covers six operator surfaces:

| Surface         | What's on it                                                                |
|-----------------|------------------------------------------------------------------------------|
| **Cockpit**     | KPIs, live port map, fleet pulse table, disruption feed, port watchlist     |
| **Fleet**       | Vessel cards with status, route progress, fuel, carbon index, speed pulse   |
| **Ports**       | Congestion radar — world map + tabular port-by-port snapshot                |
| **Voyages**     | Route-level ledger with on-time and risk scoring                            |
| **Disruptions** | Open + monitoring signals — weather, strike, congestion, mechanical, geo    |
| **Settings**    | Integration readiness and alert preferences                                 |

Cockpit, schematically:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ★ Ocean-freight operations cockpit                                            │
│   [On-time score gauge: 74/100]   [Carbon headroom: 28/100]                   │
│ ─────────────────────────────────────────────────────────────────────────     │
│ ▣ Vessels in transit  4    ▣ Ports under stress  3    ▣ Active disruptions 5  │
│ ▣ On-time score  74        ▣ Avg port wait  30h       ▣ Carbon intensity  72  │
│ ─────────────────────────────────────────────────────────────────────────     │
│ ┌────────────── Live port map ─────────────┐ ┌──── Disruption feed ────┐      │
│ │   ✦ Singapore (Heavy, 36h)               │ │ ● Long Beach Critical   │      │
│ │   ✦ Long Beach (Critical, 62h)           │ │ ⚠ Port Hedland Warning  │      │
│ │   ✦ Rotterdam (Moderate, 18h)            │ │ ⚠ Bab-el-Mandeb Watch   │      │
│ │   ✦ Hamburg (Calm, 8h)                   │ │ ⚠ Le Havre Watch        │      │
│ │   ✦ Port Hedland (Heavy, 41h)            │ │ ℹ Suez Canal Info       │      │
│ └──────────────────────────────────────────┘ └─────────────────────────┘      │
│ ┌────── Fleet pulse ───────────────────────┐ ┌─── Port stress watch ───┐      │
│ │ Aurora Crest   Yantian→Rotterdam Underway│ │ Long Beach   Critical   │      │
│ │ Boreal Vega    Valparaiso→Long Beach Anc │ │ Singapore    Heavy      │      │
│ │ Drava Falcon   Hedland→Qingdao  Underway │ │ Port Hedland Heavy      │      │
│ │ Equinox Voyager Ras Tanura→Rotterdam Del │ │                         │      │
│ └──────────────────────────────────────────┘ └─────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────────────┘

Floating bottom-right: [Routing Analyst]   Ctrl+K opens Command Palette
```

## Tech stack

- **Next.js 16** App Router with route handlers
- **React 19** with Server + Client Components
- **TypeScript 5** strict
- **Tailwind CSS 3** with a custom dark mission-control token set
- **lucide-react** for iconography
- **Vercel** for deployment, **Cloudflare** for the DNS zone

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables required — the prototype
ships with mock data.

## Documentation

| Doc | What it covers |
|-----|----------------|
| [`README.md`](README.md) | This file — product overview, what you'll see, links |
| [`TECHNICAL_BRIEF.md`](TECHNICAL_BRIEF.md) | Product framing, architecture summary, real-MVP path |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System diagram, request flow, folder layout, decisions overview |
| [`docs/API.md`](docs/API.md) | Full endpoint reference: shape, examples, curl commands |
| [`docs/adr/`](docs/adr/) | Architecture Decision Records — why we chose what we chose |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | GitHub + Vercel + Cloudflare DNS step-by-step |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How to develop, commit conventions, folder rules |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history |
| [`LICENSE`](LICENSE) | MIT |

## API surface — at a glance

```
GET  /api/vessels          → fleet list + cockpit KPIs
GET  /api/ports            → port congestion snapshot
GET  /api/voyages          → voyage ledger
GET  /api/disruptions      → open disruption feed
POST /api/voyages/plan     → plan a mock new voyage
POST /api/ai/analyze       → routing-analyst Q&A
```

Full reference with shapes, examples, and curl commands is in
[`docs/API.md`](docs/API.md).

## React Portals — four interactions

All four mount through [`src/components/portals/Portal.tsx`](src/components/portals/Portal.tsx)
to `document.body`. Why portals and not DOM siblings — see
[ADR-0003](docs/adr/0003-react-portals-for-overlays.md).

1. **Floating Routing Analyst panel** — bottom-right chat, mock LLM.
2. **Plan-New-Voyage modal** — form that posts to `/api/voyages/plan`.
3. **Command Palette** — `Ctrl+K` for global navigation and quick actions.
4. **Toast deck** — disruption-signal arrival, voyage-planned confirmation.

## License

[MIT](LICENSE) © 2026 Andrii Radkobski.
