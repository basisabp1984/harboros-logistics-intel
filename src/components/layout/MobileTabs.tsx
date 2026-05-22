"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Anchor, LayoutDashboard, Route, Ship } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Cockpit", icon: LayoutDashboard },
  { href: "/fleet", label: "Fleet", icon: Ship },
  { href: "/ports", label: "Ports", icon: Anchor },
  { href: "/voyages", label: "Voyages", icon: Route },
  { href: "/disruptions", label: "Alerts", icon: AlertTriangle }
];

export function MobileTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-surface-line bg-surface/95 p-1.5 backdrop-blur-xl shadow-soft lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl py-2 text-[10.5px] font-semibold transition",
              active ? "bg-accent-cyan/15 text-accent-cyan" : "text-muted"
            )}
          >
            <Icon size={16} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
