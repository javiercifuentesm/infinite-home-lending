import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { CurrencyInput } from "./PurchasePathFlow";
import { formatRate } from "./RefinancePathFlow";
import { useLanguage } from "../../i18n/LanguageContext";

export type ReverseFlowStep =
  | "inactive"
  | "residence"
  | "age"
  | "goal"
  | "address"
  | "value"
  | "balance"
  | "rate"
  | "obligations"
  | "timeline"
  | "complete";

export type ReverseDataState = {
  residence: string;
  ageRange: string;
  goal: string;
  address: string;
  propertyValueStr: string;
  propertyValueUnsure: boolean;
  mortgageBalanceStr: string;
  currentRate: string;
  obligations: string;
  timeline: string;
};

export const initialReverseData = (): ReverseDataState => ({
  residence: "",
  ageRange: "",
  goal: "",
  address: "",
  propertyValueStr: "",
  propertyValueUnsure: false,
  mortgageBalanceStr: "",
  currentRate: "",
  obligations: "",
  timeline: "",
});

const skipBtnClass =
  "skip-button purchase-skip-btn w-full border-0 bg-transparent p-2 font-sans text-[13px] text-[#6B7280] transition-colors duration-300 hover:text-[#0B2A4A]";

const optionBtnClass =
  "reverse-flow-option card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A]";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

const SCROLL_ID: Record<Exclude<ReverseFlowStep, "inactive" | "complete">, string> = {
  residence: "reverse-step-residence",
  age: "reverse-step-age",
  goal: "reverse-step-goal",
  address: "reverse-step-address",
  value: "reverse-step-value",
  balance: "reverse-step-balance",
  rate: "reverse-step-rate",
  obligations: "reverse-step-obligations",
  timeline: "reverse-step-timeline",
};

export function getReverseStepScrollId(step: Exclude<ReverseFlowStep, "inactive" | "complete">): string {
  return SCROLL_ID[step];
}

const REVERSE_ORDER: Exclude<ReverseFlowStep, "inactive" | "complete">[] = [
  "residence",
  "age",
  "goal",
  "address",
  "value",
  "balance",
  "rate",
  "obligations",
  "timeline",
];

export function getNextReverseSubstep(
  current: Exclude<ReverseFlowStep, "inactive" | "complete">,
): Exclude<ReverseFlowStep, "inactive" | "complete"> | "complete" {
  const i = REVERSE_ORDER.indexOf(current);
  if (i === -1 || i >= REVERSE_ORDER.length - 1) return "complete";
  return REVERSE_ORDER[i + 1];
}

type Props = {
  reverseFlowStep: Exclude<ReverseFlowStep, "inactive" | "complete">;
  reverseData: ReverseDataState;
  setReverseData: Dispatch<SetStateAction<ReverseDataState>>;
  stepMotion: StepMotion;
  onSkip: () => void;
  onStepInteraction?: () => void;
  onAdvanceAfterTileAnswer?: () => void;
  onCompleteFlow?: () => void;
};

export function ReversePathStep({
  reverseFlowStep,
  reverseData,
  setReverseData,
  stepMotion,
  onSkip,
  onStepInteraction,
  onAdvanceAfterTileAnswer,
  onCompleteFlow,
}: Props) {
  const { t } = useLanguage();

  const RESIDENCE_OPTIONS = [
    { id: "primary_yes", label: t("contact.reverse.residence.yes") },
    { id: "primary_no", label: t("contact.reverse.residence.no") },
    { id: "primary_unsure", label: t("contact.reverse.residence.unsure") },
  ];

  const AGE_OPTIONS = [
    { id: "55_61", label: "55–61" },
    { id: "62_69", label: t("contact.reverse.age.62_69") },
    { id: "70_79", label: t("contact.reverse.age.70_79") },
    { id: "80_plus", label: t("contact.reverse.age.80plus") },
    { id: "prefer_not", label: t("contact.reverse.age.preferNot") },
  ];

  const GOAL_OPTIONS = [
    { id: "supplement_income", label: t("contact.reverse.goal.income") },
    { id: "reduce_stress", label: t("contact.reverse.goal.stress") },
    { id: "stay_home", label: t("contact.reverse.goal.stay") },
    { id: "upcoming_expenses", label: t("contact.reverse.goal.expenses") },
    { id: "exploring", label: t("contact.reverse.goal.exploring") },
  ];

  const OBLIGATIONS_OPTIONS = [
    { id: "yes", label: t("contact.reverse.obligations.yes") },
    { id: "believe_so", label: t("contact.reverse.obligations.believeSo") },
    { id: "learn_more", label: t("contact.reverse.obligations.learnMore") },
  ];

  const TIMELINE_OPTIONS = [
    { id: "learning", label: t("contact.reverse.timeline.learning") },
    { id: "few_months", label: t("contact.reverse.timeline.fewMonths") },
    { id: "soon", label: t("contact.reverse.timeline.soon") },
    { id: "talk", label: t("contact.reverse.timeline.talk") },
  ];

  const softMicro = (
    <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.reverse.softMicro")}
    </p>
  );

  const microLine = (
    <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.refi.microLine")}
    </p>
  );

  const inputClass =
    "purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)]";

  if (reverseFlowStep === "residence") {
    return (
      <motion.div id={SCROLL_ID.residence} key="reverse-residence" className="form-step space-y-6" {...stepMotion}>
        <div className="mx-auto max-w-[36rem] space-y-4 text-center">
          <p className="font-heading text-[1.05rem] font-semibold leading-snug text-[#0B2A4A] sm:text-[1.15rem]">
            {t("contact.reverse.residence.intro1")}
          </p>
          <p className="font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
            {t("contact.reverse.residence.intro2")}
          </p>
          <p className="font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
            {t("contact.reverse.residence.intro3")}
          </p>
        </div>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.residence.question")}
        </h2>
        {softMicro}
        <div className="option-group grid grid-cols-1 gap-3">
          {RESIDENCE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setReverseData((d) => ({ ...d, residence: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`${optionBtnClass} ${reverseData.residence === opt.id ? "card-option--selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "age") {
    return (
      <motion.div id={SCROLL_ID.age} key="reverse-age" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.age.question")}
        </h2>
        {softMicro}
        <div className="option-group grid grid-cols-1 gap-3">
          {AGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setReverseData((d) => ({ ...d, ageRange: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`${optionBtnClass} ${reverseData.ageRange === opt.id ? "card-option--selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "goal") {
    return (
      <motion.div id={SCROLL_ID.goal} key="reverse-goal" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.goal.question")}
        </h2>
        {softMicro}
        <div className="option-group grid grid-cols-1 gap-3">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setReverseData((d) => ({ ...d, goal: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`${optionBtnClass} ${reverseData.goal === opt.id ? "card-option--selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "address") {
    return (
      <motion.div id={SCROLL_ID.address} key="reverse-address" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.address.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[520px] space-y-2 text-left">
          <label htmlFor="sc-reverse-address" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {t("contact.refi.address.label")} <span className="font-normal text-slate-400">{t("contact.refi.address.optional")}</span>
          </label>
          <input
            id="sc-reverse-address"
            name="reverseAddress"
            type="text"
            autoComplete="street-address"
            value={reverseData.address}
            onChange={(e) => {
              setReverseData((d) => ({ ...d, address: e.target.value }));
              onStepInteraction?.();
            }}
            placeholder={t("contact.refi.address.placeholder")}
            className={`${inputClass} text-center`}
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "value") {
    return (
      <motion.div id={SCROLL_ID.value} key="reverse-value" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.value.question")}
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.reverse.value.body")}
        </p>
        {softMicro}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-reverse-value" className="sr-only">
            Estimated home value (optional)
          </label>
          <CurrencyInput
            id="sc-reverse-value"
            name="reversePropertyValueInput"
            value={reverseData.propertyValueStr}
            onChange={(next) => {
              setReverseData((d) => ({ ...d, propertyValueStr: next, propertyValueUnsure: false }));
              onStepInteraction?.();
            }}
            placeholder="$400,000"
            aria-label="Estimated home value (optional)"
          />
        </div>
        <button
          type="button"
          className={optionBtnClass}
          onClick={() => {
            setReverseData((d) => ({ ...d, propertyValueStr: "", propertyValueUnsure: true }));
            onAdvanceAfterTileAnswer?.();
          }}
        >
          {t("contact.reverse.value.unsure")}
        </button>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "balance") {
    return (
      <motion.div id={SCROLL_ID.balance} key="reverse-balance" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.balance.question")}
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.reverse.balance.body")}
        </p>
        {softMicro}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-reverse-balance" className="sr-only">
            Current mortgage balance (optional)
          </label>
          <CurrencyInput
            id="sc-reverse-balance"
            name="reverseMortgageBalanceInput"
            value={reverseData.mortgageBalanceStr}
            onChange={(next) => {
              setReverseData((d) => ({ ...d, mortgageBalanceStr: next }));
              onStepInteraction?.();
            }}
            placeholder="$150,000"
            aria-label="Current mortgage balance (optional)"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "rate") {
    return (
      <motion.div id={SCROLL_ID.rate} key="reverse-rate" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.rate.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-reverse-rate" className="sr-only">
            Current interest rate (optional)
          </label>
          <input
            id="sc-reverse-rate"
            name="reverseRateInput"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={reverseData.currentRate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setReverseData((d) => ({ ...d, currentRate: formatRate(e.target.value) }));
              onStepInteraction?.();
            }}
            placeholder="6.25%"
            aria-label="Current interest rate (optional)"
            className="purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-center font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)] tabular-nums"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "obligations") {
    return (
      <motion.div id={SCROLL_ID.obligations} key="reverse-obligations" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.obligations.question")}
        </h2>
        {softMicro}
        <div className="option-group grid grid-cols-1 gap-3">
          {OBLIGATIONS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setReverseData((d) => ({ ...d, obligations: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`${optionBtnClass} ${reverseData.obligations === opt.id ? "card-option--selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "timeline") {
    return (
      <motion.div id={SCROLL_ID.timeline} key="reverse-timeline" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.reverse.timeline.question")}
        </h2>
        {softMicro}
        <div className="option-group grid grid-cols-1 gap-3">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setReverseData((d) => ({ ...d, timeline: opt.id }));
                onCompleteFlow?.();
              }}
              className={`${optionBtnClass} ${reverseData.timeline === opt.id ? "card-option--selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.reverse.skip")}
        </button>
      </motion.div>
    );
  }

  return null;
}

function parseCurrencyDigits(raw: string): number | null {
  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseRate(raw: string): number | null {
  const n = parseFloat(raw.replace(/%/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

export function buildReverseContextPayload(data: ReverseDataState): string {
  const payload = {
    residence: data.residence.trim() || null,
    ageRange: data.ageRange.trim() || null,
    goal: data.goal.trim() || null,
    address: data.address.trim() || null,
    propertyValue: data.propertyValueUnsure ? null : parseCurrencyDigits(data.propertyValueStr),
    propertyValueUnsure: data.propertyValueUnsure,
    mortgageBalance: parseCurrencyDigits(data.mortgageBalanceStr),
    currentRate: parseRate(data.currentRate),
    obligations: data.obligations.trim() || null,
    timeline: data.timeline.trim() || null,
  };
  return JSON.stringify(payload);
}
