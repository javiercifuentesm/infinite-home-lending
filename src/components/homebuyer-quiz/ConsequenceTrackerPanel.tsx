import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ConsequenceTracker } from "../../lib/financialReality/engine";
import { formatCurrency } from "../../lib/financialReality/engine";
import { SharpStrip } from "./SharpStrip";

type Props = {
  tracker: ConsequenceTracker;
};

function AnimatedMoney({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.35, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="tabular-nums font-bold text-[#D64545]"
    >
      {formatCurrency(value)}
    </motion.span>
  );
}

/**
 * Wait vs act — day mode, clear loss emphasis.
 */
export function ConsequenceTrackerPanel({ tracker }: Props) {
  const {
    sharp,
    yearlyLossApprox,
    primaryHeadline,
    primaryHeadlineSub,
    monthlyMissedEquity,
    monthlyRentLost,
    monthlyPriceDrift,
    totalMonthlyImpact,
    scenarios,
    accumulationCurve,
    marketSensitivity,
    consequenceStatement,
    decisionPressureLine,
  } = tracker;

  const [activeId, setActiveId] = useState<ConsequenceTracker["scenarios"][0]["id"]>("now");
  const active = useMemo(() => scenarios.find((s) => s.id === activeId) ?? scenarios[0], [scenarios, activeId]);

  const chartData = accumulationCurve.map((p) => ({
    m: p.month,
    loss: p.cumulativeLoss,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-[0_16px_48px_rgba(11,31,58,0.07)]"
      aria-labelledby="consequence-tracker-heading"
    >
      <div
        className="border-b border-black/[0.05] bg-gradient-to-b from-white to-[#F7F9FC] px-6 py-8 sm:px-10 sm:py-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(212,175,55,0.06) 0%, rgba(247,249,252,0.95) 48%, #F7F9FC 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37] ring-1 ring-[#D4AF37]/30">
            <Activity className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8941E]">Real-time consequence</p>
            <p className="font-sans text-[13px] text-[rgba(11,31,58,0.65)]">Reality → consequence → pattern</p>
          </div>
        </div>
        <h2
          id="consequence-tracker-heading"
          className="mt-5 font-heading text-[1.35rem] font-bold leading-tight text-[#0B1F3A] sm:text-[1.55rem] md:text-[1.75rem]"
        >
          {primaryHeadline}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[rgba(11,31,58,0.85)] md:text-[16px]">{primaryHeadlineSub}</p>
        <p className="mt-4 font-mono text-[12px] font-bold text-[#0B1F3A] sm:text-[13px]">
          ~<span className="text-[#D64545]">{formatCurrency(totalMonthlyImpact)}</span>/mo → ~
          <span className="text-[#D64545]">{formatCurrency(yearlyLossApprox)}</span>/yr → gone
        </p>
      </div>

      <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
        <SharpStrip sharp={sharp} title="Sharp lines" />

        <div className="rounded-xl border border-black/[0.05] bg-[#F7F9FC] px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 md:px-7 md:py-6">
          <p className="font-heading text-[13px] font-bold text-[#0B1F3A]">You are currently losing</p>
          <ul className="mt-4 space-y-3 text-[15px] text-[#0B1F3A] md:text-[16px]">
            <li className="flex justify-between gap-3 border-b border-black/[0.06] pb-3">
              <span className="text-[#0B1F3A]/65">Missed equity build (approx.)</span>
              <span className="font-semibold tabular-nums">
                <AnimatedMoney value={monthlyMissedEquity} />/mo
              </span>
            </li>
            <li className="flex justify-between gap-3 border-b border-black/[0.06] pb-3">
              <span className="text-[#0B1F3A]/65">Rent (non-recoverable)</span>
              <span className="font-semibold tabular-nums">
                <AnimatedMoney value={monthlyRentLost} />/mo
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-[#0B1F3A]/65">Payment drag from drift (illustrative)</span>
              <span className="font-semibold tabular-nums">
                <AnimatedMoney value={monthlyPriceDrift} />/mo
              </span>
            </li>
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-4">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#0B1F3A]/65">Total impact</span>
            <span className="font-heading text-[1.35rem] font-bold tabular-nums text-[#D64545]">
              <AnimatedMoney value={totalMonthlyImpact} />
              <span className="text-[13px] font-semibold text-[#0B1F3A]/65">/mo</span>
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-black/[0.05] bg-white px-4 py-4 shadow-sm">
          <p className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0B1F3A]/45">
            Estimated cost accumulation (first year)
          </p>
          <div className="mt-3 h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="m" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v} mo`} stroke="#94a3b8" />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  stroke="#94a3b8"
                  width={44}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Cumulative"]}
                  labelFormatter={(m) => `Month ${m}`}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#D64545"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#0B1F3A" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]/45">Time-based scenarios</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  activeId === s.id
                    ? "bg-[#0B1F3A] text-white shadow-md"
                    : "border border-black/[0.08] bg-white text-[#0B1F3A] hover:border-[#D4AF37]/45"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-5 grid gap-4 rounded-xl border border-black/[0.05] bg-white p-5 shadow-sm sm:grid-cols-2"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B1F3A]/45">Purchase price</p>
                <p className="mt-1 font-heading text-[1.1rem] font-bold tabular-nums text-[#0B1F3A]">{formatCurrency(active.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B1F3A]/45">Monthly payment (PITI)</p>
                <p className="mt-1 font-heading text-[1.1rem] font-bold tabular-nums text-[#0B1F3A]">
                  {formatCurrency(active.monthlyPayment)}/mo
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B1F3A]/45">5-year cost (incl. wait rent)</p>
                <p className="mt-1 font-heading text-[1.05rem] font-bold text-amber-900 tabular-nums">{formatCurrency(active.totalCostFiveYear)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B1F3A]/45">Equity gained (5 yr, illus.)</p>
                <p className="mt-1 font-heading text-[1.05rem] font-bold text-emerald-800 tabular-nums">{formatCurrency(active.equityGainedFiveYear)}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-5 py-5">
          <p className="font-heading text-[13px] font-bold text-amber-950">Market sensitivity</p>
          <div className="mt-4 space-y-4 text-[14px] leading-snug text-amber-950 sm:text-[15px]">
            <p>
              <span className="font-semibold">At ±0.5% rate moves:</span> on your modeled loan size, payment shifts roughly{" "}
              <span className="font-bold text-[#D64545]">+{formatCurrency(marketSensitivity.ratePlusHalf.paymentDiff)}/mo</span> at +0.5%, and{" "}
              <span className="font-bold text-emerald-800 tabular-nums">{formatCurrency(marketSensitivity.rateMinusHalf.paymentDiff)}/mo</span> at −0.5%
              (same home, illustrative).
            </p>
            <p className="text-[13px] text-amber-950/90">{marketSensitivity.ratePlusHalf.qualificationLine}</p>
            <p>
              <span className="font-semibold">
                At {marketSensitivity.priceRiseBand.lowPct}–{marketSensitivity.priceRiseBand.highPct}% higher prices:
              </span>{" "}
              extra down pressure ~{formatCurrency(marketSensitivity.priceRiseBand.extraDown)}, payment lift ~
              {formatCurrency(marketSensitivity.priceRiseBand.paymentLift)}/mo. {marketSensitivity.priceRiseBand.incomeNote}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/[0.05] bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex gap-3">
            <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-[#D64545]" strokeWidth={1.75} aria-hidden />
            <p className="text-[15px] font-medium leading-relaxed text-[#0B1F3A] md:text-[16px]">{consequenceStatement}</p>
          </div>
        </div>

        <div className="rounded-xl border border-black/[0.06] border-l-4 border-l-[#D4AF37] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-0.5">
          <p className="text-[15px] font-bold leading-snug text-[#0B1F3A] sm:text-[1.05rem]">{decisionPressureLine}</p>
        </div>

        <p className="text-center text-[11px] leading-relaxed text-[#0B1F3A]/45">
          Illustrative scenarios only — not a loan quote, approval, or market forecast.
        </p>
      </div>
    </motion.section>
  );
}
