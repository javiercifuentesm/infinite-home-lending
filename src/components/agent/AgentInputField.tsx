import type { InputHTMLAttributes } from "react";

export function AgentInputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`type-input text-[15px] ${
          error ? "border-amber-400/80 focus:border-amber-500/60 focus:ring-amber-200/50" : ""
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error ? (
        <p id={`${id}-err`} className="text-[13px] text-slate-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
