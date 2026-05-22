# Deployment Guide — HarborOS

## Public Links

```
Live demo: https://harbor.radai-1984.dev
GitHub:    https://github.com/basisabp1984/harboros-logistics-intel
```

The live demo lets a founder experience the product. The GitHub repository lets a technical
reviewer inspect the architecture.

## Local Smoke Run

```bash
npm install
npm run lint
npm run build
npm run start
```

Open `http://localhost:3000`. Both `npm run lint` and `npm run build` should pass clean before
publishing.

## GitHub

The repository is at `https://github.com/basisabp1984/harboros-logistics-intel`. To replicate
from scratch on a fresh machine:

```bash
git init
git add .
git commit -m "Bootstrap HarborOS mission-control prototype"
git branch -M master
git remote add origin https://github.com/YOUR_USERNAME/harboros-logistics-intel.git
git push -u origin master
```

## Vercel

1. Open Vercel.
2. Import the GitHub repository.
3. Keep the default Next.js detection settings.
4. Deploy.

No environment variables are required for the prototype. No API keys, no LLM provider, no
database. Anyone who can `git pull` can run the demo.

## Custom Domain

The intended custom domain is `harbor.radai-1984.dev`. The DNS sits on Cloudflare for the
parent zone `radai-1984.dev`. To attach the subdomain:

1. Vercel → project settings → domains → add `harbor.radai-1984.dev`. Vercel prints the
   required DNS record.
2. Cloudflare → `radai-1984.dev` → DNS → add the record Vercel asked for. Usually:

   ```
   Type: CNAME
   Name: harbor
   Value: cname.vercel-dns.com
   Proxy: DNS only
   ```

3. Wait for propagation. Vercel issues the certificate automatically.

## Suggested Client Message

```
I built an API-first MVP skeleton for an AI ocean-freight intelligence platform.

Live demo:
https://harbor.radai-1984.dev

GitHub:
https://github.com/basisabp1984/harboros-logistics-intel

Notes:
- Mock data only.
- No real AIS, port, weather, or geopolitical feeds.
- No authentication, no database, no LLM provider.

The goal is to show the cockpit structure, API boundaries, voyage-planner workflow,
React Portal interactions, and where real data systems and an LLM can be connected
later.
```

## Pre-Deploy Checks

```bash
npm run lint
npm run build
```

Both must pass clean before sharing the project.
