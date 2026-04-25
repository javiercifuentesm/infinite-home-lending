import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

export function SEQBankStatementInputs({ inputs, setInputs }: Props) {
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
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">Bank statement income</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-[12px] font-medium text-slate-700">
          Avg monthly deposits ($)
          <input
            type="number"
            step={500}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.avgDeposits}
            onChange={(e) => patch("avgDeposits", Number(e.target.value))}
          />
          <span className="mt-1 block text-[11px] text-slate-500">12 or 24-month average</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Statement period
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.bsPeriod}
            onChange={(e) => patch("bsPeriod", Number(e.target.value))}
          >
            <option value={12}>12 months</option>
            <option value={24}>24 months</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700 md:col-span-2">
          Business type (expense factor)
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.expFactor}
            onChange={(e) => patch("expFactor", e.target.value)}
          >
            <option value="0.50">Service business — 50% expense factor</option>
            <option value="0.40">Consulting / digital — 40% factor</option>
            <option value="0.60">Product / inventory — 60% factor</option>
            <option value="0.30">Professional services — 30% factor</option>
            <option value="custom">Custom expense factor</option>
          </select>
        </label>
        {showCustom ? (
          <label className="block text-[12px] font-medium text-slate-700 md:col-span-2">
            Custom expense factor (%)
            <input
              type="number"
              min={10}
              max={80}
              step={1}
              className="mt-1.5 w-full max-w-xs rounded border border-slate-200 px-2 py-2 text-[13px]"
              value={inputs.customExpFactor}
              onChange={(e) => patch("customExpFactor", Number(e.target.value))}
            />
            <span className="mt-1 block text-[11px] text-slate-500">% of deposits assumed as expenses</span>
          </label>
        ) : null}
      </div>
    </section>
  );
}
