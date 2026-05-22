import { Port } from "@/types";

const congestionColor: Record<Port["congestion"], string> = {
  Calm: "#34d399",
  Moderate: "#fbbf24",
  Heavy: "#fb923c",
  Critical: "#fb7185"
};

const portCoords: Record<string, { x: number; y: number }> = {
  SGSIN: { x: 720, y: 285 },
  NLRTM: { x: 480, y: 130 },
  USLGB: { x: 100, y: 200 },
  CNSHA: { x: 760, y: 215 },
  DEHAM: { x: 492, y: 120 },
  AUPHE: { x: 745, y: 365 }
};

export function WorldMap({ ports }: { ports: Port[] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-surface-line bg-canvas/60">
      <svg viewBox="0 0 900 460" className="block h-full w-full">
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="1" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="900" height="460" fill="url(#grid)" />
        {/* stylized continents (loose blobs) */}
        <g fill="rgba(34,211,238,0.07)" stroke="rgba(34,211,238,0.25)" strokeWidth="1">
          {/* North America */}
          <path d="M60 110 Q150 70 215 120 Q255 170 200 235 Q140 250 100 220 Q50 195 60 110 Z" />
          {/* South America */}
          <path d="M195 245 Q230 250 240 310 Q230 380 195 410 Q170 380 175 320 Q180 270 195 245 Z" />
          {/* Europe */}
          <path d="M425 95 Q500 80 540 115 Q535 165 480 175 Q435 165 425 130 Z" />
          {/* Africa */}
          <path d="M470 175 Q520 175 545 225 Q540 305 495 360 Q465 355 460 305 Q455 230 470 175 Z" />
          {/* Asia */}
          <path d="M540 95 Q670 70 800 105 Q830 170 790 230 Q700 245 600 215 Q545 175 540 95 Z" />
          {/* Australia */}
          <path d="M720 330 Q790 320 815 355 Q800 395 750 395 Q710 380 720 330 Z" />
        </g>
        {/* ports */}
        {ports.map((port) => {
          const coords = portCoords[port.unlocode];
          if (!coords) return null;
          const color = congestionColor[port.congestion];
          const r = port.congestion === "Critical" ? 24 : port.congestion === "Heavy" ? 18 : 12;
          return (
            <g key={port.id} style={{ color }}>
              <circle cx={coords.x} cy={coords.y} r={r} fill="url(#glow)" />
              <circle cx={coords.x} cy={coords.y} r={4} fill={color} />
              <text
                x={coords.x + 8}
                y={coords.y - 10}
                fill="#e6edf6"
                fontSize="11"
                fontFamily="ui-sans-serif"
                fontWeight={600}
              >
                {port.name}
              </text>
              <text
                x={coords.x + 8}
                y={coords.y + 4}
                fill="#7b8aa1"
                fontSize="9"
                fontFamily="ui-monospace"
              >
                {port.avgWaitHours}h wait · {port.vesselsAtAnchor} anchor
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
