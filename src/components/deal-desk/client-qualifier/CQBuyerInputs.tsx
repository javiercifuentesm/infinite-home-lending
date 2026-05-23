import type { ClientQualifierInputs } from "../../../hooks/useClientQualifierMath";
import { DollarInput } from "../../tools/shared/FormattedInput";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";
const note = "mt-1 font-sans text-[11px] text-slate-500";

const SCORE_OPTS = [
  { value: "580", label: "Below 580 — challenged" },
  { value: "600", label: "580–619 — below average" },
  { value: "620", label: "620–639 — fair" },
  { value: "640", label: "640–659 — fair" },
  { value: "660", label: "660–679 — fair" },
  { value: "680", label: "680–699 — good" },
  { value: "700", label: "700–719 — good" },
  { value: "720", label: "720–739 — very good" },
  { value: "740", label: "740+ — excellent" },
] as const;

type Props = {
  inputs: ClientQualifierInputs;
  onChange: (next: ClientQualifierInputs) => void;
};

export function CQBuyerInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof ClientQualifierInputs>(key: K, value: ClientQualifierInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section id="cq-buyer-inputs" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">1</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Buyer profile</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div>
          <label htmlFor="cq-income" className={label}>
            Annual income ($)
          </label>
          <DollarInput id="cq-income" className={input} value={inputs.income} onChange={(n) => set("income", n)} />
        </div>
        <div>
          <label htmlFor="cq-debts" className={label}>
            Monthly debts ($)
          </label>
          <DollarInput id="cq-debts" className={input} value={inputs.debts} onChange={(n) => set("debts", n)} />
          <p className={note}>Car, student loans, credit cards — minimum payments</p>
        </div>
        <div className="min-w-[150px]">
          <label htmlFor="cq-cscore" className={label}>
            Credit score range
          </label>
          <select
            id="cq-cscore"
            className={input}
            value={String(inputs.score)}
            onChange={(e) => set("score", Number.parseInt(e.target.value, 10) || 660)}
          >
            {SCORE_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cq-savings" className={label}>
            Down payment saved ($)
          </label>
          <input
            id="cq-savings"
            type="number"
            step={1000}
            className={input}
            value={inputs.savings || ""}
            onChange={(e) => set("savings", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="cq-target" className={label}>
            Target price range ($)
          </label>
          <input
            id="cq-target"
            type="number"
            step={5000}
            className={input}
            value={inputs.target || ""}
            onChange={(e) => set("target", Number.parseFloat(e.target.value) || 0)}
          />
          <p className={note}>What the buyer has in mind</p>
        </div>
        <div className="min-w-[150px]">
          <label htmlFor="cq-va" className={label}>
            VA eligible?
          </label>
          <select
            id="cq-va"
            className={input}
            value={inputs.vaEligible ? "yes" : "no"}
            onChange={(e) => set("vaEligible", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes — active duty or veteran</option>
          </select>
        </div>
      </div>
    </section>
  );
}
