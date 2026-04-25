import type { ClientQualifierResults, Readiness } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

const dotClass: Record<string, string> = {
  red: "bg-[#A32D2D]",
  yellow: "bg-[#C6A15B]",
  green: "bg-[#27500A]",
  blue: "bg-[#185FA5]",
};

function titleForReadiness(r: Readiness): string {
  if (r === "green") return "Next steps for this buyer";
  if (r === "yellow") return "30–60 day action plan";
  return "90-day improvement plan";
}

export function CQActionPlan({ results }: Props) {
  const { readiness, actions } = results;
  const items = actions.slice(0, 5);

  return (
    <div id="cq-action-plan" className="rounded-xl border border-slate-200/90 bg-[var(--color-background-secondary,#f4f4f0)] p-4 sm:p-5">
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{titleForReadiness(readiness)}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((a, i) => (
          <li key={i} className="flex gap-3">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass[a.color] ?? "bg-slate-400"}`} aria-hidden />
            <p className="font-sans text-[13px] leading-relaxed text-slate-800">{a.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
