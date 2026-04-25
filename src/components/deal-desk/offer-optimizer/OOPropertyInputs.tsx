import type { OfferOptimizerInputs } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  inputs: OfferOptimizerInputs;
  onChange: (next: OfferOptimizerInputs) => void;
};

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function OOPropertyInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof OfferOptimizerInputs>(key: K, value: OfferOptimizerInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section id="oo-concession-section" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">1</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Property &amp; concession</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="oo-salePrice" className={label}>
            Sale price ($)
          </label>
          <input
            id="oo-salePrice"
            type="number"
            min={0}
            step={5000}
            value={inputs.salePrice}
            onChange={(e) => set("salePrice", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="oo-concession" className={label}>
            Seller concession budget ($)
          </label>
          <input
            id="oo-concession"
            type="number"
            min={0}
            step={1000}
            value={inputs.concessionBudget}
            onChange={(e) => set("concessionBudget", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
          <p className="mt-1 text-[11px] text-slate-500">Total dollars available for concession</p>
        </div>
        <div>
          <label htmlFor="oo-payoff" className={label}>
            Seller&apos;s mortgage payoff ($)
          </label>
          <input
            id="oo-payoff"
            type="number"
            min={0}
            step={1000}
            value={inputs.payoff}
            onChange={(e) => set("payoff", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
          <p className="mt-1 text-[11px] text-slate-500">For net proceeds calculation</p>
        </div>
        <div>
          <label htmlFor="oo-commission" className={label}>
            Agent commission (%)
          </label>
          <input
            id="oo-commission"
            type="number"
            min={0}
            step={0.25}
            value={inputs.commission}
            onChange={(e) => set("commission", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
          <p className="mt-1 text-[11px] text-slate-500">Total — both sides combined</p>
        </div>
        <div>
          <label htmlFor="oo-sellerClosing" className={label}>
            Closing costs — seller pays ($)
          </label>
          <input
            id="oo-sellerClosing"
            type="number"
            min={0}
            step={500}
            value={inputs.sellerClosing}
            onChange={(e) => set("sellerClosing", Math.max(0, parseFloat(e.target.value) || 0))}
            className={input}
          />
        </div>
      </div>
    </section>
  );
}
