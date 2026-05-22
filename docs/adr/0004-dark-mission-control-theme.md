# ADR-0004 — Dark mission-control visual language

- **Status:** Accepted
- **Date:** 2026-05-22

## Context

This is a deliberately differentiated front-end. A parallel prototype on the same
stack ([etsy-ai-market-intel](https://github.com/basisabp1984/etsy-ai-market-intel))
ships a light premium-SaaS look — white background, navy text, soft shadows, generous
whitespace. That look fits a marketplace operator (Etsy seller). It does not fit a
fleet-ops control room.

The audience for HarborOS is an ops manager watching multiple data streams at once.
The visual reference is closer to Bloomberg / NASA / Stripe Atlas dark dashboards than
to a consumer SaaS landing page.

## Decision

- Background: `slate-950` canvas with two subtle radial color glows (cyan in
  top-left, violet in bottom-right) to avoid the "flat black" feel without becoming
  decorative.
- Five severity-mapped accents: `cyan` (info / underway), `emerald` (good / on-time),
  `amber` (warning / heavy congestion), `rose` (critical / delayed), `violet` (system
  metadata / planned).
- Cards: low-contrast surfaces (`surface` / `surface-raised`) with thin border lines.
- Numbers: tabular-nums everywhere via a `.tabular` utility, so columns don't jitter
  during live updates.
- One pulse animation, reserved for `Critical` items only — never decorative.
- A stylized world map with glow markers for ports, scaled by congestion tier.

No theming library, no light-mode toggle. Ops cockpits do not switch themes mid-shift.

## Consequences

- The look is opinionated. Anyone forking the project will probably override most of
  it — fine, the tokens are in one Tailwind config and one `globals.css`.
- Side-by-side with the Etsy prototype, this is visibly a different product on the
  same stack. That difference is the point.
- Accessibility: dark themes pose contrast risks. Body text uses `ink` (`#e6edf6`)
  on `canvas` (`#070b14`) — contrast ratio ~14:1. Muted text uses `muted`
  (`#7b8aa1`) on `canvas` — ratio ~6:1. Both pass WCAG AA for normal text. The
  pulsing critical animation respects `prefers-reduced-motion` (TODO if not).
