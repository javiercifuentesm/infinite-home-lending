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

export function SEQSharedInputs({ inputs, setInputs }: Props) {
  const { t } = useLanguage();
  const patch = (field: keyof SEQInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/90 text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">{t("tool.seq.shared.heading")}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.shared.yearsEmp")}
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.yearsEmp}
            onChange={(e) => patch("yearsEmp", Number(e.target.value))}
          >
            <option value={1}>{t("tool.seq.shared.yr1")}</option>
            <option value={2}>{t("tool.seq.shared.yr2")}</option>
            <option value={3}>{t("tool.seq.shared.yr3")}</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.shared.bizType")}
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.bizType}
            onChange={(e) => patch("bizType", e.target.value)}
          >
            <option value="sched_c">{t("tool.seq.shared.schedC")}</option>
            <option value="s_corp">{t("tool.seq.shared.sCorp")}</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.shared.cs")}
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.cs}
            onChange={(e) => patch("cs", Number(e.target.value))}
          >
            <option value={760}>{t("tool.seq.shared.cs760")}</option>
            <option value={720}>{t("tool.seq.shared.cs720")}</option>
            <option value={680}>{t("tool.seq.shared.cs680")}</option>
            <option value={640}>{t("tool.seq.shared.cs640")}</option>
            <option value={600}>{t("tool.seq.shared.cs600")}</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.shared.debts")}
          <DollarInput id="seq-debts" value={inputs.debts} className={fieldClass} onChange={(n) => patch("debts", n)} />
          <span className="mt-1 block text-[11px] font-normal text-slate-500">{t("tool.seq.shared.debtsNote")}</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.shared.dp")}
          <PercentInput
            id="seq-dp"
            value={inputs.dp}
            step={0.5}
            min={3}
            max={30}
            className={fieldClass}
            onChange={(n) => patch("dp", n)}
          />
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.shared.targetPrice")}
          <DollarInput id="targetPrice" value={inputs.targetPrice} className={fieldClass} onChange={(n) => patch("targetPrice", n)} />
        </label>
      </div>
    </section>
  );
}
