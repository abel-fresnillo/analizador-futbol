import type { FormResult, Match } from "@/lib/types";

export interface TeamForm {
  results: FormResult[]; // más reciente al final
  goalsFor: number;
  goalsAgainst: number;
}

/** Forma del equipo en sus últimos `n` partidos terminados. */
export function recentForm(teamId: number, finished: Match[], n = 5): TeamForm {
  const games = finished
    .filter((m) => m.score && (m.homeTeam.id === teamId || m.awayTeam.id === teamId))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .slice(-n);

  const form: TeamForm = { results: [], goalsFor: 0, goalsAgainst: 0 };
  for (const m of games) {
    const isHome = m.homeTeam.id === teamId;
    const gf = isHome ? m.score!.home : m.score!.away;
    const ga = isHome ? m.score!.away : m.score!.home;
    form.goalsFor += gf;
    form.goalsAgainst += ga;
    form.results.push(gf > ga ? "W" : gf === ga ? "D" : "L");
  }
  return form;
}
