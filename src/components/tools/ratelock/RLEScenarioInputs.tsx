import type { RLEInputs, RateEnv } from "../../../hooks/useRLEMath";

type Props = {
  inputs: RLEInputs;
  onChange: (next: RLEInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function RLEScenarioInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof RLEInputs>(key: K, value: RLEInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C6A15B] text-[11px] font-bold text-[#633806]">
          2
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Rate movement scenarios</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rle-rise" className={labelClass}>
            Rate rise scenario (%)
          </label>
          <select
            id="rle-rise"
            value={String(inputs.riseScenario)}
            onChange={(e) => set("riseScenario", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.125">+0.125% (small move)</option>
            <option value="0.25">+0.25% (common move)</option>
            <option value="0.375">+0.375% (moderate)</option>
            <option value="0.5">+0.50% (large move)</option>
            <option value="0.75">+0.75% (sharp jump)</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">What if rates rise by this much?</p>
        </div>
        <div>
          <label htmlFor="rle-drop" className={labelClass}>
            Rate drop scenario (%)
          </label>
          <select
            id="rle-drop"
            value={String(inputs.dropScenario)}
            onChange={(e) => set("dropScenario", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.125">−0.125% (small move)</option>
            <option value="0.25">−0.25% (common move)</option>
            <option value="0.375">−0.375% (moderate)</option>
            <option value="0.5">−0.50% (meaningful)</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">What if rates drop by this much?</p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="rle-env" className={labelClass}>
            Rate environment
          </label>
          <select
            id="rle-env"
            value={inputs.rateEnv}
            onChange={(e) => set("rateEnv", e.target.value as RateEnv)}
            className={inputClass}
          >
            <option value="volatile">Volatile — big swings possible</option>
            <option value="rising">Rising trend</option>
            <option value="falling">Slowly falling</option>
            <option value="stable">Stable / sideways</option>
          </select>
        </div>
      </div>
    </section>
  );
}
