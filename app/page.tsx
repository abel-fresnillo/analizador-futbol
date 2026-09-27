import { MatchCard } from "@/components/MatchCard";
import { MatchdayNav } from "@/components/MatchdayNav";
import {
  MissingApiKeyError, getCurrentSeason, getSeasonMatches, getSeasonMatchesOrEmpty, getStandings,
} from "@/lib/footballData";
import { recentForm } from "@/lib/model/form";
import { buildPredictor } from "@/lib/predictions";

export default async function Home({ searchParams }: { searchParams: Promise<{ matchday?: string }> }) {
  const { matchday: matchdayParam } = await searchParams;

  try {
    const season = await getCurrentSeason();
    const [current, previous, standingRows] = await Promise.all([
      getSeasonMatches(season.year),
      getSeasonMatchesOrEmpty(season.year - 1),
      getStandings(),
    ]);

    const requested = Number(matchdayParam);
    const matchday = Number.isInteger(requested) && requested >= 1 && requested <= 38 ? requested : season.matchday;

    const predict = buildPredictor(current, previous);
    const finished = current.filter((m) => m.score);
    const standings = new Map(standingRows.map((r) => [r.team.id, r]));
    const matches = current.filter((m) => m.matchday === matchday);
    const forms = new Map(
      matches.flatMap((m) => [m.homeTeam.id, m.awayTeam.id]).map((id) => [id, recentForm(id, finished)] as const),
    );

    return (
      <Shell>
        <MatchdayNav matchday={matchday} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} probabilities={predict(m)} standings={standings} forms={forms} />
          ))}
        </div>
        {matches.length === 0 && <p className="mt-6 text-slate-500">No hay partidos para esta jornada.</p>}
      </Shell>
    );
  } catch (e) {
    const message = e instanceof MissingApiKeyError
      ? "Configura FOOTBALL_DATA_API_KEY en .env.local (ver .env.example) y reinicia el servidor."
      : "No se pudieron cargar los datos de football-data.org. Inténtalo de nuevo en unos minutos.";
    return <Shell><p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">{message}</p></Shell>;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Premier League · Probabilidades</h1>
      {children}
      <p className="mt-10 text-xs text-slate-500 dark:text-slate-400">
        Las cifras son probabilidades estimadas con un modelo estadístico (Poisson sobre fuerza de ataque y defensa),
        no certezas: el fútbol tiene alta varianza. Datos: football-data.org.
      </p>
    </main>
  );
}
