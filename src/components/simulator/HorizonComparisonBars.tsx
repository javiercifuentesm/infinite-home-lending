import { motion } from "motion/react";
import type { SimulatorHorizonYears } from "../../lib/mortgage";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { EASE_PREMIUM } from "../../lib/motionConfig";

export type HorizonBarScenario = {
  interest: number;
  principal: number;
  balance: number;
};

export type HorizonComparisonBarsProps = {
  scenarioA: HorizonBarScenario;
  scenarioB: HorizonBarScenario;
  horizonLabel: string;
  /** Interest-cost leader for subtle emphasis (matches headline / delta). */
  winnerScenario: "A" | "B" | "tie";
  selectedHorizon: SimulatorHorizonYears;
  /** Drives a soft emphasis pulse when the interest leader changes. */
  interestWinnerKey?: "A" | "B" | "tie";
};

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function pct(part: number, total: number): string {
  if (total <= 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

/**
 * Supporting confirmation: two stacked bars on a common scale (narrower, centered).
 * Visually subordinate to headline + delta — confirms interest vs principal split.
 */
export function HorizonComparisonBars({
  scenarioA,
  scenarioB,
  horizonLabel,
  winnerScenario,
  selectedHorizon,
  interestWinnerKey = winnerScenario,
}: HorizonComparisonBarsProps) {
  const reduced = usePrefersReducedMotion();
  const ia = Math.max(0, scenarioA.interest);
  const pa = Math.max(0, scenarioA.principal);
  const ib = Math.max(0, scenarioB.interest);
  const pb = Math.max(0, scenarioB.principal);

  const totalA = ia + pa;
  const totalB = ib + pb;
  const maxSum = Math.max(totalA, totalB, 1);

  const widthFracA = totalA / maxSum;
  const widthFracB = totalB / maxSum;

  const intFracA = totalA > 0 ? ia / totalA : 0;
  const intFracB = totalB > 0 ? ib / totalB : 0;

  return (
    <motion.div
      key={`horizon-bars-${selectedHorizon}-${interestWinnerKey}`}
      initial={reduced ? false : { opacity: 0.92, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.34, ease: EASE_PREMIUM }}
      className="mb-4 lg:mb-5 mx-auto w-full max-w-[min(100%,30rem)] sm:max-w-[min(100%,34rem)]"
    >
      <div className="mb-2.5 sm:mb-3">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-navy/38 font-medium">
          Cost breakdown over selected horizon
        </p>
        <p className="mt-1 text-[11px] sm:text-[12px] text-slate-400 leading-snug">{horizonLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2.5 text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-5 rounded-[2px] bg-navy/58" aria-hidden />
          <span>Interest</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-5 rounded-[2px] bg-gold/42" aria-hidden />
          <span>Principal</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <BarColumn
          label="Scenario A"
          balance={scenarioA.balance}
          interest={ia}
          principal={pa}
          total={totalA}
          widthFrac={widthFracA}
          interestFrac={intFracA}
          emphasize={winnerScenario === "A"}
          muted={winnerScenario === "B"}
          pulseKey={`${selectedHorizon}-${interestWinnerKey}-A`}
        />
        <BarColumn
          label="Scenario B"
          balance={scenarioB.balance}
          interest={ib}
          principal={pb}
          total={totalB}
          widthFrac={widthFracB}
          interestFrac={intFracB}
          emphasize={winnerScenario === "B"}
          muted={winnerScenario === "A"}
          pulseKey={`${selectedHorizon}-${interestWinnerKey}-B`}
        />
      </div>
    </motion.div>
  );
}

function BarColumn({
  label,
  balance,
  interest,
  principal,
  total,
  widthFrac,
  interestFrac,
  emphasize,
  muted,
  pulseKey,
}: {
  label: string;
  balance: number;
  interest: number;
  principal: number;
  total: number;
  widthFrac: number;
  interestFrac: number;
  emphasize: boolean;
  muted: boolean;
  pulseKey: string;
}) {
  const reduced = usePrefersReducedMotion();
  const principalFrac = total > 0 ? 1 - interestFrac : 0;

  return (
    <motion.div
      key={pulseKey}
      initial={false}
      animate={
        emphasize && !reduced
          ? {
              boxShadow: [
                "0 0 0 0 rgba(197,160,89,0)",
                "0 0 0 1px rgba(197,160,89,0.12), 0 8px 28px rgba(197,160,89,0.06)",
                "0 0 0 0 rgba(197,160,89,0)",
              ],
            }
          : {}
      }
      transition={{ duration: 1.1, ease: EASE_PREMIUM }}
      className={`rounded-[3px] border px-3 py-3 sm:px-3.5 sm:py-3 transition-colors duration-300 ${
        emphasize
          ? "border-gold/22 bg-gold/[0.02] ring-1 ring-gold/8"
          : muted
            ? "border-slate-200/45 bg-slate-50/20"
            : "border-slate-200/55 bg-white/95"
      }`}
    >
      <div className="flex justify-between items-baseline gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-navy/42 font-medium">
          {label}
        </span>
        <span className="font-sans text-[10px] text-slate-400 tabular-nums shrink-0 max-w-[55%] text-right leading-tight">
          Bal. {fmt(balance)}
        </span>
      </div>

      <div className="w-full h-8 sm:h-9 rounded-[2px] bg-slate-100/80 border border-slate-200/50 overflow-hidden mb-2.5">
        <motion.div
          className="h-full flex min-w-0"
          initial={false}
          animate={{ width: `${widthFrac * 100}%` }}
          transition={{ duration: reduced ? 0 : 0.36, ease: EASE_PREMIUM }}
        >
          <motion.div
            className="h-full shrink-0 bg-navy/62 border-r border-white/25"
            initial={false}
            animate={{ width: `${interestFrac * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.36, ease: EASE_PREMIUM }}
          />
          <motion.div
            className="h-full shrink-0 bg-gold/40"
            initial={false}
            animate={{ width: `${principalFrac * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.36, ease: EASE_PREMIUM }}
          />
        </motion.div>
      </div>

      <dl className="space-y-1 text-[11px] sm:text-[12px]">
        <div className="flex justify-between gap-2 text-slate-500">
          <dt className="text-slate-400">Interest</dt>
          <dd className="font-medium text-navy/90 tabular-nums">
            {fmt(interest)}
            <span className="text-slate-400 font-normal ml-1">({pct(interest, total)})</span>
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-slate-500">
          <dt className="text-slate-400">Principal</dt>
          <dd className="font-medium text-navy/90 tabular-nums">
            {fmt(principal)}
            <span className="text-slate-400 font-normal ml-1">({pct(principal, total)})</span>
          </dd>
        </div>
      </dl>
    </motion.div>
  );
}
