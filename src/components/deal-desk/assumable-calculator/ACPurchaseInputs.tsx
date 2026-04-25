import type { AssumableInputs, VaElig } from "../../../hooks/useAssumableMath";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";
const select = input;

type Props = {
  inputs: AssumableInputs;
  onChange: (next: AssumableInputs) => void;
};

export function ACPurchaseInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof AssumableInputs>(key: K, value: AssumableInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">2</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Purchase &amp; gap financing</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div>
          <label htmlFor="ac-purchasePrice" className={label}>
            Purchase price ($)
          </label>
          <input
            id="ac-purchasePrice"
            type="number"
            step={5000}
            className={input}
            value={inputs.purchasePrice || ""}
            onChange={(e) => set("purchasePrice", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="ac-gapRate" className={label}>
            Gap financing rate (%)
          </label>
          <input
            id="ac-gapRate"
            type="number"
            step={0.125}
            className={input}
            value={inputs.gapRate || ""}
            onChange={(e) => set("gapRate", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Rate on 2nd mortgage or HELOC to cover equity gap</p>
        </div>
        <div>
          <label htmlFor="ac-gapTerm" className={label}>
            Gap financing term (years)
          </label>
          <input
            id="ac-gapTerm"
            type="number"
            step={1}
            min={1}
            max={30}
            className={input}
            value={inputs.gapTerm || ""}
            onChange={(e) =>
              set("gapTerm", Math.min(30, Math.max(1, Number.parseFloat(e.target.value) || 1)))
            }
          />
        </div>
        <div>
          <label htmlFor="ac-mktRate" className={label}>
            Current market rate (%)
          </label>
          <input
            id="ac-mktRate"
            type="number"
            step={0.125}
            className={input}
            value={inputs.mktRate || ""}
            onChange={(e) => set("mktRate", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">What a new 30-year loan would cost today</p>
        </div>
        <div>
          <label htmlFor="ac-vaElig" className={label}>
            VA-eligible buyer?
          </label>
          <select
            id="ac-vaElig"
            className={select}
            value={inputs.vaElig}
            onChange={(e) => set("vaElig", e.target.value as VaElig)}
          >
            <option value="no">No</option>
            <option value="yes">Yes — veteran / active duty</option>
          </select>
        </div>
      </div>
    </section>
  );
}
