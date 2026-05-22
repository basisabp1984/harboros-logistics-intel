"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Anchor,
  LayoutDashboard,
  Route,
  Settings,
  Ship
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Cockpit", icon: LayoutDashboard },
  { href: "/fleet", label: "Fleet", icon: Ship },
  { href: "/ports", label: "Ports", icon: Anchor },
  { href: "/voyages", label: "Voyages", icon: Route },
  { href: "/disruptions", label: "Disruptions", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-surface-line bg-surface/60 px-4 py-6 backdrop-blur lg:flex lg:flex-col">
      <div className="mb-7 flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan/30 to-accent-violet/30 text-accent-cyan ring-1 ring-accent-cyan/40">
          <Anchor size={22} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-emerald shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-ink">HarborOS</p>
          <p className="text-xs text-muted">Ocean-freight intelligence</p>
        </div>
      </div>

      <nav className="space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-accent-cyan/10 text-accent-cyan ring-1 ring-accent-cyan/30"
                  : "text-muted hover:bg-surface-raised hover:text-ink"
              )}
            >
              <Icon size={17} className={cn(active ? "text-accent-cyan" : "text-muted group-hover:text-ink")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-surface-line bg-surface-raised/70 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent-emerald">
          <Activity size={13} />
          Live ops
        </div>
        <p className="mt-2 text-sm font-semibold text-ink">All AIS feeds nominal</p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Mock telemetry. Replace with live AIS + port APIs to go production.
        </p>
      </div>
    </aside>
  );
}
