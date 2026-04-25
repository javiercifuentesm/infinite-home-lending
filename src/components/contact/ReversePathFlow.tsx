import type { Dispatch, SetStateAction } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { CurrencyInput } from "./PurchasePathFlow";

export type ReverseFlowStep =
  | "inactive"
  | "residence"
  | "age"
  | "goal"
  | "value"
  | "balance"
  | "obligations"
  | "timeline"
  | "complete";

export type ReverseDataState = {
  residence: string;
  ageRange: string;
  goal: string;
  propertyValueStr: string;
  propertyValueUnsure: boolean;
  mortgageBalanceStr: string;
  obligations: string;
  timeline: string;
};

export const initialReverseData = (): ReverseDataState => ({
  residence: "",
  ageRange: "",
  goal: "",
  propertyValueStr: "",
  propertyValueUnsure: false,
  mortgageBalanceStr: "",
  obligations: "",
  timeline: "",
});

const RESIDENCE_OPTIONS = [
  { id: "primary_yes", label: "Yes, this is my primary home" },
  { id: "primary_no", label: "No / Not full time" },
  { id: "primary_unsure", label: "I’m not sure" },
] as const;

const AGE_OPTIONS = [
  { id: "62_69", label: "62–69" },
  { id: "70_79", label: "70–79" },
  { id: "80_plus", label: "80+" },
  { id: "prefer_not", label: "Prefer not to say" },
] as const;

const GOAL_OPTIONS = [
  { id: "supplement_income", label: "Supplement monthly income" },
  { id: "reduce_stress", label: "Reduce financial stress" },
  { id: "stay_home", label: "Stay comfortably in my home long-term" },
  { id: "upcoming_expenses", label: "Cover upcoming expenses" },
  { id: "exploring", label: "Just exploring options" },
] as const;

const OBLIGATIONS_OPTIONS = [
  { id: "yes", label: "Yes" },
  { id: "believe_so", label: "I believe so" },
  { id: "learn_more", label: "I’d like to understand that better" },
] as const;

const TIMELINE_OPTIONS = [
  { id: "learning", label: "Just learning for now" },
  { id: "few_months", label: "In the next few months" },
  { id: "soon", label: "Soon" },
  { id: "talk", label: "I’d like to talk with someone" },
] as const;

const softMicro = (
  <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
    The more you share, the better we can guide you — but everything here is completely optional.
  </p>
);

const skipBtnClass =
  "skip-button purchase-skip-btn w-full border-0 bg-transparent p-2 font-sans text-[13px] text-[#6B7280] transition-colors duration-300 hover:text-[#0B2A4A]";

const optionBtnClass =
  "reverse-flow-option card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A]";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

const SCROLL_ID: Record<Exclude<ReverseFlowStep, "inactive" | "complete">, string> = {
  residence: "reverse-step-residence",
  age: "reverse-step-age",
  goal: "reverse-step-goal",
  value: "reverse-step-value",
  balance: "reverse-step-balance",
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
  "value",
  "balance",
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
  if (reverseFlowStep === "residence") {
    return (
      <motion.div id={SCROLL_ID.residence} key="reverse-residence" className="form-step space-y-6" {...stepMotion}>
        <div className="mx-auto max-w-[36rem] space-y-4 text-center">
          <p className="font-heading text-[1.05rem] font-semibold leading-snug text-[#0B2A4A] sm:text-[1.15rem]">
            Let&apos;s explore what&apos;s possible — at your pace.
          </p>
          <p className="font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
            This is simply a conversation to understand your situation and see if a reverse mortgage could be a helpful option for you.
          </p>
          <p className="font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
            The more you share, the better we can guide you — but everything here is completely optional.
          </p>
        </div>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Is this home where you currently live most of the year?
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
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "age") {
    return (
      <motion.div id={SCROLL_ID.age} key="reverse-age" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Which of these best describes your stage?
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
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "goal") {
    return (
      <motion.div id={SCROLL_ID.goal} key="reverse-goal" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          What would you like this to help you with?
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
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "value") {
    return (
      <motion.div id={SCROLL_ID.value} key="reverse-value" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Do you have a sense of your home&apos;s value?
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          A rough sense is enough — we can help you understand more whenever you&apos;re ready.
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
          I&apos;m not sure
        </button>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "balance") {
    return (
      <motion.div id={SCROLL_ID.balance} key="reverse-balance" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          What&apos;s your current mortgage balance?
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          Optional — it helps us understand your situation more clearly.
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
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "obligations") {
    return (
      <motion.div id={SCROLL_ID.obligations} key="reverse-obligations" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Are you comfortable continuing to cover things like property taxes and insurance?
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
          Skip for now
        </button>
      </motion.div>
    );
  }

  if (reverseFlowStep === "timeline") {
    return (
      <motion.div id={SCROLL_ID.timeline} key="reverse-timeline" className="form-step space-y-6" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          When would you like to explore this further?
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

export function buildReverseContextPayload(data: ReverseDataState): string {
  const payload = {
    residence: data.residence.trim() || null,
    ageRange: data.ageRange.trim() || null,
    goal: data.goal.trim() || null,
    propertyValue: data.propertyValueUnsure ? null : parseCurrencyDigits(data.propertyValueStr),
    propertyValueUnsure: data.propertyValueUnsure,
    mortgageBalance: parseCurrencyDigits(data.mortgageBalanceStr),
    obligations: data.obligations.trim() || null,
    timeline: data.timeline.trim() || null,
  };
  return JSON.stringify(payload);
}
