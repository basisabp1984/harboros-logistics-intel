"use client";

import { Plus, Search, Signal } from "lucide-react";

export function Topbar({
  onCommand,
  onPlanVoyage
}: {
  onCommand: () => void;
  onPlanVoyage: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-surface-line bg-canvas/80 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onCommand}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-surface-line bg-surface/70 px-3.5 py-2 text-left text-sm text-muted transition hover:border-accent-cyan/40 hover:text-ink"
        >
          <Search size={16} />
          <span className="truncate">Search vessels, ports, voyages, disruptions...</span>
          <span className="ml-auto hidden items-center gap-1 rounded-md border border-surface-line bg-surface-raised px-1.5 py-0.5 font-mono text-[11px] text-muted sm:flex">
            Ctrl K
          </span>
        </button>

        <button
          onClick={onPlanVoyage}
          className="hidden items-center gap-2 rounded-xl bg-accent-cyan/15 px-3 py-2 text-sm font-semibold text-accent-cyan ring-1 ring-accent-cyan/40 transition hover:bg-accent-cyan/25 sm:flex"
        >
          <Plus size={16} />
          Plan voyage
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-surface-line bg-surface/70 px-3 py-1.5">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink leading-tight">Ops Console</p>
            <p className="text-xs text-muted leading-tight">
              <Signal size={10} className="inline-block text-accent-emerald" /> UTC sync
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan text-xs font-bold text-canvas">
            OC
          </div>
        </div>
      </div>
    </header>
  );
}
