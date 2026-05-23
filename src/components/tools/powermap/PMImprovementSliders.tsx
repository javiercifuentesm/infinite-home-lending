import type { PowerMapInputs } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: PowerMapInputs;
  onChange: (next: PowerMapInputs) => void;
};

const labelRow = "flex justify-between gap-3";
const labelText = "text-[12px] font-medium text-[#0B2A4A]";
const valueText = "text-[12px] font-medium text-[#C6A15B]";
const noteText = "mt-1.5 text-[10px] leading-snug text-slate-500";
const rangeClass =
  "mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#C6A15B] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C6A15B]";

export function PMImprovementSliders({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof PowerMapInputs>(key: K, value: PowerMapInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const { scoreBase, creditImp, debtPayoff, savingsBoost, incomeGrowth } = inputs;
  const targetScore = Math.min(760, scoreBase + creditImp);
  const pts = t("tool.pm.sliders.points");

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B6D11] text-[11px] font-bold text-white">
          2
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.pm.sliders.heading")}</h2>
      </div>
      <p className="mb-6 text-[11px] leading-relaxed text-slate-500">{t("tool.pm.sliders.subtitle")}</p>

      <div className="space-y-6">
        <div>
          <div className={labelRow}>
            <span className={labelText}>{t("tool.pm.sliders.credit")}</span>
            <span className={valueText}>
              {creditImp > 0 ? `+${creditImp} ${pts}` : t("tool.pm.sliders.creditNone")}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={120}
            step={20}
            value={creditImp}
            onChange={(e) => set("creditImp", parseInt(e.target.value, 10))}
            className={rangeClass}
            aria-label={t("tool.pm.sliders.credit")}
          />
          <p className={noteText}>
            {t("tool.pm.sliders.creditNote").replace("{base}", String(scoreBase)).replace("{target}", String(targetScore))}
          </p>
        </div>

        <div>
          <div className={labelRow}>
            <span className={labelText}>{t("tool.pm.sliders.debt")}</span>
            <span className={valueText}>
              {debtPayoff > 0 ? `${fmtShort(debtPayoff)}${t("tool.pm.sliders.moReduced")}` : t("tool.pm.sliders.debtNone")}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={100}
            value={debtPayoff}
            onChange={(e) => set("debtPayoff", parseInt(e.target.value, 10))}
            className={rangeClass}
            aria-label={t("tool.pm.sliders.debt")}
          />
          <p className={noteText}>{t("tool.pm.sliders.debtNote")}</p>
        </div>

        <div>
          <div className={labelRow}>
            <span className={labelText}>{t("tool.pm.sliders.savings")}</span>
            <span className={valueText}>
              {savingsBoost > 0 ? `+$${savingsBoost}${t("tool.pm.sliders.mo")}` : t("tool.pm.sliders.savingsNone")}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={100}
            value={savingsBoost}
            onChange={(e) => set("savingsBoost", parseInt(e.target.value, 10))}
            className={rangeClass}
            aria-label={t("tool.pm.sliders.savings")}
          />
          <p className={noteText}>{t("tool.pm.sliders.savingsNote")}</p>
        </div>

        <div>
          <div className={labelRow}>
            <span className={labelText}>{t("tool.pm.sliders.income")}</span>
            <span className={valueText}>
              {incomeGrowth > 0
                ? `+$${incomeGrowth.toLocaleString("en-US")}${t("tool.pm.sliders.yr")}`
                : t("tool.pm.sliders.incomeNone")}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={25000}
            step={2500}
            value={incomeGrowth}
            onChange={(e) => set("incomeGrowth", parseInt(e.target.value, 10))}
            className={rangeClass}
            aria-label={t("tool.pm.sliders.income")}
          />
          <p className={noteText}>{t("tool.pm.sliders.incomeNote")}</p>
        </div>
      </div>
    </section>
  );
}

function fmtShort(n: number): string {
  return "$" + n.toLocaleString("en-US");
}
