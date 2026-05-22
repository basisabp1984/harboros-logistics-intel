# Security Policy

## Current posture

This repository is a **mock-data MVP prototype**, not a production system. The
security model reflects that on purpose:

- **No secrets.** There is no `.env`, no API key, no database credential, no
  signing secret, no token in this codebase. Cloning the repository exposes no
  credentials.
- **No authentication.** The live demo at https://harbor.radai-1984.dev is open
  by design so that a reviewer can evaluate the product without an account.
  Vercel deployment-protection is intentionally off for this project.
- **No persistence.** Every API response is computed at request time from
  in-memory mock arrays in [`src/lib/mock-data.ts`](src/lib/mock-data.ts). No
  database. POST endpoints fabricate responses on the fly and write nothing.
- **No third-party providers.** No real AIS, port, weather, geopolitical, or
  LLM provider is called. There is nothing to leak.

## What is intentionally absent — and why

These layers would normally be present in a production SaaS. They are absent
here on purpose, because at the mock-data level they would test the test, not
the system.

| Layer | Why absent | When it lands |
|-------|------------|---------------|
| Login / session management | No real users — demo must be openable cold | At first real-tenant onboarding |
| Input validation (`zod`) on POST | Bodies are ignored or used for templated responses | Together with persistence |
| Per-tenant rate limiting | Endpoints return identical mock JSON to any caller | With auth + real provider calls |
| CSRF protection | No authenticated state-changing endpoints exist | With session management |
| CORS allow-list | No cross-origin clients yet | Per real client need |
| Content Security Policy headers | No third-party scripts, no inline scripts | With analytics / 3rd-party SDKs |
| Secret management | Nothing to manage | First real API key |
| Audit log | No state changes to audit | With persistence + tenancy |

## What lands before production — concrete plan

When this skeleton is the seed for a real product, the following arrive together
in a single security-baseline PR before the first real tenant signs in:

1. **Authentication and session management.** Auth.js / Clerk / custom — either
   way the route handlers gain a per-request principal.
2. **Input validation with `zod`** on every POST/PATCH handler. Reject malformed
   bodies with `400` and a stable error code.
3. **Authorization at the route-handler layer.** Each handler checks the
   principal against the resource being read/written.
4. **Per-tenant rate limits.** Either Vercel's built-in (Edge Middleware) or a
   service such as Upstash. Defaults: bursty `60/min` for GET, conservative
   `10/min` for POST.
5. **Secrets via `process.env`** populated from Vercel project settings. No
   secret enters the repo. Pre-commit hook or git-secrets scan to enforce.
6. **CSP and security headers.** A `middleware.ts` that emits
   `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`,
   `Referrer-Policy`, `Permissions-Policy`. Defaults tightened over time.
7. **Audit log of every state-changing handler.** Append-only Postgres table,
   eventually a separate retention tier.
8. **Observability.** Sentry for exceptions; structured logs shipped off-host;
   uptime monitoring on the live URL.
9. **Vercel deployment protection turned back on.** Demos for non-customers move
   to per-link tokens, not public access.
10. **`SECURITY.md` reporting flow** (this file) replaced with a real
    [`coordinated disclosure`](https://en.wikipedia.org/wiki/Coordinated_disclosure)
    process, ideally including a `security.txt` at the root of the live domain.

This is also documented at a higher level in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) §7 (security & secrets) and
covered as a separate phase in the customization workflow in
[`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md).

## Reporting a vulnerability

If you spot a security issue in this prototype — even though there is no
real data to protect — please email **basisabp1984@gmail.com** with:

- A short description of the issue.
- Steps to reproduce.
- The affected URL and commit SHA, if known.

Please do not open a public GitHub issue for security reports. Triage target:
within 48 hours for an initial response.

## Supported versions

Only the `master` branch of this prototype receives updates. There are no
tagged releases yet; the project is pre-`v1.0.0`.
