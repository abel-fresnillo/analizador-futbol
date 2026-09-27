import type { Match } from "@/lib/types";

export interface WeightedMatch {
  homeId: number;
  awayId: number;
  homeGoals: number;
  awayGoals: number;
  weight: number;
}

export interface Strengths {
  /** Media de goles del local / visitante en la liga (incluye la ventaja de localía). */
  leagueHomeAvg: number;
  leagueAwayAvg: number;
  /** Multiplicadores relativos a la media de la liga (1 = promedio). */
  teams: Map<number, { attack: number; defense: number }>;
}

/** Partidos de referencia con los que se regulariza cada equipo hacia la media. */
const PRIOR_GAMES = 4;

/**
 * Convierte partidos terminados en `WeightedMatch`.
 * El peso decae con la antigüedad (vida media `halfLifeDays`) y se multiplica por `baseWeight`
 * (p. ej. 0.5 para la temporada anterior).
 */
export function toWeighted(
  matches: Match[],
  now: Date,
  baseWeight = 1,
  halfLifeDays = 120,
): WeightedMatch[] {
  return matches
    .filter((m) => m.score)
    .map((m) => {
      const ageDays = (now.getTime() - new Date(m.utcDate).getTime()) / 86_400_000;
      return {
        homeId: m.homeTeam.id,
        awayId: m.awayTeam.id,
        homeGoals: m.score!.home,
        awayGoals: m.score!.away,
        weight: baseWeight * Math.pow(0.5, Math.max(ageDays, 0) / halfLifeDays),
      };
    });
}

export function computeStrengths(matches: WeightedMatch[]): Strengths {
  let wSum = 0;
  let homeGoals = 0;
  let awayGoals = 0;
  for (const m of matches) {
    wSum += m.weight;
    homeGoals += m.weight * m.homeGoals;
    awayGoals += m.weight * m.awayGoals;
  }
  const leagueHomeAvg = wSum > 0 ? homeGoals / wSum : 1.5;
  const leagueAwayAvg = wSum > 0 ? awayGoals / wSum : 1.2;
  const avg = (leagueHomeAvg + leagueAwayAvg) / 2; // goles por equipo y partido

  const acc = new Map<number, { n: number; gf: number; ga: number }>();
  const get = (id: number) => {
    let a = acc.get(id);
    if (!a) acc.set(id, (a = { n: 0, gf: 0, ga: 0 }));
    return a;
  };
  for (const m of matches) {
    const h = get(m.homeId);
    const a = get(m.awayId);
    h.n += m.weight; h.gf += m.weight * m.homeGoals; h.ga += m.weight * m.awayGoals;
    a.n += m.weight; a.gf += m.weight * m.awayGoals; a.ga += m.weight * m.homeGoals;
  }

  const teams = new Map<number, { attack: number; defense: number }>();
  for (const [id, t] of acc) {
    const denom = (t.n + PRIOR_GAMES) * avg;
    teams.set(id, {
      attack: (t.gf + PRIOR_GAMES * avg) / denom,
      defense: (t.ga + PRIOR_GAMES * avg) / denom,
    });
  }
  return { leagueHomeAvg, leagueAwayAvg, teams };
}

/** Goles esperados de cada equipo; un equipo desconocido se trata como promedio. */
export function expectedGoals(s: Strengths, homeId: number, awayId: number) {
  const h = s.teams.get(homeId) ?? { attack: 1, defense: 1 };
  const a = s.teams.get(awayId) ?? { attack: 1, defense: 1 };
  return {
    home: s.leagueHomeAvg * h.attack * a.defense,
    away: s.leagueAwayAvg * a.attack * h.defense,
  };
}
