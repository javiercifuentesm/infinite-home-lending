import type { ReverseInputs } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput } from "../shared/FormattedInput";

type Props = {
  inputs: ReverseInputs;
  onChange: (next: ReverseInputs) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

const fieldClass =
  "min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40 md:min-h-[40px]";

export function ReverseSituationInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const patch = (p: Partial<ReverseInputs>) => onChange({ ...inputs, ...p });

  const coWarn =
    inputs.coAge != null && inputs.coAge > 0 && inputs.coAge < 62;

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#0B2A4A]"
          style={{ background: "#E6F1FB" }}
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{t("tool.reverse.situation.eyebrow")}</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.reverse.situation.heading")}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.situation.hv")}
          </span>
          <DollarInput id="homeVal" value={inputs.homeVal} min={0} className={fieldClass} onChange={(n) => patch({ homeVal: n })} />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.situation.hvNote")}</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.situation.mb")}
          </span>
          <DollarInput id="mortBal" value={inputs.mortBal} min={0} className={fieldClass} onChange={(n) => patch({ mortBal: n })} />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.situation.mbNote")}</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.situation.age")}
          </span>
          <input
            id="age"
            type="number"
            min={62}
            max={95}
            step={1}
            className={fieldClass}
            value={inputs.age}
            onChange={(e) => patch({ age: Math.round(num(e.target.value, inputs.age)) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.situation.ageNote")}</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.situation.coAge")}
          </span>
          <input
            id="coAge"
            type="number"
            min={62}
            max={95}
            step={1}
            placeholder={t("tool.reverse.situation.coAgePlaceholder")}
            className={fieldClass}
            value={inputs.coAge ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw === "") patch({ coAge: null });
              else patch({ coAge: Math.round(num(raw, 70)) });
            }}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.situation.coAgeNote")}</p>
          {coWarn ? (
            <p className="mt-2 text-[13px] font-medium text-[#854F0B]">{t("tool.reverse.situation.coAgeWarn")}</p>
          ) : null}
        </label>
      </div>
    </div>
  );
}
