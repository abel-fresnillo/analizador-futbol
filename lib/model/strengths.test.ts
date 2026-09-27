import { describe, expect, it } from "vitest";
import { computeStrengths, expectedGoals, type WeightedMatch } from "./strengths";
import { outcomeProbabilities } from "./poisson";

const m = (homeId: number, awayId: number, hg: number, ag: number): WeightedMatch => ({
  homeId, awayId, homeGoals: hg, awayGoals: ag, weight: 1,
});

// Liga de 3 equipos: 1 fuerte, 2 medio, 3 débil, todos contra todos ida y vuelta.
const league = [
  m(1, 2, 3, 1), m(2, 1, 1, 2), m(1, 3, 4, 0), m(3, 1, 0, 3),
  m(2, 3, 2, 1), m(3, 2, 0, 1),
];

describe("computeStrengths", () => {
  const s = computeStrengths(league);

  it("ordena ataque y defensa según el rendimiento", () => {
    const t = (id: number) => s.teams.get(id)!;
    expect(t(1).attack).toBeGreaterThan(t(2).attack);
    expect(t(2).attack).toBeGreaterThan(t(3).attack);
    expect(t(1).defense).toBeLessThan(t(3).defense);
  });

  it("el fuerte en casa contra el débil es claro favorito", () => {
    const g = expectedGoals(s, 1, 3);
    const p = outcomeProbabilities(g.home, g.away);
    expect(p.home).toBeGreaterThan(0.6);
    expect(p.home + p.draw + p.away).toBeCloseTo(1, 10);
  });

  it("sin datos no falla y devuelve valores razonables", () => {
    const g = expectedGoals(computeStrengths([]), 1, 2);
    expect(g.home).toBeGreaterThan(g.away);
  });
});
