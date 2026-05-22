# Customize this skeleton for your own product

This repository is a working SaaS MVP skeleton on Next.js + React + TypeScript +
Tailwind. The visible product (ocean-freight intelligence) is a placeholder — the
architecture, API-first contract, React Portal interactions, dark theme, build
pipeline, and deploy automation are reusable.

If you have a SaaS idea, you can have your **own** live MVP in days by following
the swap checklist below. The estimated time is for one focused developer doing
the data-shape redesign with an AI agent.

---

## 1. Fork and rename — 15 min

```bash
gh repo create your-org/your-product --public --clone
cd your-product
# copy everything from this skeleton except .git/, .vercel/, node_modules/, .next/
```

Edit [`package.json`](../package.json):

```json
{
  "name": "your-product"
}
```

## 2. Reshape the data model — 1–3 hours

This is where most of the design happens.

- [`src/types/index.ts`](../src/types/index.ts) — replace `Vessel`, `Port`, `Voyage`,
  `Disruption`, `CockpitKpis` with your domain types.
- [`src/lib/mock-data.ts`](../src/lib/mock-data.ts) — replace the mock arrays with
  realistic-looking sample data for your domain (8–10 of each domain object is
  enough).
- Recompute the KPI object at the bottom from your new mock arrays.

If your product needs 4–6 main domain objects (typical for a SaaS dashboard), this
shape will hold. If you only need 1–2, you can collapse pages.

## 3. Swap the API surface — 30–60 min

Under [`src/app/api/`](../src/app/api), rename folders to match your domain
objects and edit each [`route.ts`](../src/app/api/vessels/route.ts) to return
the right slice. The pattern is one line:

```ts
import { NextResponse } from "next/server";
import { yourCollection } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: yourCollection });
}
```

Update [`src/lib/api.ts`](../src/lib/api.ts) with the new endpoint names so the
typed client stays consistent.

Update [`docs/API.md`](API.md) — full endpoint reference for your product.

## 4. Swap the pages — 2–4 hours

Under [`src/app/`](../src/app/), rename the page folders and update each
`page.tsx`. The fetch hook is the same shape — only the URLs and the rendering
change.

For each page:

- Update the page title, intro copy, KPI labels.
- Replace tables, cards, and chart inputs with your new fields.

Update [`src/components/cockpit/Cockpit.tsx`](../src/components/cockpit/Cockpit.tsx)
for the dashboard composition.

Update [`src/components/layout/Sidebar.tsx`](../src/components/layout/Sidebar.tsx)
and [`MobileTabs.tsx`](../src/components/layout/MobileTabs.tsx) with the new
navigation labels and routes.

## 5. Rebrand — 30 min

Strings that mention HarborOS / ocean freight / vessels:

- [`src/app/layout.tsx`](../src/app/layout.tsx) — page metadata title and
  description.
- [`src/components/layout/Sidebar.tsx`](../src/components/layout/Sidebar.tsx) —
  the brand block at the top ("HarborOS" + tagline + icon).
- [`src/components/layout/Topbar.tsx`](../src/components/layout/Topbar.tsx) —
  search placeholder + user profile labels.
- [`src/components/portals/AnalystPanel.tsx`](../src/components/portals/AnalystPanel.tsx) —
  greeting line + seed-question chips.
- [`src/components/portals/VoyagePlannerModal.tsx`](../src/components/portals/VoyagePlannerModal.tsx) —
  modal title + scope copy. Probably rename to fit your action verb.
- [`src/components/portals/CommandPalette.tsx`](../src/components/portals/CommandPalette.tsx) —
  action labels.

## 6. Reshape the AI analyst — 1 hour

[`src/app/api/ai/analyze/route.ts`](../src/app/api/ai/analyze/route.ts) is a
keyword router over the mock dataset. Replace the keyword table:

- Decide 4–6 question shapes a user is most likely to ask in your domain.
- For each, return a templated answer over the new mock arrays.
- Keep the fallback narrative for unknown questions.

If you have an OpenAI / Anthropic key, you can replace the whole handler with a
real LLM call here without touching the chat panel — that's the API-first
boundary in action (see [ADR-0002](adr/0002-api-first-mock-layer.md)).

## 7. Re-tune the theme — 15 min to 4 hours

[`tailwind.config.ts`](../tailwind.config.ts) and
[`src/app/globals.css`](../src/app/globals.css) hold the visual tokens.

If your audience is a creative entrepreneur — go light premium-SaaS (see the
companion repo [`etsy-ai-market-intel`](https://github.com/basisabp1984/etsy-ai-market-intel)
which uses that direction). If your audience is an ops operator — keep the dark
mission-control direction.

Update [`docs/adr/0004-dark-mission-control-theme.md`](adr/0004-dark-mission-control-theme.md)
— rewrite the rationale for your audience. ADRs should reflect **your** decisions,
not inherited ones.

## 8. Documentation refresh — 30 min

- [`README.md`](../README.md) — hero, what-you-see, mock-up, links.
- [`TECHNICAL_BRIEF.md`](../TECHNICAL_BRIEF.md) — product framing.
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — folder layout if you renamed, real-MVP swap table.
- [`docs/API.md`](API.md) — your endpoint reference.
- [`docs/adr/`](adr/) — ADRs should reflect **your** decisions, not the
  skeleton's. Rewriting ADR-0004 is the most common edit; the others
  (App Router, API-first, Portals, no state library) usually carry over.
- [`CHANGELOG.md`](../CHANGELOG.md) — reset to your `v0.1.0` with your feature list.
- Author lines in `LICENSE` and the commit `Co-Authored-By` trailer.

## 9. Deploy — 15 min

```bash
gh repo create your-org/your-product --public --push
vercel link --yes --project your-product
vercel deploy --prod --yes
vercel domains add yourproduct.yourdomain.com
# then add the Cloudflare A record (or equivalent) — see DEPLOYMENT.md
```

## 10. Smoke-check — 5 min

```bash
npm run lint
npm run build
curl https://yourproduct.yourdomain.com/api/<one-of-your-routes>
```

If lint + build pass and one endpoint returns 200 with sensible JSON, the MVP is
live.

---

## Total: 1–2 focused days

The longest segments are the data-shape redesign (step 2) and page swapping
(step 4). Everything else is template edits an AI agent handles in minutes.

This skeleton is built so the answer to "how long until I have a live MVP" is
**days, not weeks**.
