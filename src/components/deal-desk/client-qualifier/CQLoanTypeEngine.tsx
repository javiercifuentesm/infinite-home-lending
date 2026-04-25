import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQLoanTypeEngine({ results }: Props) {
  const { loanOptions, recommendedLoan } = results;

  return (
    <div id="cq-loan-engine" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">Recommended loan type</h3>
      <div className="mt-4 flex flex-col gap-3">
        {loanOptions.map((opt) => {
          const isRecommended = recommendedLoan === opt.key && opt.available && recommendedLoan !== "none";
          const isUnavailable = !opt.available;
          return (
            <div
              key={opt.key}
              className={`rounded-xl border p-4 transition-opacity ${
                isUnavailable ? "opacity-40" : ""
              } ${
                isRecommended
                  ? "border-[1.5px] border-[rgba(11,42,74,0.2)] bg-[rgba(11,42,74,0.04)]"
                  : opt.available
                    ? "border-[0.5px] border-slate-200/90 bg-[var(--color-background-secondary,#f4f4f0)]"
                    : "border-[0.5px] border-slate-200/80 bg-slate-50/80"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {isRecommended ? (
                  <span className="rounded bg-[#0B2A4A] px-2 py-0.5 font-sans text-[11px] font-semibold text-[#C6A15B]">
                    Recommended
                  </span>
                ) : opt.available ? (
                  <span className="rounded bg-slate-200/90 px-2 py-0.5 font-sans text-[11px] font-semibold text-slate-600">Available</span>
                ) : (
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-sans text-[11px] font-semibold text-slate-400">Not available</span>
                )}
                <span className="font-sans text-[13px] font-medium text-[#0B2A4A]">{opt.name}</span>
              </div>
              <p className="mt-1 font-sans text-[12px] text-slate-700">{opt.detail}</p>
              <p className="mt-2 font-sans text-[11px] leading-relaxed text-slate-500">{opt.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
