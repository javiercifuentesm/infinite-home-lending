import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import {
  getCitiesForDCArea,
  DC_AREA_KEYS,
} from "../../data/purchaseLocations";
import { useLanguage } from "../../i18n/LanguageContext";

export type PurchaseFlowStep = "inactive" | "intro" | "property" | "price" | "down" | "credit" | "complete";

export type PurchaseDataState = {
  hasProperty: boolean | null;
  address: string;
  /** Structured location when “still exploring” — DC only (licensed market). */
  locationState: "" | "DC";
  locationCounty: string;
  locationCity: string;
  purchasePriceStr: string;
  downPaymentType: "dollar" | "percent";
  downPaymentStr: string;
  creditRange: string;
};

export const initialPurchaseData = (): PurchaseDataState => ({
  hasProperty: null,
  address: "",
  locationState: "",
  locationCounty: "",
  locationCity: "",
  purchasePriceStr: "",
  downPaymentType: "dollar",
  downPaymentStr: "",
  creditRange: "",
});

/** Spec: digits only → $ + toLocaleString */
export function formatCurrency(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (!cleaned) return "";
  return "$" + Number(cleaned).toLocaleString();
}

function countDigitsBeforeCursor(value: string, caret: number): number {
  return value.slice(0, caret).replace(/\D/g, "").length;
}

function caretAfterDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return formatted.startsWith("$") ? 1 : 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

export function formatPercentInput(raw: string): string {
  let cleaned = raw.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
  const n = parseFloat(cleaned);
  if (Number.isFinite(n) && n > 100) return "100";
  return cleaned;
}

type CurrencyInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  "aria-label"?: string;
};

export function CurrencyInput({ id, name, value, onChange, placeholder, "aria-label": ariaLabel }: CurrencyInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const pendingCaretDigits = useRef<number | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const caret = el.selectionStart ?? 0;
    pendingCaretDigits.current = countDigitsBeforeCursor(el.value, caret);
    onChange(formatCurrency(el.value));
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || pendingCaretDigits.current === null) return;
    const digits = pendingCaretDigits.current;
    pendingCaretDigits.current = null;
    const pos = caretAfterDigitCount(value, digits);
    el.setSelectionRange(pos, pos);
  }, [value]);

  return (
    <input
      ref={ref}
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)] tabular-nums"
    />
  );
}

const skipBtnClass =
  "purchase-skip-btn w-full border-0 bg-transparent p-2 font-sans text-[13px] text-[#6B7280] transition-colors hover:text-[#0B2A4A]";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

type Props = {
  purchaseFlowStep: Exclude<PurchaseFlowStep, "inactive" | "complete">;
  purchaseData: PurchaseDataState;
  setPurchaseData: Dispatch<SetStateAction<PurchaseDataState>>;
  stepMotion: StepMotion;
  reducedMotion: boolean;
  onSkip: () => void;
};

/**
 * Progressive purchase-intent questions — only when reason is “buy”.
 * All fields optional; same card/input styling as main contact flow.
 */
export function PurchasePathStep({ purchaseFlowStep, purchaseData, setPurchaseData, stepMotion, reducedMotion, onSkip }: Props) {
  const { t } = useLanguage();

  const PROPERTY_OPTIONS = [
    { id: true, label: t("contact.purchase.property.yes") },
    { id: false, label: t("contact.purchase.property.no") },
  ];

  const CREDIT_OPTIONS = [
    { id: "excellent", label: t("contact.purchase.credit.excellent") },
    { id: "good", label: t("contact.purchase.credit.good") },
    { id: "fair", label: t("contact.purchase.credit.fair") },
    { id: "unsure", label: t("contact.purchase.credit.unsure") },
  ];

  const microLine = (
    <p className="mx-auto max-w-[32rem] px-2 text-center font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
      {t("contact.purchase.microLine")}
    </p>
  );

  const inputClass =
    "purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)]";

  if (purchaseFlowStep === "intro") {
    return (
      <motion.div id="purchase-flow-intro" key="purchase-intro" className="form-step space-y-6" {...stepMotion}>
        <p className="mx-auto max-w-[34rem] text-center font-sans text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
          {t("contact.purchase.intro.body1")}
          <span className="mt-2 block text-slate-500/95">{t("contact.purchase.intro.body2")}</span>
        </p>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.purchase.skip")}
        </button>
      </motion.div>
    );
  }

  if (purchaseFlowStep === "property") {
    return (
      <motion.div id="purchase-flow-property" key="purchase-property" className="form-step space-y-5" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.purchase.property.question")}
        </h2>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {PROPERTY_OPTIONS.map((opt) => (
            <button
              key={String(opt.id)}
              type="button"
              onClick={() =>
                setPurchaseData((d) => ({
                  ...d,
                  hasProperty: opt.id,
                  ...(opt.id === true
                    ? { locationState: "" as const, locationCounty: "", locationCity: "" }
                    : { address: "" }),
                }))
              }
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                purchaseData.hasProperty === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {purchaseData.hasProperty === true ? (
            <motion.div
              id="purchase-anchor-address"
              key="addr"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="option-group mx-auto w-full max-w-[520px] space-y-2 text-left"
            >
              <label htmlFor="sc-purchase-address" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {t("contact.purchase.property.address.label")}{" "}
                <span className="font-normal text-slate-400">{t("contact.purchase.property.address.optional")}</span>
              </label>
              <input
                id="sc-purchase-address"
                name="purchaseAddress"
                type="text"
                autoComplete="street-address"
                value={purchaseData.address}
                onChange={(e) => setPurchaseData((d) => ({ ...d, address: e.target.value }))}
                placeholder={t("contact.purchase.property.address.placeholder")}
                className={`${inputClass} text-center`}
              />
            </motion.div>
          ) : null}
          {purchaseData.hasProperty === false ? (
            <motion.div
              id="purchase-anchor-location"
              key="loc"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="option-group mx-auto w-full max-w-[520px] space-y-6"
            >
              <h3 className="text-balance text-center font-heading text-base font-semibold text-[#0B2A4A] sm:text-lg">
                {t("contact.purchase.property.where.question")}
              </h3>
              <p className="text-center font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                {t("contact.purchase.property.where.body")}
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPurchaseData((d) => ({
                      ...d,
                      locationState: "DC",
                      locationCounty: "",
                      locationCity: "",
                    }))
                  }
                  className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                    purchaseData.locationState === "DC" ? "card-option--selected" : ""
                  }`}
                >
                  District of Columbia
                </button>
              </div>
              <p className="text-center font-sans text-[12px] leading-relaxed text-slate-500">
                {t("contact.purchase.property.expanding")}
              </p>

              <AnimatePresence mode="wait">
                {purchaseData.locationState === "DC" ? (
                  <motion.div
                    id="purchase-anchor-county"
                    key="county-layer"
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                    className="space-y-3"
                  >
                    <h4 className="text-center font-heading text-[15px] font-semibold text-[#0B2A4A] sm:text-base">
                      {t("contact.purchase.property.county.question")}
                    </h4>
                    <label htmlFor="sc-purchase-county" className="sr-only">
                      DC area (optional)
                    </label>
                    <select
                      id="sc-purchase-county"
                      name="purchaseCounty"
                      value={purchaseData.locationCounty}
                      onChange={(e) =>
                        setPurchaseData((d) => ({
                          ...d,
                          locationCounty: e.target.value,
                          locationCity: "",
                        }))
                      }
                      className="time-picker w-full"
                      aria-label="DC area (optional)"
                    >
                      <option value="">{t("contact.purchase.property.county.placeholder")}</option>
                      {DC_AREA_KEYS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {purchaseData.locationState === "DC" && purchaseData.locationCounty ? (
                  <motion.div
                    id="purchase-anchor-city"
                    key="city-layer"
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                    className="space-y-3"
                  >
                    <h4 className="text-center font-heading text-[15px] font-semibold text-[#0B2A4A] sm:text-base">
                      {t("contact.purchase.property.city.question")}
                    </h4>
                    <label htmlFor="sc-purchase-city-select" className="sr-only">
                      Neighborhood (optional)
                    </label>
                    <select
                      id="sc-purchase-city-select"
                      name="purchaseCitySelect"
                      value={purchaseData.locationCity}
                      onChange={(e) => setPurchaseData((d) => ({ ...d, locationCity: e.target.value }))}
                      className="time-picker w-full"
                      aria-label="Neighborhood (optional)"
                    >
                      <option value="">{t("contact.purchase.property.city.placeholder")}</option>
                      {getCitiesForDCArea(purchaseData.locationCounty).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.purchase.skip")}
        </button>
      </motion.div>
    );
  }

  if (purchaseFlowStep === "price") {
    return (
      <motion.div id="purchase-flow-price" key="purchase-price" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.purchase.price.question")}
        </h2>
        {microLine}
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-purchase-price" className="sr-only">
            Purchase price range (optional)
          </label>
          <CurrencyInput
            id="sc-purchase-price"
            name="purchasePriceInput"
            value={purchaseData.purchasePriceStr}
            onChange={(next) => setPurchaseData((d) => ({ ...d, purchasePriceStr: next }))}
            placeholder="$450,000"
            aria-label="Purchase price range (optional)"
          />
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.purchase.skip")}
        </button>
      </motion.div>
    );
  }

  if (purchaseFlowStep === "down") {
    const isDollar = purchaseData.downPaymentType === "dollar";
    return (
      <motion.div id="purchase-flow-down" key="purchase-down" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.purchase.down.question")}
        </h2>
        <p className="mx-auto max-w-[28rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.purchase.down.body")}
        </p>
        {microLine}
        <div className="mx-auto flex max-w-[320px] justify-center gap-2">
          <button
            type="button"
            onClick={() => setPurchaseData((d) => ({ ...d, downPaymentType: "dollar", downPaymentStr: "" }))}
            className={`min-h-[44px] min-w-[52px] rounded-lg border px-4 font-sans text-[13px] font-semibold transition-colors ${
              isDollar
                ? "border-[#C6A15B] bg-[#C6A15B]/10 text-[#0B2A4A]"
                : "border-[#E5E7EB] bg-white text-slate-600 hover:border-slate-300"
            }`}
            aria-pressed={isDollar}
          >
            $
          </button>
          <button
            type="button"
            onClick={() => setPurchaseData((d) => ({ ...d, downPaymentType: "percent", downPaymentStr: "" }))}
            className={`min-h-[44px] min-w-[52px] rounded-lg border px-4 font-sans text-[13px] font-semibold transition-colors ${
              !isDollar
                ? "border-[#C6A15B] bg-[#C6A15B]/10 text-[#0B2A4A]"
                : "border-[#E5E7EB] bg-white text-slate-600 hover:border-slate-300"
            }`}
            aria-pressed={!isDollar}
          >
            %
          </button>
        </div>
        <div className="option-group mx-auto w-full max-w-[320px]">
          <label htmlFor="sc-purchase-down" className="sr-only">
            Down payment (optional)
          </label>
          {isDollar ? (
            <CurrencyInput
              id="sc-purchase-down"
              name="purchaseDownInput"
              value={purchaseData.downPaymentStr}
              onChange={(next) => setPurchaseData((d) => ({ ...d, downPaymentStr: next }))}
              placeholder="$50,000"
              aria-label="Down payment in dollars (optional)"
            />
          ) : (
            <input
              id="sc-purchase-down"
              name="purchaseDownPercentInput"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={purchaseData.downPaymentStr}
              onChange={(e) => setPurchaseData((d) => ({ ...d, downPaymentStr: formatPercentInput(e.target.value) }))}
              placeholder="10%"
              aria-label="Down payment as percent (optional)"
              className="purchase-input-field w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-center font-sans text-navy outline-none transition-colors focus:border-[#C6A15B] focus:shadow-[0_0_0_2px_rgba(198,161,91,0.15)] tabular-nums"
            />
          )}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.purchase.skip")}
        </button>
      </motion.div>
    );
  }

  if (purchaseFlowStep === "credit") {
    return (
      <motion.div id="credit-step" key="purchase-credit" className="form-step space-y-4" {...stepMotion}>
        <h2 className="text-balance text-center font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          {t("contact.purchase.credit.question")}
        </h2>
        <p className="mx-auto max-w-[30rem] text-center font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
          {t("contact.purchase.credit.body")}
        </p>
        {microLine}
        <div className="option-group grid grid-cols-1 gap-3">
          {CREDIT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPurchaseData((d) => ({ ...d, creditRange: opt.id }))}
              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                purchaseData.creditRange === opt.id ? "card-option--selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className={skipBtnClass} onClick={onSkip}>
          {t("contact.purchase.skip")}
        </button>
      </motion.div>
    );
  }

  return null;
}
