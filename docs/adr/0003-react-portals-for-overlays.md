# ADR-0003 — React Portals for overlay UI

- **Status:** Accepted
- **Date:** 2026-05-22

## Context

The cockpit needs four pieces of UI that live *outside* the normal layout flow:

- A floating chat panel (Routing Analyst) anchored to the viewport, persistent across
  page navigation.
- A modal dialog (Voyage Planner) that must trap focus and dim the entire page.
- A command palette (`Ctrl+K`) that overlays everything.
- A toast deck for notifications that stacks at a fixed corner.

If we render these as DOM siblings of the page content, they inherit layout, `overflow`
boundaries, and stacking contexts from whatever wrapper they end up under. The cockpit
already has multiple scroll containers and a sticky topbar — any one of them will
clip or constrain an inline overlay.

## Decision

All four pieces use **`createPortal` to `document.body`**, via a single
`Portal.tsx` helper that waits for hydration before mounting (so SSR stays
deterministic).

State for each overlay (open / closed, payload) lives in the top-level `<Shell />`
component. The portals themselves are pure presentation — they receive props and
render.

## Consequences

- Overlays are immune to ancestor `overflow`, `transform`, and `position` rules.
- The `Shell` becomes the single coordination point for cross-page state (palette
  open, toast queue, modal open). This is fine at this size; if more cross-page
  state arrives, we revisit [ADR-0005](0005-no-state-library.md).
- We get to demonstrate four genuinely different React Portal use cases in one
  product — which is part of the prototype's intent.
- SSR is preserved: `Portal` returns `null` until `useEffect` confirms we're in the
  browser. No hydration warnings.
