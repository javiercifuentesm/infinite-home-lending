import type { PowerMapInputs } from "../../../hooks/usePowerMapMath";

type Props = {
  inputs: PowerMapInputs;
  onChange: (next: PowerMapInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function PMFinancialInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof PowerMapInputs>(key: K, value: PowerMapInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your financial position today</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pm-income" className={labelClass}>
            Annual income ($)
          </label>
          <input
            id="pm-income"
            type="number"
            min={0}
            step={1000}
            value={inputs.income}
            onChange={(e) => set("income", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="pm-debts" className={labelClass}>
            Monthly debts ($)
          </label>
          <input
            id="pm-debts"
            type="number"
            min={0}
            step={50}
            value={inputs.debts}
            onChange={(e) => set("debts", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-slate-500">Car, student loans, credit cards</p>
        </div>
        <div>
          <label htmlFor="pm-score" className={labelClass}>
            Credit score
          </label>
          <select
            id="pm-score"
            value={inputs.scoreBase}
            onChange={(e) => set("scoreBase", parseInt(e.target.value, 10))}
            className={inputClass}
          >
            <option value={580}>580–619 — below average</option>
            <option value={620}>620–639 — fair</option>
            <option value={640}>640–659 — fair</option>
            <option value={660}>660–679 — fair</option>
            <option value={680}>680–699 — good</option>
            <option value={700}>700–719 — good</option>
            <option value={720}>720–739 — very good</option>
            <option value={740}>740+ — excellent</option>
          </select>
        </div>
        <div>
          <label htmlFor="pm-savings" className={labelClass}>
            Down payment savings ($)
          </label>
          <input
            id="pm-savings"
            type="number"
            min={0}
            step={1000}
            value={inputs.savings}
            onChange={(e) => set("savings", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pm-savings-rate" className={labelClass}>
            Monthly savings rate ($)
          </label>
          <input
            id="pm-savings-rate"
            type="number"
            min={0}
            step={50}
            value={inputs.savingsRate}
            onChange={(e) => set("savingsRate", Math.max(0, parseFloat(e.target.value) || 0))}
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-slate-500">How much you save per month</p>
        </div>
      </div>
    </section>
  );
}
