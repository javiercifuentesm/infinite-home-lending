import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

export function SEQTaxReturnInputs({ inputs, setInputs }: Props) {
  const patch = (field: keyof SEQInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const addRows: { field: keyof SEQInputs; label: string; tag: string }[] = [
    { field: "ab_dep", label: "Depreciation (Sch. C Line 13)", tag: "+adds back" },
    { field: "ab_dep2", label: "Depletion (Sch. C)", tag: "+adds back" },
    { field: "ab_home", label: "Business use of home (Form 8829)", tag: "+adds back" },
    { field: "ab_loss", label: "Non-recurring losses / one-time expenses", tag: "+adds back" },
    { field: "ab_meals", label: "Meals & entertainment (add back 50%)", tag: "50% back" },
  ];

  return (
    <section className="mb-8 rounded-lg border border-amber-200/60 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/90 text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">Schedule C income (tax returns)</h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-[12px] font-medium text-slate-700">
          Net profit — Year 1 ($)
          <input
            type="number"
            step={1000}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.netY1}
            onChange={(e) => patch("netY1", Number(e.target.value))}
          />
          <span className="mt-1 block text-[11px] text-slate-500">Line 31 of Schedule C</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Net profit — Year 2 ($)
          <input
            type="number"
            step={1000}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.netY2}
            onChange={(e) => patch("netY2", Number(e.target.value))}
          />
          <span className="mt-1 block text-[11px] text-slate-500">Most recent year</span>
        </label>
      </div>

      <p className="mb-2 text-[12px] font-semibold text-slate-800">Add-backs (increases qualifying income)</p>
      <div className="divide-y divide-slate-200/80 rounded border border-slate-100">
        {addRows.map((row, i) => (
          <div key={row.field} className={`flex flex-wrap items-center gap-2 px-2 py-2 sm:flex-nowrap ${i === addRows.length - 1 ? "" : ""}`}>
            <span className="min-w-0 flex-1 text-[12px] leading-snug text-slate-700">{row.label}</span>
            <input
              type="number"
              step={100}
              className="h-[30px] w-[120px] shrink-0 rounded border border-slate-200 px-2 text-[12px]"
              value={inputs[row.field] as number}
              onChange={(e) => patch(row.field, Number(e.target.value))}
            />
            <span className="w-full text-right text-[11px] font-medium text-green-700 sm:w-auto sm:min-w-[4.5rem]">
              {row.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
