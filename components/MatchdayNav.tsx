import Link from "next/link";

const TOTAL_MATCHDAYS = 38;

export function MatchdayNav({ matchday }: { matchday: number }) {
  const link = "rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800";
  const disabled = "pointer-events-none opacity-40";
  return (
    <nav className="flex items-center gap-3" aria-label="Jornadas">
      <Link href={`/?matchday=${matchday - 1}`} className={`${link} ${matchday <= 1 ? disabled : ""}`}>← Anterior</Link>
      <span className="text-lg font-semibold">Jornada {matchday}</span>
      <Link href={`/?matchday=${matchday + 1}`} className={`${link} ${matchday >= TOTAL_MATCHDAYS ? disabled : ""}`}>Siguiente →</Link>
    </nav>
  );
}
