import type { BuydownType, OfferOptimizerInputs } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  inputs: OfferOptimizerInputs;
  onChange: (next: OfferOptimizerInputs) => void;
};

const OPTIONS: { key: BuydownType; title: string; description: string }[] = [
  {
    key: "2-1",
    title: "2-1 Buydown",
    description: "Rate drops 2% in Year 1, 1% in Year 2, market rate from Year 3. Most popular — sellers use this to offset high rates.",
  },
  {
    key: "1-0",
    title: "1-0 Buydown",
    description: "Rate drops 1% in Year 1, market rate from Year 2. Lower cost, shorter relief period.",
  },
  {
    key: "perm",
    title: "Permanent Buydown",
    description: "Rate permanently reduced for life of loan (costs ~1 pt per 0.25%). Maximum long-term impact.",
  },
];

export function OOBuydownSelector({ inputs, onChange }: Props) {
  return (
    <section id="oo-buydown-selector" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Buydown structure</h2>
      <p className="mt-1 text-[12px] text-slate-500">Choose how the seller&apos;s concession funds the rate.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const active = inputs.buydownType === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange({ ...inputs, buydownType: o.key })}
              className={`rounded-xl border-2 p-4 text-left transition-colors ${
                active
                  ? "border-[#C6A15B] bg-[#0B2A4A] text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className={`block font-sans text-[13px] font-semibold ${active ? "text-white" : "text-[#0B2A4A]"}`}>{o.title}</span>
              <span className={`mt-2 block text-[11px] leading-snug ${active ? "text-white/75" : "text-slate-500"}`}>
                {o.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
