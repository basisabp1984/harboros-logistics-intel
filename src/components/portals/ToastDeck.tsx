"use client";

import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Portal } from "@/components/portals/Portal";

export type ToastTone = "success" | "warning" | "info";

export type ToastEntry = {
  id: string;
  title: string;
  body: string;
  tone: ToastTone;
};

const toneConfig: Record<ToastTone, { icon: typeof Info; ring: string; text: string }> = {
  success: { icon: CheckCircle2, ring: "ring-accent-emerald/40", text: "text-accent-emerald" },
  warning: { icon: AlertTriangle, ring: "ring-accent-amber/40", text: "text-accent-amber" },
  info: { icon: Info, ring: "ring-accent-cyan/40", text: "text-accent-cyan" }
};

export function ToastDeck({ toasts }: { toasts: ToastEntry[] }) {
  return (
    <Portal>
      <div className="pointer-events-none fixed bottom-24 right-5 z-50 flex w-[min(92vw,360px)] flex-col gap-3 lg:bottom-5 lg:right-[420px]">
        {toasts.map((toast) => {
          const cfg = toneConfig[toast.tone];
          const Icon = cfg.icon;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border border-surface-line bg-surface/95 p-4 ring-1 ${cfg.ring} shadow-soft backdrop-blur`}
            >
              <div className="flex gap-3">
                <Icon className={`mt-0.5 ${cfg.text}`} size={18} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{toast.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{toast.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Portal>
  );
}
