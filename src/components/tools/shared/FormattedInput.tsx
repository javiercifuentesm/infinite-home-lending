import { useEffect, useState } from "react";

export const SMART_TOOL_INPUT_BASE_CLASS =
  "w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40";

type DollarInputProps = {
  id: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function DollarInput({ id, value, onChange, min, max, className }: DollarInputProps) {
  const baseClass = `${className ?? SMART_TOOL_INPUT_BASE_CLASS} pl-6`;

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

  const commitIfValid = (rawStripped: string): number | null => {
    if (rawStripped === "" || rawStripped === "-" || /\.$/.test(rawStripped)) return null;
    const n = parseFloat(rawStripped);
    if (!Number.isFinite(n)) return null;
    if (min !== undefined && n < min) return null;
    if (max !== undefined && n > max) return null;
    return n;
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">$</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        className={baseClass}
        value={localStr}
        autoComplete="off"
        onChange={(e) => {
          const raw = e.target.value.replace(/,/g, "");
          if (raw === "" || raw === "-") {
            setLocalStr(raw);
            return;
          }
          const n = commitIfValid(raw);
          if (n !== null) {
            setLocalStr(n.toLocaleString("en-US", { maximumFractionDigits: 0 }));
            onChange(n);
          }
        }}
        onBlur={() => {
          const stripped = localStr.replace(/,/g, "");
          const n = commitIfValid(stripped);
          if (n === null) {
            setLocalStr(value.toLocaleString("en-US", { maximumFractionDigits: 0 }));
          }
        }}
      />
    </div>
  );
}

type PercentInputProps = {
  id: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
};

export function PercentInput({ id, value, onChange, step, min, max, className }: PercentInputProps) {
  const baseClass = `${className ?? SMART_TOOL_INPUT_BASE_CLASS} pr-7`;

  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        className={baseClass}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">%</span>
    </div>
  );
}
