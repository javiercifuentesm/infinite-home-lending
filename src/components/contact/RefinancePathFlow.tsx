import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { CurrencyInput } from "./PurchasePathFlow";
import { useLanguage } from "../../i18n/LanguageContext";

export type RefinanceFlowStep =
  | "inactive"
  | "intro"
  | "goal"
  | "address"
  | "balance"
  | "rate"
  | "timeline"
  | "value"
  | "cashOut"
  | "debt"
  | "complete";

/** Form state — strings for inputs; tri-state fields use "" when unset */
export type RefinanceDataState = {
  goal: string;
  address: string;
  loanBalanceStr: string;
  rateStr: string;
  purchaseTimeline: string;
  estimatedValueStr: string;
  cashOut: "yes" | "no" | "unsure" | "";
  debtConsolidation: "yes" | "no" | "maybe" | "";
};

export const initialRefinanceData = (): RefinanceDataState => ({
  goal: "",
  address: "",
  loanBalanceStr: "",
  rateStr: "",
  purchaseTimeline: "",
  estimatedValueStr: "",
  cashOut: "",
  debtConsolidation: "",
});

/** Digits + one decimal; single trailing % — conversational rate entry */
export function formatRate(value: string): string {
  const noPct = value.replace(/%/g, "");
  let cleaned = noPct.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
  if (!cleaned) return "";
  return `${cleaned}%`;
}

const STEP_ORDER: Exclude<RefinanceFlowStep, "inactive" | "complete">[] = [
  "intro",
  "goal",
  "address",
  "balance",
  "rate",
  "timeline",
  "value",
  "cashOut",
  "debt",
];

export function getRefinanceStepScrollId(
  step: Exclude<RefinanceFlowStep, "inactive" | "complete">,
): string {
  const i = STEP_ORDER.indexOf(step);
  return i >= 0 ? `refi-step-${i + 1}` : "refi-step-1";
}

function refiStepDomId(step: Exclude<RefinanceFlowStep, "inactive" | "complete">): string {
  return getRefinanceStepScrollId(step);
}

const skipBtnClass =
  "purchase-skip-btn w-full border-0 bg-transparent p-2 font-sans text-[13px] text-[#6B7280] transition-colors hover:text-[#0B2A4A]";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

type Props = {
  refinanceFlowStep: Exclude<RefinanceFlowStep, "inactive" | "complete">;
  refinanceData: RefinanceDataState;
  setRefinanceData: Dispatch<SetStateAction<RefinanceDataState>>;
  stepMotion: StepMotion;
  onSkip: () => void;
  /** Re-center the current step after an answer (tiles / inputs). */
  onStepInteraction?: () => void;
};

/**
 * Progressive refinance questions — only when reason is “refi”.
 * All fields optional; same patterns as the purchase path.
 */
export function RefinancePathStep({
  refinanceFlowStep,
  refinanceData,
  setRefinanceData,
  stepMotion,
  onSkip,
  onStepInteraction,
}: Props) {
  const { t } = useLanguage();

  const GOAL_OPTIONS = [
    { id: "lower_payment", label: t("contact.refi.goal.lowerPayment") },
    { id: "reduce_rate", label: t("contact.refi.goal.reduceRate") },
    { id: "cash_out", label: t("contact.refi.goal.cashOut") },
    { id: "consolidate_debt", label: t("contact.refi.goal.consolidate") },
    { id: "unsure", label: t("contact.refi.goal.unsure") },
  ];

  const TIMELINE_OPTIONS = [
    { id: "lt1", label: t("contact.refi.timeline.lt1") },
    { id: "y1_3", label: t("contact.refi.timeline.y1_3") },
    { id: "y3_5", label: t("contact.refi.timeline.y3_5") },
    { id: "y5p", label: t("contact.refi.timeline.y5p") },
    { id: "unsure", label: t("contact.refi.timeline.unsure") },
  ];

  const CASH_OUT_OPTIONS = [
    { id: "yes" as const, label: t("contact.refi.cashOut.yes") },
    { id: "no" as const, label: t("contact.refi.cashOut.no") },
    { id: "unsure" as const, label: t("contact.refi.cashOut.unsure") },
  ];

  const DEBT_OPTIONS = [
    { id: "yes" as const, label: t("contact.refi.debt.yes") },
    { id: "no" as const, label: t("contact.refi.debt.no") },
    { id: "maybe" as const, label: t("contact.refi.debt.maybe") },
  ];

  const microLine = (
    <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.refi.microLine")}
    </p>
  );

  const inputClass =
    "purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)]";

  if (refinanceFlowStep === "intro") {
    return (
      <motion.div id={refiStepDomId("intro")} key="refi-intro" className="form-step space-y-6" {...stepMotion}>
        <p className="mx-auto max-w-[34rem] text-center font-sans text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
          {t("contact.refi.intro.body1")}
          <span className="mt-2 block text-slate-500/95">{t("contact.refi.intro.body2")}</span>
        </p>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (refinanceFlowStep === "goal") {
    return (
      <motion.div id={refiStepDomId("goal")} key="refi-goal" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.goal.question")}
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setRefinanceData((d) => ({ ...d, goal: opt.id }));
                onStepInteraction?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                refinanceData.goal === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (refinanceFlowStep === "address") {
    return (
      <motion.div id={refiStepDomId("address")} key="refi-address" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.address.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[520px] space-y-2 text-left">
          <label htmlFor="sc-refi-address" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {t("contact.refi.address.label")} <span className="font-normal text-slate-400">{t("contact.refi.address.optional")}</span>
          </label>
          <input
            id="sc-refi-address"
            name="refinanceAddress"
            type="text"
            autoComplete="street-address"
            value={refinanceData.address}
            onChange={(e) => {
              setRefinanceData((d) => ({ ...d, address: e.target.value }));
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

  if (refinanceFlowStep === "balance") {
    return (
      <motion.div id={refiStepDomId("balance")} key="refi-balance" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.balance.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-refi-balance" className="sr-only">
            Current loan balance (optional)
          </label>
          <CurrencyInput
            id="sc-refi-balance"
            name="refinanceBalanceInput"
            value={refinanceData.loanBalanceStr}
            onChange={(next) => {
              setRefinanceData((d) => ({ ...d, loanBalanceStr: next }));
              onStepInteraction?.();
            }}
            placeholder="$350,000"
            aria-label="Current loan balance (optional)"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (refinanceFlowStep === "rate") {
    return (
      <motion.div id={refiStepDomId("rate")} key="refi-rate" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.rate.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-refi-rate" className="sr-only">
            Current interest rate (optional)
          </label>
          <input
            id="sc-refi-rate"
            name="refinanceRateInput"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={refinanceData.rateStr}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setRefinanceData((d) => ({ ...d, rateStr: formatRate(e.target.value) }));
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

  if (refinanceFlowStep === "timeline") {
    return (
      <motion.div id={refiStepDomId("timeline")} key="refi-timeline" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.timeline.question")}
        </h2>
        <p className="mx-auto max-w-[28rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.refi.timeline.body")}
        </p>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setRefinanceData((d) => ({ ...d, purchaseTimeline: opt.id }));
                onStepInteraction?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                refinanceData.purchaseTimeline === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (refinanceFlowStep === "value") {
    return (
      <motion.div id={refiStepDomId("value")} key="refi-value" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.value.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-refi-value" className="sr-only">
            Estimated home value (optional)
          </label>
          <CurrencyInput
            id="sc-refi-value"
            name="refinanceValueInput"
            value={refinanceData.estimatedValueStr}
            onChange={(next) => {
              setRefinanceData((d) => ({ ...d, estimatedValueStr: next }));
              onStepInteraction?.();
            }}
            placeholder="$500,000"
            aria-label="Estimated home value (optional)"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (refinanceFlowStep === "cashOut") {
    return (
      <motion.div id={refiStepDomId("cashOut")} key="refi-cash" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.cashOut.question")}
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {CASH_OUT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setRefinanceData((d) => ({ ...d, cashOut: opt.id }));
                onStepInteraction?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                refinanceData.cashOut === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  if (refinanceFlowStep === "debt") {
    return (
      <motion.div id={refiStepDomId("debt")} key="refi-debt" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.debt.question")}
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {DEBT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setRefinanceData((d) => ({ ...d, debtConsolidation: opt.id }));
                onStepInteraction?.();
              }}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                refinanceData.debtConsolidation === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.refi.skip")}
        </button>
      </motion.div>
    );
  }

  return null;
}

/** Parse refinance form state into API-oriented payload */
export function buildRefinanceContextPayload(data: RefinanceDataState): string {
  const parseMoney = (s: string) => {
    const n = Number(s.replace(/\D/g, ""));
    return Number.isFinite(n) ? n : null;
  };
  const parseRate = (s: string) => {
    const n = parseFloat(s.replace(/%/g, "").trim());
    return Number.isFinite(n) ? n : null;
  };
  const tri = (v: "yes" | "no" | "unsure" | "maybe" | ""): boolean | null => {
    if (v === "yes") return true;
    if (v === "no") return false;
    return null;
  };
  const debtTri = (v: "yes" | "no" | "maybe" | ""): boolean | null => {
    if (v === "yes") return true;
    if (v === "no") return false;
    if (v === "maybe") return null;
    return null;
  };

  const payload = {
    goal: data.goal.trim() || null,
    address: data.address.trim() || null,
    balance: parseMoney(data.loanBalanceStr),
    rate: parseRate(data.rateStr),
    purchaseTimeline: data.purchaseTimeline.trim() || null,
    estimatedValue: parseMoney(data.estimatedValueStr),
    cashOut: tri(data.cashOut),
    debtConsolidation: debtTri(data.debtConsolidation),
  };
  return JSON.stringify(payload);
}
