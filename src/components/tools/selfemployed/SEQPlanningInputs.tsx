import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

export function SEQPlanningInputs({ inputs, setInputs }: Props) {
  const patch = (field: keyof SEQInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="mb-8 rounded-lg border border-[#C6A15B]/40 bg-amber-50/20 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C6A15B] text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">Mortgage planning scenario</h2>
      </div>
      <p className="mb-4 text-[12px] leading-relaxed text-slate-600">
        You are not required to claim every deduction. Reducing write-offs increases your qualifying income — at the cost
        of higher taxes. Model that tradeoff here.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-[12px] font-medium text-slate-700">
          Reduce deductions by ($)
          <input
            type="number"
            step={1000}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.planReduction}
            onChange={(e) => patch("planReduction", Number(e.target.value))}
          />
          <span className="mt-1 block text-[11px] text-slate-500">Amount to forgo claiming next filing</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Your estimated tax rate (%)
          <input
            type="number"
            min={10}
            max={45}
            step={1}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.taxRate}
            onChange={(e) => patch("taxRate", Number(e.target.value))}
          />
          <span className="mt-1 block text-[11px] text-slate-500">Federal + state marginal rate</span>
        </label>
      </div>
    </section>
  );
}
