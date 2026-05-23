import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

const fieldClass =
  "mt-1.5 w-full rounded border border-slate-200 bg-white px-2 py-2 text-[13px] tabular-nums text-slate-900 outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/40";

export function SEQBankStatementInputs({ inputs, setInputs }: Props) {
  const { t } = useLanguage();
  const patch = (field: keyof SEQInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const showCustom = inputs.expFactor === "custom";

  return (
    <section className="mb-8 rounded-lg border border-green-200/70 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B6D11] text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">{t("tool.seq.bs.heading")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.bs.deposits")}
          <DollarInput id="avgDeposits" value={inputs.avgDeposits} className={fieldClass} onChange={(n) => patch("avgDeposits", n)} />
          <span className="mt-1 block text-[11px] text-slate-500">{t("tool.seq.bs.depositsNote")}</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.bs.period")}
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.bsPeriod}
            onChange={(e) => patch("bsPeriod", Number(e.target.value))}
          >
            <option value={12}>{t("tool.seq.bs.mo12")}</option>
            <option value={24}>{t("tool.seq.bs.mo24")}</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700 md:col-span-2">
          {t("tool.seq.bs.expFactor")}
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.expFactor}
            onChange={(e) => patch("expFactor", e.target.value)}
          >
            <option value="0.50">{t("tool.seq.bs.exp50")}</option>
            <option value="0.40">{t("tool.seq.bs.exp40")}</option>
            <option value="0.60">{t("tool.seq.bs.exp60")}</option>
            <option value="0.30">{t("tool.seq.bs.exp30")}</option>
            <option value="custom">{t("tool.seq.bs.expCustom")}</option>
          </select>
        </label>
        {showCustom ? (
          <label className="block text-[12px] font-medium text-slate-700 md:col-span-2">
            {t("tool.seq.bs.customExp")}
            <div className="mt-1.5 max-w-xs">
              <PercentInput
                id="seq-customExp"
                value={inputs.customExpFactor}
                min={10}
                max={80}
                step={1}
                className="w-full max-w-xs rounded border border-slate-200 bg-white px-2 py-2 text-[13px] tabular-nums outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/40"
                onChange={(n) => patch("customExpFactor", Math.min(80, Math.max(10, Math.round(n))))}
              />
            </div>
            <span className="mt-1 block text-[11px] text-slate-500">{t("tool.seq.bs.customExpNote")}</span>
          </label>
        ) : null}
      </div>
    </section>
  );
}
