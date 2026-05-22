"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileTabs } from "@/components/layout/MobileTabs";
import { AnalystPanel } from "@/components/portals/AnalystPanel";
import { CommandPalette } from "@/components/portals/CommandPalette";
import { VoyagePlannerModal } from "@/components/portals/VoyagePlannerModal";
import { ToastDeck, ToastEntry } from "@/components/portals/ToastDeck";

export function Shell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const pushToast = useCallback((toast: Omit<ToastEntry, "id">) => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, ...toast }]);
    window.setTimeout(() => setToasts((items) => items.filter((t) => t.id !== id)), 4500);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      pushToast({
        title: "New disruption signal",
        body: "Long Beach anchorage queue grew by 3 vessels in the last 20 min.",
        tone: "warning"
      });
    }, 3500);
    return () => window.clearTimeout(t);
  }, [pushToast]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar onCommand={() => setPaletteOpen(true)} onPlanVoyage={() => setPlannerOpen(true)} />
        <main className="px-4 pb-32 pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileTabs />
      <AnalystPanel />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onPlanVoyage={() => setPlannerOpen(true)}
      />
      <VoyagePlannerModal
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        onPlanned={(voyage) =>
          pushToast({
            title: "Voyage planned",
            body: `${voyage.routeCode} · ${voyage.from} → ${voyage.to} · ETA ${new Date(voyage.arrivalIso).toUTCString().slice(0, 16)}`,
            tone: "success"
          })
        }
      />
      <ToastDeck toasts={toasts} />
    </div>
  );
}
