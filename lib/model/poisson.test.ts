import { describe, expect, it } from "vitest";
import { outcomeProbabilities } from "./poisson";

describe("outcomeProbabilities", () => {
  it("suma 1", () => {
    const p = outcomeProbabilities(1.7, 1.1);
    expect(p.home + p.draw + p.away).toBeCloseTo(1, 10);
  });

  it("es simétrica con goles esperados iguales", () => {
    const p = outcomeProbabilities(1.3, 1.3);
    expect(p.home).toBeCloseTo(p.away, 10);
  });

  it("favorece al equipo con más goles esperados", () => {
    const p = outcomeProbabilities(2.2, 0.8);
    expect(p.home).toBeGreaterThan(p.draw);
    expect(p.draw).toBeGreaterThan(p.away);
  });
});
