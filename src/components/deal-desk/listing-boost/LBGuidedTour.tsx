import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK } from "../../../hooks/useListingBoostMath";
import { LBTourHighlight } from "./LBTourHighlight";

export const LISTING_BOOST_TOUR_KEY = "ihl_listing_boost_tour_complete";

type StepMeta = {
  targetId: string;
  stepLabel: string;
  title: string;
  body: string;
};

const STEP_META: StepMeta[] = [
  {
    targetId: "lb-listing-inputs",
    stepLabel: "Step 1 of 5",
    title: "Start with the listing — including days on market",
    body: "Enter the list price, how long it's been sitting, and what the seller is willing to offer as a concession. The days on market field is important — it gets built directly into the agent script at the end so you have specific, data-driven language for the seller conversation. Estimates are fine for all fields.",
  },
  {
    targetId: "lb-pool-hero",
    stepLabel: "Step 2 of 5",
    title: "This number is your listing presentation moment",
    body: "The large percentage at the top is the single most powerful number to show a seller who is resisting concessions. It answers the question sellers actually care about: 'Will more buyers see my home?' Not 'what does a buydown cost me?' — that's secondary. Lead with the pool expansion, then explain the cost.",
  },
  {
    targetId: "lb-scenario-grid",
    stepLabel: "Step 3 of 5",
    title: "Three scenarios — always show all three",
    body: "Show the seller all three side by side — never just the option you're recommending. Sellers trust agents who present the full picture. The price cut is Scenario A: same rate, smaller loan, lower payment. The 2-1 Buydown is Scenario B: full price, lower rate for two years, bigger Year 1 payment relief. The 1-0 Buydown is Scenario C: one year of relief at lower cost. Watch how the Year 1 payment and the net proceeds tell the real story.",
  },
  {
    targetId: "lb-pool-bars",
    stepLabel: "Step 4 of 5",
    title: "The bars show the buyer pool in visual terms",
    body: "Most sellers have never seen their buyer pool represented this way. The qualifying income threshold is the invisible barrier that keeps buyers out — and the bars show exactly how each scenario moves that barrier. The longer the bar, the more of the local buyer pool qualifies. Use this to show the seller that a concession isn't a giveaway — it's a marketing strategy that brings more buyers to the door.",
  },
  {
    targetId: "lb-agent-script",
    stepLabel: "Step 5 of 5",
    title: "Use the script — it's already written for this listing",
    body: "The agent script at the bottom is pre-filled with the exact numbers from this listing — days on market, income thresholds, pool expansion percentages, and net proceeds comparison. You don't need to memorize anything. Read it to the seller, or use it as your talking points. Every number is specific to their situation, which is what makes it persuasive.",
  },
];

function buildScript(stepIndex: number, r: ListingBoostResults): string {
  const poolGainDisplay = r.poolGain > 0 ? r.poolGain : 0;
  const poolDeltaBC = r.poolB - r.poolCurrent;

  switch (stepIndex) {
    case 0:
      return `"I want to show you something about your listing. You've been on the market ${r.dom} days, and I've been thinking about why we haven't had the right offer yet. I ran the numbers through a tool that shows exactly what's happening with your buyer pool — and more importantly, what we can do about it."`;
    case 1:
      return `"See this number? With a seller-funded buydown, ${poolGainDisplay}% more buyers qualify for your home than qualify today. That's not a projection — that's the math on what the lower qualifying income threshold does to the local buyer pool. More buyers means more offers. More offers means you have leverage back."`;
    case 2:
      return `"Here are three ways we can use that ${fmtK(r.budget)} you're willing to offer. Option A cuts the price. Options B and C fund a buydown — same dollars, different mechanism, bigger impact on the buyer's monthly payment and your net proceeds."`;
    case 3:
      return `"Look at the difference between today and the 2-1 Buydown scenario. Today, you need ${fmtK(r.incCurrent)} in household income to qualify. With the buydown, you only need ${fmtK(r.incB)}. That's ${fmtK(r.incDropB)} less income required — which opens your home to ${poolDeltaBC >= 0 ? "+" : ""}${poolDeltaBC}% more of the buyers actively looking in this market right now."`;
    case 4:
      return `"Let me walk you through what the numbers actually say about your listing..." [Then read or reference the auto-generated script below — it's already written with your listing's specific data.]`;
    default:
      return "";
  }
}

type Props = {
  mainContentRef: RefObject<HTMLElement | null>;
  replayToken: number;
  onActiveChange?: (active: boolean) => void;
  results: ListingBoostResults;
};

export function LBGuidedTour({ mainContentRef, replayToken, onActiveChange, results }: Props) {
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
      typeof window !== "undefined" ? localStorage.getItem(LISTING_BOOST_TOUR_KEY) : "true";
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
        localStorage.setItem(LISTING_BOOST_TOUR_KEY, "true");
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
      <LBTourHighlight targetId={step.targetId} active={tourActive} />
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
