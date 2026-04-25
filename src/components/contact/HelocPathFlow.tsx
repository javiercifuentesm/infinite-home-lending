import type { Dispatch, SetStateAction } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { CurrencyInput } from "./PurchasePathFlow";

export type HelocFlowStep =
  | "inactive"
  | "purpose"
  | "value"
  | "balance"
  | "amount"
  | "credit"
  | "timeline"
  | "complete";

export type HelocDataState = {
  helocPurpose: string;
  propertyValueStr: string;
  mortgageBalanceStr: string;
  desiredAccess: string;
  creditProfile: string;
  timeline: string;
};

export const initialHelocData = (): HelocDataState => ({
  helocPurpose: "",
  propertyValueStr: "",
  mortgageBalanceStr: "",
  desiredAccess: "",
  creditProfile: "",
  timeline: "",
});

const PURPOSE_OPTIONS = [
  { id: "home_improvements", label: "Home improvements" },
  { id: "debt_consolidation", label: "Debt consolidation" },
  { id: "flexible_funds", label: "Access to flexible funds" },
  { id: "major_expense", label: "Major expense (education, medical, or life events)" },
  { id: "unsure", label: "Not sure yet" },
] as const;

const ACCESS_OPTIONS = [
  { id: "under_25k", label: "Under $25,000" },
  { id: "range_25_75", label: "$25,000 – $75,000" },
  { id: "range_75_150", label: "$75,000 – $150,000" },
  { id: "over_150k", label: "$150,000+" },
  { id: "unsure", label: "Not sure yet" },
] as const;

const CREDIT_OPTIONS = [
  { id: "excellent", label: "Excellent (720+)" },
  { id: "good", label: "Good (680–720)" },
  { id: "fair", label: "Fair (620–680)" },
  { id: "unsure", label: "Not sure" },
] as const;

const TIMELINE_OPTIONS = [
  { id: "exploring", label: "Exploring options" },
  { id: "few_months", label: "Within the next few months" },
  { id: "ready_soon", label: "Ready soon" },
  { id: "quick", label: "Need access quickly" },
] as const;

const microLine = (
  <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
    Optional — share what you can. We&apos;ll guide you either way.
  </p>
);

/** Global optional disclaimer — same tone as purchase/refi microcopy. */
const helocGlobalDisclaimer = (
  <p className="mx-auto max-w-[36rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
    The more you share, the better we can prepare to guide you — but everything here is optional.
  </p>
);

const skipBtnClass =
  "skip-button purchase-skip-btn w-full border-0 bg-transparent p-2 font-sans text-[13px] text-[#6B7280] transition-colors hover:text-[#0B2A4A]";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

const SCROLL_ID: Record<Exclude<HelocFlowStep, "inactive" | "complete">, string> = {
  purpose: "heloc-step-purpose",
  value: "heloc-step-value",
  balance: "heloc-step-balance",
  amount: "heloc-step-amount",
  credit: "heloc-step-credit",
  timeline: "heloc-step-timeline",
};

export function getHelocStepScrollId(step: Exclude<HelocFlowStep, "inactive" | "complete">): string {
  return SCROLL_ID[step];
}

const HELOC_ORDER: Exclude<HelocFlowStep, "inactive" | "complete">[] = [
  "purpose",
  "value",
  "balance",
  "amount",
  "credit",
  "timeline",
];

/** Next sub-step after `current`, or `complete` when skipping past the last HELOC question. */
export function getNextHelocSubstep(
  current: Exclude<HelocFlowStep, "inactive" | "complete">,
): Exclude<HelocFlowStep, "inactive" | "complete"> | "complete" {
  const i = HELOC_ORDER.indexOf(current);
  if (i === -1 || i >= HELOC_ORDER.length - 1) return "complete";
  return HELOC_ORDER[i + 1];
}

type Props = {
  helocFlowStep: Exclude<HelocFlowStep, "inactive" | "complete">;
  helocData: HelocDataState;
  setHelocData: Dispatch<SetStateAction<HelocDataState>>;
  stepMotion: StepMotion;
  onSkip: () => void;
  onStepInteraction?: () => void;
  /** After purpose / amount / credit tile selection — advances to next HELOC step + triggers scroll. */
  onAdvanceAfterTileAnswer?: () => void;
  /** After timeline selection — completes HELOC path and enters shared “Where things stand” step. */
  onCompleteFlow?: () => void;
};

export function HelocPathStep({
  helocFlowStep,
  helocData,
  setHelocData,
  stepMotion,
  onSkip,
  onStepInteraction,
  onAdvanceAfterTileAnswer,
  onCompleteFlow,
}: Props) {
  if (helocFlowStep === "purpose") {
    return (
      <motion.div
        id={SCROLL_ID.purpose}
        key="heloc-purpose"
        className="form-step space-y-5"
        {...stepMotion}
      >
        <p className="mx-auto max-w-[34rem] text-center font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
          We&apos;ll use this to structure the smartest way to access your equity — not just any option.
        </p>
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          What are you looking to accomplish with your home equity?
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setHelocData((d) => ({ ...d, helocPurpose: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                helocData.helocPurpose === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (helocFlowStep === "value") {
    return (
      <motion.div
        id={SCROLL_ID.value}
        key="heloc-value"
        className="form-step space-y-4"
        {...stepMotion}
      >
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Do you have an idea of what your property is worth?
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          An estimate is perfectly fine — we&apos;ll help refine it if needed.
        </p>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-heloc-value" className="sr-only">
            Estimated property value (optional)
          </label>
          <CurrencyInput
            id="sc-heloc-value"
            name="helocPropertyValueInput"
            value={helocData.propertyValueStr}
            onChange={(next) => {
              setHelocData((d) => ({ ...d, propertyValueStr: next }));
              onStepInteraction?.();
            }}
            placeholder="$450,000"
            aria-label="Estimated property value (optional)"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (helocFlowStep === "balance") {
    return (
      <motion.div
        id={SCROLL_ID.balance}
        key="heloc-balance"
        className="form-step space-y-4"
        {...stepMotion}
      >
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          What&apos;s your current mortgage balance?
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          Optional — helps us estimate your available equity.
        </p>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-heloc-balance" className="sr-only">
            Current mortgage balance (optional)
          </label>
          <CurrencyInput
            id="sc-heloc-balance"
            name="helocMortgageBalanceInput"
            value={helocData.mortgageBalanceStr}
            onChange={(next) => {
              setHelocData((d) => ({ ...d, mortgageBalanceStr: next }));
              onStepInteraction?.();
            }}
            placeholder="$350,000"
            aria-label="Current mortgage balance (optional)"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (helocFlowStep === "amount") {
    return (
      <motion.div
        id={SCROLL_ID.amount}
        key="heloc-amount"
        className="form-step space-y-5"
        {...stepMotion}
      >
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          How much access to your equity are you considering?
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {ACCESS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setHelocData((d) => ({ ...d, desiredAccess: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                helocData.desiredAccess === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (helocFlowStep === "credit") {
    return (
      <motion.div
        id={SCROLL_ID.credit}
        key="heloc-credit"
        className="form-step space-y-4"
        {...stepMotion}
      >
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Do you have a general sense of your credit?
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          A rough sense is plenty — no exact score needed.
        </p>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {CREDIT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setHelocData((d) => ({ ...d, creditProfile: opt.id }));
                onAdvanceAfterTileAnswer?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                helocData.creditProfile === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (helocFlowStep === "timeline") {
    return (
      <motion.div
        id={SCROLL_ID.timeline}
        key="heloc-timeline"
        className="form-step space-y-5"
        {...stepMotion}
      >
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          How soon are you looking to move forward?
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setHelocData((d) => ({ ...d, timeline: opt.id }));
                onCompleteFlow?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                helocData.timeline === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
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

export function buildHelocContextPayload(data: HelocDataState): string {
  const payload = {
    helocPurpose: data.helocPurpose.trim() || null,
    propertyValue: parseCurrencyDigits(data.propertyValueStr),
    mortgageBalance: parseCurrencyDigits(data.mortgageBalanceStr),
    desiredAccess: data.desiredAccess.trim() || null,
    creditProfile: data.creditProfile.trim() || null,
    timeline: data.timeline.trim() || null,
  };
  return JSON.stringify(payload);
}
