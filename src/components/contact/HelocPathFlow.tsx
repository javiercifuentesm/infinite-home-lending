import type { Dispatch, SetStateAction } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { CurrencyInput } from "./PurchasePathFlow";
import { useLanguage } from "../../i18n/LanguageContext";

export type HelocFlowStep =
  | "inactive"
  | "purpose"
  | "address"
  | "value"
  | "balance"
  | "amount"
  | "credit"
  | "timeline"
  | "complete";

export type HelocDataState = {
  helocPurpose: string;
  address: string;
  propertyValueStr: string;
  mortgageBalanceStr: string;
  desiredAccess: string;
  creditProfile: string;
  timeline: string;
};

export const initialHelocData = (): HelocDataState => ({
  helocPurpose: "",
  address: "",
  propertyValueStr: "",
  mortgageBalanceStr: "",
  desiredAccess: "",
  creditProfile: "",
  timeline: "",
});

const skipBtnClass =
  "skip-button purchase-skip-btn w-full border-0 bg-transparent p-2 font-sans text-[13px] text-[#6B7280] transition-colors hover:text-[#0B2A4A]";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

const SCROLL_ID: Record<Exclude<HelocFlowStep, "inactive" | "complete">, string> = {
  purpose: "heloc-step-purpose",
  address: "heloc-step-address",
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
  "address",
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
  const { t } = useLanguage();

  const PURPOSE_OPTIONS = [
    { id: "home_improvements", label: t("contact.heloc.purpose.improvements") },
    { id: "debt_consolidation", label: t("contact.heloc.purpose.debt") },
    { id: "flexible_funds", label: t("contact.heloc.purpose.flexible") },
    { id: "major_expense", label: t("contact.heloc.purpose.major") },
    { id: "unsure", label: t("contact.heloc.purpose.unsure") },
  ];

  const ACCESS_OPTIONS = [
    { id: "under_25k", label: t("contact.heloc.amount.under25") },
    { id: "range_25_75", label: t("contact.heloc.amount.25_75") },
    { id: "range_75_150", label: t("contact.heloc.amount.75_150") },
    { id: "over_150k", label: t("contact.heloc.amount.over150") },
    { id: "unsure", label: t("contact.heloc.amount.unsure") },
  ];

  const CREDIT_OPTIONS = [
    { id: "excellent", label: t("contact.heloc.credit.excellent") },
    { id: "good", label: t("contact.heloc.credit.good") },
    { id: "fair", label: t("contact.heloc.credit.fair") },
    { id: "unsure", label: t("contact.heloc.credit.unsure") },
  ];

  const TIMELINE_OPTIONS = [
    { id: "exploring", label: t("contact.heloc.timeline.exploring") },
    { id: "few_months", label: t("contact.heloc.timeline.fewMonths") },
    { id: "ready_soon", label: t("contact.heloc.timeline.readySoon") },
    { id: "quick", label: t("contact.heloc.timeline.quick") },
  ];

  const helocMicroLine = (
    <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.heloc.microLine")}
    </p>
  );

  const microLine = (
    <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.refi.microLine")}
    </p>
  );

  const inputClass =
    "purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)]";

  const helocGlobalDisclaimer = (
    <p className="mx-auto max-w-[36rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.heloc.globalDisclaimer")}
    </p>
  );

  if (helocFlowStep === "purpose") {
    return (
      <motion.div
        id={SCROLL_ID.purpose}
        key="heloc-purpose"
        className="form-step space-y-5"
        {...stepMotion}
      >
        <p className="mx-auto max-w-[34rem] text-center font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
          {t("contact.heloc.purpose.intro")}
        </p>
        {helocGlobalDisclaimer}
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.heloc.purpose.question")}
        </h2>
        {helocMicroLine}
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
          {t("contact.heloc.skip")}
        </button>
      </motion.div>
    );
  }

  if (helocFlowStep === "address") {
    return (
      <motion.div id={SCROLL_ID.address} key="heloc-address" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.refi.address.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[520px] space-y-2 text-left">
          <label htmlFor="sc-heloc-address" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {t("contact.refi.address.label")} <span className="font-normal text-slate-400">{t("contact.refi.address.optional")}</span>
          </label>
          <input
            id="sc-heloc-address"
            name="helocAddress"
            type="text"
            autoComplete="street-address"
            value={helocData.address}
            onChange={(e) => {
              setHelocData((d) => ({ ...d, address: e.target.value }));
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
          {t("contact.heloc.value.question")}
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.heloc.value.body")}
        </p>
        {helocMicroLine}
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
          {t("contact.heloc.skip")}
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
          {t("contact.heloc.balance.question")}
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.heloc.balance.body")}
        </p>
        {helocMicroLine}
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
          {t("contact.heloc.skip")}
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
          {t("contact.heloc.amount.question")}
        </h2>
        {helocMicroLine}
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
          {t("contact.heloc.skip")}
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
          {t("contact.heloc.credit.question")}
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.heloc.credit.body")}
        </p>
        {helocMicroLine}
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
          {t("contact.heloc.skip")}
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
          {t("contact.heloc.timeline.question")}
        </h2>
        {helocMicroLine}
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
          {t("contact.heloc.skip")}
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
    address: data.address.trim() || null,
    propertyValue: parseCurrencyDigits(data.propertyValueStr),
    mortgageBalance: parseCurrencyDigits(data.mortgageBalanceStr),
    desiredAccess: data.desiredAccess.trim() || null,
    creditProfile: data.creditProfile.trim() || null,
    timeline: data.timeline.trim() || null,
  };
  return JSON.stringify(payload);
}
