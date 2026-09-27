export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface Match {
  id: number;
  matchday: number;
  utcDate: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  /** Marcador final; null si el partido no ha terminado. */
  score: { home: number; away: number } | null;
}

export interface StandingRow {
  position: number;
  team: Team;
  playedGames: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Probabilities {
  home: number;
  draw: number;
  away: number;
}

export type FormResult = "W" | "D" | "L";
