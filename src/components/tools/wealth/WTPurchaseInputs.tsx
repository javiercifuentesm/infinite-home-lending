import type { WealthInputs } from "../../../hooks/useWealthMath";

type Props = {
  inputs: WealthInputs;
  onChange: (next: WealthInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function WTPurchaseInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof WealthInputs>(key: K, value: WealthInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your purchase</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wt-hp" className={labelClass}>
            Home price ($)
          </label>
          <input
            id="wt-hp"
            type="number"
            min={0}
            step={5000}
            value={inputs.hp}
            onChange={(e) => set("hp", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wt-dp" className={labelClass}>
            Down payment (%)
          </label>
          <input
            id="wt-dp"
            type="number"
            min={3}
            max={30}
            step={1}
            value={inputs.dp}
            onChange={(e) => {
              const v = Math.round(parseFloat(e.target.value) || 3);
              set("dp", Math.min(30, Math.max(3, v)));
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wt-rate" className={labelClass}>
            Mortgage rate (%)
          </label>
          <input
            id="wt-rate"
            type="number"
            step={0.125}
            value={inputs.rate}
            onChange={(e) => set("rate", parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wt-rent" className={labelClass}>
            Current monthly rent ($)
          </label>
          <input
            id="wt-rent"
            type="number"
            min={0}
            step={50}
            value={inputs.rent}
            onChange={(e) => set("rent", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
