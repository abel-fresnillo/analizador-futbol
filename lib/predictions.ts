import type { Match, Probabilities } from "@/lib/types";
import { outcomeProbabilities } from "@/lib/model/poisson";
import { computeStrengths, expectedGoals, toWeighted } from "@/lib/model/strengths";

/** Peso de la temporada anterior frente a la actual (cuenta menos porque las plantillas cambian). */
const PREVIOUS_SEASON_WEIGHT = 0.5;

export function buildPredictor(current: Match[], previous: Match[], now = new Date()) {
  const strengths = computeStrengths([
    ...toWeighted(current, now),
    ...toWeighted(previous, now, PREVIOUS_SEASON_WEIGHT),
  ]);
  return (match: Match): Probabilities => {
    const g = expectedGoals(strengths, match.homeTeam.id, match.awayTeam.id);
    return outcomeProbabilities(g.home, g.away);
  };
}
