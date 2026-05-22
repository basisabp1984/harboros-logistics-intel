import { CockpitKpis, Disruption, Port, Vessel, Voyage } from "@/types";

type Wrapped<T> = { data: T };

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) }
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${path} (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  vessels: () => call<Wrapped<Vessel[]> & { kpis: CockpitKpis }>("/api/vessels"),
  ports: () => call<Wrapped<Port[]>>("/api/ports"),
  voyages: () => call<Wrapped<Voyage[]>>("/api/voyages"),
  disruptions: () => call<Wrapped<Disruption[]>>("/api/disruptions"),
  planVoyage: (payload: { from: string; to: string; vessel: string }) =>
    call<Wrapped<Voyage>>("/api/voyages/plan", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  ask: (question: string) =>
    call<Wrapped<{ answer: string; citations: string[] }>>("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ question })
    })
};
