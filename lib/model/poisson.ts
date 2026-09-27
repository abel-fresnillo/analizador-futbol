import type { Probabilities } from "@/lib/types";

const MAX_GOALS = 8;

function poissonPmf(lambda: number, maxK: number): number[] {
  const pmf = [Math.exp(-lambda)];
  for (let k = 1; k <= maxK; k++) pmf.push((pmf[k - 1] * lambda) / k);
  return pmf;
}

/**
 * Probabilidades 1X2 a partir de los goles esperados de cada equipo,
 * asumiendo goles independientes con distribución de Poisson.
 * Se normaliza para que la masa truncada (marcadores > MAX_GOALS) no rompa la suma a 1.
 */
export function outcomeProbabilities(lambdaHome: number, lambdaAway: number): Probabilities {
  const h = poissonPmf(lambdaHome, MAX_GOALS);
  const a = poissonPmf(lambdaAway, MAX_GOALS);
  let home = 0;
  let draw = 0;
  let away = 0;
  for (let i = 0; i <= MAX_GOALS; i++) {
    for (let j = 0; j <= MAX_GOALS; j++) {
      const p = h[i] * a[j];
      if (i > j) home += p;
      else if (i === j) draw += p;
      else away += p;
    }
  }
  const total = home + draw + away;
  return { home: home / total, draw: draw / total, away: away / total };
}
