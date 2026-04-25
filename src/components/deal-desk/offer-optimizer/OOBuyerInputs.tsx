import type { OfferOptimizerInputs } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  inputs: OfferOptimizerInputs;
  onChange: (next: OfferOptimizerInputs) => void;
};

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function OOBuyerInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof OfferOptimizerInputs>(key: K, value: OfferOptimizerInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B6D11] text-[11px] font-bold text-white">2</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Buyer&apos;s financial profile</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="oo-dp" className={label}>
            Buyer down payment (%)
          </label>
          <input
            id="oo-dp"
            type="number"
            min={3}
            max={30}
            step={1}
            value={inputs.buyerDP}
            onChange={(e) => set("buyerDP", Math.min(30, Math.max(3, parseFloat(e.target.value) || 3)))}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="oo-rate" className={label}>
            Current market rate (%)
          </label>
          <input
            id="oo-rate"
            type="number"
            step={0.125}
            value={inputs.marketRate}
            onChange={(e) => set("marketRate", parseFloat(e.target.value) || 0)}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="oo-income" className={label}>
            Buyer&apos;s gross monthly income ($)
          </label>
          <input
            id="oo-income"
            type="number"
            min={0}
            step={250}
            value={inputs.buyerIncome}
            onChange={(e) => set("buyerIncome", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
          <p className="mt-1 text-[11px] text-slate-500">Used to show qualification impact</p>
        </div>
        <div>
          <label htmlFor="oo-debts" className={label}>
            Buyer&apos;s monthly debts ($)
          </label>
          <input
            id="oo-debts"
            type="number"
            min={0}
            step={50}
            value={inputs.buyerDebts}
            onChange={(e) => set("buyerDebts", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
          <p className="mt-1 text-[11px] text-slate-500">Car, student loans, credit cards</p>
        </div>
        <div>
          <label htmlFor="oo-term" className={label}>
            Loan term (years)
          </label>
          <select
            id="oo-term"
            value={inputs.loanTerm}
            onChange={(e) => set("loanTerm", parseInt(e.target.value, 10) as 15 | 30)}
            className={input}
          >
            <option value={30}>30 years</option>
            <option value={15}>15 years</option>
          </select>
        </div>
      </div>
    </section>
  );
}
