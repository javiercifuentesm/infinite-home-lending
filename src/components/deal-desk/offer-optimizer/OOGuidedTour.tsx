import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import { OOTourHighlight } from "./OOTourHighlight";

export const OFFER_OPTIMIZER_TOUR_KEY = "ihl_offer_optimizer_tour_complete";

type Step = {
  targetId: string;
  stepLabel: string;
  title: string;
  body: string;
  script: string;
};

const STEPS: Step[] = [
  {
    targetId: "oo-concession-section",
    stepLabel: "Step 1 of 5",
    title: "Start with the seller's concession budget",
    body: "Enter the total dollars your seller is willing to put toward closing. This is the amount you're going to model as either a price cut or a buydown — same dollar amount, very different impact on the buyer's monthly payment. The rest of the tool flows from this single number.",
    script: `"Before we pick a number, let me show you what $15,000 does two different ways. Because a $15,000 price cut and a $15,000 buydown are not the same thing for your buyer — and by the end of this, you'll see exactly why."`,
  },
  {
    targetId: "oo-buydown-selector",
    stepLabel: "Step 2 of 5",
    title: "Choose your buydown structure",
    body: "The 2-1 Buydown is the most common structure in today's MD-DC-VA market — it reduces the buyer's rate by 2% in Year 1 and 1% in Year 2, then resets to the market rate. Try each option to model different scenarios. The 2-1 gives the most dramatic Year 1 payment relief; the permanent buydown maximizes long-term savings but costs the seller more upfront.",
    script:
      '"With a 2-1 buydown, your buyer\'s first-year payment drops by almost $400 a month. That\'s real breathing room right when they\'re moving in and expenses are highest. And it costs the seller the same as a price cut."',
  },
  {
    targetId: "oo-dual-panel",
    stepLabel: "Step 3 of 5",
    title: "Lead with the Year 1 payment — not the rate",
    body: "The navy panel (Scenario B) shows the number you lead with in buyer conversations. Don't say 'the rate is 4.875%' — say 'your first-year payment is $2,847 a month.' Buyers understand payments. They don't intuitively understand rate differentials. The comparison panel on the left shows what a straight price cut delivers with the same seller dollars.",
    script:
      '"See this number right here? That\'s your payment for all of Year 1. The price cut gives you this number over here. Same seller dollars — look at the difference. Which number would you want to put in your offer package?"',
  },
  {
    targetId: "oo-net-proceeds",
    stepLabel: "Step 4 of 5",
    title: "Show sellers they net MORE with the buydown",
    body: "This is the listing presentation moment most agents miss. Because the seller is contributing to a closing cost — not cutting their sale price — their commission and transfer tax are calculated on the full asking price. The result: a seller-funded buydown almost always nets the seller more money than a price cut of the same amount. This is the insight that wins hesitant sellers.",
    script:
      '"Here\'s what I want you to pay attention to. The price cut nets you this amount. The buydown nets you this amount. You\'re giving the buyer a lower payment AND walking away with more money. That\'s the reason I\'m recommending we go this route."',
  },
  {
    targetId: "oo-partnership-cta",
    stepLabel: "Step 5 of 5",
    title: "Close with a pre-approval that references the structure",
    body: "Once you've presented this analysis, the natural next step is a pre-approval letter from IHL that specifically references the buydown structure. This transforms your offer package from a price and a generic letter into a complete financial story — with the monthly payment math already done for the seller's agent and their client.",
    script:
      '"I\'m going to have my lender issue a pre-approval that shows exactly what this buyer qualifies for under this buydown structure. Your offer goes in with everything already explained. The seller\'s agent won\'t have questions."',
  },
];

type Props = {
  mainContentRef: RefObject<HTMLElement | null>;
  replayToken: number;
  onActiveChange?: (active: boolean) => void;
};

export function OOGuidedTour({ mainContentRef, replayToken, onActiveChange }: Props) {
  const titleId = useId();
  const [tourActive, setTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sheetEntered, setSheetEntered] = useState(false);
  const skipRef = useRef<HTMLButtonElement | null>(null);

  const notifyActive = useCallback(
    (active: boolean) => {
      onActiveChange?.(active);
    },
    [onActiveChange],
  );

  useEffect(() => {
    const completed = typeof window !== "undefined" ? localStorage.getItem(OFFER_OPTIMIZER_TOUR_KEY) : "true";
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
        localStorage.setItem(OFFER_OPTIMIZER_TOUR_KEY, "true");
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
    if (currentStep < STEPS.length - 1) {
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

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  if (!tourActive) {
    return null;
  }

  return (
    <>
      <OOTourHighlight targetId={step.targetId} active={tourActive} />
      <div
        className="fixed inset-0 z-[9998] bg-[rgba(11,42,74,0.72)] transition-opacity duration-300 ease-out"
        style={{ opacity: sheetEntered ? 1 : 0 }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center p-0 sm:px-4"
        role="presentation"
      >
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
              {STEPS.map((_, i) => {
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
            <h2 id={titleId} className="mt-1 font-[Georgia,serif] text-[17px] font-medium leading-[1.3] text-[var(--color-text-primary,#0B2A4A)]">
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
              {currentStep + 1} of {STEPS.length}
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
