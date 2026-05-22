# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `scripts/smoke.sh` — bash smoke test that hits every API endpoint and every
  page, asserts HTTP 200 + recognizable JSON content. Runnable against any base
  URL (local or production). Documented in README "QA pipeline" and required as
  a pre-PR check in CONTRIBUTING.

## [0.1.0] — 2026-05-22

Initial prototype release.

### Added

- Next.js 16 App Router project scaffolded with React 19, TypeScript 5, Tailwind CSS 3.
- Six operator surfaces: Cockpit (dashboard), Fleet, Ports, Voyages, Disruptions, Settings.
- Six mock API route handlers:
  - `GET /api/vessels`, `GET /api/ports`, `GET /api/voyages`, `GET /api/disruptions`
  - `POST /api/voyages/plan`, `POST /api/ai/analyze`
- Four React Portal interactions:
  - Floating Routing Analyst chat panel
  - Plan-New-Voyage modal
  - Command Palette (`Ctrl+K`)
  - Toast deck for disruption signals and voyage-planned notifications
- Mock dataset: 8 vessels, 6 ports, 7 voyages, 6 disruptions with cockpit KPIs.
- Dark mission-control visual language: slate-950 canvas, cyan/emerald/amber/rose/violet
  accent system, stylized world map with congestion glow markers, gauge KPIs, status pills,
  speed sparkbars, pulsing critical-alert animation.
- Documentation: README, TECHNICAL_BRIEF, DEPLOYMENT, ARCHITECTURE, API reference, ADRs,
  CONTRIBUTING, LICENSE (MIT).
- GitHub repository connected to Vercel; live custom domain
  [`harbor.radai-1984.dev`](https://harbor.radai-1984.dev).

### Out of scope (intentionally)

- No real AIS / port / weather / geopolitics provider integration.
- No authentication, no database, no LLM provider.
- No background jobs, no queues, no scraping.
- No tests beyond manual smoke checks via curl.

[Unreleased]: https://github.com/basisabp1984/harboros-logistics-intel/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/basisabp1984/harboros-logistics-intel/releases/tag/v0.1.0
