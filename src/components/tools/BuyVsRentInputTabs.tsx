import type { ReactNode } from "react";
import { Home, KeyRound, TrendingUp } from "lucide-react";
import type { BuyVsRentInputs } from "../../hooks/useBuyVsRentMath";

export type BuyTab = "buying" | "renting" | "market";

type Props = {
  activeTab: BuyTab;
  onTabChange: (t: BuyTab) => void;
  inputs: BuyVsRentInputs;
  onChange: (next: BuyVsRentInputs) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function BuyVsRentInputTabs({ activeTab, onTabChange, inputs, onChange }: Props) {
  const patch = (p: Partial<BuyVsRentInputs>) => onChange({ ...inputs, ...p });

  const tabBtn = (id: BuyTab, label: string, icon: ReactNode, bg: string) => (
    <button
      type="button"
      onClick={() => onTabChange(id)}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all sm:px-4 ${
        activeTab === id ? "ring-2 ring-[#0B2A4A] ring-offset-2" : "opacity-90 hover:opacity-100"
      }`}
      style={{ background: bg }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex gap-2 border-b border-[var(--color-border-tertiary)] pb-4">
        {tabBtn("buying", "Buying", <Home className="h-5 w-5 text-[#0B2A4A]" strokeWidth={1.75} />, "#E6F1FB")}
        {tabBtn("renting", "Renting", <KeyRound className="h-5 w-5 text-[#27500A]" strokeWidth={1.75} />, "#EAF3DE")}
        {tabBtn("market", "Market & returns", <TrendingUp className="h-5 w-5 text-[#854F0B]" strokeWidth={1.75} />, "#FAEEDA")}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {activeTab === "buying" && (
          <>
            <Field label="Home price ($)" id="hp" step={5000} value={inputs.hp} on={(v) => patch({ hp: num(v, inputs.hp) })} />
            <Field label="Down payment (%)" id="dp" step={0.5} min={0} max={50} value={inputs.dp} on={(v) => patch({ dp: num(v, inputs.dp) })} />
            <Field label="Interest rate (%)" id="ir" step={0.05} value={inputs.ir} on={(v) => patch({ ir: num(v, inputs.ir) })} />
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                Loan term (years)
              </span>
              <select
                className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A]"
                value={inputs.lt}
                onChange={(e) => patch({ lt: Number(e.target.value) })}
              >
                {[30, 20, 15].map((lt) => (
                  <option key={lt} value={lt}>
                    {lt} years
                  </option>
                ))}
              </select>
            </label>
            <Field label="Property tax (% /yr)" id="pt" step={0.05} value={inputs.pt} note="MD avg ~1.1% · DC ~0.6% · VA ~0.8%" on={(v) => patch({ pt: num(v, inputs.pt) })} />
            <Field label="Home insurance ($/yr)" id="hi" step={100} value={inputs.hi} on={(v) => patch({ hi: num(v, inputs.hi) })} />
            <Field label="HOA fees ($/mo)" id="hoa" step={25} value={inputs.hoa} on={(v) => patch({ hoa: num(v, inputs.hoa) })} />
            <Field label="Maintenance (% /yr)" id="maint" step={0.1} value={inputs.maint} note="Industry standard: 1–2% of home value" on={(v) => patch({ maint: num(v, inputs.maint) })} />
          </>
        )}

        {activeTab === "renting" && (
          <>
            <Field label="Monthly rent ($)" id="rent" step={50} value={inputs.rent} on={(v) => patch({ rent: num(v, inputs.rent) })} />
            <Field label="Annual rent increase (%)" id="ri" step={0.1} value={inputs.ri} note="National avg ~3–4%" on={(v) => patch({ ri: num(v, inputs.ri) })} />
            <Field label="Renter's insurance ($/yr)" id="rins" step={20} value={inputs.rins} on={(v) => patch({ rins: num(v, inputs.rins) })} />
            <Field label="Security deposit ($)" id="sd" step={100} value={inputs.sd} on={(v) => patch({ sd: num(v, inputs.sd) })} />
          </>
        )}

        {activeTab === "market" && (
          <>
            <Field label="Home appreciation (% /yr)" id="appr" step={0.1} value={inputs.appr} note="MD/DC/VA historical ~3–4%" on={(v) => patch({ appr: num(v, inputs.appr) })} />
            <Field label="Investment return (% /yr)" id="inv" step={0.1} value={inputs.inv} note="S&P 500 long-term avg ~7% real" on={(v) => patch({ inv: num(v, inputs.inv) })} />
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                Marginal tax bracket (%)
              </span>
              <select
                className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] sm:max-w-md"
                value={inputs.tax}
                onChange={(e) => patch({ tax: Number(e.target.value) })}
              >
                <option value={0}>0% (no tax benefit)</option>
                <option value={12}>12%</option>
                <option value={22}>22%</option>
                <option value={24}>24%</option>
                <option value={32}>32%</option>
                <option value={37}>37%</option>
              </select>
            </label>
            <Field label="Closing costs (% of price)" id="cc" step={0.1} value={inputs.cc} on={(v) => patch({ cc: num(v, inputs.cc) })} />
            <Field label="Selling costs (% of price)" id="sc" step={0.1} value={inputs.sc} note="Agent fees + transfer taxes" on={(v) => patch({ sc: num(v, inputs.sc) })} />
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  on,
  step,
  min,
  max,
  note,
}: {
  label: string;
  id: string;
  value: number;
  on: (v: string) => void;
  step?: number;
  min?: number;
  max?: number;
  note?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{label}</span>
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
        value={value}
        onChange={(e) => on(e.target.value)}
      />
      {note ? <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{note}</p> : null}
    </label>
  );
}
