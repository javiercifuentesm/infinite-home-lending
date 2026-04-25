import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt, fmtK } from "../../../hooks/useAssumableMath";
import { ACTourHighlight } from "./ACTourHighlight";

export const ASSUMABLE_CALCULATOR_TOUR_KEY = "ihl_assumable_calculator_tour_complete";

type StepMeta = {
  targetId: string;
  stepLabel: string;
  title: string;
  body: string;
};

const STEP_META: StepMeta[] = [
  {
    targetId: "ac-loan-inputs",
    stepLabel: "Step 1 of 5",
    title: "Enter the existing loan — not the listing price",
    body: "The key inputs here are the assumed rate, remaining loan balance, and remaining term — not the original loan amount or purchase price. Ask the seller or listing agent directly: most MLS listings don't flag assumability. You may need to call the servicer or check the seller's mortgage statement. The rate and remaining balance are the two numbers that determine whether this deal makes financial sense.",
  },
  {
    targetId: "ac-worth-it",
    stepLabel: "Step 2 of 5",
    title: "Read the verdict first — it tells you where to focus",
    body: "Green means the assumption delivers strong, clear financial advantage — worth the extra complexity and longer timeline. Amber means the saving exists but may not justify the 45–90 day assumption process and dual-loan payment structure. Red means the gap financing is eating the rate benefit — a new loan may be simpler and comparably priced. The color tells you how hard to push this with your buyer.",
  },
  {
    targetId: "ac-dual-panel",
    stepLabel: "Step 3 of 5",
    title: "Two paths — show both before recommending one",
    body: "The left panel is the assumption path: the assumed loan payment plus the gap financing payment. The right panel is a new loan at today's market rate. Show your buyer both — never just the assumption. The honest comparison builds trust, and in most cases where the assumption is Green or Amber, the numbers speak for themselves. The monthly payment difference and the total cost over time are the two numbers to focus on.",
  },
  {
    targetId: "ac-gap-analysis",
    stepLabel: "Step 4 of 5",
    title: "The blended rate is the number that closes the deal",
    body: "The equity gap is the practical barrier most buyers get stuck on. They see a $150,000 gap and think it kills the deal. What they need to see is the blended rate — because even at 8-9% on the gap financing, the weighted average across both loans is often still well below what a new 30-year mortgage costs today. That blended rate number is the one you lead with when the buyer objects to the gap.",
  },
  {
    targetId: "ac-eligibility",
    stepLabel: "Step 5 of 5",
    title: "Know the rules — they vary by loan type",
    body: "VA, FHA, and USDA assumptions have different fee structures, eligibility requirements, and timeline expectations. VA loans can be assumed by non-veterans, but the seller's entitlement stays tied to the property. FHA assumptions inherit the MIP terms — sometimes an advantage. USDA requires the property to remain rural-eligible. The eligibility section updates for whichever loan type you entered. Read it carefully before presenting this strategy to a seller.",
  },
];

function buildScript(stepIndex: number, r: AssumableResults): string {
  switch (stepIndex) {
    case 0:
      return `"Do you know if this is an FHA or VA loan? And roughly what rate they locked in? I want to run a quick calculation to see if the assumption actually pencils out for your buyer — because the gap financing changes the math significantly."`;
    case 1: {
      if (r.worthIt === "yes") {
        return `"Here is where we land. The assumption is worth it — the math is clear."`;
      }
      if (r.worthIt === "marginal") {
        return `"Here is where we land. It is a modest advantage — worth a conversation but not a dealbreaker."`;
      }
      return `"Here is where we land. The numbers are tight — let us talk through whether a new loan makes more sense."`;
    }
    case 2:
      return `"Option A: you assume the existing loan at ${r.assumedRate.toFixed(3)}% and take out a second mortgage for the equity difference. Total monthly payment: ${fmt(r.totalAssumed)}. Option B: you get a new loan at today's ${r.mktRate.toFixed(3)}% rate. Monthly payment: ${fmt(r.totalNew)}. The difference is ${fmt(r.monthlySaving)} per month. Over the life of the loan, that is ${fmtK(r.lifetimeSaving)} in interest."`;
    case 3:
      return `"I know the equity gap looks big. But here is what the math actually says: even after financing that gap at ${r.gapRate.toFixed(3)}%, the blended rate across both loans is ${r.blendedRate.toFixed(3)}%. You cannot get that on a new loan today. That is the number that matters."`;
    case 4: {
      if (r.loanType === "va") {
        return `"Before we go any further, there are a couple of things we need to confirm with the servicer. The seller's entitlement situation, and whether your buyer qualifies to substitute it. IHL handles this regularly — let me get them on a call."`;
      }
      if (r.loanType === "fha") {
        return `"Before we go any further, there are a couple of things we need to confirm with the servicer. That the loan is current and the lender accepts assumption applications. IHL handles this regularly — let me get them on a call."`;
      }
      return `"Before we go any further, there are a couple of things we need to confirm with the servicer. The property's USDA eligibility and rural status, and whether the loan is current. IHL handles this regularly — let me get them on a call."`;
    }
    default:
      return "";
  }
}

type Props = {
  mainContentRef: RefObject<HTMLElement | null>;
  replayToken: number;
  onActiveChange?: (active: boolean) => void;
  results: AssumableResults;
};

export function ACGuidedTour({ mainContentRef, replayToken, onActiveChange, results }: Props) {
  const titleId = useId();
  const [tourActive, setTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sheetEntered, setSheetEntered] = useState(false);
  const skipRef = useRef<HTMLButtonElement | null>(null);

  const steps = useMemo(
    () =>
      STEP_META.map((meta, i) => ({
        ...meta,
        script: buildScript(i, results),
      })),
    [results],
  );

  const notifyActive = useCallback(
    (active: boolean) => {
      onActiveChange?.(active);
    },
    [onActiveChange],
  );

  useEffect(() => {
    const completed =
      typeof window !== "undefined" ? localStorage.getItem(ASSUMABLE_CALCULATOR_TOUR_KEY) : "true";
    if (!completed) {
      const t = window.setTimeout(() => {
        setTourActive(true);
        notifyActive(true);
      }, 600);
      return () => window.clearTimeout(t);
    }
  }, [notifyActive]);

  useEffect(() => {
    if (replayToken <= 0) return;
    setCurrentStep(0);
    setTourActive(true);
    notifyActive(true);
  }, [replayToken, notifyActive]);

  useEffect(() => {
    if (!tourActive) {
      setSheetEntered(false);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setSheetEntered(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [tourActive]);

  const prevFocus = useRef<HTMLElement | null>(null);

  const endTour = useCallback(
    (completed: boolean) => {
      setTourActive(false);
      setSheetEntered(false);
      notifyActive(false);
      if (completed) {
        localStorage.setItem(ASSUMABLE_CALCULATOR_TOUR_KEY, "true");
      }
      window.setTimeout(() => {
        const main = mainContentRef.current;
        if (main) {
          main.focus({ preventScroll: true });
        } else {
          prevFocus.current?.focus?.();
        }
      }, 0);
    },
    [mainContentRef, notifyActive],
  );

  useEffect(() => {
    if (!tourActive) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    window.setTimeout(() => skipRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        endTour(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourActive, endTour]);

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour(true);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  if (!tourActive) {
    return null;
  }

  return (
    <>
      <ACTourHighlight targetId={step.targetId} active={tourActive} />
      <div
        className="fixed inset-0 z-[9998] bg-[rgba(11,42,74,0.72)] transition-opacity duration-300 ease-out"
        style={{ opacity: sheetEntered ? 1 : 0 }}
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center p-0 sm:px-4" role="presentation">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`pointer-events-auto flex max-h-[60vh] w-full max-w-[680px] flex-col rounded-t-2xl bg-[var(--color-background-primary,#ffffff)] px-5 pb-7 pt-6 shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-sm:max-h-[60vh] max-sm:px-5 max-sm:pb-6 max-sm:pt-5 sm:px-7 ${
            sheetEntered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="relative shrink-0">
            <div className="mb-4 flex justify-center gap-1.5">
              {steps.map((_, i) => {
                let state: "done" | "active" | "pending";
                if (i < currentStep) state = "done";
                else if (i === currentStep) state = "active";
                else state = "pending";
                return (
                  <span
                    key={i}
                    className="h-1 w-7 rounded-full transition-colors duration-300 ease-out"
                    style={{
                      background:
                        state === "done"
                          ? "#C6A15B"
                          : state === "active"
                            ? "#0B2A4A"
                            : "var(--color-border-secondary, #e2e8f0)",
                    }}
                    aria-hidden
                  />
                );
              })}
            </div>
            <button
              ref={skipRef}
              type="button"
              onClick={() => endTour(false)}
              className="absolute right-0 top-0 font-sans text-[11px] text-[var(--color-text-tertiary,#64748b)] underline decoration-[var(--color-text-tertiary,#64748b)]/50 underline-offset-2"
            >
              Skip tour
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-[#C6A15B]">{step.stepLabel}</p>
            <h2
              id={titleId}
              className="mt-1 font-[Georgia,serif] text-[17px] font-medium leading-[1.3] text-[var(--color-text-primary,#0B2A4A)]"
            >
              {step.title}
            </h2>
            <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[var(--color-text-secondary,#475569)] max-sm:text-[13px]">
              {step.body}
            </p>
            <div
              className="mt-4 rounded-r-md border-l-[3px] border-[#C6A15B] py-[0.65rem] pl-[0.85rem] pr-[0.85rem]"
              style={{ background: "rgba(11,42,74,0.05)" }}
            >
              <p className="font-sans text-[10px] uppercase tracking-wide text-[#C6A15B]">📋 Realtor script</p>
              <p className="mt-1 font-[Georgia,serif] text-[13px] italic leading-[1.55] text-[#0B2A4A] max-sm:text-[12px]">
                {step.script}
              </p>
            </div>
          </div>

          <div className="mt-4 flex shrink-0 items-center justify-between gap-3 border-t border-slate-100/80 pt-4">
            <span className="font-sans text-[12px] text-slate-500">
              {currentStep + 1} of {steps.length}
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-md border border-[#0B2A4A] bg-white px-4 py-2 font-sans text-[13px] font-medium text-[#0B2A4A] transition-colors hover:bg-slate-50"
                >
                  Back
                </button>
              ) : (
                <span className="w-0 min-w-0 sm:w-[4.5rem]" aria-hidden />
              )}
              {isLast ? (
                <button
                  type="button"
                  onClick={() => endTour(true)}
                  className="rounded-md bg-[#C6A15B] px-4 py-2 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#b48e48]"
                >
                  Finish tour ✓
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md bg-[#0B2A4A] px-4 py-2 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#0a2340]"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
