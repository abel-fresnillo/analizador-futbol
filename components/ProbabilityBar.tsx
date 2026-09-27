import type { Probabilities } from "@/lib/types";

const pct = (p: number) => Math.round(p * 100);

export function ProbabilityBar({ p }: { p: Probabilities }) {
  const segments = [
    { label: "Local", value: p.home, color: "bg-emerald-500" },
    { label: "Empate", value: p.draw, color: "bg-slate-400" },
    { label: "Visitante", value: p.away, color: "bg-sky-500" },
  ];
  return (
    <div>
      <div
        className="flex h-3 overflow-hidden rounded-full"
        role="img"
        aria-label={segments.map((s) => `${s.label} ${pct(s.value)}%`).join(", ")}
      >
        {segments.map((s) => (
          <div key={s.label} className={s.color} style={{ width: `${s.value * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 text-sm">
        {segments.map((s, i) => (
          <div key={s.label} className={i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"}>
            <span className="font-semibold">{pct(s.value)}%</span>
            <span className="ml-1 text-slate-500 dark:text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
