import Image from "next/image";
import type { FormResult, StandingRow, Team } from "@/lib/types";
import type { TeamForm } from "@/lib/model/form";

const formColor: Record<FormResult, string> = {
  W: "bg-emerald-500",
  D: "bg-slate-400",
  L: "bg-rose-500",
};

export function TeamStats({
  team, standing, form, align,
}: {
  team: Team;
  standing?: StandingRow;
  form: TeamForm;
  align: "left" | "right";
}) {
  const right = align === "right";
  return (
    <div className={`flex flex-col gap-2 ${right ? "items-end text-right" : "items-start"}`}>
      <div className={`flex items-center gap-3 ${right ? "flex-row-reverse" : ""}`}>
        <Image src={team.crest} alt="" width={40} height={40} className="h-10 w-10 object-contain" unoptimized />
        <span className="text-lg font-semibold">{team.shortName}</span>
      </div>
      {standing && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {standing.position}.º · {standing.points} pts · GF {standing.goalsFor} / GC {standing.goalsAgainst}
        </p>
      )}
      <div className="flex gap-1" aria-label={`Forma reciente: ${form.results.join(" ") || "sin datos"}`}>
        {form.results.map((r, i) => (
          <span
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${formColor[r]}`}
          >
            {r === "W" ? "V" : r === "D" ? "E" : "D"}
          </span>
        ))}
      </div>
    </div>
  );
}
