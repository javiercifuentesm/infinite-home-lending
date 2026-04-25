import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";
import { fmtMoney } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQDownPaymentGap({ results }: Props) {
  const { dpScenarios } = results;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">Down payment gap analysis</h3>
      <div className="mt-4 flex flex-col gap-2">
        {dpScenarios.map((s) => {
          const base =
            s.status === "has"
              ? "border-[rgba(59,109,17,0.15)] bg-[rgba(59,109,17,0.07)]"
              : s.status === "close"
                ? "border-[rgba(198,161,91,0.2)] bg-[rgba(198,161,91,0.07)]"
                : "border-slate-200/90 bg-[var(--color-background-secondary,#f4f4f0)]";
          const amtColor = s.status === "has" ? "#27500A" : s.status === "close" ? "#854F0B" : "#0B2A4A";
          return (
            <div
              key={s.pct}
              className={`flex flex-col gap-1 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${base}`}
            >
              <div>
                <span className="font-sans text-[12px] font-semibold text-[#0B2A4A]">
                  {s.pct} down · {s.label}
                </span>
                <p className="font-sans text-[12px]" style={{ color: amtColor }}>
                  {fmtMoney(s.amt)} down + closing
                </p>
              </div>
              <p className="shrink-0 text-right font-sans text-[11px] leading-snug text-slate-700">
                {s.status === "has" && "✓ Buyer has enough"}
                {s.status==="close" && `Need ${fmtMoney(s.gap)} more (incl. closing)`}
                {s.status==="needs" && `Need ${fmtMoney(s.gap)} more (incl. closing)`}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-[rgba(24,95,165,0.12)] bg-[rgba(24,95,165,0.05)] px-3 py-2 font-sans text-[11px] italic leading-relaxed text-[#185FA5]">
        IHL has access to down payment assistance programs in MD, DC, and VA. Ask about eligibility for your buyer&apos;s county and income level.
      </div>
    </div>
  );
}
