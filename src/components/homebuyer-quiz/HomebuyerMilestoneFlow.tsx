import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { formatCurrency } from "../../lib/financialReality/engine";
import { computeFromQuickInputs, normalizeRentMonthly } from "../../lib/financialReality/quickFlow";
import { buildShockOutcome, type ShockImpactLevel } from "../../lib/financialReality/shockOutcomeEngine";
import { PAGE_CONTENT_RAIL_CLASS } from "../../constants/layout";
import { FlagshipCtaPrimary, FlagshipCtaPrimaryButton } from "./FlagshipCta";
import { QuizShareButton } from "./QuizShareButton";

const DEFAULT_TIMING_IDX = 1;
/** 0 hero → 1 input → 2 side-by-side → 3–6 story → 7 winner → 8 CTA */
const TOTAL_STEPS = 9;
const FINAL_INDEX = TOTAL_STEPS - 1;
/** Progress: hero + input (2) + 7 beats + final */
const PROGRESS_TOTAL = 10;

const RENT_PRESETS = [1600, 2000, 2500, 3200, 4000, 4800] as const;
const INCOME_OPTIONS = [
  { label: "Under $75K", idx: 0 },
  { label: "$75K–$125K", idx: 1 },
  { label: "$125K–$200K", idx: 2 },
  { label: "$200K+", idx: 3 },
] as const;

/** Derived numbers for discovery modals — no manual math in UI */
function useDerivedImpact(outcome: FinancialRealityOutcome | null) {
  return useMemo(() => {
    if (!outcome) return null;
    const c = outcome.consequence;
    const t = outcome.consequenceTracker;
    const monthlyRent = c.monthly_loss_estimate;
    const yearlyRent = Math.round(monthlyRent * 12);
    const fiveYearRent = Math.round(monthlyRent * 12 * 5);
    const yearlyLeak = t.yearlyLossApprox;
    const fiveYearLeakIllustrative = Math.round(yearlyLeak * 5);
    const equity5 = t.scenarios[0]?.equityGainedFiveYear ?? 0;
    const monthlyImpact = t.totalMonthlyImpact;
    return {
      monthlyRent,
      yearlyRent,
      fiveYearRent,
      yearlyLeak,
      fiveYearLeakIllustrative,
      equity5,
      monthlyImpact,
      yearlyImpact: yearlyLeak,
      components: {
        missedEquity: t.monthlyMissedEquity,
        rentLost: t.monthlyRentLost,
        priceDrift: t.monthlyPriceDrift,
      },
      sixMonthBurn: t.sixMonthCostIllustrative,
    };
  }, [outcome]);
}

type DerivedImpact = NonNullable<ReturnType<typeof useDerivedImpact>>;

/** Optional curiosity paths — 2–3 steps, modal UI */
export type DiscoveryPathId = "baseline" | "rent-tally" | "leak-breakdown" | "equity-model" | "pressure-stack";

type DiscoveryStep = { kicker: string; title: string; body: ReactNode };

export function discoveryPathIdForMainStep(stepIndex: number): DiscoveryPathId | null {
  if (stepIndex === 0) return null;
  if (stepIndex === 1 || stepIndex === 3 || stepIndex === 4) return "baseline";
  if (stepIndex === 2) return "equity-model";
  if (stepIndex === 5) return "leak-breakdown";
  if (stepIndex === 6) return "equity-model";
  if (stepIndex === 7) return "pressure-stack";
  return null;
}

export const DISCOVERY_TRIGGERS: Record<DiscoveryPathId, string> = {
  baseline: "Where does that number come from?",
  "rent-tally": "Show me the rent stack again",
  "leak-breakdown": "Break down the leak for me",
  "equity-model": "How did you get this equity number?",
  "pressure-stack": "Show me how the loss stacks",
};

function MicroReward({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-400/35"
          aria-hidden
        >
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function getProgressSegment(args: { stepIndex: number; revealed: boolean }): number {
  const { stepIndex, revealed } = args;
  if (stepIndex === 0) return 1;
  if (stepIndex === 1 && !revealed) return 2;
  if (stepIndex === 1 && revealed) return 3;
  if (stepIndex >= 2 && stepIndex <= 7) return 3 + (stepIndex - 1);
  if (stepIndex === 8) return 10;
  return 1;
}

function CountUpCurrency({
  target,
  delayMs = 0,
  className = "",
}: {
  target: number;
  delayMs?: number;
  className?: string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    let start: number | null = null;
    let raf = 0;
    const dur = 1150;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      if (elapsed < delayMs) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (elapsed - delayMs) / dur);
      const eased = 1 - (1 - p) ** 3;
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delayMs]);
  return <span className={`numeric font-heading font-bold ${className}`}>{formatCurrency(v)}</span>;
}

function SilentLossCountUp({ target }: { target: number }) {
  return <CountUpCurrency target={target} className="numeric-glow text-[#D64545]" />;
}

function GlowNumber({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{
        textShadow: [
          "0 0 0 rgba(214,69,69,0)",
          "0 0 26px rgba(214,69,69,0.2)",
          "0 0 0 rgba(214,69,69,0)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

function RevealLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WhatThisMeans({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 w-full rounded-xl border border-[#D4AF37]/22 bg-white px-3 py-3 text-left shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B8941E]">What this means</p>
      <div className="mt-2 text-[13px] font-medium leading-relaxed text-[#0B1F3A]/88">{children}</div>
    </div>
  );
}

function ImpactBar({ level }: { level: ShockImpactLevel }) {
  const pct = level === "HIGH" ? 100 : level === "MEDIUM" ? 62 : 34;
  const color =
    level === "HIGH" ? "bg-[#D64545]" : level === "MEDIUM" ? "bg-amber-500" : "bg-emerald-600";
  const label = level === "HIGH" ? "High" : level === "MEDIUM" ? "Medium" : "Low";
  const bar = (
    <div className="h-2.5 overflow-hidden rounded-full bg-[#0B1F3A]/10">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
  return (
    <div className="mt-5 w-full max-w-xs text-left">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B1F3A]/45">Financial impact of waiting</p>
      {level === "HIGH" ? (
        <motion.div animate={{ opacity: [1, 0.82, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          {bar}
        </motion.div>
      ) : (
        bar
      )}
      <p className="mt-1.5 text-[12px] font-bold text-[#0B1F3A]/75">{label}</p>
    </div>
  );
}

function MetricBlock({
  big,
  suffix,
  label,
  className = "text-[#0B1F3A]",
}: {
  big: string;
  suffix?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className="text-center">
      <p className={`numeric font-heading text-[clamp(1.5rem,6.5vw,2.1rem)] font-bold leading-none ${className}`}>
        {big}
        {suffix ? <span className="numeric text-[0.42em] font-bold opacity-80">{suffix}</span> : null}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]/45">{label}</p>
    </div>
  );
}

/** Single snapshot — avoids mo / yr / multi-year column repetition */
function DiscoveryRentSnapshot({ d }: { d: DerivedImpact }) {
  return (
    <div className="mt-4 rounded-xl border border-black/[0.06] bg-white px-4 py-5 text-center shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B1F3A]/45">Rent today</p>
      <p className="numeric mt-2 font-heading text-[clamp(1.75rem,6vw,2.25rem)] font-bold leading-none text-[#0B1F3A]">
        {formatCurrency(d.monthlyRent)}
      </p>
      <p className="mt-3 text-left text-[12px] leading-relaxed text-[#0B1F3A]/70">
        Five years out the door:{" "}
        <span className="numeric font-semibold text-[#D64545]">{formatCurrency(d.fiveYearRent)}</span>
        <span className="text-[#0B1F3A]/55"> — no equity.</span>
      </p>
    </div>
  );
}

export function buildDiscoverySteps(
  pathId: DiscoveryPathId,
  o: FinancialRealityOutcome,
  d: DerivedImpact,
): DiscoveryStep[] {
  const mid = (o.numbers.buyingPowerLow + o.numbers.buyingPowerHigh) / 2;

  switch (pathId) {
    case "baseline":
      return [
        {
          kicker: "Discovery · 1/3",
          title: "See where your rent goes",
          body: (
            <div className="mt-4">
              <DiscoveryRentSnapshot d={d} />
            </div>
          ),
        },
        {
          kicker: "Discovery · 2/3",
          title: "What we stack it against",
          body: (
            <p className="mt-4 text-left text-[13px] font-medium leading-relaxed text-[#0B1F3A]/85">
              We compare that rent to ownership in your income band — missed principal paydown, modest appreciation on a modeled price path, and drift from waiting. Same engine as the main cards.
            </p>
          ),
        },
        {
          kicker: "Discovery · 3/3",
          title: "Assumptions",
          body: (
            <p className="mt-4 text-left text-[12px] leading-relaxed text-[#0B1F3A]/65">
              Illustrative model output — not a loan quote, approval, or tax advice. Your actual loan, taxes, and insurance will differ.
            </p>
          ),
        },
      ];
    case "rent-tally":
      return [
        {
          kicker: "Discovery · 1/3",
          title: "The rent trajectory",
          body: (
            <div className="mt-4">
              <DiscoveryRentSnapshot d={d} />
            </div>
          ),
        },
        {
          kicker: "Discovery · 2/3",
          title: "Comparison",
          body: (
            <p className="mt-4 text-left text-[13px] leading-relaxed text-[#0B1F3A]/85">
              Same rent dollars as the compound-loss card — stretched over years, none of it builds equity while you rent.
            </p>
          ),
        },
        {
          kicker: "Discovery · 3/3",
          title: "Why it stings",
          body: (
            <p className="mt-4 text-[13px] font-semibold leading-snug text-[#D64545]">You own $0 of every payment. That’s the comparison that matters.</p>
          ),
        },
      ];
    case "leak-breakdown":
      return [
        {
          kicker: "Discovery · 1/3",
          title: "What “leak” means here",
          body: (
            <div className="mt-4 space-y-2 rounded-xl border border-amber-200/80 bg-amber-50/95 px-3 py-3 text-left text-[12px] font-semibold text-amber-950">
              <div className="flex justify-between gap-2">
                <span>Missed equity (model)</span>
                <span className="numeric">{formatCurrency(d.components.missedEquity)}/mo</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Rent — no return</span>
                <span className="numeric">{formatCurrency(d.components.rentLost)}/mo</span>
              </div>
              <div className="flex justify-between gap-2 border-t border-amber-200/60 pt-2">
                <span>Price / payment drift</span>
                <span className="numeric">{formatCurrency(d.components.priceDrift)}/mo</span>
              </div>
              <div className="flex justify-between gap-2 border-t border-amber-900/15 pt-2 font-heading text-[1.05rem] font-bold">
                <span>Combined</span>
                <span className="numeric">{formatCurrency(d.monthlyImpact)}/mo</span>
              </div>
            </div>
          ),
        },
        {
          kicker: "Discovery · 2/3",
          title: "Projections",
          body: (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-200/90 bg-white p-3 text-center">
                <p className="numeric font-heading text-[1.25rem] font-bold text-amber-950">{formatCurrency(d.yearlyLeak)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-900/65">Illustr. yearly drag</p>
              </div>
              <div className="rounded-xl border border-amber-200/90 bg-white p-3 text-center">
                <p className="numeric font-heading text-[1.25rem] font-bold text-amber-950">{formatCurrency(d.fiveYearLeakIllustrative)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-900/65">Illustr. 5-year stack</p>
              </div>
            </div>
          ),
        },
        {
          kicker: "Discovery · 3/3",
          title: "Assumptions",
          body: (
            <p className="mt-4 text-left text-[12px] leading-relaxed text-amber-950/85">
              Built from your band + timing in the engine — directional, not a promise. Use it to ask better questions, not as a guarantee.
            </p>
          ),
        },
      ];
    case "equity-model":
      return [
        {
          kicker: "Discovery · 1/2",
          title: "How we get this number",
          body: (
            <div className="mt-4 text-center">
              <p className="numeric font-heading text-[2rem] font-bold text-emerald-900">{formatCurrency(d.equity5)}</p>
              <p className="mt-3 text-left text-[13px] leading-relaxed text-emerald-900/85">
                “Buy now” scenario: scheduled principal over five years plus a modest appreciation path on the modeled purchase price — same scenario as the main card.
              </p>
            </div>
          ),
        },
        {
          kicker: "Discovery · 2/2",
          title: "Limits",
          body: (
            <p className="mt-4 text-left text-[12px] leading-relaxed text-emerald-900/80">
              Rates, taxes, insurance, and your actual structure will differ. This is a directional model — not a promise of returns.
            </p>
          ),
        },
      ];
    case "pressure-stack":
      return [
        {
          kicker: "Discovery · 1/2",
          title: "How the loss stacks",
          body: (
            <div className="mt-4 space-y-3 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-left text-[12px] font-semibold text-white">
              <p className="text-[11px] font-medium text-white/70">Monthly sideline drag (model)</p>
              <p className="numeric font-heading text-[1.65rem] font-bold leading-none">{formatCurrency(d.monthlyImpact)}</p>
              <p className="text-[11px] font-medium leading-relaxed text-white/55">
                Illustrative 5-year bleed: <span className="numeric font-semibold text-white/85">{formatCurrency(d.fiveYearLeakIllustrative)}</span>
              </p>
              <p className="pt-1 text-[11px] font-medium text-white/45">Mid price ref ~{formatCurrency(mid)} — your buying-power band.</p>
            </div>
          ),
        },
        {
          kicker: "Discovery · 2/2",
          title: "Read that again",
          body: <p className="mt-4 text-left text-[13px] font-semibold leading-snug text-white/90">{o.irreversibility.finalPressureLine}</p>,
        },
      ];
    default:
      return [];
  }
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -28 : 28, opacity: 0 }),
};

type DiscoveryState = { pathId: DiscoveryPathId; step: number };

/**
 * Full-screen cards: brutal copy, computed impact, dual path, optional discovery modal.
 */
export function HomebuyerMilestoneFlow() {
  const [rent, setRent] = useState<number | null>(null);
  const [incomeIdx, setIncomeIdx] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dir, setDir] = useState(1);
  const [discovery, setDiscovery] = useState<DiscoveryState | null>(null);
  const [completionGlow, setCompletionGlow] = useState(false);
  const [validationHint, setValidationHint] = useState<string | null>(null);
  const [continuePressed, setContinuePressed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const canSubmit = rent != null && incomeIdx != null;

  const outcome = useMemo(() => {
    if (rent == null || incomeIdx == null) return null;
    return computeFromQuickInputs(rent, incomeIdx, DEFAULT_TIMING_IDX);
  }, [rent, incomeIdx]);

  const derived = useDerivedImpact(outcome);

  const shock = useMemo(() => {
    if (!outcome) return null;
    return buildShockOutcome(outcome);
  }, [outcome]);

  const discoveryStepsLive = useMemo(() => {
    if (!discovery || !outcome || !derived) return [];
    return buildDiscoverySteps(discovery.pathId, outcome, derived);
  }, [discovery, outcome, derived]);

  const atLastDiscoveryStep =
    !!discovery && discoveryStepsLive.length > 0 && discovery.step >= discoveryStepsLive.length - 1;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goTo = useCallback(
    (nextIdx: number, direction: number) => {
      if (nextIdx < 0 || nextIdx >= TOTAL_STEPS) return;
      /** Steps 0–1 are allowed without a computed outcome; story steps 2+ need inputs. */
      if (nextIdx >= 2 && !outcome) return;
      setDiscovery(null);
      setDir(direction);
      setStepIndex(nextIdx);
    },
    [outcome],
  );

  /** Linear +1 — functional update avoids stale stepIndex and race conditions. */
  const advanceStep = useCallback(() => {
    setDiscovery(null);
    setDir(1);
    setStepIndex((prev) => {
      if (prev >= FINAL_INDEX) return prev;
      const n = prev + 1;
      if (n >= TOTAL_STEPS) return prev;
      if (n >= 2 && !outcome) {
        if (import.meta.env.DEV) {
          console.warn("[HomebuyerFlow] advanceStep blocked: outcome required for step", n);
        }
        return prev;
      }
      return n;
    });
  }, [outcome]);

  const triggerStepReward = useCallback(() => {
    setShowReward(true);
    setCompletionGlow(true);
    window.setTimeout(() => setShowReward(false), 700);
    window.setTimeout(() => setCompletionGlow(false), 950);
  }, []);

  const jumpToFinal = useCallback(() => {
    if (!outcome) return;
    setDiscovery(null);
    setDir(1);
    setStepIndex(FINAL_INDEX);
  }, [outcome]);

  const handleUnlock = useCallback(() => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setRevealed(true);
      setValidationHint(null);
      triggerStepReward();
    }, 220);
  }, [triggerStepReward]);

  const openDiscovery = useCallback(() => {
    const pathId = discoveryPathIdForMainStep(stepIndex);
    if (pathId) setDiscovery({ pathId, step: 0 });
  }, [stepIndex]);

  const closeDiscovery = useCallback(() => setDiscovery(null), []);

  const discoveryNext = useCallback(() => {
    if (!outcome || !derived) return;
    setDiscovery((d) => {
      if (!d) return null;
      const steps = buildDiscoverySteps(d.pathId, outcome, derived);
      if (d.step < steps.length - 1) return { ...d, step: d.step + 1 };
      return null;
    });
  }, [outcome, derived]);

  const discoveryBack = useCallback(() => {
    setDiscovery((d) => {
      if (!d) return null;
      if (d.step > 0) return { ...d, step: d.step - 1 };
      return null;
    });
  }, []);

  const next = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log("[HomebuyerFlow] next()", {
        stepIndex,
        revealed,
        canSubmit,
        busy,
        discovery: !!discovery,
      });
    }

    if (discovery) {
      discoveryNext();
      return;
    }
    if (stepIndex === 0) {
      setValidationHint(null);
      goTo(1, 1);
      triggerStepReward();
      return;
    }
    if (stepIndex === 1 && !revealed) {
      if (!canSubmit) {
        setValidationHint("Select your rent and income to continue.");
        return;
      }
      handleUnlock();
      return;
    }
    if (stepIndex === 1 && revealed) {
      setValidationHint(null);
      goTo(2, 1);
      triggerStepReward();
      return;
    }
    if (stepIndex >= FINAL_INDEX) return;
    setValidationHint(null);
    advanceStep();
    triggerStepReward();
  }, [
    advanceStep,
    busy,
    canSubmit,
    discovery,
    discoveryNext,
    goTo,
    handleUnlock,
    revealed,
    stepIndex,
    triggerStepReward,
  ]);

  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    if (canSubmit) setValidationHint(null);
  }, [canSubmit]);

  const handleContinueClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (import.meta.env.DEV) {
      console.log("[HomebuyerFlow] Continue clicked", {
        stepIndex,
        revealed,
        canSubmit,
        busy,
      });
    }
    const stepFn = nextRef.current;
    if (typeof stepFn !== "function") {
      console.error("[HomebuyerFlow] nextStep function missing");
      setValidationHint("Something went wrong — try again.");
      return;
    }
    setContinuePressed(true);
    window.setTimeout(() => setContinuePressed(false), 180);
    stepFn();
  }, [stepIndex, revealed, canSubmit, busy]);

  const prev = useCallback(() => {
    if (discovery) {
      discoveryBack();
      return;
    }
    if (stepIndex === 0) return;
    if (stepIndex === 1 && !revealed) {
      goTo(0, -1);
      return;
    }
    goTo(stepIndex - 1, -1);
  }, [discovery, discoveryBack, goTo, stepIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (!discovery && stepIndex === FINAL_INDEX) return;
        next();
      }
      if (e.key === "Escape" && discovery) {
        e.preventDefault();
        closeDiscovery();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, stepIndex, discovery, closeDiscovery]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 56) return;
    if (dx < 0) {
      if (!discovery && stepIndex === FINAL_INDEX) return;
      next();
    } else {
      prev();
    }
  };

  const btnPreset = (active: boolean) =>
    `rounded-xl border px-2.5 py-2.5 text-center text-[13px] font-semibold transition-colors sm:px-3 sm:text-[14px] ${
      active
        ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#0B1F3A] ring-1 ring-[#D4AF37]/25"
        : "border-black/[0.08] bg-white text-[#0B1F3A] hover:border-[#0B1F3A]/12"
    }`;

  const progressSegment = getProgressSegment({ stepIndex, revealed });
  const pct = (progressSegment / PROGRESS_TOTAL) * 100;

  const streakHint = useMemo(() => {
    if (progressSegment === 5) return "This is the story — let it build.";
    if (progressSegment === 10) return "Next: talk it through with a human.";
    return null;
  }, [progressSegment]);

  const discoveryTriggerLabel = useMemo(() => {
    const pid = discoveryPathIdForMainStep(stepIndex);
    return pid ? DISCOVERY_TRIGGERS[pid] : "Tell me more";
  }, [stepIndex]);

  const continueLabel = (() => {
    if (discovery && outcome && derived) {
      return atLastDiscoveryStep ? "Back to the flow" : "Next";
    }
    if (stepIndex === 0) return "Continue";
    if (stepIndex === 1 && !revealed) return busy ? "…" : "Show me what I’m paying";
    if (stepIndex === 1 && revealed) return "Start the breakdown";
    if (stepIndex === 7) return "See your options";
    if (stepIndex >= 2 && stepIndex <= 6) return "Next";
    return "Continue";
  })();

  /** Never block primary advance on “invalid form” — next() shows validationHint instead. Only block re-entry while unlock animation runs. */
  const continueDisabled = !discovery && stepIndex === 1 && !revealed && busy;

  const showFooterContinue =
    discovery || stepIndex < FINAL_INDEX || stepIndex === 1;

  const showDiscoveryTrigger =
    !!outcome && !discovery && stepIndex < FINAL_INDEX && stepIndex !== 0 && (stepIndex !== 1 || revealed);

  const showResultsCta =
    !!outcome && !discovery && stepIndex >= 2 && stepIndex < FINAL_INDEX;

  const motionKey = `${stepIndex}-${revealed ? "r" : "i"}`;

  const renderCard = () => {
    if (!outcome && stepIndex >= 2) return null;

    if (stepIndex === 0) {
      return (
        <div className="flex w-full flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Decision lab</p>
          <h1 className="mt-3 max-w-[22ch] font-heading text-[clamp(1.35rem,5vw,1.9rem)] font-bold leading-[1.12] text-[#0B1F3A]">
            Should you buy now… or wait?
          </h1>
          <p className="mt-5 max-w-md text-[15px] font-medium leading-relaxed text-[#0B1F3A]/88">
            This tool shows you the real financial impact of your decision — in dollars.
          </p>
          <p className="mt-3 text-[13px] font-semibold text-[#0B1F3A]/72">Most people guess. This shows the truth.</p>
          <div className="mt-8 w-full max-w-md border-t border-black/[0.06] pt-6 text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#B8941E]">In the next 60 seconds, you’ll see:</p>
            <ul className="mt-3 space-y-2.5 text-[14px] font-semibold leading-snug text-[#0B1F3A]">
              <li className="flex gap-2">
                <span className="text-[#D64545]" aria-hidden>
                  →
                </span>
                what you’re actually paying
              </li>
              <li className="flex gap-2">
                <span className="text-[#D64545]" aria-hidden>
                  →
                </span>
                what waiting costs you
              </li>
              <li className="flex gap-2">
                <span className="text-[#D64545]" aria-hidden>
                  →
                </span>
                which decision puts you ahead
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <MicroReward show={showReward} />
          </div>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="flex w-full flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Your numbers</p>
          <h2 className="mt-2 font-heading text-[clamp(1.25rem,4.5vw,1.65rem)] font-bold leading-tight text-[#0B1F3A]">What do you pay every month?</h2>

          {!revealed ? (
            <>
              <div className="mt-5 w-full space-y-4 text-left">
                <div>
                  <p className="text-[12px] font-semibold text-[#0B1F3A]">Your rent</p>
                  <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">
                    {RENT_PRESETS.map((n) => (
                      <button key={n} type="button" onClick={() => setRent(n)} className={btnPreset(rent === n)}>
                        {formatCurrency(n)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#0B1F3A]">Your income</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {INCOME_OPTIONS.map((o) => (
                      <button key={o.idx} type="button" onClick={() => setIncomeIdx(o.idx)} className={btnPreset(incomeIdx === o.idx)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {outcome && derived && !revealed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 w-full rounded-xl border border-[#D4AF37]/25 bg-white/80 px-3 py-3 text-left text-[12px] font-semibold leading-snug text-[#0B1F3A]"
                >
                  <span className="numeric">{formatCurrency(derived.monthlyRent)}</span>
                  <span className="text-[#0B1F3A]/70">/month in rent — all out, nothing back.</span>
                </motion.div>
              ) : null}
              <div className="mt-4">
                <MicroReward show={showReward} />
              </div>
            </>
          ) : outcome && derived ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 w-full rounded-2xl border border-black/[0.06] bg-[#F7F9FC] p-4 shadow-inner"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B1F3A]/45">You’re paying this today</p>
                <p className="numeric mt-5 font-heading text-[clamp(2rem,9vw,2.75rem)] font-bold leading-none text-[#0B1F3A]">
                  {formatCurrency(derived.monthlyRent)}
                  <span className="numeric text-[0.42em] font-bold text-[#0B1F3A]/70">/mo</span>
                </p>
                <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#D64545]">
                  Five-year burn: <span className="numeric font-bold">{formatCurrency(derived.fiveYearRent)}</span>
                  <span className="text-[#0B1F3A]/65"> — walking out the door.</span>
                </p>
                <div className="mt-4 flex justify-center">
                  <MicroReward show />
                </div>
              </motion.div>
              {showDiscoveryTrigger ? (
                <button
                  type="button"
                  onClick={openDiscovery}
                  className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
                >
                  {discoveryTriggerLabel}
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      );
    }

    if (!outcome || !derived || !shock) return null;

    const d = derived;
    const s = shock;

    if (stepIndex === 2) {
      const sb = s.sideBySideTruth;
      return (
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Side-by-side</p>
          <h2 className="mt-3 font-heading text-[clamp(1.15rem,4vw,1.45rem)] font-bold leading-tight text-[#0B1F3A]">
            Here’s your situation:
          </h2>
          <div className="mt-6 w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-left shadow-sm">
            <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-black/[0.06] bg-[#F7F9FC] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/55">
              <span>Scenario</span>
              <span className="text-right">Outcome</span>
            </div>
            <div className="divide-y divide-black/[0.06]">
              <div className="flex items-baseline justify-between gap-3 px-3 py-3">
                <span className="text-[13px] font-semibold text-[#0B1F3A]">Rent &amp; wait</span>
                <span className="numeric text-[1.05rem] font-bold text-[#D64545]">{formatCurrency(sb.rentWaitOutcome)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-3 py-3">
                <span className="text-[13px] font-semibold text-[#0B1F3A]">Buy now</span>
                <span className="numeric text-[1.05rem] font-bold text-emerald-800">{formatCurrency(sb.buyNowOutcome)}</span>
              </div>
            </div>
          </div>
          <p className="mt-5 font-heading text-[clamp(1.05rem,3.6vw,1.3rem)] font-bold leading-snug text-[#0B1F3A]">
            That’s a <span className="numeric text-[#D64545]">{formatCurrency(sb.difference)}</span> difference
          </p>
          <WhatThisMeans>
            Same time horizon ({sb.horizonYears} years, model). The middle column is the gap between renting and owning — not
            trivia.
          </WhatThisMeans>
          {showDiscoveryTrigger ? (
            <button
              type="button"
              onClick={openDiscovery}
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
            >
              {discoveryTriggerLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
          <div className="mt-4 flex justify-center">
            <MicroReward show={showReward} />
          </div>
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <motion.div
          className="flex w-full max-w-md flex-col items-center text-center"
          animate={completionGlow ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 0.45 }}
        >
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Cash out the door</p>
          <h2 className="mt-3 font-heading text-[clamp(1.15rem,4vw,1.45rem)] font-bold leading-tight text-[#0B1F3A]">
            Your rent is a leak — not a line item.
          </h2>
          <p className="mt-2 text-[14px] font-semibold text-[#D64545]">
            So what?{" "}
            <span className="numeric">{formatCurrency(d.monthlyRent)}/mo</span> leaves — nothing builds.
          </p>
          <GlowNumber>
            <p className="numeric numeric-glow mt-5 font-heading text-[clamp(2rem,9vw,2.65rem)] font-bold leading-none text-[#0B1F3A]">
              <CountUpCurrency target={d.monthlyRent} delayMs={0} className="font-bold" />
            </p>
          </GlowNumber>
          <WhatThisMeans>
            Rent feels “fixed,” but it’s still money you never see again — that’s the comparison that matters next.
          </WhatThisMeans>
          {showDiscoveryTrigger ? (
            <button
              type="button"
              onClick={openDiscovery}
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
            >
              {discoveryTriggerLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
          <div className="mt-4 flex justify-center">
            <MicroReward show={showReward} />
          </div>
        </motion.div>
      );
    }

    if (stepIndex === 4) {
      const pd = s.paymentDistortion;
      return (
        <motion.div
          className="flex w-full max-w-md flex-col items-center text-center"
          animate={completionGlow ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 0.45 }}
        >
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Payment truth</p>
          <h2 className="mt-3 font-heading text-[clamp(1.1rem,3.8vw,1.45rem)] font-bold leading-tight text-[#0B1F3A]">
            Only <span className="numeric text-emerald-800">{formatCurrency(pd.actuallyYours)}</span> of your payment builds wealth.
          </h2>
          <p className="mt-2 text-[14px] font-semibold text-[#D64545]">
            So what? The other <span className="numeric">{formatCurrency(pd.trueCost)}/mo</span> is gone.
          </p>
          <RevealLine delay={0.1} className="mt-6 w-full rounded-2xl border border-black/[0.06] bg-white px-4 py-5 text-left shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B1F3A]/45">Looks like (full PITI)</p>
            <p className="numeric mt-1 font-heading text-[clamp(1.75rem,7vw,2.25rem)] font-bold leading-none text-[#D64545]">
              {formatCurrency(pd.looksLike)}
            </p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-900/70">Actually yours (principal)</p>
            <p className="numeric mt-1 font-heading text-[clamp(1.35rem,5vw,1.65rem)] font-bold leading-none text-emerald-800">
              {formatCurrency(pd.actuallyYours)}
            </p>
          </RevealLine>
          <WhatThisMeans>
            Even when buying feels more expensive upfront, most of the check isn’t “yours” yet — only the principal slice is.
          </WhatThisMeans>
          {showDiscoveryTrigger ? (
            <button
              type="button"
              onClick={openDiscovery}
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
            >
              {discoveryTriggerLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
          <div className="mt-4 flex justify-center">
            <MicroReward show={showReward} />
          </div>
        </motion.div>
      );
    }

    if (stepIndex === 5) {
      const sl = s.silentLoss;
      const tc = s.timeIsCost;
      return (
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Story 3 · Damage</p>
          <h2 className="mt-2 font-heading text-[clamp(1.05rem,3.8vw,1.35rem)] font-bold leading-tight text-[#0B1F3A]">{tc.headline}</h2>
          <p className="mt-2 text-[13px] font-medium text-[#0B1F3A]/75">So what? Waiting has a meter — and it runs daily.</p>
          <ul className="mt-5 w-full space-y-2 rounded-xl border border-amber-200/85 bg-amber-50/95 px-4 py-4 text-left text-[13px] font-semibold text-amber-950">
            <li className="flex justify-between gap-2">
              <span>Rent — gone</span>
              <span className="numeric text-[#D64545]">{formatCurrency(sl.rentGone)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Missed equity (model)</span>
              <span className="numeric text-[#D64545]">{formatCurrency(sl.lostEquity)}</span>
            </li>
            <li className="flex justify-between gap-2 border-t border-amber-200/70 pt-2">
              <span>Rate / price drift</span>
              <span className="numeric text-[#D64545]">{formatCurrency(sl.rateImpact)}</span>
            </li>
          </ul>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0B1F3A]/45">You lose (sideline drag)</p>
          <p className="mt-2 font-heading text-[clamp(2rem,8vw,2.75rem)] font-bold leading-none text-[#D64545]">
            <SilentLossCountUp target={sl.monthlyLoss} />
            <span className="numeric text-[0.42em] font-bold text-[#D64545]/80">/mo</span>
          </p>
          <p className="mt-4 text-[13px] font-semibold text-[#0B1F3A]">
            That’s{" "}
            <span className="numeric font-bold text-[#D64545]">{formatCurrency(tc.lossPerDay)}</span> per day.
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0B1F3A]/65">{tc.punchline}</p>
          <ImpactBar level={s.impactLevel} />
          <WhatThisMeans>
            Sideline drag is rent + missed equity + drift — not one bill, but it adds up the same every month.
          </WhatThisMeans>
          {showDiscoveryTrigger ? (
            <button
              type="button"
              onClick={openDiscovery}
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
            >
              {discoveryTriggerLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
          <div className="mt-4 flex justify-center">
            <MicroReward show={showReward} />
          </div>
        </div>
      );
    }

    if (stepIndex === 6) {
      const el = s.escalatingLoss;
      const td = s.totalDamage;
      return (
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">The future</p>
          <RevealLine delay={0.06}>
            <h2 className="mt-2 font-heading text-[clamp(1.05rem,3.8vw,1.35rem)] font-bold leading-tight text-[#0B1F3A]">{el.headline}</h2>
          </RevealLine>
          <p className="mt-2 text-[13px] font-medium text-[#0B1F3A]/75">{el.subhead}</p>
          <div className="mt-5 w-full space-y-3 text-left">
            <RevealLine delay={0.12} className="flex items-baseline justify-between gap-3 border-b border-black/[0.06] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/45">Year 1</span>
              <CountUpCurrency target={el.loss1yr} delayMs={0} className="text-[clamp(1.35rem,5vw,1.75rem)] text-[#D64545]" />
            </RevealLine>
            <RevealLine delay={0.2} className="flex items-baseline justify-between gap-3 border-b border-black/[0.06] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/45">Year 3</span>
              <span>
                <CountUpCurrency target={el.loss3yr} delayMs={100} className="text-[clamp(1.35rem,5vw,1.75rem)] text-[#D64545]" />
                <span className="mt-0.5 block text-[10px] font-medium text-[#0B1F3A]/45">×1.2 vs year-1 pace</span>
              </span>
            </RevealLine>
            <RevealLine delay={0.28} className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/45">Year 5</span>
              <span>
                <CountUpCurrency target={el.loss5yr} delayMs={200} className="text-[clamp(1.5rem,5.5vw,2rem)] text-[#D64545]" />
                <span className="mt-0.5 block text-[10px] font-medium text-[#0B1F3A]/45">×1.5 vs year-1 pace</span>
              </span>
            </RevealLine>
          </div>
          <p className="mt-4 text-[13px] font-bold text-[#D64545]">{el.punchline}</p>
          <div className="mt-8 w-full rounded-2xl border border-[#D64545]/20 bg-[rgba(214,69,69,0.06)] px-4 py-5 text-center">
            <p className="text-[13px] font-bold leading-snug text-[#0B1F3A]">You lose this much by waiting (illustrative 5 yr)</p>
            <p className="numeric numeric-glow mt-3 font-heading text-[clamp(1.75rem,6.5vw,2.25rem)] font-bold text-[#D64545]">
              {formatCurrency(td.total)}
            </p>
          </div>
          <WhatThisMeans>
            That total is rent burned + missed equity build + financing cost in the model — not a single line item, but one outcome.
          </WhatThisMeans>
          {showDiscoveryTrigger ? (
            <button
              type="button"
              onClick={openDiscovery}
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
            >
              {discoveryTriggerLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
          <div className="mt-4 flex justify-center">
            <MicroReward show={showReward} />
          </div>
        </div>
      );
    }

    if (stepIndex === 7) {
      const w = s.winnerCard;
      const horizon = s.sideBySideTruth.horizonYears;
      if (w.winner === "BUY") {
        return (
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800">One clear outcome</p>
            <h2 className="mt-3 font-heading text-[clamp(1.25rem,4.2vw,1.65rem)] font-bold leading-tight text-emerald-950">
              Buying now puts you ahead
            </h2>
            <p className="mt-3 text-[15px] font-semibold text-[#0B1F3A]">
              By <span className="numeric font-bold">{formatCurrency(w.advantageDollars)}</span> over the next{" "}
              <span className="numeric">{horizon}</span> years
            </p>
            <div className="mt-6 w-full space-y-3 rounded-2xl border border-emerald-200/85 bg-emerald-50/95 px-4 py-4 text-left text-[14px] font-semibold text-emerald-950">
              <p>
                You build <span className="numeric">{formatCurrency(w.equityBuilt5yr)}</span> in equity
              </p>
              <p>
                You avoid <span className="numeric text-[#D64545]">{formatCurrency(w.lossStackAvoided)}</span> in sideline losses
              </p>
            </div>
            <p className="mt-6 text-[16px] font-bold text-[#D64545]">Waiting costs you more than it saves</p>
            <WhatThisMeans>
              Even if buying feels more expensive upfront, this model has you net ahead over the window — not stuck rebuilding from
              zero.
            </WhatThisMeans>
            <p className="numeric mt-5 font-heading text-[1.85rem] font-bold text-[#B8941E]">{s.decisionScore}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B1F3A]/45">Momentum score (directional)</p>
            {showDiscoveryTrigger ? (
              <button
                type="button"
                onClick={openDiscovery}
                className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
              >
                {discoveryTriggerLabel}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
            <div className="mt-4 flex justify-center">
              <MicroReward show={showReward} />
            </div>
          </div>
        );
      }
      return (
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D64545]">One clear outcome</p>
          <h2 className="mt-3 font-heading text-[clamp(1.15rem,4vw,1.5rem)] font-bold leading-tight text-[#0B1F3A]">
            Waiting is the better move right now
          </h2>
          <p className="mt-3 text-[15px] font-semibold text-[#0B1F3A]">
            You avoid <span className="numeric font-bold">{formatCurrency(w.advantageDollars)}</span> in unnecessary cost
          </p>
          <p className="mt-6 text-[16px] font-bold text-[#D64545]">Buying now would put you behind</p>
          <WhatThisMeans>
            In this model, staying put nets better — use it as a directional check, then pressure-test with real quotes and goals.
          </WhatThisMeans>
          <p className="numeric mt-6 font-heading text-[2rem] font-bold text-[#B8941E]">{s.decisionScore}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B1F3A]/45">Momentum score (directional)</p>
          {showDiscoveryTrigger ? (
            <button
              type="button"
              onClick={openDiscovery}
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]/55 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#0B1F3A]"
            >
              {discoveryTriggerLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
          <div className="mt-4 flex justify-center">
            <MicroReward show={showReward} />
          </div>
        </div>
      );
    }

    if (stepIndex === FINAL_INDEX) {
      const win = shock.winnerCard.winner;
      return (
        <div className="flex w-full flex-col items-center text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Decision moment</p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 font-heading text-[clamp(1.05rem,3.8vw,1.35rem)] font-bold text-[#0B1F3A]"
          >
            Based on your numbers…
          </motion.p>
          <h2 className="mt-2 font-heading text-[clamp(1.2rem,4vw,1.5rem)] font-bold leading-tight text-[#0B1F3A]">
            Here’s the smarter move:
          </h2>
          <p className="mt-3 text-[15px] font-semibold text-[#0B1F3A]">
            {win === "BUY" ? (
              <>
                Lean toward <span className="text-emerald-800">buying</span> — the model has you ahead over{" "}
                <span className="numeric">{shock.sideBySideTruth.horizonYears}</span> years.
              </>
            ) : (
              <>
                Lean toward <span className="text-[#D64545]">waiting</span> — the model has renting ahead for now.
              </>
            )}
          </p>
          <ul className="mt-5 space-y-1.5 text-left text-[13px] font-semibold leading-snug text-[#0B1F3A]/85">
            <li>Talk it through with a real advisor</li>
            <li>Stress-test with real quotes — not just a calculator</li>
            <li>No credit pull to start the conversation</li>
          </ul>

          <div className="mt-5 w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-3 text-left shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0B1F3A]/45">Your inputs</p>
            <p className="mt-1 text-[13px] font-bold text-[#0B1F3A]">
              {rent != null ? `${formatCurrency(normalizeRentMonthly(rent))}/mo` : "—"} ·{" "}
              {INCOME_OPTIONS.find((x) => x.idx === incomeIdx)?.label ?? "—"}
            </p>
            <p className="mt-3 text-[10px] text-[rgba(11,31,58,0.5)]">Illustrative model — not a loan approval, quote, or tax advice.</p>
          </div>

          <div className="mt-4 w-full max-w-sm space-y-2.5">
            <FlagshipCtaPrimary to="/contact" className="w-full justify-center text-[14px]">
              Talk through my numbers
            </FlagshipCtaPrimary>
            <QuizShareButton theme="light" />
            <Link to="/smart-tools" className="block text-center text-[11px] font-medium text-[#0B1F3A]/45 hover:text-[#0B1F3A]">
              ← Back to tools
            </Link>
          </div>
        </div>
      );
    }

    return null;
  };

  const activeDiscoveryStep =
    discovery && discoveryStepsLive.length > 0 ? discoveryStepsLive[discovery.step] ?? null : null;
  const isPressureDiscovery = discovery?.pathId === "pressure-stack";

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#F7F9FC]">
      <header className="z-30 shrink-0 border-b border-black/[0.05] bg-white/95 shadow-sm backdrop-blur-sm">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))]`}>
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/smart-tools"
              className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-[#0B1F3A]/55 hover:text-[#0B1F3A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Exit
            </Link>
            <p className="min-w-0 flex-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]/55">
              {discovery && discoveryStepsLive.length > 0 ? (
                <>
                  Step {progressSegment} of {PROGRESS_TOTAL}
                  <span className="text-[#0B1F3A]/35"> · </span>
                  <span className="text-[#B8941E]">
                    Discovery {discovery.step + 1}/{discoveryStepsLive.length}
                  </span>
                </>
              ) : (
                <>
                  Step {progressSegment} of {PROGRESS_TOTAL}
                </>
              )}
            </p>
            <span className="w-8 shrink-0" aria-hidden />
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0B1F3A]/10">
              <motion.div
                className="h-full rounded-full bg-[#D4AF37]"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex max-w-[100px] shrink-0 flex-wrap justify-end gap-0.5" aria-hidden>
              {Array.from({ length: PROGRESS_TOTAL }, (_, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={{ scale: i === progressSegment - 1 ? [1, 1.35, 1] : 1 }}
                  transition={{ duration: 0.35 }}
                  className={`h-1.5 w-1.5 rounded-full ${i < progressSegment ? "bg-[#D4AF37]" : "bg-[#0B1F3A]/15"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div
        className="relative min-h-0 flex-1 overflow-hidden overscroll-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="presentation"
      >
        <div className={`${PAGE_CONTENT_RAIL_CLASS} mx-auto flex h-full min-h-0 w-full max-w-lg flex-col`}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={motionKey}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={`flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-1 sm:px-5 ${
                completionGlow ? "rounded-2xl ring-2 ring-[#D4AF37]/45 ring-offset-4 ring-offset-[#F7F9FC]" : ""
              }`}
            >
              {streakHint ? (
                <p className="mb-2 max-w-md text-center text-[11px] font-semibold text-[#B8941E]">{streakHint}</p>
              ) : null}
              {renderCard()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showFooterContinue ? (
        <footer className="shrink-0 border-t border-black/[0.05] bg-white/95 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
          <div className={`${PAGE_CONTENT_RAIL_CLASS} mx-auto flex max-w-lg flex-col gap-2`}>
            <motion.div
              className="w-full max-w-md"
              animate={{ scale: continuePressed ? 0.97 : 1 }}
              transition={{ type: "spring", stiffness: 520, damping: 38 }}
            >
              <FlagshipCtaPrimaryButton
                type="button"
                onClick={handleContinueClick}
                disabled={continueDisabled}
                aria-busy={busy && stepIndex === 1 && !revealed}
                className="min-h-[46px] w-full max-w-md text-[14px] sm:w-auto"
              >
                {continueLabel}
              </FlagshipCtaPrimaryButton>
            </motion.div>
            {validationHint ? (
              <p role="status" aria-live="polite" className="text-center text-[12px] font-semibold leading-snug text-[#D64545]">
                {validationHint}
              </p>
            ) : null}
            {showResultsCta ? (
              <button
                type="button"
                onClick={jumpToFinal}
                className="w-full py-1 text-center text-[13px] font-semibold text-[#0B1F3A]/55 transition-colors hover:text-[#0B1F3A]"
              >
                I’ve seen enough
              </button>
            ) : null}
          </div>
          {!discovery ? (
            <p className="mt-1.5 text-center text-[9px] text-[#0B1F3A]/38">Swipe · arrows · Enter</p>
          ) : (
            <p className="mt-1.5 text-center text-[9px] text-[#0B1F3A]/38">Esc closes · arrows step</p>
          )}
        </footer>
      ) : (
        <footer className="shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]" aria-hidden />
      )}
      </div>

      <AnimatePresence>
        {discovery && activeDiscoveryStep && outcome && derived ? (
          <motion.div
            key="discovery-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="discovery-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDiscovery();
            }}
          >
            <motion.div
              key={`${discovery.pathId}-${discovery.step}`}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl border px-4 py-5 shadow-[0_20px_50px_rgba(11,31,58,0.22)] sm:px-6 ${
                isPressureDiscovery
                  ? "border-white/15 bg-[#0B1F3A] text-white"
                  : "border-black/[0.08] bg-white text-[#0B1F3A]"
              }`}
            >
              <p
                className={`font-sans text-[10px] font-semibold uppercase tracking-[0.2em] ${isPressureDiscovery ? "text-[#D4AF37]/90" : "text-[#B8941E]"}`}
              >
                {activeDiscoveryStep.kicker}
              </p>
              <h3
                id="discovery-title"
                className={`mt-2 font-heading text-[clamp(1.05rem,3.6vw,1.3rem)] font-bold leading-snug ${isPressureDiscovery ? "text-white" : "text-[#0B1F3A]"}`}
              >
                {activeDiscoveryStep.title}
              </h3>
              <div className={isPressureDiscovery ? "text-white" : ""}>{activeDiscoveryStep.body}</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
