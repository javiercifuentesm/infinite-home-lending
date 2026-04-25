import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
  computePaymentScenario,
  computeMaxAffordablePrice,
  breakdownFromPrice,
  cumulativePIOverHorizon,
  buildPositionSnapshot,
  SIMULATOR_HORIZON_MONTHS,
  type SimulatorHorizonYears,
  type HorizonSlice,
  type PositionSnapshot,
} from "../lib/mortgage";
import {
  buildHorizonInterpretation,
  getScenarioCardPresentation,
  type HorizonInterpretation,
  type CardDominance,
} from "../lib/simulatorInterpretation";
import { buildSimulatorLeadPayload } from "../lib/simulatorLeadPayload";
import {
  SimulatorConversionProvider,
  SimulatorConversionSlideIn,
  SimulatorConversionEarlyCta,
  SimulatorConversionMainCta,
} from "../components/simulator/ScenarioConversionBlock";
import { ArrowRight, Compass, Scale, Sparkles, ArrowLeftRight, MessageCircle } from "lucide-react";
import { MonthlyPaymentMixDonut } from "../components/simulator/SimulatorGraphics";
import { HorizonComparisonBars } from "../components/simulator/HorizonComparisonBars";
import { DecisionConfidenceBlock } from "../components/simulator/DecisionConfidenceBlock";
import { SimulatorGuidedStart } from "../components/simulator/SimulatorGuidedStart";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Mode = "payment" | "affordability";

export type HorizonKey = SimulatorHorizonYears;

const HORIZONS: { key: SimulatorHorizonYears; label: string; months: number }[] = [
  { key: 5, label: "5 years", months: SIMULATOR_HORIZON_MONTHS[5] },
  { key: 7, label: "7 years", months: SIMULATOR_HORIZON_MONTHS[7] },
  { key: 10, label: "10+ years", months: SIMULATOR_HORIZON_MONTHS[10] },
];

type Scenario = {
  price: number;
  downPercent: number;
  rate: number;
  termYears: number;
  annualTax: number;
  annualInsurance: number;
  targetMonthly: number;
  taxPctOfValue: number;
  insurancePctOfValue: number;
};

const defaultScenario = (): Scenario => ({
  price: 650_000,
  downPercent: 20,
  rate: 6.625,
  termYears: 30,
  annualTax: 7_800,
  annualInsurance: 1_800,
  targetMonthly: 4_200,
  taxPctOfValue: 1.1,
  insurancePctOfValue: 0.35,
});

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCurrencyDetailed(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Ease-out cubic; used when horizon or inputs change so headline numbers feel responsive. */
function useAnimatedNumber(target: number, reducedMotion: boolean): number {
  const [v, setV] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimationFrame(rafRef.current);
      setV(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    const dur = 420;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setV(from + (target - from) * e);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        setV(target);
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, reducedMotion]);

  return v;
}

type ScenarioId = "A" | "B";

function rowBetter(
  valA: number,
  valB: number,
  higherIsBetter: boolean
): ScenarioId | "tie" {
  const m = Math.max(Math.abs(valA), Math.abs(valB), 1);
  const eps = Math.max(25, m * 0.0002);
  if (Math.abs(valA - valB) < eps) return "tie";
  if (higherIsBetter) return valA > valB ? "A" : "B";
  return valA < valB ? "A" : "B";
}

/** Unified “winner” surface — same family as scenario cards + Direction anchor */
const WINNER_SURFACE = "bg-gold/[0.06] ring-1 ring-inset ring-gold/15";
const WINNER_BORDER_ACCENT = "border-l-[4px] border-l-gold/55";

function formatCompactApprox(diff: number): string {
  const n = Math.abs(diff);
  if (n >= 1_000_000) return `~$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 10 ? Math.round(k) : Math.round(k * 10) / 10;
    return `~$${s}K`;
  }
  return `~$${Math.round(n)}`;
}

/** Human-readable impact line; returns undefined if difference isn’t meaningful */
function humanInterpretation(
  rowKey: string,
  cell: ScenarioId,
  valA: number,
  valB: number,
  higherIsBetter: boolean
): string | undefined {
  const better = rowBetter(valA, valB, higherIsBetter);
  if (better === "tie" || better !== cell) return undefined;
  const diff = Math.abs(valA - valB);
  const threshold = Math.max(250, Math.max(valA, valB) * 0.0015);
  if (diff < threshold) return undefined;
  const other: ScenarioId = cell === "A" ? "B" : "A";
  const fmt = formatCompactApprox(diff);

  switch (rowKey) {
    case "total":
      return `Saves ${fmt} vs ${other}`;
    case "interest":
      return `Saves ${fmt} vs ${other} in interest`;
    case "principal":
      return `${fmt} more equity vs ${other}`;
    case "balance":
      return `${fmt} lower balance vs ${other}`;
    default:
      return undefined;
  }
}

type InsightBlock = {
  type: "directional" | "tradeoff" | "advisory";
  label: string;
  title: string;
  lines: string[];
  confidence?: { headline: string; reason?: string };
};

function buildTradeoffAdvisoryBlocks(
  mode: Mode,
  a: Scenario,
  b: Scenario,
  loanA: number,
  loanB: number,
  resultA: ReturnType<typeof computePaymentScenario> & { impliedPrice?: number },
  resultB: ReturnType<typeof computePaymentScenario> & { impliedPrice?: number },
  sliceA: HorizonSlice,
  sliceB: HorizonSlice,
  interpretation: HorizonInterpretation
): InsightBlock[] {
  const monthlyDiff = resultA.total - resultB.total;
  const rateDiff = a.rate - b.rate;
  const loanDiff = loanA - loanB;
  const ia = sliceA.interestPaid;
  const ib = sliceB.interestPaid;
  const interestEps = Math.max(75, Math.max(ia, ib) * 0.01);
  const lowerMonthly = monthlyDiff < -15 ? "A" : monthlyDiff > 15 ? "B" : null;
  const lowerInterest =
    ia < ib - interestEps ? "A" : ib < ia - interestEps ? "B" : null;

  const tradeoffLines: string[] = [];
  if (Math.abs(rateDiff) >= 0.0625) {
    tradeoffLines.push(
      `Rates differ (${a.rate.toFixed(3)}% vs ${b.rate.toFixed(3)}%)—that changes how interest accrues each month.`
    );
  }
  if (Math.abs(loanDiff) > Math.max(loanA, loanB, 1) * 0.03) {
    const bigger = loanA > loanB ? "A" : "B";
    tradeoffLines.push(`The loan is larger on ${bigger}, so more balance is subject to interest.`);
  }
  if (Math.abs(a.downPercent - b.downPercent) >= 1 && tradeoffLines.length < 2) {
    tradeoffLines.push(
      `Down payments differ (${a.downPercent.toFixed(1)}% vs ${b.downPercent.toFixed(1)}%)—borrowed amounts aren’t identical.`
    );
  }
  if (mode === "payment" && Math.abs(monthlyDiff) > 25) {
    tradeoffLines.push(
      `Monthly housing cost differs by about ${formatCurrencyDetailed(Math.abs(monthlyDiff))}—cash flow now versus interest over the horizon.`
    );
  }
  if (mode === "affordability" && tradeoffLines.length === 0) {
    tradeoffLines.push(
      `Tax and insurance scale with price here—rate and down payment move both implied price and cumulative interest.`
    );
  }
  if (tradeoffLines.length === 0) {
    tradeoffLines.push(
      `Structures are close on rate and loan size; small quote-level changes can move the picture—worth validating with real numbers.`
    );
  }

  const advisoryLines: string[] = [];
  if (interpretation.strength === "tie" || interpretation.interestWinner === "tie") {
    advisoryLines.push(
      `With loan interest this close, we’d stress-test both scenarios with actual quotes and talk through how long you expect to hold.`
    );
    if (lowerMonthly) {
      advisoryLines.push(
        `If monthly comfort is the gating factor, Scenario ${lowerMonthly} is easier on the budget—your advisor still weighs taxes, insurance, and goals.`
      );
    }
  } else if (interpretation.strength === "mixed" && lowerMonthly && lowerInterest && lowerMonthly !== lowerInterest) {
    advisoryLines.push(
      `If keeping borrowing cost lower is the priority, Scenario ${lowerInterest} is the stronger read on interest. If near-term cash preservation matters more, Scenario ${lowerMonthly} may still deserve consideration.`
    );
    advisoryLines.push(`This is where timeline and liquidity should decide the structure—not the spreadsheet alone.`);
  } else {
    const li = interpretation.interestWinner;
    if (li === "A" || li === "B") {
      advisoryLines.push(
        `If minimizing loan interest over this horizon matches your plan, Scenario ${li} is the directional lean—still confirm with underwriting and your full balance sheet.`
      );
      if (lowerMonthly && lowerMonthly !== li) {
        advisoryLines.push(
          `Scenario ${lowerMonthly} is lighter on the monthly payment; if liquidity matters more than this interest gap, bring that into the conversation.`
        );
      }
    }
  }

  if (advisoryLines.length === 0) {
    advisoryLines.push(
      `Bring this snapshot to your advisor with your actual quotes—timeline, savings, and stability usually refine the final structure.`
    );
  }

  return [
    {
      type: "tradeoff",
      label: "Tradeoff",
      title: "Why the difference exists",
      lines: tradeoffLines,
    },
    {
      type: "advisory",
      label: "Guidance",
      title: "What to discuss next",
      lines: advisoryLines,
    },
  ];
}

type MetricRow = {
  key: string;
  label: string;
  hint?: string;
  valA: number;
  valB: number;
  higherIsBetter: boolean;
};

function PositionComparison({
  horizonLabel,
  posA,
  posB,
}: {
  horizonLabel: string;
  posA: PositionSnapshot;
  posB: PositionSnapshot;
}) {
  const rows: MetricRow[] = [
    {
      key: "total",
      label: "Total paid over the period",
      hint: "PITI — mortgage, taxes, and insurance",
      valA: posA.totalHousingOutflow,
      valB: posB.totalHousingOutflow,
      higherIsBetter: false,
    },
    {
      key: "interest",
      label: "Interest paid",
      hint: "Borrowing cost over this horizon (loan interest only)",
      valA: posA.interestPaid,
      valB: posB.interestPaid,
      higherIsBetter: false,
    },
    {
      key: "principal",
      label: "Principal gained (equity from payments)",
      valA: posA.principalPaid,
      valB: posB.principalPaid,
      higherIsBetter: true,
    },
    {
      key: "balance",
      label: "Remaining loan balance",
      valA: posA.remainingBalance,
      valB: posB.remainingBalance,
      higherIsBetter: false,
    },
  ];

  function MetricCell({
    rowKey,
    cell,
    valA,
    valB,
    higherIsBetter,
    valueTransitionKey,
  }: {
    rowKey: string;
    cell: ScenarioId;
    valA: number;
    valB: number;
    higherIsBetter: boolean;
    valueTransitionKey: string;
  }) {
    const val = cell === "A" ? valA : valB;
    const better = rowBetter(valA, valB, higherIsBetter);
    const isWinner = better === cell;
    const humanLine = humanInterpretation(rowKey, cell, valA, valB, higherIsBetter);
    return (
      <td
        className={`py-3 px-3 sm:px-4 align-top transition-colors duration-200 ${
          isWinner ? `${WINNER_SURFACE} text-navy` : "font-medium text-slate-600"
        }`}
      >
        {humanLine && (
          <p className="font-sans font-semibold text-navy text-[13px] leading-snug mb-1">{humanLine}</p>
        )}
        <motion.div
          key={valueTransitionKey}
          initial={{ opacity: 0.72 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={
            humanLine
              ? "font-sans text-slate-400 text-[11px] tabular-nums font-medium"
              : "font-sans font-semibold text-navy tabular-nums text-[13px]"
          }
        >
          {formatCurrency(val)}
        </motion.div>
      </td>
    );
  }

  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-surface/40 overflow-hidden">
      <div className="px-4 py-3 sm:px-5 border-b border-slate-200/90 bg-white/60">
        <h3 className="font-heading font-semibold text-navy text-lg sm:text-xl tracking-[-0.02em]">
          Position after {horizonLabel}
        </h3>
        <p className="type-caption text-slate-500 mt-1 text-[13px]">
          Cumulative view of outflows and loan balance—not a payoff quote. Highlights favor the
          stronger value per row.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-100 bg-white/50">
              <th className="font-sans font-semibold text-navy/70 text-[11px] uppercase tracking-[0.12em] py-3 px-4 sm:px-5 w-[40%]">
                Metric
              </th>
              <th className="font-sans font-semibold text-navy text-[11px] uppercase tracking-[0.12em] py-3 px-3 sm:px-4">
                Scenario A
              </th>
              <th className="font-sans font-semibold text-navy text-[11px] uppercase tracking-[0.12em] py-3 px-3 sm:px-4">
                Scenario B
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-slate-100/80 last:border-0">
                <td className="py-3 px-4 sm:px-5 align-top">
                  <span className="font-sans text-slate-600 text-[13px] leading-snug">{row.label}</span>
                  {row.hint && (
                    <span className="block font-sans text-slate-400 text-[11px] mt-0.5 leading-snug">
                      {row.hint}
                    </span>
                  )}
                </td>
                <MetricCell
                  rowKey={row.key}
                  cell="A"
                  valA={row.valA}
                  valB={row.valB}
                  higherIsBetter={row.higherIsBetter}
                  valueTransitionKey={`${horizonLabel}-${row.key}-A`}
                />
                <MetricCell
                  rowKey={row.key}
                  cell="B"
                  valA={row.valA}
                  valB={row.valB}
                  higherIsBetter={row.higherIsBetter}
                  valueTransitionKey={`${horizonLabel}-${row.key}-B`}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-[11px] text-slate-400 px-4 py-3 sm:px-5 border-t border-slate-100/80 leading-relaxed">
        Principal paydown builds equity from loan payments; it does not include down payment or home
        appreciation. Net cost of borrowing equals interest over this window (closing costs not
        modeled).
      </p>
    </div>
  );
}

/** Main interpretation anchor: conclusion → dominant delta → supporting metrics. */
function HorizonComparisonSummary({
  interpretation,
  horizonLabel,
  horizonMonths,
  selectedHorizon,
  posA,
  posB,
  sliceA,
  sliceB,
  inputFlash,
}: {
  interpretation: HorizonInterpretation;
  horizonLabel: string;
  horizonMonths: number;
  selectedHorizon: SimulatorHorizonYears;
  posA: PositionSnapshot;
  posB: PositionSnapshot;
  sliceA: HorizonSlice;
  sliceB: HorizonSlice;
  /** Brief dim when inputs change (linked feedback). */
  inputFlash: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const animIA = useAnimatedNumber(sliceA.interestPaid, reduced);
  const animIB = useAnimatedNumber(sliceB.interestPaid, reduced);
  const animPA = useAnimatedNumber(sliceA.principalPaid, reduced);
  const animPB = useAnimatedNumber(sliceB.principalPaid, reduced);
  const animBA = useAnimatedNumber(posA.remainingBalance, reduced);
  const animBB = useAnimatedNumber(posB.remainingBalance, reduced);
  const animGap = useAnimatedNumber(interpretation.interestGap, reduced);

  return (
    <motion.div
      layout
      key={`snapshot-shell-${selectedHorizon}`}
      initial={reduced ? false : { opacity: 0.97, y: 6 }}
      animate={{
        opacity: inputFlash ? 0.93 : 1,
        y: 0,
      }}
      transition={{ duration: inputFlash ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="group/snapshot relative mb-8 lg:mb-10 rounded-[4px] border border-slate-200/80 bg-white shadow-[0_20px_64px_rgba(10,25,47,0.085)] overflow-hidden ring-1 ring-slate-100/80"
    >
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[min(100%,42rem)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(197,160,89,0.09),transparent_68%)] opacity-90"
        aria-hidden
      />
      <div className="h-[3px] bg-gradient-to-r from-gold/85 via-gold/50 to-gold/15" aria-hidden />
      <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6 lg:mb-7">
          <div>
            <p className="type-label text-navy/32 tracking-[0.18em] mb-1">Decision read</p>
            <p className="type-label text-gold/90 tracking-[0.2em]">Horizon snapshot</p>
          </div>
          <p className="type-caption text-slate-400 tabular-nums">
            {horizonLabel} · first {horizonMonths} payments
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedHorizon}-${interpretation.primaryHeadline}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 lg:mb-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="min-w-0 flex-1">
                <h2 className="font-heading font-semibold text-[1.85rem] sm:text-[2.35rem] lg:text-[2.65rem] xl:text-[2.75rem] text-navy tracking-[-0.038em] leading-[1.14] max-w-4xl">
                  {interpretation.primaryHeadline}
                </h2>
                <div className="mt-3 lg:hidden max-w-md">
                  <DecisionConfidenceBlock
                    confidence={interpretation.confidence}
                    transitionKey={selectedHorizon}
                  />
                </div>
                {interpretation.primarySubline && (
                  <p className="mt-4 text-slate-500 text-[15px] sm:text-[16px] leading-[1.65] max-w-3xl">
                    {interpretation.primarySubline}
                  </p>
                )}
              </div>
              <div className="hidden lg:block shrink-0 w-[11rem] xl:w-[11.5rem] pt-0.5">
                <DecisionConfidenceBlock
                  confidence={interpretation.confidence}
                  transitionKey={selectedHorizon}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`delta-block-${selectedHorizon}-${Math.round(animGap)}`}
          initial={reduced ? false : { opacity: 0.82 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, delay: reduced ? 0 : 0.02, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 lg:mb-3 rounded-[3px] bg-gradient-to-br from-navy/[0.06] to-transparent border border-navy/12 px-5 py-5 sm:px-7 sm:py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-navy/[0.04]"
        >
          <p className="type-label text-navy/35 tracking-[0.16em] mb-2">Loan interest difference</p>
          <p className="font-heading font-bold text-[2.65rem] sm:text-[3.25rem] lg:text-[3.6rem] xl:text-[3.85rem] text-navy tracking-[-0.048em] tabular-nums leading-[0.98] mb-2.5">
            {formatCurrency(animGap)}
          </p>
          <p className="font-sans text-sm sm:text-[15px] text-slate-500 leading-snug max-w-2xl font-medium">
            {interpretation.deltaDisplay}
          </p>
          {interpretation.deltaReinforcement && (
            <p className="mt-3 pt-3 border-t border-navy/10 font-sans text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              {interpretation.deltaReinforcement}
            </p>
          )}
        </motion.div>

        <HorizonComparisonBars
          scenarioA={{
            interest: animIA,
            principal: animPA,
            balance: animBA,
          }}
          scenarioB={{
            interest: animIB,
            principal: animPB,
            balance: animBB,
          }}
          horizonLabel={horizonLabel}
          winnerScenario={interpretation.interestWinner}
          selectedHorizon={selectedHorizon}
          interestWinnerKey={interpretation.interestWinner}
        />

        <p className="type-label text-navy/30 tracking-[0.14em] mb-3">Supporting figures</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <motion.div
            key={`a-metrics-${selectedHorizon}`}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="rounded-[3px] border border-slate-100/90 bg-surface/30 px-4 py-3 sm:py-3.5"
          >
            <p className="type-label text-navy/40 tracking-[0.12em] mb-2.5">Scenario A</p>
            <dl className="space-y-2 text-[12px] sm:text-[13px]">
              <div className="flex justify-between gap-3 text-slate-500">
                <dt>Interest paid</dt>
                <dd className="font-medium text-navy tabular-nums">{formatCurrency(animIA)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-slate-500">
                <dt>Principal gained</dt>
                <dd className="font-medium text-navy tabular-nums">{formatCurrency(animPA)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-slate-500 pt-1 border-t border-slate-100/80">
                <dt>Remaining balance</dt>
                <dd className="font-medium text-navy tabular-nums">{formatCurrency(animBA)}</dd>
              </div>
            </dl>
          </motion.div>
          <motion.div
            key={`b-metrics-${selectedHorizon}`}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.03 }}
            className="rounded-[3px] border border-slate-100/90 bg-surface/30 px-4 py-3 sm:py-3.5"
          >
            <p className="type-label text-navy/40 tracking-[0.12em] mb-2.5">Scenario B</p>
            <dl className="space-y-2 text-[12px] sm:text-[13px]">
              <div className="flex justify-between gap-3 text-slate-500">
                <dt>Interest paid</dt>
                <dd className="font-medium text-navy tabular-nums">{formatCurrency(animIB)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-slate-500">
                <dt>Principal gained</dt>
                <dd className="font-medium text-navy tabular-nums">{formatCurrency(animPB)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-slate-500 pt-1 border-t border-slate-100/80">
                <dt>Remaining balance</dt>
                <dd className="font-medium text-navy tabular-nums">{formatCurrency(animBB)}</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const LoanSimulator = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>("payment");
  /** Single source of truth for the simulation window (drives all horizon-dependent math + copy). */
  const [selectedHorizon, setSelectedHorizon] = useState<SimulatorHorizonYears>(10);
  const [a, setA] = useState<Scenario>(defaultScenario);
  const [b, setB] = useState<Scenario>(() => ({
    ...defaultScenario(),
    rate: 6.875,
    downPercent: 15,
  }));

  /** Direct map — avoids `.find` failures that would silently fall back to 120 months for every selection. */
  const horizonMonths = SIMULATOR_HORIZON_MONTHS[selectedHorizon];

  const termMonthsA = Math.round(a.termYears * 12);
  const termMonthsB = Math.round(b.termYears * 12);

  const resultA = useMemo(() => {
    if (mode === "payment") {
      return computePaymentScenario({
        price: a.price,
        downPercent: a.downPercent,
        rate: a.rate,
        termYears: a.termYears,
        annualTax: a.annualTax,
        annualInsurance: a.annualInsurance,
      });
    }
    const maxPrice = computeMaxAffordablePrice({
      targetTotalMonthly: a.targetMonthly,
      downPercent: a.downPercent,
      rate: a.rate,
      termYears: a.termYears,
      taxPctOfValueAnnual: a.taxPctOfValue,
      insurancePctOfValueAnnual: a.insurancePctOfValue,
    });
    if (maxPrice <= 0) {
      return {
        ...computePaymentScenario({
          price: 0,
          downPercent: a.downPercent,
          rate: a.rate,
          termYears: a.termYears,
          annualTax: 0,
          annualInsurance: 0,
        }),
        impliedPrice: 0,
      };
    }
    const br = breakdownFromPrice(maxPrice, {
      downPercent: a.downPercent,
      rate: a.rate,
      termYears: a.termYears,
      taxPctOfValueAnnual: a.taxPctOfValue,
      insurancePctOfValueAnnual: a.insurancePctOfValue,
    });
    return { ...br, impliedPrice: maxPrice };
  }, [mode, a]);

  const resultB = useMemo(() => {
    if (mode === "payment") {
      return computePaymentScenario({
        price: b.price,
        downPercent: b.downPercent,
        rate: b.rate,
        termYears: b.termYears,
        annualTax: b.annualTax,
        annualInsurance: b.annualInsurance,
      });
    }
    const maxPrice = computeMaxAffordablePrice({
      targetTotalMonthly: b.targetMonthly,
      downPercent: b.downPercent,
      rate: b.rate,
      termYears: b.termYears,
      taxPctOfValueAnnual: b.taxPctOfValue,
      insurancePctOfValueAnnual: b.insurancePctOfValue,
    });
    if (maxPrice <= 0) {
      return {
        ...computePaymentScenario({
          price: 0,
          downPercent: b.downPercent,
          rate: b.rate,
          termYears: b.termYears,
          annualTax: 0,
          annualInsurance: 0,
        }),
        impliedPrice: 0,
      };
    }
    const br = breakdownFromPrice(maxPrice, {
      downPercent: b.downPercent,
      rate: b.rate,
      termYears: b.termYears,
      taxPctOfValueAnnual: b.taxPctOfValue,
      insurancePctOfValueAnnual: b.insurancePctOfValue,
    });
    return { ...br, impliedPrice: maxPrice };
  }, [mode, b]);

  const loanA = mode === "payment" ? a.price * (1 - a.downPercent / 100) : resultA.loanAmount;
  const loanB = mode === "payment" ? b.price * (1 - b.downPercent / 100) : resultB.loanAmount;

  const sliceA = useMemo(
    () => cumulativePIOverHorizon(loanA, a.rate, termMonthsA, horizonMonths),
    [loanA, a.rate, termMonthsA, horizonMonths, selectedHorizon]
  );

  const sliceB = useMemo(
    () => cumulativePIOverHorizon(loanB, b.rate, termMonthsB, horizonMonths),
    [loanB, b.rate, termMonthsB, horizonMonths, selectedHorizon]
  );

  const positionSnapshots = useMemo(
    () => ({
      a: buildPositionSnapshot(sliceA, resultA, horizonMonths, termMonthsA),
      b: buildPositionSnapshot(sliceB, resultB, horizonMonths, termMonthsB),
    }),
    [sliceA, sliceB, resultA, resultB, horizonMonths, termMonthsA, termMonthsB, selectedHorizon]
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const term = Math.min(termMonthsA, termMonthsB);
    if (term < SIMULATOR_HORIZON_MONTHS[10]) return;
    const s5 = cumulativePIOverHorizon(loanA, a.rate, termMonthsA, SIMULATOR_HORIZON_MONTHS[5]);
    const s7 = cumulativePIOverHorizon(loanA, a.rate, termMonthsA, SIMULATOR_HORIZON_MONTHS[7]);
    const s10 = cumulativePIOverHorizon(loanA, a.rate, termMonthsA, SIMULATOR_HORIZON_MONTHS[10]);
    const interestOk = s5.interestPaid < s7.interestPaid && s7.interestPaid < s10.interestPaid;
    const balanceOk =
      s5.remainingBalance > s7.remainingBalance && s7.remainingBalance > s10.remainingBalance;
    if (!interestOk || !balanceOk) {
      console.warn("[LoanSimulator] Horizon monotonicity check failed", {
        interestOk,
        balanceOk,
        s5,
        s7,
        s10,
      });
    }
  }, [
    selectedHorizon,
    loanA,
    a.rate,
    termMonthsA,
    termMonthsB,
    horizonMonths,
  ]);

  const horizonLabelLong = HORIZONS.find((x) => x.key === selectedHorizon)?.label ?? "this horizon";

  const interpretation = useMemo(
    () =>
      buildHorizonInterpretation({
        sliceA,
        sliceB,
        posA: positionSnapshots.a,
        posB: positionSnapshots.b,
        monthlyA: resultA.total,
        monthlyB: resultB.total,
        horizonLabel: horizonLabelLong,
        selectedHorizon,
      }),
    [
      sliceA,
      sliceB,
      positionSnapshots.a,
      positionSnapshots.b,
      resultA.total,
      resultB.total,
      horizonLabelLong,
      selectedHorizon,
    ]
  );

  const lowerMonthlyForCards: ScenarioId | null =
    resultA.total + 15 < resultB.total ? "A" : resultB.total + 15 < resultA.total ? "B" : null;

  const cardPresentation = useMemo(
    () => getScenarioCardPresentation(interpretation, lowerMonthlyForCards),
    [interpretation, lowerMonthlyForCards]
  );

  const leadPayload = useMemo(
    () =>
      buildSimulatorLeadPayload({
        mode,
        a: { ...a },
        b: { ...b },
        resultA: {
          total: resultA.total,
          principalAndInterest: resultA.principalAndInterest,
          loanAmount: resultA.loanAmount,
          impliedPrice: resultA.impliedPrice,
        },
        resultB: {
          total: resultB.total,
          principalAndInterest: resultB.principalAndInterest,
          loanAmount: resultB.loanAmount,
          impliedPrice: resultB.impliedPrice,
        },
        selectedHorizon,
        horizonLabel: horizonLabelLong,
        horizonMonths,
        sliceA,
        sliceB,
        posA: positionSnapshots.a,
        posB: positionSnapshots.b,
        interpretation,
      }),
    [
      mode,
      a,
      b,
      resultA.total,
      resultA.principalAndInterest,
      resultA.loanAmount,
      resultA.impliedPrice,
      resultB.total,
      resultB.principalAndInterest,
      resultB.loanAmount,
      resultB.impliedPrice,
      selectedHorizon,
      horizonLabelLong,
      horizonMonths,
      sliceA,
      sliceB,
      positionSnapshots.a,
      positionSnapshots.b,
      interpretation,
    ]
  );

  const structureInsightBlocks = useMemo(() => {
    const directional: InsightBlock = {
      type: "directional",
      label: "Direction",
      title: interpretation.directionTitle,
      lines: interpretation.directionLines,
      confidence: {
        headline: interpretation.decisionHeadline,
        reason: interpretation.decisionReason ?? undefined,
      },
    };
    return [
      directional,
      ...buildTradeoffAdvisoryBlocks(
        mode,
        a,
        b,
        loanA,
        loanB,
        resultA,
        resultB,
        sliceA,
        sliceB,
        interpretation
      ),
    ];
  }, [mode, a, b, loanA, loanB, resultA, resultB, sliceA, sliceB, interpretation]);

  /** Unlocks contextual conversion CTA after the user explores the simulator (persisted for the session). */
  const [hasExploredSimulator, setHasExploredSimulator] = useState(() => {
    try {
      return sessionStorage.getItem("ihl_sim_explored") === "1";
    } catch {
      return false;
    }
  });
  const touchExploration = useCallback(() => {
    setHasExploredSimulator(true);
    try {
      sessionStorage.setItem("ihl_sim_explored", "1");
    } catch {
      /* private mode */
    }
  }, []);

  const updateA = (patch: Partial<Scenario>) => {
    touchExploration();
    setA((s) => ({ ...s, ...patch }));
  };
  const updateB = (patch: Partial<Scenario>) => {
    touchExploration();
    setB((s) => ({ ...s, ...patch }));
  };

  const firstHorizonRef = useRef(selectedHorizon);
  const firstModeRef = useRef(mode);
  const [horizonChanged, setHorizonChanged] = useState(false);
  const [modeChanged, setModeChanged] = useState(false);

  useEffect(() => {
    if (selectedHorizon !== firstHorizonRef.current) setHorizonChanged(true);
  }, [selectedHorizon]);

  useEffect(() => {
    if (mode !== firstModeRef.current) setModeChanged(true);
  }, [mode]);

  /** Early advisor CTA after a clarity signal (leader, payment gap, horizon/mode exploration). */
  const showEarlyConversion = useMemo(() => {
    if (!hasExploredSimulator) return false;
    const monthlyDiff = Math.abs(resultA.total - resultB.total);
    return (
      interpretation.interestWinner !== "tie" ||
      monthlyDiff >= 50 ||
      horizonChanged ||
      modeChanged
    );
  }, [
    hasExploredSimulator,
    resultA.total,
    resultB.total,
    interpretation.interestWinner,
    horizonChanged,
    modeChanged,
  ]);

  /** Subtle cue when setup inputs change so results feel linked (no scroll jump). */
  const [setupResultsFlash, setSetupResultsFlash] = useState(false);
  const setupFlashSkip = useRef(true);
  useEffect(() => {
    if (setupFlashSkip.current) {
      setupFlashSkip.current = false;
      return;
    }
    setSetupResultsFlash(true);
    const t = window.setTimeout(() => setSetupResultsFlash(false), 650);
    return () => window.clearTimeout(t);
  }, [a, b, mode, selectedHorizon]);

  return (
    <div
      className="
        bg-surface min-h-screen border-b border-slate-100
        pt-[calc(var(--site-header-height)+0.375rem)]
      "
    >
      <SimulatorConversionProvider payload={leadPayload} explorationReady={hasExploredSimulator}>
      <section className="max-w-7xl mx-auto px-6 pb-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-12 lg:mb-14 pt-2 sm:pt-3 lg:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl min-w-0 flex-1"
          >
            <h1 className="type-editorial-section-title text-[2rem] sm:text-4xl lg:text-[2.75rem] mb-5 leading-[1.08]">
              Loan Structure Simulator
            </h1>
            <p className="type-body-lg text-slate-600 max-w-2xl">
              Model monthly payments or work backward from a comfortable payment—then compare two
              structures side by side. Illustrative only; your advisor will refine this with real
              costs and goals.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0 w-full lg:w-auto lg:max-w-[20rem] self-start"
          >
            <SimulatorGuidedStart />
          </motion.div>
        </div>

        {/* SECTION 1 — Quick Setup (control panel) */}
        <div id="sim-scenario-inputs" className="mb-0 scroll-mt-28">
          <div className="max-w-3xl mb-6 lg:mb-8">
            <p className="type-label text-navy/40 tracking-[0.18em] mb-2">Compare your loan structures</p>
            <p className="type-body text-slate-600 text-[15px] leading-relaxed">
              Adjust both scenarios to see how structure changes your cost over time
            </p>
          </div>

          <div className="inline-flex p-1 bg-white rounded-[4px] border border-slate-200/70 shadow-[0_1px_6px_rgba(10,25,47,0.04)] mb-8 lg:mb-10">
            <button
              type="button"
              onClick={() => {
                touchExploration();
                setMode("payment");
              }}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-[3px] transition-all duration-300 ${
                mode === "payment"
                  ? "bg-navy text-white shadow-sm"
                  : "text-navy/65 hover:text-navy"
              }`}
            >
              Monthly payment
            </button>
            <button
              type="button"
              onClick={() => {
                touchExploration();
                setMode("affordability");
              }}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-[3px] transition-all duration-300 ${
                mode === "affordability"
                  ? "bg-navy text-white shadow-sm"
                  : "text-navy/65 hover:text-navy"
              }`}
            >
              Affordability
            </button>
          </div>

          <p className="type-caption text-slate-400 text-[12px] sm:text-[13px] mb-4 lg:mb-5 max-w-2xl leading-relaxed">
            Start by adjusting either scenario to match your situation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
            <ScenarioCard
              label="Scenario A"
              mode={mode}
              s={a}
              result={resultA}
              onChange={updateA}
              dominance={cardPresentation.cardA}
              chipLabel={cardPresentation.labelA}
              horizonKey={selectedHorizon}
              phase="setup"
              winnerPulseKey={`${selectedHorizon}-${interpretation.interestWinner}-${interpretation.strength}-${interpretation.interestGap}`}
            />
            <ScenarioCard
              label="Scenario B"
              mode={mode}
              s={b}
              result={resultB}
              onChange={updateB}
              dominance={cardPresentation.cardB}
              chipLabel={cardPresentation.labelB}
              horizonKey={selectedHorizon}
              phase="setup"
              winnerPulseKey={`${selectedHorizon}-${interpretation.interestWinner}-${interpretation.strength}-${interpretation.interestGap}`}
            />
          </div>
        </div>

        {/* Phase shift: control panel → decision (strong separation) */}
        <div
          className="mt-16 lg:mt-24 xl:mt-28 mb-12 lg:mb-16 pt-10 lg:pt-14 border-t border-slate-200/80"
          aria-labelledby="results-phase-heading"
        >
          <div className="rounded-[4px] border border-slate-200/55 bg-gradient-to-br from-slate-50/95 via-white to-slate-50/30 px-6 py-9 sm:px-8 sm:py-10 lg:px-10 lg:py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_40px_rgba(10,25,47,0.04)]">
            <h2
              id="results-phase-heading"
              className="font-heading text-[1.65rem] sm:text-[2.1rem] lg:text-[2.45rem] text-navy tracking-[-0.035em] leading-[1.18] max-w-3xl mb-4"
            >
              See how your structure performs over time
            </h2>
            <p className="text-slate-500 text-[15px] sm:text-[16px] leading-[1.65] max-w-3xl">
              Compare how each scenario behaves across different time horizons — cost, balance, and
              long-term impact.
            </p>
          </div>
        </div>

        {/* SECTION 2 — Decision Engine */}
        <div className="relative">
          <div className="max-w-3xl mb-8 lg:mb-10">
            <p className="type-label text-gold/90 tracking-[0.2em] mb-2">Decision engine</p>
            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed max-w-2xl">
              Choose a horizon—the snapshot and chart below update instantly. Your inputs stay in the
              cards above.
            </p>
          </div>

          <div id="sim-comparison-results" className="scroll-mt-28">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span id="time-horizon-label" className="type-label text-navy/50 mr-1">
                  Time horizon
                </span>
                <LayoutGroup>
                  <div
                    role="group"
                    aria-labelledby="time-horizon-label"
                    className="inline-flex p-1 bg-white rounded-[4px] border border-slate-200/90 shadow-sm relative"
                  >
                    {HORIZONS.map((h) => {
                      const active = selectedHorizon === h.key;
                      return (
                        <button
                          key={h.key}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                          touchExploration();
                          setSelectedHorizon(h.key);
                        }}
                          className={`relative z-[1] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] rounded-[3px] transition-colors duration-200 ease-out ${
                            active
                              ? "text-white"
                              : "text-navy/55 hover:text-navy hover:bg-slate-50/90"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="simHorizonTab"
                              className="absolute inset-0 rounded-[3px] bg-navy shadow-sm ring-1 ring-inset ring-white/10"
                              transition={{
                                type: "spring",
                                stiffness: reducedMotion ? 800 : 520,
                                damping: reducedMotion ? 60 : 36,
                              }}
                            />
                          )}
                          <span className="relative z-[2]">{h.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </div>
              <p className="type-caption text-slate-500 text-[12px] leading-relaxed max-w-xl sm:ml-0">
                First{" "}
                <span className="font-medium text-navy/70 tabular-nums">{horizonMonths}</span> payments
                ({horizonLabelLong}; 10+ = first 10 years). Capped at payoff if the loan ends sooner.
              </p>
            </div>
          </div>

          <motion.div
            id="sim-decision-snapshot"
            className="scroll-mt-28 rounded-[4px]"
            animate={
              setupResultsFlash
                ? { boxShadow: "0 0 0 1px rgba(197,160,89,0.2)", transition: { duration: 0.35 } }
                : { boxShadow: "0 0 0 0px rgba(197,160,89,0)", transition: { duration: 0.5 } }
            }
          >
            <HorizonComparisonSummary
              interpretation={interpretation}
              horizonLabel={horizonLabelLong}
              horizonMonths={horizonMonths}
              selectedHorizon={selectedHorizon}
              posA={positionSnapshots.a}
              posB={positionSnapshots.b}
              sliceA={sliceA}
              sliceB={sliceB}
              inputFlash={setupResultsFlash}
            />
          </motion.div>

          <SimulatorConversionEarlyCta visible={showEarlyConversion} />
          </div>

        {/* Transition: numbers → interpretation */}
        <div id="sim-decision-interpretation" className="scroll-mt-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-5 lg:mb-6"
        >
          <p className="type-label text-gold/90 tracking-[0.18em] mb-2">What this means</p>
          <p className="font-heading text-xl sm:text-2xl text-navy tracking-[-0.02em] leading-snug max-w-2xl">
            From numbers to interpretation
          </p>
        </motion.div>

        {/* Insights */}
        <motion.div
          layout
          className="card-home-elevated p-6 sm:p-8 lg:p-10 bg-white border-slate-200/90"
        >
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-navy text-xl sm:text-2xl tracking-[-0.02em] mb-1">
                Structure insights
              </h2>
              <p className="type-caption text-slate-500 text-[13px] leading-relaxed">
                Illustrative only. Underwriting and your full situation come next.
              </p>
            </div>
          </div>

          <div className="space-y-14 lg:space-y-16">
            <motion.div
              key={`pos-${mode}-${selectedHorizon}`}
              initial={{ opacity: 0.92 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <PositionComparison
                horizonLabel={horizonLabelLong}
                posA={positionSnapshots.a}
                posB={positionSnapshots.b}
              />
            </motion.div>

            <AnimatePresence mode="popLayout">
              {structureInsightBlocks.map((block, i) => {
                const Icon =
                  block.type === "directional"
                    ? Compass
                    : block.type === "tradeoff"
                      ? ArrowLeftRight
                      : MessageCircle;

                if (block.type === "directional") {
                  return (
                    <motion.article
                      key={`direction-${mode}-${selectedHorizon}-${block.type}`}
                      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.5, delay: 0.03, ease: [0.22, 1, 0.36, 1] }}
                      className={`rounded-[4px] border border-gold/25 ${WINNER_SURFACE} ${WINNER_BORDER_ACCENT} pl-6 sm:pl-8 pr-5 sm:pr-8 py-10 sm:py-12 lg:py-14 shadow-[0_4px_44px_rgba(10,25,47,0.05)]`}
                    >
                      <p className="type-label text-gold/95 tracking-[0.16em] mb-5">{block.label}</p>
                      {block.confidence && (
                        <div className="mb-8 max-w-2xl">
                          <p className="type-label text-navy/45 tracking-[0.14em] mb-2">Decision strength</p>
                          <p className="font-heading text-xl sm:text-2xl lg:text-[1.65rem] text-navy tracking-[-0.02em] leading-snug">
                            {block.confidence.headline}
                          </p>
                          {block.confidence.reason && (
                            <p className="font-sans text-sm text-slate-500 mt-2 leading-relaxed">
                              {block.confidence.reason}
                            </p>
                          )}
                        </div>
                      )}
                      <h3 className="font-heading font-semibold text-navy text-[1.85rem] sm:text-[2.35rem] lg:text-[2.5rem] tracking-[-0.035em] leading-[1.1] mb-6">
                        {block.title}
                      </h3>
                      <div className="space-y-3 max-w-3xl">
                        {block.lines.map((line, j) => (
                          <p
                            key={j}
                            className="font-sans text-slate-600 text-[15px] leading-[1.65]"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </motion.article>
                  );
                }

                if (block.type === "tradeoff") {
                  return (
                    <motion.article
                      key={`${mode}-${selectedHorizon}-${block.type}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 + i * 0.04 }}
                      className="flex gap-4 sm:gap-5 pt-10 border-t border-slate-100/90"
                    >
                      <div className="w-9 h-9 rounded-full bg-surface border border-slate-100 flex items-center justify-center text-navy/45 shrink-0 mt-0.5">
                        <Icon size={17} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <p className="type-label text-navy/45 tracking-[0.14em]">{block.label}</p>
                        <h3 className="font-heading font-semibold text-navy text-lg sm:text-xl tracking-[-0.02em] leading-snug">
                          {block.title}
                        </h3>
                        <div className="space-y-2.5">
                          {block.lines.map((line, j) => (
                            <p
                              key={j}
                              className="font-sans text-slate-600 text-[14px] sm:text-[15px] leading-[1.62]"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  );
                }

                return (
                  <motion.article
                    key={`${mode}-${selectedHorizon}-${block.type}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.04 }}
                    className="rounded-[4px] bg-surface/70 border border-slate-100/90 px-5 py-5 sm:px-6 sm:py-6 mt-2"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-navy/35 shrink-0 mt-0.5">
                        <Icon size={17} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <p className="type-label text-navy/40 tracking-[0.12em]">{block.label}</p>
                        <h3 className="font-heading font-semibold text-navy/90 text-lg tracking-[-0.015em] leading-snug">
                          {block.title}
                        </h3>
                        <div className="space-y-2.5">
                          {block.lines.map((line, j) => (
                            <p
                              key={j}
                              className="font-sans text-slate-500 text-[14px] leading-[1.65] not-italic"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
        </div>

        <SimulatorConversionMainCta />
        </div>

      </section>
      <SimulatorConversionSlideIn />
      </SimulatorConversionProvider>
    </div>
  );
};

function ScenarioCard({
  label,
  mode,
  s,
  result,
  onChange,
  dominance,
  chipLabel,
  horizonKey,
  phase = "setup",
  winnerPulseKey,
}: {
  label: string;
  mode: Mode;
  s: Scenario;
  result: ReturnType<typeof computePaymentScenario> & { impliedPrice?: number };
  onChange: (p: Partial<Scenario>) => void;
  dominance: CardDominance;
  chipLabel: string | null;
  horizonKey: SimulatorHorizonYears;
  /** Setup = control panel (lighter). Reserved for future split. */
  phase?: "setup";
  /** Changes when inputs/horizon/interpretation updates — subtle winner highlight. */
  winnerPulseKey?: string;
}) {
  const isSetup = phase === "setup";
  const skipWinnerPulse = useRef(true);
  const [winnerRing, setWinnerRing] = useState(false);

  useEffect(() => {
    if (!isSetup || dominance !== "winner" || !winnerPulseKey) return;
    if (skipWinnerPulse.current) {
      skipWinnerPulse.current = false;
      return;
    }
    setWinnerRing(true);
    const t = window.setTimeout(() => setWinnerRing(false), 520);
    return () => window.clearTimeout(t);
  }, [winnerPulseKey, dominance, isSetup]);

  const surface = isSetup
    ? dominance === "winner"
      ? "border border-gold/22 bg-gold/[0.02] border-slate-200/40"
      : dominance === "loser"
        ? "border border-slate-200/40 bg-white/[0.98]"
        : "border border-slate-200/40 bg-white/[0.99]"
    : dominance === "winner"
      ? `${WINNER_SURFACE} border border-gold/40 ${WINNER_BORDER_ACCENT} ring-1 ring-gold/20`
      : dominance === "loser"
        ? "border-slate-200/55 bg-white/98 border shadow-[0_1px_12px_rgba(10,25,47,0.028)]"
        : "border-slate-200/65 bg-white/98 border shadow-[0_1px_14px_rgba(10,25,47,0.022)]";

  const setupShadow = { boxShadow: "0 1px 4px rgba(10,25,47,0.014)" };
  const winnerPulse = {
    boxShadow: [
      "0 10px 44px rgba(197,160,89,0.13)",
      "0 12px 52px rgba(197,160,89,0.2)",
      "0 10px 44px rgba(197,160,89,0.13)",
    ],
  };

  return (
    <motion.div
      layout
      key={`${label}-${horizonKey}-${dominance}`}
      initial={false}
      animate={
        isSetup
          ? setupShadow
          : dominance === "winner"
            ? winnerPulse
            : dominance === "loser"
              ? { boxShadow: "0 1px 14px rgba(10,25,47,0.035)" }
              : { boxShadow: "0 2px 20px rgba(10,25,47,0.03)" }
      }
      transition={{ duration: isSetup ? 0.3 : 0.88, ease: [0.22, 1, 0.36, 1] }}
      className={`card-home p-5 lg:p-6 ${surface} transition-[box-shadow,border-color,box-shadow] duration-300 ${
        winnerRing ? "ring-2 ring-gold/35 ring-offset-2 ring-offset-surface" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-start gap-2 min-w-0">
          <Scale size={17} className={`shrink-0 mt-0.5 ${isSetup ? "text-gold/45" : "text-gold/80"}`} strokeWidth={1.5} />
          <div className="min-w-0">
            <span className="type-label text-navy/90 text-[11px] tracking-[0.14em]">{label}</span>
            <p className="type-caption text-slate-500/90 text-[11px] leading-snug mt-0.5">
              Structure inputs &amp; monthly payment
            </p>
          </div>
        </div>
        {chipLabel && (
          <span className="type-label text-gold/90 tracking-[0.12em] text-[10px] sm:text-[11px] text-right leading-snug max-w-[11rem] shrink-0">
            {chipLabel}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {mode === "affordability" ? (
          <Field
            label="Target monthly (total)"
            hint="P&I, taxes, insurance"
            value={s.targetMonthly}
            onChange={(v) => onChange({ targetMonthly: clamp(v, 500, 50000) })}
            prefix="$"
            step={100}
          />
        ) : (
          <Field
            label="Purchase price"
            value={s.price}
            onChange={(v) => onChange({ price: clamp(v, 25_000, 50_000_000) })}
            prefix="$"
            step={5000}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Down payment"
            value={s.downPercent}
            onChange={(v) => onChange({ downPercent: clamp(v, 0, 100) })}
            suffix="%"
            step={0.5}
          />
          <Field
            label="Interest rate"
            value={s.rate}
            onChange={(v) => onChange({ rate: clamp(v, 0.1, 25) })}
            suffix="%"
            step={0.125}
          />
        </div>

        <Field
          label="Loan term"
          value={s.termYears}
          onChange={(v) => onChange({ termYears: clamp(Math.round(v), 10, 40) })}
          suffix="years"
          step={5}
        />

        {mode === "payment" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <Field
              label="Property tax (annual)"
              value={s.annualTax}
              onChange={(v) => onChange({ annualTax: clamp(v, 0, 500_000) })}
              prefix="$"
              step={100}
            />
            <Field
              label="Insurance (annual)"
              value={s.annualInsurance}
              onChange={(v) => onChange({ annualInsurance: clamp(v, 0, 100_000) })}
              prefix="$"
              step={100}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Field
              label="Est. tax (% / yr)"
              hint="Of value"
              value={s.taxPctOfValue}
              onChange={(v) => onChange({ taxPctOfValue: clamp(v, 0, 5) })}
              suffix="%"
              step={0.05}
            />
            <Field
              label="Est. insurance (% / yr)"
              hint="Of value"
              value={s.insurancePctOfValue}
              onChange={(v) => onChange({ insurancePctOfValue: clamp(v, 0, 3) })}
              suffix="%"
              step={0.05}
            />
          </div>
        )}
      </div>

      <motion.div
        layout
        className="mt-6 pt-6 border-t border-slate-100/90 space-y-4"
      >
        {mode === "affordability" && result.impliedPrice !== undefined && (
          <div className="flex justify-between items-baseline gap-4">
            <span className="type-caption text-slate-500">Implied max price</span>
            <motion.span
              key={result.impliedPrice}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="font-heading text-xl sm:text-2xl font-semibold text-navy tabular-nums"
            >
              {result.impliedPrice > 0 ? formatCurrency(result.impliedPrice) : "—"}
            </motion.span>
          </div>
        )}
        <BreakdownRows result={result} mode={mode} />
        <MonthlyPaymentMixDonut
          principalAndInterest={result.principalAndInterest}
          propertyTax={result.propertyTax}
          insurance={result.insurance}
        />
      </motion.div>
    </motion.div>
  );
}

function BreakdownRows({
  result,
  mode,
}: {
  result: ReturnType<typeof computePaymentScenario> & { impliedPrice?: number };
  mode: Mode;
}) {
  return (
    <>
      <Row label="Principal & interest" value={result.principalAndInterest} k="pi" />
      <Row label="Property tax (mo.)" value={result.propertyTax} k="tax" />
      <Row label="Insurance (mo.)" value={result.insurance} k="ins" />
      <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
        <span className="type-label text-navy/65">Total monthly</span>
        <motion.span
          key={result.total}
          initial={{ opacity: 0.75 }}
          animate={{ opacity: 1 }}
          className="font-heading text-xl sm:text-2xl font-semibold text-gold tabular-nums"
        >
          {formatCurrencyDetailed(result.total)}
        </motion.span>
      </div>
      {mode === "payment" && (
        <p className="type-caption text-slate-400 pt-1">
          Loan amount {formatCurrency(result.loanAmount)}
        </p>
      )}
    </>
  );
}

function Row({
  label,
  value,
  k,
}: {
  label: string;
  value: number;
  k: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <motion.span
        key={`${k}-${value}`}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        className="font-sans font-medium text-navy tabular-nums"
      >
        {formatCurrencyDetailed(value)}
      </motion.span>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-2">
        <label className="type-label text-navy/55">{label}</label>
        {hint && <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400">{hint}</span>}
      </div>
      <div className="relative flex items-center rounded-[4px] border border-slate-200 bg-white focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20 transition-all duration-200">
        {prefix && (
          <span className="pl-3 text-slate-400 text-sm font-medium tabular-nums">{prefix}</span>
        )}
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent px-3 py-2.5 text-navy text-sm font-medium tabular-nums focus:outline-none min-w-0"
        />
        {suffix && (
          <span className="pr-3 text-slate-500 text-xs font-semibold tracking-wide">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default LoanSimulator;
