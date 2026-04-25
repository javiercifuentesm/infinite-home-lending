import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";
import { fmtK, fmtMoney } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQSnapshotGrid({ results }: Props) {
  const {
    maxPrice,
    qualRate,
    minDownPct,
    income,
    score,
    dtiAtMax,
    savings,
    target,
    qualifiesConv,
    qualifiesVA,
    gap,
  } = results;

  const cards: {
    key: string;
    label: string;
    value: string;
    sub: string;
    highlight: boolean;
    valueColor?: string;
    subColor?: string;
  }[] = [
    {
      key: "max",
      label: "Max qualifying price",
      value: fmtK(maxPrice),
      sub: `At ${qualRate}% with ${(minDownPct * 100).toFixed(1)}% down`,
      highlight: true,
    },
    {
      key: "mi",
      label: "Monthly income",
      value: fmtMoney(Math.round(income / 12)),
      sub: `Gross / ${fmtMoney(income)} annually`,
      highlight: false,
    },
    {
      key: "rate",
      label: "Qualifying rate",
      value: `${qualRate}%`,
      sub: `Score tier: ${score}+`,
      highlight: false,
    },
    {
      key: "dti",
      label: "DTI at max loan",
      value: `${dtiAtMax}%`,
      sub: dtiAtMax <= 43 ? "Within 43% limit" : "Exceeds limit — reduce debts",
      highlight: false,
      valueColor: dtiAtMax <= 43 ? undefined : "#A32D2D",
    },
    {
      key: "sav",
      label: "Down payment saved",
      value: fmtK(savings),
      sub: "Available for down + closing costs",
      highlight: false,
    },
    {
      key: "tgt",
      label: "Target price",
      value: fmtK(target),
      sub: qualifiesConv || qualifiesVA ? "✓ Within qualifying range" : `Gap: ${fmtK(gap)}`,
      subColor: qualifiesConv || qualifiesVA ? "#27500A" : "#A32D2D",
      highlight: false,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.key}
          className={`rounded-xl border bg-white p-4 shadow-sm ${
            c.highlight ? "border-2 border-[#C6A15B] ring-1 ring-[#C6A15B]/25" : "border-slate-200/90"
          }`}
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
          <p
            className={`mt-0.5 font-[Georgia,serif] text-[20px] font-medium ${
              c.highlight ? "text-[#C6A15B]" : "text-[#0B2A4A]"
            }`}
            style={c.valueColor ? { color: c.valueColor } : undefined}
          >
            {c.value}
          </p>
          <p className="mt-1 font-sans text-[11px] leading-snug text-slate-600" style={c.subColor ? { color: c.subColor } : undefined}>
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
