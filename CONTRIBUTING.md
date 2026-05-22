# Contributing to HarborOS

Thanks for taking a look. This file covers how to work on the code if you want to
extend the prototype or use it as a starting point for a real product.

## Local development

```bash
git clone https://github.com/basisabp1984/harboros-logistics-intel.git
cd harboros-logistics-intel
npm install
npm run dev
```

Open `http://localhost:3000`.

## Before opening a pull request

Both checks below must pass clean:

```bash
npm run lint    # eslint-config-next, --max-warnings=0
npm run build   # production build, fails on type or compile errors
```

If you touch a route handler or an endpoint contract, please also smoke-check it
with `curl` — examples are in [`docs/API.md`](docs/API.md).

## Code conventions

- **TypeScript strict.** No `any`. Use the shared types in
  [`src/types/index.ts`](src/types/index.ts) instead of inlining.
- **Server vs client components.** Default to server components. Add `"use client"`
  only when you need state, effects, browser APIs, or event handlers.
- **No direct imports from `mock-data.ts` outside of `app/api/*`.** This is the
  API-first invariant — see [ADR-0002](docs/adr/0002-api-first-mock-layer.md).
- **Tailwind tokens, not arbitrary hex.** New colors go in
  [`tailwind.config.ts`](tailwind.config.ts) first.
- **Tabular numbers.** Any number in the UI gets the `.tabular` utility (variant
  `font-variant-numeric: tabular-nums`). Columns must not jump on update.
- **Icons** come from `lucide-react`. Match the existing line weight and size
  conventions in the codebase.

## Folder boundaries

- `src/app/` — routes (pages + API handlers). One folder per route segment.
- `src/components/layout/` — frame shell. Keep small.
- `src/components/portals/` — anything that uses `createPortal`.
- `src/components/ui/` — pure presentational primitives (no fetching, no state).
- `src/components/<feature>/` — feature compositions that compose `ui/` + portals +
  fetch. Cockpit is the canonical example.
- `src/lib/` — mock data, API client, formatting helpers.
- `src/types/` — shared TS types.

When in doubt, put a component **lower** in this hierarchy rather than higher.
Layout shells should not reach into feature compositions, and feature compositions
should not reach into other feature compositions.

## Commit style

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) prefixes:

| Prefix     | When                                                            |
|------------|-----------------------------------------------------------------|
| `feat:`    | New user-visible feature or new API endpoint                    |
| `fix:`     | Bug fix                                                         |
| `docs:`    | Docs only (README, docs/, CHANGELOG, ADRs)                      |
| `refactor:`| Code change without behavior change                             |
| `style:`   | Formatting only                                                 |
| `test:`    | Tests only                                                      |
| `chore:`   | Dependencies, config, tooling                                   |
| `perf:`    | Performance work                                                |

Subject under 70 characters, imperative mood. Body explains *why* if the diff doesn't.

## Adding a new surface

1. Create `src/app/<surface>/page.tsx` — start as a client component with a single
   `useEffect` fetch.
2. If the surface needs a new domain object, add the type to
   `src/types/index.ts` and a slice to `src/lib/mock-data.ts`.
3. Add a route handler under `src/app/api/<surface>/route.ts`.
4. Wire the surface into the sidebar ([`Sidebar.tsx`](src/components/layout/Sidebar.tsx))
   and mobile tabs ([`MobileTabs.tsx`](src/components/layout/MobileTabs.tsx)).
5. Add an entry to the command palette
   ([`CommandPalette.tsx`](src/components/portals/CommandPalette.tsx)).
6. Update [`docs/API.md`](docs/API.md) with the new endpoint.
7. Add a CHANGELOG entry under `[Unreleased]`.

## Adding a real provider integration

This is the moment to read [ADR-0002](docs/adr/0002-api-first-mock-layer.md). The
contract: route handlers are the only place that touches data sources. Replace the
body of `app/api/<surface>/route.ts` — do not change the page or its types.

Secrets go through `process.env`. Add them in the Vercel project settings, not in
`.env.local` (which must never be committed).

## Documentation

When you ship a non-trivial change:

- Update [`CHANGELOG.md`](CHANGELOG.md) under `[Unreleased]`.
- If you make a decision that future readers might second-guess, write a short ADR in
  `docs/adr/` following the existing format.
- If you change the API surface, update [`docs/API.md`](docs/API.md).
