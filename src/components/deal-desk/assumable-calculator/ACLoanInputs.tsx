import type { AssumableInputs, LoanType } from "../../../hooks/useAssumableMath";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";
const select = input;

type Props = {
  inputs: AssumableInputs;
  onChange: (next: AssumableInputs) => void;
};

export function ACLoanInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof AssumableInputs>(key: K, value: AssumableInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section id="ac-loan-inputs" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">1</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Existing loan details</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div>
          <label htmlFor="ac-loanType" className={label}>
            Loan type
          </label>
          <select
            id="ac-loanType"
            className={select}
            value={inputs.loanType}
            onChange={(e) => set("loanType", e.target.value as LoanType)}
          >
            <option value="va">VA Loan</option>
            <option value="fha">FHA Loan</option>
            <option value="usda">USDA Loan</option>
          </select>
        </div>
        <div>
          <label htmlFor="ac-assumedRate" className={label}>
            Assumed rate (%)
          </label>
          <input
            id="ac-assumedRate"
            type="number"
            step={0.125}
            className={input}
            value={inputs.assumedRate || ""}
            onChange={(e) => set("assumedRate", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Rate on the existing loan being assumed</p>
        </div>
        <div>
          <label htmlFor="ac-loanBal" className={label}>
            Remaining loan balance ($)
          </label>
          <input
            id="ac-loanBal"
            type="number"
            step={5000}
            className={input}
            value={inputs.loanBal || ""}
            onChange={(e) => set("loanBal", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="ac-termYrs" className={label}>
            Remaining term (years)
          </label>
          <input
            id="ac-termYrs"
            type="number"
            step={1}
            min={1}
            max={30}
            className={input}
            value={inputs.termYrs || ""}
            onChange={(e) =>
              set("termYrs", Math.min(30, Math.max(1, Number.parseFloat(e.target.value) || 1)))
            }
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Years left on the existing loan</p>
        </div>
      </div>
    </section>
  );
}
