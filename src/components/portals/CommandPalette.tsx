"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Anchor,
  Compass,
  LayoutDashboard,
  Route,
  Search,
  Settings,
  Ship,
  X
} from "lucide-react";
import { Portal } from "@/components/portals/Portal";

const actions = [
  { href: "/", label: "Open Cockpit", icon: LayoutDashboard },
  { href: "/fleet", label: "Inspect Fleet", icon: Ship },
  { href: "/ports", label: "Port congestion radar", icon: Anchor },
  { href: "/voyages", label: "Voyage ledger", icon: Route },
  { href: "/disruptions", label: "Disruption signals", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function CommandPalette({
  open,
  onClose,
  onPlanVoyage
}: {
  open: boolean;
  onClose: () => void;
  onPlanVoyage: () => void;
}) {
  if (!open) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-50 bg-canvas/70 px-4 pt-[12vh] backdrop-blur-md">
        <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-surface-line bg-surface/95 shadow-soft">
          <div className="flex items-center gap-3 border-b border-surface-line px-4 py-3">
            <Search size={16} className="text-muted" />
            <input
              autoFocus
              placeholder="Type a command — vessels, ports, disruptions..."
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
            <button
              aria-label="Close palette"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted hover:bg-surface-raised hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-3">
            <button
              onClick={() => {
                onPlanVoyage();
                onClose();
              }}
              className="mb-2 flex w-full items-center gap-3 rounded-xl bg-accent-cyan/15 px-4 py-3 text-left text-sm font-semibold text-accent-cyan ring-1 ring-accent-cyan/40 transition hover:bg-accent-cyan/25"
            >
              <Compass size={16} />
              Plan a new voyage
              <span className="ml-auto rounded-md border border-accent-cyan/30 px-1.5 py-0.5 font-mono text-[10px]">↵</span>
            </button>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-canvas/60 hover:text-ink"
                >
                  <Icon size={16} />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Portal>
  );
}
