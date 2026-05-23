import { useState } from "react";
import type { WaitingInputs } from "../../hooks/useWaitingMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  inputs: WaitingInputs;
  onChange: (next: WaitingInputs) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

function stripThousands(raw: string): string {
  return raw.replace(/,/g, "").trim();
}

/** Commit from raw string — false while empty, incomplete decimals, NaN, or out of range. */
function parsedValidForCommit(
  raw: string,
  min: number | undefined,
  max: number | undefined
): number | null {
  const t = stripThousands(raw);
  if (t === "" || t === "-" || /\.$/.test(t)) return null;
  const n = parseFloat(t);
  if (!Number.isFinite(n)) return null;
  if (min !== undefined && n < min) return null;
  if (max !== undefined && n > max) return null;
  return n;
}

/** Prefix/suffix hints for dollar vs percent fields from label copy. */
function smartToolInputSymbol(label: string): "dollar" | "percent" | null {
  if (label.includes("($") || label.includes("$/")) return "dollar";
  if (
    label.includes("(%)") ||
    label.includes("% /yr") ||
    label.includes("% /año") ||
    label.includes("(%")
  ) {
    return "percent";
  }
  return null;
}

export function WaitingInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const patch = (partial: Partial<WaitingInputs>) => onChange({ ...inputs, ...partial });

  const fields: {
    id: keyof WaitingInputs;
    label: string;
    step?: string;
    min?: number;
    max?: number;
    note?: string;
    type?: "number" | "select";
    options?: { value: number; label: string }[];
  }[] = [
    { id: "hp", label: t("tool.waiting.input.hp"), step: "5000" },
    { id: "rent", label: t("tool.waiting.input.rent"), step: "50" },
    { id: "dp", label: t("tool.waiting.input.dp"), step: "0.5", min: 0, max: 50 },
    { id: "rate", label: t("tool.waiting.input.rate"), step: "0.05" },
    { id: "appr", label: t("tool.waiting.input.appr"), step: "0.1", note: t("tool.waiting.input.apprNote") },
    { id: "ri", label: t("tool.waiting.input.ri"), step: "0.1" },
    {
      id: "futureRate",
      label: t("tool.waiting.input.futureRate"),
      step: "0.05",
      note: t("tool.waiting.input.futureRateNote"),
    },
    {
      id: "lt",
      label: t("tool.waiting.input.lt"),
      type: "select",
      options: [
        { value: 30, label: t("tool.waiting.input.lt30") },
        { value: 20, label: t("tool.waiting.input.lt20") },
        { value: 15, label: t("tool.waiting.input.lt15") },
      ],
    },
  ];

  const [localValues, setLocalValues] = useState<Record<string, string>>(() => ({
    hp: inputs.hp.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    rent: inputs.rent.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    dp: String(inputs.dp),
    rate: String(inputs.rate),
    appr: String(inputs.appr),
    ri: String(inputs.ri),
    futureRate: String(inputs.futureRate),
  }));

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((f) => (
        <label key={String(f.id)} className="block">
          <span className="mb-1.5 block text-[12px] font-semibold text-[var(--tcw-text-secondary,#475569)]">
            {f.label}
          </span>
          {f.type === "select" && f.options ? (
            <select
              id={String(f.id)}
              className="w-full rounded-lg border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] px-3 py-2.5 text-[15px] text-[var(--tcw-text-primary,#0B2A4A)] outline-none focus:ring-2 focus:ring-[#C6A15B]/40"
              value={inputs[f.id] as number}
              onChange={(e) => patch({ [f.id]: num(e.target.value, inputs[f.id] as number) } as Partial<WaitingInputs>)}
            >
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            (() => {
              const sym = smartToolInputSymbol(f.label);
              const cls =
                "w-full rounded-lg border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] px-3 py-2.5 text-[15px] tabular-nums text-[var(--tcw-text-primary,#0B2A4A)] outline-none focus:ring-2 focus:ring-[#C6A15B]/40]" +
                (sym === "dollar" ? " pl-6" : "") +
                (sym === "percent" ? " pr-7" : "");
              const inputEl =
                sym === "dollar" ? (
                  <input
                    id={String(f.id)}
                    type="text"
                    inputMode="numeric"
                    className={cls}
                    value={
                      localValues[f.id] ??
                      (inputs[f.id] as number).toLocaleString("en-US", { maximumFractionDigits: 0 })
                    }
                    onChange={(e) => {
                      const id = String(f.id);
                      const stripped = stripThousands(e.target.value);
                      if (stripped === "" || stripped === "-") {
                        setLocalValues((prev) => ({ ...prev, [id]: stripped }));
                        return;
                      }
                      const n = parsedValidForCommit(stripped, f.min, f.max);
                      if (n !== null) {
                        setLocalValues((prev) => ({
                          ...prev,
                          [id]: n.toLocaleString("en-US", { maximumFractionDigits: 0 }),
                        }));
                        patch({ [f.id]: n } as Partial<WaitingInputs>);
                      }
                    }}
                    onBlur={() => {
                      const id = String(f.id);
                      const raw = localValues[id] ?? "";
                      const n = parsedValidForCommit(raw, f.min, f.max);
                      if (n === null) {
                        setLocalValues((prev) => ({
                          ...prev,
                          [id]: (inputs[f.id] as number).toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          }),
                        }));
                      }
                    }}
                  />
                ) : (
                  <input
                    id={String(f.id)}
                    type="number"
                    step={f.step}
                    min={f.min}
                    max={f.max}
                    className={cls}
                    value={localValues[f.id] ?? String(inputs[f.id])}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const id = String(f.id);
                      setLocalValues((prev) => ({ ...prev, [id]: raw }));

                      const n = parsedValidForCommit(raw, f.min, f.max);
                      if (n !== null)
                        patch({ [f.id]: n } as Partial<WaitingInputs>);
                    }}
                    onBlur={() => {
                      const id = String(f.id);
                      const raw = localValues[id] ?? String(inputs[f.id]);
                      const n = parsedValidForCommit(raw, f.min, f.max);
                      if (n === null) {
                        setLocalValues((prev) => ({
                          ...prev,
                          [id]: String(inputs[f.id]),
                        }));
                      }
                    }}
                  />
                );
              return sym === "dollar" ? (
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">
                    $
                  </span>
                  {inputEl}
                </div>
              ) : sym === "percent" ? (
                <div className="relative">
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">
                    %
                  </span>
                  {inputEl}
                </div>
              ) : (
                inputEl
              );
            })()
          )}
          {f.note ? <p className="mt-1 text-[11px] text-[var(--tcw-text-muted,#64748b)]">{f.note}</p> : null}
        </label>
      ))}
    </div>
  );
}
