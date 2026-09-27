import type { Match, Probabilities, StandingRow } from "@/lib/types";
import type { TeamForm } from "@/lib/model/form";
import { ProbabilityBar } from "./ProbabilityBar";
import { TeamStats } from "./TeamStats";

const dateFmt = new Intl.DateTimeFormat("es", {
  weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  timeZone: "Europe/London",
});

export function MatchCard({
  match, probabilities, standings, forms,
}: {
  match: Match;
  probabilities: Probabilities;
  standings: Map<number, StandingRow>;
  forms: Map<number, TeamForm>;
}) {
  const empty: TeamForm = { results: [], goalsFor: 0, goalsAgainst: 0 };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <time dateTime={match.utcDate}>{dateFmt.format(new Date(match.utcDate))} (Reino Unido)</time>
        {match.score && (
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {match.score.home} - {match.score.away}
          </span>
        )}
      </header>
      <div className="grid grid-cols-2 gap-4">
        <TeamStats team={match.homeTeam} standing={standings.get(match.homeTeam.id)} form={forms.get(match.homeTeam.id) ?? empty} align="left" />
        <TeamStats team={match.awayTeam} standing={standings.get(match.awayTeam.id)} form={forms.get(match.awayTeam.id) ?? empty} align="right" />
      </div>
      <div className="mt-5">
        <ProbabilityBar p={probabilities} />
      </div>
    </article>
  );
}
