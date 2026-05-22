# ADR-0002 — API-first mock layer

- **Status:** Accepted
- **Date:** 2026-05-22

## Context

This is a prototype. There is no production database, no AIS provider, no LLM. The
fastest way to ship a screen is to import the mock array directly:

```ts
import { vessels } from "@/lib/mock-data";
// ... render
```

That works. It is also a trap: it lets the UI assume the shape of the mock, and when a
real backend lands, every page that imports the mock must be rewritten.

## Decision

**No page or component imports `mock-data.ts` directly.** All data flows through HTTP
route handlers under `app/api/*`, even when the page and the handler live in the same
process.

The only place that touches `mock-data.ts` is the route handler.

## Consequences

- One extra `fetch` per surface load. In a prototype, free; in production, this is the
  normal client-server roundtrip anyway.
- The mock layer can be swapped for real services by editing only the handler bodies.
  No page changes.
- We get a single chokepoint for things the production version will want: validation,
  caching, rate limits, auth. They all live on the route handler.
- A typed client lives in `src/lib/api.ts`. Calling `apiClient.vessels()` is type-safe
  end-to-end without coupling the caller to the mock module.

## Notes

This was the change that fixed the parallel Codex prototype: its Research page was
the only screen that imported the mock array directly. That asymmetry was a small bug
in the API-first invariant. Here we enforce the invariant from day one.
