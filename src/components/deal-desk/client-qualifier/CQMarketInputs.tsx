import type { ClientQualifierInputs } from "../../../hooks/useClientQualifierMath";
import { PercentInput } from "../../tools/shared/FormattedInput";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

type Props = {
  inputs: ClientQualifierInputs;
  onChange: (next: ClientQualifierInputs) => void;
};

export function CQMarketInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof ClientQualifierInputs>(key: K, value: ClientQualifierInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">2</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Market context</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div>
          <label htmlFor="cq-rate" className={label}>
            Current market rate (%)
          </label>
          <PercentInput
            id="cq-rate"
            step={0.125}
            className={input}
            value={inputs.marketRate}
            onChange={(n) => set("marketRate", n)}
          />
        </div>
        <div>
          <label htmlFor="cq-ptax" className={label}>
            Property tax rate (%/yr)
          </label>
          <PercentInput
            id="cq-ptax"
            step={0.1}
            className={input}
            value={inputs.ptaxRate}
            onChange={(n) => set("ptaxRate", n)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">MD avg ~1.1%, VA avg ~0.8%, DC avg ~0.85%</p>
        </div>
      </div>
    </section>
  );
}
