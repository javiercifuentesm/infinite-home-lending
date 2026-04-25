import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

export function SEQSharedInputs({ inputs, setInputs }: Props) {
  const patch = (field: keyof SEQInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/90 text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">Your situation</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="block text-[12px] font-medium text-slate-700">
          Years self-employed
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.yearsEmp}
            onChange={(e) => patch("yearsEmp", Number(e.target.value))}
          >
            <option value={1}>1 year</option>
            <option value={2}>2 years</option>
            <option value={3}>3+ years</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Business structure
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.bizType}
            onChange={(e) => patch("bizType", e.target.value)}
          >
            <option value="sched_c">Sole prop / Single LLC (Sch. C)</option>
            <option value="s_corp">S-Corp / Partnership</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Credit score
          <select
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.cs}
            onChange={(e) => patch("cs", Number(e.target.value))}
          >
            <option value={760}>760+</option>
            <option value={720}>720–759</option>
            <option value={680}>680–719</option>
            <option value={640}>640–679</option>
            <option value={600}>600–639</option>
          </select>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Monthly debts ($)
          <input
            type="number"
            step={50}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.debts}
            onChange={(e) => patch("debts", Number(e.target.value))}
          />
          <span className="mt-1 block text-[11px] font-normal text-slate-500">Car, student loans, credit cards</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Down payment (%)
          <input
            type="number"
            step={0.5}
            min={3}
            max={30}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.dp}
            onChange={(e) => patch("dp", Number(e.target.value))}
          />
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          Target home price ($)
          <input
            type="number"
            step={10000}
            className="mt-1.5 w-full rounded border border-slate-200 px-2 py-2 text-[13px]"
            value={inputs.targetPrice}
            onChange={(e) => patch("targetPrice", Number(e.target.value))}
          />
        </label>
      </div>
    </section>
  );
}
