import type { SellerNetInputs } from "../../../hooks/useSellerNetMath";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

type Props = {
  inputs: SellerNetInputs;
  onChange: (next: SellerNetInputs) => void;
};

export function SNSPropertyInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof SellerNetInputs>(key: K, value: SellerNetInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section id="sns-property-inputs" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">1</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Property &amp; seller details</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div>
          <label htmlFor="sns-price" className={label}>
            List / sale price ($)
          </label>
          <input
            id="sns-price"
            type="number"
            step={5000}
            className={input}
            value={inputs.price || ""}
            onChange={(e) => set("price", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="sns-payoff" className={label}>
            Mortgage payoff ($)
          </label>
          <input
            id="sns-payoff"
            type="number"
            step={1000}
            className={input}
            value={inputs.payoff || ""}
            onChange={(e) => set("payoff", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="sns-comm" className={label}>
            Commission rate (%)
          </label>
          <input
            id="sns-comm"
            type="number"
            step={0.25}
            className={input}
            value={inputs.comm || ""}
            onChange={(e) => set("comm", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Total — both sides combined</p>
        </div>
        <div>
          <label htmlFor="sns-concession" className={label}>
            Seller concession ($)
          </label>
          <input
            id="sns-concession"
            type="number"
            step={500}
            className={input}
            value={inputs.concession || ""}
            onChange={(e) => set("concession", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Buydown credit, closing cost help, repairs, etc.</p>
        </div>
        <div>
          <label htmlFor="sns-hoa" className={label}>
            HOA transfer fee ($)
          </label>
          <input
            id="sns-hoa"
            type="number"
            step={100}
            className={input}
            value={inputs.hoa || ""}
            onChange={(e) => set("hoa", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="sns-warranty" className={label}>
            Home warranty ($)
          </label>
          <input
            id="sns-warranty"
            type="number"
            step={50}
            className={input}
            value={inputs.warranty || ""}
            onChange={(e) => set("warranty", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </section>
  );
}
