import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import { CQTourHighlight } from "./CQTourHighlight";

export const CLIENT_QUALIFIER_TOUR_KEY = "ihl_client_qualifier_tour_complete";

type Step = {
  targetId: string;
  stepLabel: string;
  title: string;
  body: string;
  script: string;
};

const STEPS: Step[] = [
  {
    targetId: "cq-buyer-inputs",
    stepLabel: "Step 1 of 5",
    title: "Enter what you know — estimates are fine",
    body: "You don't need the buyer's tax returns to run this tool. Approximate income, a rough sense of their monthly debt load, and a credit score range are enough to get a meaningful snapshot. The tool is built for deal strategy, not underwriting precision. Round numbers work perfectly.",
    script: `"Before we go look at anything, I want to run your numbers through a quick qualification snapshot. It takes about 90 seconds and tells me exactly what price range makes sense for you — so we don't waste time falling in love with something that doesn't work financially."`,
  },
  {
    targetId: "cq-traffic-light",
    stepLabel: "Step 2 of 5",
    title: "Read the traffic light first — it tells you everything",
    body: "Green means show homes with confidence — this buyer qualifies at their target today. Yellow means they're close — 30 to 60 days and the right loan structure gets them there. Red means they need a plan, not a showing schedule. The color you see here dictates the entire conversation that follows.",
    script: `"Here's where we are. [Green: You're qualified — let's go find your home.] [Yellow: You're 30–60 days away — here's the plan.] [Red: You're further out, but here's exactly what we do about it.]"`,
  },
  {
    targetId: "cq-loan-engine",
    stepLabel: "Step 3 of 5",
    title: "The loan type changes everything — especially for VA buyers",
    body: "The recommended loan type isn't just a label — it changes the down payment required, whether PMI applies, and the rate the buyer qualifies at. VA-eligible buyers have a massive advantage most agents don't fully leverage: 0% down, no PMI, competitive rate. If your buyer has served, this is the first conversation to have.",
    script: `"Based on your situation, the strongest loan for you is [loan type]. Here's why that matters for your down payment and monthly cost..." [For VA:] "Your military service gives you access to a VA loan — that's 0% down, no monthly mortgage insurance, and a competitive rate. This changes your entire offer strategy."`,
  },
  {
    targetId: "cq-payment-range",
    stepLabel: "Step 4 of 5",
    title: "Show the payment range — not just the price",
    body: "Buyers think in purchase prices. Sellers think in purchase prices. But what actually determines whether a buyer can afford a home is the monthly payment — principal, interest, taxes, insurance, and PMI if applicable. This range gives you the real number to use in the conversation. Lead with this, not the price.",
    script: `"At your target price, your all-in monthly payment would be somewhere between [low] and [high] — depending on how much you put down. That range is what we're working with. Does that fit your monthly budget?"`,
  },
  {
    targetId: "cq-action-plan",
    stepLabel: "Step 5 of 5",
    title: "Use the action plan to set a timeline — not just expectations",
    body: "Every item in this plan has a dollar consequence and a time estimate attached. This is what separates a good buyer conversation from a great one: instead of 'you need to improve your credit,' you're saying 'moving your score from 660 to 700 drops your rate by 0.375% and adds $28,000 in buying power — and here's how to get there in 60 days.' Specific plans create committed clients.",
    script: `"Here's the specific plan to get you to where you need to be. [Item 1]. [Item 2]. If you do these things, you're ready to make a competitive offer in [timeline]. I'm going to connect you with my lender at IHL — they'll walk you through each step at no cost."`,
  },
];

type Props = {
  mainContentRef: RefObject<HTMLElement | null>;
  replayToken: number;
  onActiveChange?: (active: boolean) => void;
};

export function CQGuidedTour({ mainContentRef, replayToken, onActiveChange }: Props) {
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
    const completed =
      typeof window !== "undefined" ? localStorage.getItem(CLIENT_QUALIFIER_TOUR_KEY) : "true";
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
        localStorage.setItem(CLIENT_QUALIFIER_TOUR_KEY, "true");
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
      <CQTourHighlight targetId={step.targetId} active={tourActive} />
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
