import { StatusPill } from "@/components/ui/StatusPill";

const integrations = [
  ["AIS / vessel telemetry", "Mocked", "Future MarineTraffic / VesselFinder / Spire feed"],
  ["Port congestion", "Mocked", "Future port authority APIs + crowd-sourced berth signals"],
  ["Weather + cyclone risk", "Mocked", "Future NOAA / DTN / Tomorrow.io feed"],
  ["Geopolitical signals", "Mocked", "Future insurance/security intel feed (Dryad, Ambrey, etc.)"],
  ["ETA / routing model", "Mocked", "Future in-house bunker-aware routing model"],
  ["LLM analyst", "Mocked", "Future provider abstraction + prompt registry"]
] as const;

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Platform setup</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Nothing here ships secrets. These controls document where real data feeds and credentials
          will plug in when HarborOS goes beyond a prototype.
        </p>
      </header>

      <section className="rounded-2xl border border-surface-line bg-surface/70 p-5">
        <h2 className="text-lg font-bold text-ink">Integration readiness</h2>
        <div className="mt-4 grid gap-3">
          {integrations.map(([name, status, note]) => (
            <div
              key={name}
              className="flex flex-col gap-3 rounded-xl border border-surface-line bg-canvas/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{name}</p>
                <p className="mt-1 text-sm text-muted">{note}</p>
              </div>
              <StatusPill tone="amber">{status}</StatusPill>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-line bg-surface/70 p-5">
          <h2 className="text-lg font-bold text-ink">Alert preferences</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <label className="flex items-center justify-between rounded-xl border border-surface-line bg-canvas/40 p-3">
              <span>Critical congestion alerts</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-surface-line bg-canvas/40 p-3">
              <span>Cyclone / weather watches</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-surface-line bg-canvas/40 p-3">
              <span>Daily ops brief (08:00 UTC)</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-surface-line bg-canvas/40 p-3">
              <span>Geopolitical re-rating notices</span>
              <input type="checkbox" className="accent-cyan-400" />
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-surface-line bg-surface/70 p-5">
          <h2 className="text-lg font-bold text-ink">API posture</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            HarborOS keeps API contracts separated from the cockpit. Every screen consumes a Next.js
            route handler under <span className="font-mono text-accent-cyan">/api/*</span>. To go
            production, replace the mock handlers with database reads, AIS providers, port APIs,
            queue-backed research jobs, and an LLM provider — without touching the UI.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            No real keys are required to run this demo.
          </p>
        </div>
      </section>
    </div>
  );
}
