# ADR-0001 — Next.js App Router with route handlers

- **Status:** Accepted
- **Date:** 2026-05-22

## Context

We need a single framework that delivers:

- File-based routing for the six operator surfaces.
- Server-rendered shell with progressive client hydration for interactive cockpit pieces.
- A backend surface that returns JSON.
- One deployment target (Vercel) without a separate API project.

Two viable options inside the Next.js family:

1. **Pages Router + `pages/api`** — the older, stable layout.
2. **App Router + route handlers under `app/api/*/route.ts`** — the current default,
   colocated server logic, streaming-friendly.

## Decision

We use **App Router** with route handlers.

Rationale:

- Vercel and Next.js are actively investing in App Router; new features (partial
  prerendering, Turbopack-only optimizations) ship App-Router-first.
- Route handlers colocate the API next to the matching feature folder, which is exactly
  the shape we want long-term: one folder per domain object.
- Server Components let us render the static shell on the server and keep the cockpit
  interactive bits as small client islands.

## Consequences

- We commit to Next.js 16+. Downgrading is a non-trivial rewrite.
- Some library docs still reference the Pages Router. New contributors should be
  warned (CONTRIBUTING covers this).
- Route handlers do not get the older `req`/`res` Node.js shape; they receive a
  `Request` and return a `Response`. The codebase uses this consistently.
- When we add real services behind the route handlers, the file paths remain stable
  — only the body of each handler changes.
