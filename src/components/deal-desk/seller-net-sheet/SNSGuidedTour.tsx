import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { SellerNetResults } from "../../../hooks/useSellerNetMath";
import { fmt, fmtK } from "../../../hooks/useSellerNetMath";
import { SNSTourHighlight } from "./SNSTourHighlight";

export const SELLER_NET_SHEET_TOUR_KEY = "ihl_seller_net_sheet_tour_complete";

type StepMeta = {
  targetId: string;
  stepLabel: string;
  title: string;
  body: string;
};

const STEP_META: StepMeta[] = [
  {
    targetId: "sns-property-inputs",
    stepLabel: "Step 1 of 5",
    title: "Build this before the listing appointment — not during it",
    body: "The Seller Net Sheet is the one Deal Desk tool you prepare in advance. Run it the night before the listing appointment using the price you plan to recommend and the payoff amount the seller shared with you. Walk in with the numbers already done — printed or pulled up on your phone. That preparation signals professionalism before you say a single word about price.",
  },
  {
    targetId: "sns-jurisdiction",
    stepLabel: "Step 2 of 5",
    title: "Select the jurisdiction — this is where most tools get it wrong",
    body: "Transfer taxes in MD-DC-VA are not the same — not even close. A seller in Montgomery County pays roughly 1.0–1.5% in combined transfer and recordation taxes. A seller in Northern Virginia pays 0.25%. A DC seller pays 1.1% or 1.45% depending on whether the sale price is above or below $400,000. On a $600,000 sale, the difference between NoVA and Montgomery County is more than $7,000 in the seller's pocket. Generic calculators use one national average. This tool uses the real number for the actual jurisdiction.",
  },
  {
    targetId: "sns-scenario-hero",
    stepLabel: "Step 3 of 5",
    title: "Three scenarios — the seller's decision framework",
    body: "The three cards at the top tell the seller's entire story in one glance. The left card is their best case — full asking price. The middle card shows what a 3% negotiated discount actually costs them in real dollars. The right card shows the floor at 5% below. Most sellers have never seen these three numbers side by side before you walk in the door. This comparison is the frame for every offer conversation you will have with them for the life of the listing.",
  },
  {
    targetId: "sns-net-sheet-table",
    stepLabel: "Step 4 of 5",
    title: "Walk through the table line by line — no surprises at closing",
    body: "The itemized table shows every dollar that leaves the seller's proceeds before they get their check. Walk them through each line at the listing appointment. The transfer tax line is often the biggest surprise — especially in Maryland, where combined transfer and recordation taxes on a $600,000 home can run $7,000–$9,000. Showing it here prevents a shocked seller at the closing table — and positions you as the most prepared agent they have ever worked with.",
  },
  {
    targetId: "sns-agent-script",
    stepLabel: "Step 5 of 5",
    title: "The script — already written with your listing's numbers",
    body: "The agent script at the bottom is pre-filled with this listing's exact figures — asking price, three-scenario net proceeds, and the dollar cost of each percentage point conceded. Read it directly to the seller or use it as your talking points. It sets the right frame for the entire listing relationship: every negotiation decision comes back to protecting that bottom-line number. This is the sentence that closes the listing presentation.",
  },
];

function buildScript(stepIndex: number, r: SellerNetResults): string {
  const { ask, below3, below5, diff3, diff5, jurisdictionName } = r;
  switch (stepIndex) {
    case 0:
      return `"Before we meet tomorrow, I put together something for you. I ran your home through a net sheet tool using the price range I am thinking about recommending — so you can see exactly what you will walk away with at different price points before we talk about listing strategy."`;
    case 1:
      return `"Your property is in ${jurisdictionName}, so the transfer tax line reflects the actual rate for your jurisdiction. In ${jurisdictionName}, that comes to approximately ${fmt(ask.transferTax)} on your asking price. This is one of the things most agents do not show until after you are under contract — I prefer to show it now so there are no surprises."`;
    case 2:
      return `"See these three numbers? At your asking price, you walk away with ${fmtK(ask.net)}. If we accept an offer 3% below, that drops to ${fmtK(below3.net)} — a real difference of ${fmtK(diff3)} in your pocket. Five percent below gets you ${fmtK(below5.net)}. Every offer we discuss from here comes back to this table."`;
    case 3:
      return `"Let me walk you through each line so there are no surprises at closing. The big ones are your mortgage payoff, the commission, and the transfer tax — which in ${jurisdictionName} comes to approximately ${fmt(ask.transferTax)}. Add title fees and your tax proration, and that brings your total deductions to ${fmt(ask.totalDeductions)}. What is left is yours."`;
    case 4:
      return `"Before we talk about what price to list at, I want to make sure you understand what each number actually means for your bottom line..." [Then walk through the auto-generated script — it is already written with your listing's specific numbers and real jurisdiction taxes.]`;
    default:
      return "";
  }
}

type Props = {
  mainContentRef: RefObject<HTMLElement | null>;
  replayToken: number;
  onActiveChange?: (active: boolean) => void;
  results: SellerNetResults;
};

export function SNSGuidedTour({ mainContentRef, replayToken, onActiveChange, results }: Props) {
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
    const completed = typeof window !== "undefined" ? localStorage.getItem(SELLER_NET_SHEET_TOUR_KEY) : "true";
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
        localStorage.setItem(SELLER_NET_SHEET_TOUR_KEY, "true");
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
      <SNSTourHighlight targetId={step.targetId} active={tourActive} />
      <div
        className="print:hidden fixed inset-0 z-[9998] bg-[rgba(11,42,74,0.72)] transition-opacity duration-300 ease-out"
        style={{ opacity: sheetEntered ? 1 : 0 }}
        aria-hidden
      />
      <div className="print:hidden pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center p-0 sm:px-4" role="presentation">
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
