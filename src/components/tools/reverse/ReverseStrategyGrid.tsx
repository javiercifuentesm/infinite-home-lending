import type { ReverseInputs, ReverseResult } from "../../../hooks/useReverseMath";
import { fmt, fmtK } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";

export type StratId = "lump" | "tenure" | "term" | "loc";

type Props = {
  inputs: ReverseInputs;
  results: ReverseResult;
  activeStrat: StratId;
  onSelectStrat: (id: StratId) => void;
};

export function ReverseStrategyGrid({ inputs, results, activeStrat, onSelectStrat }: Props) {
  const { t } = useLanguage();
  const { netPL, tenurePayment, termPayment } = results;
  const rateLabel = (inputs.intRate + 0.5).toFixed(1);

  const STRATS: {
    id: StratId;
    badge: string;
    badgeClass: string;
    name: string;
    desc: string;
    best: string;
  }[] = [
    {
      id: "lump",
      badge: t("tool.reverse.strategy.lump.badge"),
      badgeClass: "bg-[#FAEEDA] text-[#633806]",
      name: t("tool.reverse.strategy.lump.name"),
      desc: t("tool.reverse.strategy.lump.desc"),
      best: t("tool.reverse.strategy.lump.best"),
    },
    {
      id: "tenure",
      badge: t("tool.reverse.strategy.tenure.badge"),
      badgeClass: "bg-[#EAF3DE] text-[#27500A]",
      name: t("tool.reverse.strategy.tenure.name"),
      desc: t("tool.reverse.strategy.tenure.desc"),
      best: t("tool.reverse.strategy.tenure.best"),
    },
    {
      id: "term",
      badge: t("tool.reverse.strategy.term.badge"),
      badgeClass: "bg-[#E6F1FB] text-[#0C447C]",
      name: t("tool.reverse.strategy.term.name"),
      desc: t("tool.reverse.strategy.term.desc"),
      best: t("tool.reverse.strategy.term.best"),
    },
    {
      id: "loc",
      badge: t("tool.reverse.strategy.loc.badge"),
      badgeClass: "bg-[rgba(198,161,91,0.15)] text-[#854F0B]",
      name: t("tool.reverse.strategy.loc.name"),
      desc: t("tool.reverse.strategy.loc.desc"),
      best: t("tool.reverse.strategy.loc.best"),
    },
  ];

  const perMo = t("tool.reverse.strategy.perMo");

  const amountFor = (id: StratId): string => {
    switch (id) {
      case "lump":
        return fmt(netPL);
      case "tenure":
        return fmt(tenurePayment) + perMo;
      case "term":
        return fmt(termPayment) + perMo;
      case "loc":
        return t("tool.reverse.strategy.locAmount").replace("{amt}", fmtK(netPL)).replace("{rate}", rateLabel);
      default:
        return "";
    }
  };

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.reverse.strategy.title")}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {STRATS.map((s) => {
          const active = activeStrat === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStrat(s.id)}
              className={`rounded-xl p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 ${
                active ? "border-2 border-[#C6A15B] bg-white" : "border-[0.5px] border-[var(--color-border-tertiary)] bg-white"
              }`}
            >
              <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${s.badgeClass}`}>{s.badge}</span>
              <p className="mt-3 font-[Georgia,serif] text-[16px] font-semibold text-[#0B2A4A]">{s.name}</p>
              <p className="mt-2 text-[15px] font-semibold tabular-nums text-[#0B2A4A]">{amountFor(s.id)}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-tertiary)]">{s.desc}</p>
              <p className="mt-3 text-[13px] font-medium text-[#0B2A4A]">{s.best}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
