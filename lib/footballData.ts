import type { Match, StandingRow, Team } from "@/lib/types";

const BASE_URL = "https://api.football-data.org/v4/competitions/PL";
const REVALIDATE_SECONDS = 3600;

export class MissingApiKeyError extends Error {
  constructor() {
    super("Falta FOOTBALL_DATA_API_KEY en .env.local");
  }
}

async function api<T>(path: string): Promise<T> {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) throw new MissingApiKeyError();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`football-data.org ${path} respondió ${res.status}`);
  return res.json() as Promise<T>;
}

interface ApiTeam { id: number; name: string; shortName: string | null; tla: string; crest: string }
const toTeam = (t: ApiTeam): Team => ({
  id: t.id,
  name: t.name,
  shortName: t.shortName ?? t.name,
  crest: t.crest,
});

export async function getCurrentSeason(): Promise<{ year: number; matchday: number }> {
  const data = await api<{ currentSeason: { startDate: string; currentMatchday: number | null } }>("");
  return {
    year: Number(data.currentSeason.startDate.slice(0, 4)),
    matchday: data.currentSeason.currentMatchday ?? 1,
  };
}

interface ApiMatch {
  id: number;
  matchday: number;
  utcDate: string;
  status: string;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: { fullTime: { home: number | null; away: number | null } };
}

/** Todos los partidos de una temporada (una sola llamada, se filtra en local). */
export async function getSeasonMatches(year: number): Promise<Match[]> {
  const data = await api<{ matches: ApiMatch[] }>(`/matches?season=${year}`);
  return data.matches.map((m) => {
    const { home, away } = m.score.fullTime;
    return {
      id: m.id,
      matchday: m.matchday,
      utcDate: m.utcDate,
      status: m.status,
      homeTeam: toTeam(m.homeTeam),
      awayTeam: toTeam(m.awayTeam),
      score: m.status === "FINISHED" && home !== null && away !== null ? { home, away } : null,
    };
  });
}

/** La temporada anterior puede no estar disponible en el plan gratuito; en ese caso, sin datos. */
export async function getSeasonMatchesOrEmpty(year: number): Promise<Match[]> {
  try {
    return await getSeasonMatches(year);
  } catch (e) {
    if (e instanceof MissingApiKeyError) throw e;
    return [];
  }
}

export async function getStandings(): Promise<StandingRow[]> {
  const data = await api<{
    standings: {
      type: string;
      table: {
        position: number; team: ApiTeam; playedGames: number; points: number;
        goalsFor: number; goalsAgainst: number;
      }[];
    }[];
  }>("/standings");
  const total = data.standings.find((s) => s.type === "TOTAL") ?? data.standings[0];
  return total.table.map((r) => ({
    position: r.position,
    team: toTeam(r.team),
    playedGames: r.playedGames,
    points: r.points,
    goalsFor: r.goalsFor,
    goalsAgainst: r.goalsAgainst,
  }));
}
