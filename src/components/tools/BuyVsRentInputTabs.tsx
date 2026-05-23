import { useEffect, useState, type ReactNode } from "react";
import { Home, KeyRound, TrendingUp } from "lucide-react";
import type { BuyVsRentInputs } from "../../hooks/useBuyVsRentMath";
import { useLanguage } from "../../i18n/LanguageContext";

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

function smartToolInputSymbol(label: string): "dollar" | "percent" | null {
  if (label.includes("($") || label.includes("$/")) return "dollar";
  if (label.includes("(%)") || label.includes("% /yr") || label.includes("% /año") || label.includes("(%")) return "percent";
  return null;
}

export function BuyVsRentInputTabs({ activeTab, onTabChange, inputs, onChange }: Props) {
  const { t } = useLanguage();
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
        {tabBtn("buying", t("tool.bvr.tab.buying"), <Home className="h-5 w-5 text-[#0B2A4A]" strokeWidth={1.75} />, "#E6F1FB")}
        {tabBtn("renting", t("tool.bvr.tab.renting"), <KeyRound className="h-5 w-5 text-[#27500A]" strokeWidth={1.75} />, "#EAF3DE")}
        {tabBtn("market", t("tool.bvr.tab.market"), <TrendingUp className="h-5 w-5 text-[#854F0B]" strokeWidth={1.75} />, "#FAEEDA")}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {activeTab === "buying" && (
          <>
            <Field label={t("tool.bvr.input.hp")} id="hp" step={5000} value={inputs.hp} on={(v) => patch({ hp: num(v, inputs.hp) })} />
            <Field label={t("tool.bvr.input.dp")} id="dp" step={0.5} min={0} max={50} value={inputs.dp} on={(v) => patch({ dp: num(v, inputs.dp) })} />
            <Field label={t("tool.bvr.input.ir")} id="ir" step={0.05} value={inputs.ir} on={(v) => patch({ ir: num(v, inputs.ir) })} />
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                {t("tool.bvr.input.lt")}
              </span>
              <select
                className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A]"
                value={inputs.lt}
                onChange={(e) => patch({ lt: Number(e.target.value) })}
              >
                {[30, 20, 15].map((lt) => (
                  <option key={lt} value={lt}>
                    {lt} {t("tool.bvr.input.years")}
                  </option>
                ))}
              </select>
            </label>
            <Field label={t("tool.bvr.input.pt")} id="pt" step={0.05} value={inputs.pt} note={t("tool.bvr.input.ptNote")} on={(v) => patch({ pt: num(v, inputs.pt) })} />
            <Field label={t("tool.bvr.input.hi")} id="hi" step={100} value={inputs.hi} on={(v) => patch({ hi: num(v, inputs.hi) })} />
            <Field label={t("tool.bvr.input.hoa")} id="hoa" step={25} value={inputs.hoa} on={(v) => patch({ hoa: num(v, inputs.hoa) })} />
            <Field label={t("tool.bvr.input.maint")} id="maint" step={0.1} value={inputs.maint} note={t("tool.bvr.input.maintNote")} on={(v) => patch({ maint: num(v, inputs.maint) })} />
          </>
        )}

        {activeTab === "renting" && (
          <>
            <Field label={t("tool.bvr.input.rent")} id="rent" step={50} value={inputs.rent} on={(v) => patch({ rent: num(v, inputs.rent) })} />
            <Field label={t("tool.bvr.input.ri")} id="ri" step={0.1} value={inputs.ri} note={t("tool.bvr.input.riNote")} on={(v) => patch({ ri: num(v, inputs.ri) })} />
            <Field label={t("tool.bvr.input.rins")} id="rins" step={20} value={inputs.rins} on={(v) => patch({ rins: num(v, inputs.rins) })} />
            <Field label={t("tool.bvr.input.sd")} id="sd" step={100} value={inputs.sd} on={(v) => patch({ sd: num(v, inputs.sd) })} />
          </>
        )}

        {activeTab === "market" && (
          <>
            <Field label={t("tool.bvr.input.appr")} id="appr" step={0.1} value={inputs.appr} note={t("tool.bvr.input.apprNote")} on={(v) => patch({ appr: num(v, inputs.appr) })} />
            <Field label={t("tool.bvr.input.inv")} id="inv" step={0.1} value={inputs.inv} note={t("tool.bvr.input.invNote")} on={(v) => patch({ inv: num(v, inputs.inv) })} />
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                {t("tool.bvr.input.tax")}
              </span>
              <select
                className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] sm:max-w-md"
                value={inputs.tax}
                onChange={(e) => patch({ tax: Number(e.target.value) })}
              >
                <option value={0}>{t("tool.bvr.input.taxZero")}</option>
                <option value={12}>12%</option>
                <option value={22}>22%</option>
                <option value={24}>24%</option>
                <option value={32}>32%</option>
                <option value={37}>37%</option>
              </select>
            </label>
            <Field label={t("tool.bvr.input.cc")} id="cc" step={0.1} value={inputs.cc} on={(v) => patch({ cc: num(v, inputs.cc) })} />
            <Field label={t("tool.bvr.input.sc")} id="sc" step={0.1} value={inputs.sc} note={t("tool.bvr.input.scNote")} on={(v) => patch({ sc: num(v, inputs.sc) })} />
          </>
        )}
      </div>
    </div>
  );
}

function DollarField({
  label,
  id,
  value,
  on,
  note,
}: {
  label: string;
  id: string;
  value: number;
  on: (v: string) => void;
  note?: string;
}) {
  const [localStr, setLocalStr] = useState(() =>
    value.toLocaleString("en-US", { maximumFractionDigits: 0 })
  );

  useEffect(() => {
    setLocalStr((prev) => {
      const stripped = prev.replace(/,/g, "");
      if (stripped === "" || stripped === "-") return prev;
      const parsed = parseFloat(stripped);
      if (!Number.isFinite(parsed)) return prev;
      if (Math.round(parsed) === Math.round(value)) return prev;
      return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
    });
  }, [value]);

  const cls =
    "w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 pl-6 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40";

  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          className={cls}
          value={localStr}
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, "");
            const n = parseFloat(raw);
            if (raw === "" || raw === "-") {
              setLocalStr(raw);
            } else if (!Number.isNaN(n)) {
              setLocalStr(n.toLocaleString("en-US", { maximumFractionDigits: 0 }));
              on(raw);
            }
          }}
          onBlur={() => {
            const raw = localStr.replace(/,/g, "");
            const n = parseFloat(raw);
            if (!Number.isFinite(n)) {
              setLocalStr(value.toLocaleString("en-US", { maximumFractionDigits: 0 }));
            }
          }}
        />
      </div>
      {note ? <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{note}</p> : null}
    </label>
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
  const sym = smartToolInputSymbol(label);
  if (sym === "dollar") return <DollarField label={label} id={id} value={value} on={on} note={note} />;

  const cls =
    "w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40" +
    (sym === "percent" ? " pr-7" : "");

  const inputEl = (
    <input id={id} type="number" step={step} min={min} max={max} className={cls} value={value} onChange={(e) => on(e.target.value)} />
  );

  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{label}</span>
      {sym === "percent" ? (
        <div className="relative">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">%</span>
          {inputEl}
        </div>
      ) : (
        inputEl
      )}
      {note ? <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{note}</p> : null}
    </label>
  );
}
