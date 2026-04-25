import type { RLEInputs, RiskTol } from "../../../hooks/useRLEMath";

type Props = {
  inputs: RLEInputs;
  onChange: (next: RLEInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function RLEExtensionInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof RLEInputs>(key: K, value: RLEInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B6D11] text-[11px] font-bold text-white">
          3
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Extension &amp; float-down settings</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rle-ext" className={labelClass}>
            Extension fee (% per 15 days)
          </label>
          <select
            id="rle-ext"
            value={String(inputs.extFee)}
            onChange={(e) => set("extFee", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.0625">0.0625% per 15 days — low</option>
            <option value="0.125">0.125% per 15 days — typical</option>
            <option value="0.25">0.25% per 15 days — higher</option>
          </select>
        </div>
        <div>
          <label htmlFor="rle-float-cost" className={labelClass}>
            Float-down option cost (%)
          </label>
          <select
            id="rle-float-cost"
            value={String(inputs.floatCost)}
            onChange={(e) => set("floatCost", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0">No float-down offered</option>
            <option value="0.125">0.125% — low</option>
            <option value="0.25">0.25% — standard</option>
            <option value="0.5">0.50% — premium</option>
          </select>
        </div>
        <div>
          <label htmlFor="rle-float-thresh" className={labelClass}>
            Float-down threshold (%)
          </label>
          <select
            id="rle-float-thresh"
            value={String(inputs.floatThresh)}
            onChange={(e) => set("floatThresh", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.25">0.25% minimum drop required</option>
            <option value="0.375">0.375% minimum</option>
            <option value="0.5">0.50% minimum</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">Minimum rate drop to exercise</p>
        </div>
        <div>
          <label htmlFor="rle-risk" className={labelClass}>
            Risk tolerance
          </label>
          <select
            id="rle-risk"
            value={inputs.riskTol}
            onChange={(e) => set("riskTol", e.target.value as RiskTol)}
            className={inputClass}
          >
            <option value="low">Low — I hate uncertainty</option>
            <option value="medium">Medium — I can handle some risk</option>
            <option value="high">High — I&apos;ll bet on rates dropping</option>
          </select>
        </div>
      </div>
    </section>
  );
}
