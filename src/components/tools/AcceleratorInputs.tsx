import { useEffect, useState } from "react";
import type { PaymentFreq } from "../../hooks/useAcceleratorMath";
import { useLanguage } from "../../i18n/LanguageContext";

export type AcceleratorFormState = {
  bal: number;
  rate: number;
  term: number;
  paid: number;
  extra: number;
  freq: PaymentFreq;
};

type Props = {
  inputs: AcceleratorFormState;
  onChange: (next: AcceleratorFormState) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function AcceleratorInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const patch = (p: Partial<AcceleratorFormState>) => onChange({ ...inputs, ...p });

  const paidMax = Math.max(0, inputs.term - 1);

  const [balStr, setBalStr] = useState(() =>
    inputs.bal.toLocaleString("en-US", { maximumFractionDigits: 0 })
  );

  useEffect(() => {
    setBalStr((prev) => {
      const stripped = prev.replace(/,/g, "");
      if (stripped === "" || stripped === "-") return prev;
      const parsed = parseFloat(stripped);
      if (!Number.isFinite(parsed)) return prev;
      if (Math.round(parsed) === Math.round(inputs.bal)) return prev;
      return inputs.bal.toLocaleString("en-US", { maximumFractionDigits: 0 });
    });
  }, [inputs.bal]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Loan balance ($)
        </span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">$</span>
          <input
            id="bal"
            type="text"
            inputMode="numeric"
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 pl-6 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40"
            value={balStr}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              const n = parseFloat(raw);
              if (raw === "" || raw === "-") {
                setBalStr(raw);
              } else if (Number.isFinite(n)) {
                setBalStr(n.toLocaleString("en-US", { maximumFractionDigits: 0 }));
                patch({ bal: n });
              }
            }}
            onBlur={() => {
              const raw = balStr.replace(/,/g, "");
              const n = parseFloat(raw);
              if (!Number.isFinite(n)) {
                setBalStr(inputs.bal.toLocaleString("en-US", { maximumFractionDigits: 0 }));
              }
            }}
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          {t("tool.accelerator.input.rate")}
        </span>
        <div className="relative">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">%</span>
          <input
            id="rate"
            type="number"
            step={0.05}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 pr-7 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40"
            value={inputs.rate}
            onChange={(e) => patch({ rate: num(e.target.value, inputs.rate) })}
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          {t("tool.accelerator.input.term")}
        </span>
        <input
          id="term"
          type="number"
          min={10}
          max={30}
          step={1}
          className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
          value={inputs.term}
          onChange={(e) => {
            const t = Math.round(num(e.target.value, inputs.term));
            const term = Math.min(30, Math.max(10, t));
            const paid = Math.min(inputs.paid, term - 1);
            patch({ term, paid });
          }}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          {t("tool.accelerator.input.paid")}
        </span>
        <input
          id="paid"
          type="number"
          min={0}
          max={paidMax}
          step={1}
          className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
          value={inputs.paid}
          onChange={(e) => {
            const p = Math.round(num(e.target.value, inputs.paid));
            patch({ paid: Math.max(0, Math.min(paidMax, p)) });
          }}
        />
        <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{t("tool.accelerator.input.paidNote")}</p>
      </label>
    </div>
  );
}
