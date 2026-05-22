"use client";

import { FormEvent, useState } from "react";
import { Bot, MessageSquare, Send, X } from "lucide-react";
import { Portal } from "@/components/portals/Portal";
import { apiClient } from "@/lib/api";

const seeds = [
  "Where are the worst delays right now?",
  "Which ports are congested this week?",
  "Brief me on open disruptions and risk",
  "Which vessel has the highest carbon intensity?",
  "Write a short ocean-freight weekly brief"
];

type Message = { role: "user" | "agent"; text: string };

export function AnalystPanel() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<Message[]>([
    {
      role: "agent",
      text: "I'm your routing analyst. Ask me about delays, port congestion, disruptions, fuel posture, or this week's brief — I'm reading the mock telemetry live."
    }
  ]);

  async function ask(question: string) {
    if (!question.trim()) return;
    setLog((items) => [...items, { role: "user", text: question }]);
    setInput("");
    setBusy(true);
    const response = await apiClient.ask(question);
    setLog((items) => [...items, { role: "agent", text: response.data.answer }]);
    setBusy(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <Portal>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-2xl bg-accent-cyan/15 px-4 py-3 text-sm font-semibold text-accent-cyan ring-1 ring-accent-cyan/40 backdrop-blur transition hover:bg-accent-cyan/25"
        >
          <MessageSquare size={16} />
          Routing analyst
        </button>
      )}
      {open && (
        <aside className="fixed bottom-5 right-5 z-40 flex h-[min(80vh,640px)] w-[min(94vw,400px)] flex-col overflow-hidden rounded-2xl border border-surface-line bg-surface/95 backdrop-blur-xl shadow-soft">
          <div className="flex items-center justify-between border-b border-surface-line px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-accent-cyan/15 p-2 text-accent-cyan ring-1 ring-accent-cyan/30">
                <Bot size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Routing analyst</p>
                <p className="text-[11px] text-muted">Mock LLM over mock ops data</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close analyst"
              className="rounded-lg p-1.5 text-muted transition hover:bg-surface-raised hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-auto px-4 py-3 text-sm">
            {log.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-2xl bg-accent-cyan/20 px-3 py-2 text-ink ring-1 ring-accent-cyan/30"
                    : "mr-8 rounded-2xl bg-canvas/60 px-3 py-2 leading-6 text-muted"
                }
              >
                {message.text}
              </div>
            ))}
            {busy && <p className="mr-8 rounded-2xl bg-canvas/60 px-3 py-2 text-xs text-muted">Analyzing mock telemetry...</p>}
            <div className="grid gap-2 pt-2">
              {seeds.map((seed) => (
                <button
                  key={seed}
                  onClick={() => ask(seed)}
                  className="rounded-xl border border-surface-line bg-canvas/40 px-3 py-2 text-left text-[11px] text-muted transition hover:border-accent-cyan/40 hover:text-ink"
                >
                  {seed}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-surface-line p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask the analyst..."
              className="min-w-0 flex-1 rounded-xl border border-surface-line bg-canvas/40 px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-accent-cyan/60"
            />
            <button
              type="submit"
              aria-label="Send"
              className="rounded-xl bg-accent-cyan/20 p-2.5 text-accent-cyan ring-1 ring-accent-cyan/40 transition hover:bg-accent-cyan/30"
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      )}
    </Portal>
  );
}
