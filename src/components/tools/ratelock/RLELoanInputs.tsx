import type { RLEInputs } from "../../../hooks/useRLEMath";

type Props = {
  inputs: RLEInputs;
  onChange: (next: RLEInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function RLELoanInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof RLEInputs>(key: K, value: RLEInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your loan situation</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rle-loan" className={labelClass}>
            Loan amount ($)
          </label>
          <input
            id="rle-loan"
            type="number"
            min={0}
            step={5000}
            value={inputs.loan}
            onChange={(e) => set("loan", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="rle-rate" className={labelClass}>
            Current rate offered (%)
          </label>
          <input
            id="rle-rate"
            type="number"
            step={0.125}
            value={inputs.rate}
            onChange={(e) => set("rate", parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="rle-term" className={labelClass}>
            Loan term (years)
          </label>
          <select
            id="rle-term"
            value={inputs.term}
            onChange={(e) => set("term", parseInt(e.target.value, 10) as 15 | 30)}
            className={inputClass}
          >
            <option value={30}>30 years</option>
            <option value={15}>15 years</option>
          </select>
        </div>
        <div>
          <label htmlFor="rle-days" className={labelClass}>
            Days until closing
          </label>
          <input
            id="rle-days"
            type="number"
            min={7}
            max={120}
            step={1}
            value={inputs.daysToClose}
            onChange={(e) => {
              const v = Math.round(parseFloat(e.target.value) || 7);
              set("daysToClose", Math.min(120, Math.max(7, v)));
            }}
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-slate-500">From today to your closing date</p>
        </div>
      </div>
    </section>
  );
}
