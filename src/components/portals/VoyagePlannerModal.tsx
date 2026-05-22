"use client";

import { useState } from "react";
import { Compass, X } from "lucide-react";
import { Portal } from "@/components/portals/Portal";
import { apiClient } from "@/lib/api";
import { Voyage } from "@/types";

export function VoyagePlannerModal({
  open,
  onClose,
  onPlanned
}: {
  open: boolean;
  onClose: () => void;
  onPlanned: (voyage: Voyage) => void;
}) {
  const [from, setFrom] = useState("Singapore");
  const [to, setTo] = useState("Rotterdam");
  const [vessel, setVessel] = useState("Aurora Crest");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function submit() {
    setBusy(true);
    const result = await apiClient.planVoyage({ from, to, vessel });
    setBusy(false);
    onPlanned(result.data);
    onClose();
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/70 px-4 backdrop-blur-md">
        <section className="w-full max-w-xl rounded-2xl border border-surface-line bg-surface/95 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-accent-cyan/15 p-2.5 text-accent-cyan ring-1 ring-accent-cyan/40">
                <Compass size={20} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Routing agent</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">Plan a new voyage</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close planner"
              className="rounded-lg p-1.5 text-muted hover:bg-surface-raised hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            This simulates an API-first routing workflow. In production it would trigger an actual
            routing optimization, write to the voyage ledger, and notify the consignee.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.14em] text-muted">From port</span>
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="rounded-xl border border-surface-line bg-canvas/40 px-3 py-2 text-sm text-ink outline-none focus:border-accent-cyan/60"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.14em] text-muted">To port</span>
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="rounded-xl border border-surface-line bg-canvas/40 px-3 py-2 text-sm text-ink outline-none focus:border-accent-cyan/60"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.14em] text-muted">Vessel</span>
              <input
                value={vessel}
                onChange={(event) => setVessel(event.target.value)}
                className="rounded-xl border border-surface-line bg-canvas/40 px-3 py-2 text-sm text-ink outline-none focus:border-accent-cyan/60"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-surface-line bg-canvas/40 px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={busy}
              className="rounded-xl bg-accent-cyan/20 px-5 py-2.5 text-sm font-semibold text-accent-cyan ring-1 ring-accent-cyan/40 transition hover:bg-accent-cyan/30 disabled:opacity-60"
            >
              {busy ? "Optimizing..." : "Run mock optimization"}
            </button>
          </div>
        </section>
      </div>
    </Portal>
  );
}
