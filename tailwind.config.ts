import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"]
      },
      colors: {
        ink: "#e6edf6",
        muted: "#7b8aa1",
        canvas: "#070b14",
        surface: {
          DEFAULT: "#0f1626",
          raised: "#141d31",
          line: "#1f2a44"
        },
        accent: {
          cyan: "#22d3ee",
          emerald: "#34d399",
          amber: "#fbbf24",
          rose: "#fb7185",
          violet: "#a78bfa"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.18), 0 12px 40px -16px rgba(34,211,238,0.35)",
        soft: "0 18px 60px -28px rgba(2,6,12,0.65)"
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)"
      },
      backgroundSize: {
        "grid-soft": "48px 48px"
      }
    }
  },
  plugins: []
};

export default config;
