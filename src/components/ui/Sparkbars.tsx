export function Sparkbars({ data, accent = "#22d3ee" }: { data: number[]; accent?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-10 items-end gap-1">
      {data.map((value, index) => (
        <div
          key={index}
          className="w-1.5 rounded-sm"
          style={{
            height: `${Math.max(8, (value / max) * 100)}%`,
            background: `linear-gradient(180deg, ${accent}cc, ${accent}33)`
          }}
        />
      ))}
    </div>
  );
}
