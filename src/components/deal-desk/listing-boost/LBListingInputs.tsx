import type { ListingBoostInputs } from "../../../hooks/useListingBoostMath";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

type Props = {
  inputs: ListingBoostInputs;
  onChange: (next: ListingBoostInputs) => void;
};

export function LBListingInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof ListingBoostInputs>(key: K, value: ListingBoostInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section id="lb-listing-inputs" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">1</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Listing details</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div>
          <label htmlFor="lb-listPrice" className={label}>
            List price ($)
          </label>
          <input
            id="lb-listPrice"
            type="number"
            step={5000}
            className={input}
            value={inputs.listPrice || ""}
            onChange={(e) => set("listPrice", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="lb-dom" className={label}>
            Days on market
          </label>
          <input
            id="lb-dom"
            type="number"
            step={1}
            min={0}
            className={input}
            value={inputs.dom || ""}
            onChange={(e) => set("dom", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="lb-rate" className={label}>
            Current market rate (%)
          </label>
          <input
            id="lb-rate"
            type="number"
            step={0.125}
            className={input}
            value={inputs.rate || ""}
            onChange={(e) => set("rate", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="lb-budget" className={label}>
            Seller concession budget ($)
          </label>
          <input
            id="lb-budget"
            type="number"
            step={1000}
            className={input}
            value={inputs.budget || ""}
            onChange={(e) => set("budget", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Total dollars seller is willing to offer</p>
        </div>
        <div>
          <label htmlFor="lb-payoff" className={label}>
            Seller mortgage payoff ($)
          </label>
          <input
            id="lb-payoff"
            type="number"
            step={1000}
            className={input}
            value={inputs.payoff || ""}
            onChange={(e) => set("payoff", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="lb-comm" className={label}>
            Commission rate (%)
          </label>
          <input
            id="lb-comm"
            type="number"
            step={0.25}
            className={input}
            value={inputs.comm || ""}
            onChange={(e) => set("comm", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Total — both sides combined</p>
        </div>
      </div>
    </section>
  );
}
