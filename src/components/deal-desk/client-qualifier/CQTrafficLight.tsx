import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";
import { fmtK } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQTrafficLight({ results }: Props) {
  const { readiness, maxPrice, vaPriceMax, target, gap } = results;
  const qualUpTo = Math.max(maxPrice, vaPriceMax);

  const wrap =
    readiness === "green"
      ? "bg-[linear-gradient(135deg,#1B4D1B,#27500A)]"
      : readiness === "yellow"
        ? "bg-[linear-gradient(135deg,#5C3D00,#854F0B)]"
        : "bg-[linear-gradient(135deg,#5C1A1A,#A32D2D)]";

  const status =
    readiness === "green"
      ? "Ready to show"
      : readiness === "yellow"
        ? "30–60 day timeline"
        : "90+ day plan needed";

  const statusClass =
    readiness === "green"
      ? "text-[rgba(159,225,130,0.85)]"
      : readiness === "yellow"
        ? "text-amber-100/90"
        : "text-red-100/85";

  const icon = readiness === "green" ? "🟢" : readiness === "yellow" ? "🟡" : "🔴";

  let headline: string;
  let sub: string;
  if (readiness === "green") {
    headline = `Qualifies up to ${fmtK(qualUpTo)}`;
    sub = `This buyer qualifies at or above their ${fmtK(target)} target. Show homes with confidence.`;
  } else if (readiness === "yellow") {
    headline = `${fmtK(maxPrice)} qualifying now — ${fmtK(gap)} gap to target`;
    sub =
      "Close to qualifying. With the right loan structure or minor improvements, this buyer can be ready within 30–60 days.";
  } else {
    headline = `${fmtK(maxPrice)} qualifying now — ${fmtK(gap)} gap to close`;
    sub =
      "This buyer needs a structured improvement plan before they're ready to make a competitive offer at their target price.";
  }

  return (
    <div id="cq-traffic-light" className={`rounded-[14px] p-6 text-center text-white ${wrap}`}>
      <div className="text-[36px] leading-none" aria-hidden>
        {icon}
      </div>
      <p className={`mt-3 font-sans text-[11px] font-semibold uppercase tracking-wide ${statusClass}`}>{status}</p>
      <p className="mt-2 font-[Georgia,serif] text-[22px] font-medium leading-tight">{headline}</p>
      <p className="mx-auto mt-3 max-w-xl font-sans text-[13px] leading-relaxed text-[rgba(255,255,255,0.7)]">{sub}</p>
    </div>
  );
}
