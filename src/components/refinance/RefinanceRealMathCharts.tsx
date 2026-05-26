import { useEffect, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AmortMonth } from "../../lib/refinanceRealMathModel";

const GOLD = "#C5A059";
const NAVY = "#0A192F";
const REF_LINE = "#C89B5A";

export type RefinanceChartStrings = {
  breakEvenLabel: (month: number) => string;
  lessInterestLabel: (amount: string) => string;
  moreInterestLabel: (amount: string) => string;
  loanPaidOff: string;
  principalAccelerating: string;
  tooltipYear: (year: number, month: number) => string;
  totalInterestCurrent: string;
  totalInterestNew: string;
  remainingCurrent: string;
  remainingNew: string;
  equityBuiltCurrent: string;
  equityBuiltNew: string;
  equityPctCurrent: string;
  equityPctNew: string;
  equityCurrent: string;
  equityNew: string;
  balanceCurrent: string;
  balanceNew: string;
  pctPaidCurrent: string;
};

export type InterestChartRow = {
  month: number;
  year: number;
  currentInterest: number;
  newInterest: number;
  low: number;
  spread: number;
  balanceCurrent: number;
  balanceNew: number;
  equityCurrent: number;
  equityNew: number;
};

function buildRows(seriesCurrent: AmortMonth[], seriesNew: AmortMonth[]): InterestChartRow[] {
  const len = Math.max(seriesCurrent.length, seriesNew.length);
  const rows: InterestChartRow[] = [];
  for (let i = 0; i < len; i++) {
    const c = seriesCurrent[i];
    const n = seriesNew[i];
    const ci = c?.cumulativeInterest ?? 0;
    const ni = n?.cumulativeInterest ?? 0;
    const low = Math.min(ci, ni);
    const spread = Math.abs(ni - ci);
    const month = i + 1;
    rows.push({
      month,
      year: month / 12,
      currentInterest: ci,
      newInterest: ni,
      low,
      spread,
      balanceCurrent: c?.balanceEnd ?? 0,
      balanceNew: n?.balanceEnd ?? 0,
      equityCurrent: c?.cumulativePrincipal ?? 0,
      equityNew: n?.cumulativePrincipal ?? 0,
    });
  }
  return rows;
}

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function yTicks50k(maxVal: number): number[] {
  const step = 50_000;
  const top = Math.max(step, Math.ceil(maxVal / step) * step);
  const out: number[] = [];
  for (let v = 0; v <= top; v += step) out.push(v);
  return out;
}

const YEAR_TICK_MONTHS = [12, 60, 120, 180, 240, 300, 360];

function makeInterestTooltip(chartStrings: RefinanceChartStrings) {
  return function InterestTooltip({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: InterestChartRow }>;
  }) {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    const own = (eq: number, bal: number) => {
      const t = eq + bal;
      return t > 0 ? Math.round((eq / t) * 1000) / 10 : 0;
    };
    const yearLabel = Math.max(1, Math.ceil(p.month / 12));
    return (
      <div className="tooltip-box">
        <p className="font-semibold text-navy">{chartStrings.tooltipYear(yearLabel, p.month)}</p>
        <p className="mt-1.5 text-slate-600">
          {chartStrings.totalInterestCurrent}{" "}
          <span className="font-medium text-navy">{fmtMoney(p.currentInterest)}</span>
        </p>
        <p className="text-slate-600">
          {chartStrings.totalInterestNew}{" "}
          <span className="font-medium text-navy">{fmtMoney(p.newInterest)}</span>
        </p>
        <p className="mt-1.5 text-slate-600">
          {chartStrings.remainingCurrent}{" "}
          <span className="font-medium">{fmtMoney(p.balanceCurrent)}</span>
        </p>
        <p className="text-slate-600">
          {chartStrings.remainingNew}{" "}
          <span className="font-medium">{fmtMoney(p.balanceNew)}</span>
        </p>
        <p className="mt-1.5 text-slate-600">
          {chartStrings.equityBuiltCurrent}{" "}
          <span className="font-medium">{fmtMoney(p.equityCurrent)}</span>
        </p>
        <p className="text-slate-600">
          {chartStrings.equityBuiltNew}{" "}
          <span className="font-medium">{fmtMoney(p.equityNew)}</span>
        </p>
        <p className="mt-2 text-[11px] text-slate-500">
          {chartStrings.equityPctCurrent} {own(p.equityCurrent, p.balanceCurrent)}% · {chartStrings.equityPctNew}{" "}
          {own(p.equityNew, p.balanceNew)}%
        </p>
      </div>
    );
  };
}

function makeEquityTooltip(chartStrings: RefinanceChartStrings) {
  return function EquityTooltip({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: InterestChartRow }>;
  }) {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    const own = (eq: number, bal: number) => {
      const t = eq + bal;
      return t > 0 ? Math.round((eq / t) * 1000) / 10 : 0;
    };
    const yearLabel = Math.max(1, Math.ceil(p.month / 12));
    return (
      <div className="tooltip-box">
        <p className="font-semibold text-navy">{chartStrings.tooltipYear(yearLabel, p.month)}</p>
        <p className="mt-1.5 text-slate-600">
          {chartStrings.equityCurrent}{" "}
          <span className="font-medium text-navy">{fmtMoney(p.equityCurrent)}</span>
        </p>
        <p className="text-slate-600">
          {chartStrings.equityNew}{" "}
          <span className="font-medium text-navy">{fmtMoney(p.equityNew)}</span>
        </p>
        <p className="mt-1.5 text-slate-600">
          {chartStrings.balanceCurrent}{" "}
          <span className="font-medium">{fmtMoney(p.balanceCurrent)}</span>
        </p>
        <p className="text-slate-600">
          {chartStrings.balanceNew}{" "}
          <span className="font-medium">{fmtMoney(p.balanceNew)}</span>
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          {chartStrings.pctPaidCurrent} {own(p.equityCurrent, p.balanceCurrent)}% · {chartStrings.equityPctNew}{" "}
          {own(p.equityNew, p.balanceNew)}%
        </p>
      </div>
    );
  };
}

type InterestChartProps = {
  seriesCurrent: AmortMonth[];
  seriesNew: AmortMonth[];
  breakEvenMonths: number | null;
  chartKey: string;
  reducedMotion: boolean;
  currentPayoffMonth: number | null;
  chartStrings: RefinanceChartStrings;
};

export function RefinanceInterestChartRecharts({
  seriesCurrent,
  seriesNew,
  breakEvenMonths,
  chartKey,
  reducedMotion,
  currentPayoffMonth,
  chartStrings,
}: InterestChartProps) {
  const data = useMemo(() => buildRows(seriesCurrent, seriesNew), [seriesCurrent, seriesNew]);
  const [showPulse, setShowPulse] = useState(true);
  const InterestTooltip = useMemo(() => makeInterestTooltip(chartStrings), [chartStrings]);

  useEffect(() => {
    setShowPulse(true);
    const t = window.setTimeout(() => setShowPulse(false), 3500);
    return () => window.clearTimeout(t);
  }, [chartKey]);

  const maxInt = Math.max(
    1,
    ...data.map((d) => Math.max(d.currentInterest, d.newInterest))
  );
  const paddedMax = maxInt * 1.2;
  const yTicks = yTicks50k(paddedMax);
  const domainMax = yTicks[yTicks.length - 1] ?? paddedMax;

  const maxMonth = data.length;
  const be =
    breakEvenMonths != null && Number.isFinite(breakEvenMonths) && breakEvenMonths > 0 && breakEvenMonths <= maxMonth
      ? Math.ceil(breakEvenMonths)
      : null;

  const xTicks = YEAR_TICK_MONTHS.filter((m) => m <= maxMonth);
  if (maxMonth > 0 && !xTicks.includes(maxMonth) && maxMonth < 400) xTicks.push(maxMonth);

  const last = data[data.length - 1];
  const refiMore = last ? last.newInterest - last.currentInterest : 0;

  const pulseMonth = data.length >= 2 ? 2 : data.length === 1 ? 1 : 0;
  const pulseRow = pulseMonth > 0 ? data[pulseMonth - 1] : undefined;
  const pulseY =
    pulseRow != null ? (pulseRow.currentInterest + pulseRow.newInterest) / 2 : maxInt * 0.4;

  const endCalloutText =
    refiMore >= 0
      ? chartStrings.moreInterestLabel(fmtMoney(refiMore))
      : chartStrings.lessInterestLabel(fmtMoney(Math.abs(refiMore)));

  const safeRefiEndX = data.length > 0.25 ? data.length - 0.25 : data.length;

  const refiLabelVerticalOffset = useMemo(() => {
    if (!last || domainMax <= 0) return 72;
    const t = Math.min(1, Math.max(0, last.newInterest / domainMax));
    return Math.round(44 + t * 118);
  }, [last, domainMax]);

  return (
    <div className="relative h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          key={chartKey}
          data={data}
          margin={{ top: 40, right: 72, left: 0, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" vertical={false} />
          <XAxis
            dataKey="month"
            type="number"
            domain={[0, "dataMax"]}
            padding={{ right: 36 }}
            ticks={xTicks}
            tickFormatter={(m: number) => {
              const y = m / 12;
              if (y < 1) return "0";
              return `Yr ${Math.round(y)}`;
            }}
            tick={{ fontSize: 10, fill: "#64748b" }}
            stroke="#cbd5e1"
          />
          <YAxis
            domain={[0, domainMax]}
            ticks={yTicks}
            tickFormatter={(v) => `$${v / 1000}K`}
            tick={{ fontSize: 10, fill: "#64748b" }}
            stroke="#cbd5e1"
            width={48}
          />
          <Tooltip content={InterestTooltip} cursor={{ stroke: REF_LINE, strokeWidth: 1 }} isAnimationActive={false} />
          <Area
            type="monotone"
            dataKey="low"
            stackId="gap"
            stroke="none"
            fill="transparent"
            isAnimationActive={!reducedMotion}
            animationDuration={reducedMotion ? 0 : 900}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="spread"
            stackId="gap"
            stroke="none"
            fill="rgba(200, 155, 90, 0.18)"
            isAnimationActive={!reducedMotion}
            animationDuration={reducedMotion ? 0 : 900}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="currentInterest"
            stroke={NAVY}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: NAVY }}
            isAnimationActive={!reducedMotion}
            animationDuration={reducedMotion ? 0 : 1100}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="newInterest"
            stroke={GOLD}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: GOLD }}
            isAnimationActive={!reducedMotion}
            animationDuration={reducedMotion ? 0 : 1100}
            animationEasing="ease-out"
          />
          {be != null && (
            <ReferenceLine
              x={be}
              stroke={REF_LINE}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: chartStrings.breakEvenLabel(be),
                position: "top",
                offset: 12,
                fill: REF_LINE,
                fontSize: 12,
              }}
            />
          )}
          {last && data.length > 0 && (
            <ReferenceDot
              x={safeRefiEndX}
              y={last.newInterest}
              r={3}
              fill="#C89B5A"
              stroke="#fff"
              strokeWidth={1}
              isFront
              ifOverflow="visible"
              label={{
                value: endCalloutText,
                position: "bottom",
                offset: refiLabelVerticalOffset,
                dx: -28,
                fill: "#C89B5A",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
          )}
          {currentPayoffMonth != null &&
            currentPayoffMonth < data.length &&
            data[currentPayoffMonth - 1] != null && (
              <ReferenceDot
                x={currentPayoffMonth}
                y={data[currentPayoffMonth - 1].currentInterest}
                r={3}
                fill={NAVY}
                stroke="#fff"
                strokeWidth={1}
                isFront
                ifOverflow="extendDomain"
                label={{
                  value: chartStrings.loanPaidOff,
                  position: "bottom",
                  offset: 20,
                  dx: 4,
                  fill: NAVY,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
            )}
          {showPulse && !reducedMotion && pulseRow != null && pulseMonth > 0 && (
            <ReferenceDot
              x={pulseMonth}
              y={pulseY}
              r={0}
              fill="transparent"
              stroke="none"
              isFront
              shape={(dotProps: { cx?: number; cy?: number }) => {
                const { cx, cy } = dotProps;
                if (cx == null || cy == null) return null;
                return (
                  <g className="pulse-dot pointer-events-none" transform={`translate(${cx},${cy})`}>
                    <circle cx={0} cy={0} r={5} fill="#C89B5A" stroke="#fff" strokeWidth={1} />
                  </g>
                );
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

type EquityChartProps = {
  seriesCurrent: AmortMonth[];
  seriesNew: AmortMonth[];
  chartKey: string;
  reducedMotion: boolean;
  chartStrings: RefinanceChartStrings;
};

const DOT_MONTHS = new Set([60, 120, 240]);

export function RefinanceEquityChartRecharts({
  seriesCurrent,
  seriesNew,
  chartKey,
  reducedMotion,
  chartStrings,
}: EquityChartProps) {
  const data = useMemo(() => buildRows(seriesCurrent, seriesNew), [seriesCurrent, seriesNew]);
  const [showPulse, setShowPulse] = useState(true);
  const EquityTooltip = useMemo(() => makeEquityTooltip(chartStrings), [chartStrings]);

  useEffect(() => {
    setShowPulse(true);
    const t = window.setTimeout(() => setShowPulse(false), 3500);
    return () => window.clearTimeout(t);
  }, [chartKey]);

  const maxEq = Math.max(
    1,
    ...data.map((d) => Math.max(d.equityCurrent, d.equityNew))
  );
  const paddedMax = maxEq * 1.2;
  const yTicks = yTicks50k(paddedMax);
  const domainMax = yTicks[yTicks.length - 1] ?? paddedMax;
  const maxMonth = data.length;
  const xTicks = YEAR_TICK_MONTHS.filter((m) => m <= maxMonth);
  const midMonth = Math.max(1, Math.floor(maxMonth / 2));

  const pulseMonth = data.length >= 2 ? 2 : data.length === 1 ? 1 : 0;
  const pulseRowEq = pulseMonth > 0 ? data[pulseMonth - 1] : undefined;
  const pulseYEq =
    pulseRowEq != null ? (pulseRowEq.equityCurrent + pulseRowEq.equityNew) / 2 : maxEq * 0.4;

  function dotRenderer(active: "current" | "new") {
    return (props: {
      cx?: number;
      cy?: number;
      payload?: InterestChartRow;
    }) => {
      const { cx, cy, payload } = props;
      if (cx == null || cy == null || !payload) return null;
      if (!DOT_MONTHS.has(payload.month)) return null;
      return <circle cx={cx} cy={cy} r={4} fill={active === "current" ? NAVY : GOLD} stroke="#fff" strokeWidth={1} />;
    };
  }

  return (
    <div className="relative h-[340px] w-full">
      <p className="absolute left-1/2 top-2 z-10 -translate-x-1/2 text-center text-[10px] font-medium text-slate-500">
        {chartStrings.principalAccelerating}
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          key={chartKey}
          data={data}
          margin={{ top: 52, right: 40, left: 0, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" vertical={false} />
          <ReferenceLine
            x={midMonth}
            stroke="rgb(203 213 225)"
            strokeDasharray="3 3"
            strokeOpacity={0.6}
          />
          <XAxis
            dataKey="month"
            type="number"
            domain={[0, "dataMax"]}
            ticks={xTicks}
            tickFormatter={(m: number) => {
              const y = m / 12;
              if (y < 1) return "0";
              return `Yr ${Math.round(y)}`;
            }}
            tick={{ fontSize: 10, fill: "#64748b" }}
            stroke="#cbd5e1"
          />
          <YAxis
            domain={[0, domainMax]}
            ticks={yTicks}
            tickFormatter={(v) => `$${v / 1000}K`}
            tick={{ fontSize: 10, fill: "#64748b" }}
            stroke="#cbd5e1"
            width={48}
          />
          <Tooltip content={EquityTooltip} cursor={{ stroke: REF_LINE, strokeWidth: 1 }} isAnimationActive={false} />
          <Line
            name="Current loan"
            type="monotone"
            dataKey="equityCurrent"
            stroke={NAVY}
            strokeWidth={2}
            dot={dotRenderer("current")}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: NAVY }}
            isAnimationActive={!reducedMotion}
            animationDuration={reducedMotion ? 0 : 1100}
            animationEasing="ease-out"
          />
          <Line
            name="New loan"
            type="monotone"
            dataKey="equityNew"
            stroke={GOLD}
            strokeWidth={2}
            dot={dotRenderer("new")}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: GOLD }}
            isAnimationActive={!reducedMotion}
            animationDuration={reducedMotion ? 0 : 1100}
            animationEasing="ease-out"
          />
          {showPulse && !reducedMotion && pulseRowEq != null && pulseMonth > 0 && (
            <ReferenceDot
              x={pulseMonth}
              y={pulseYEq}
              r={0}
              fill="transparent"
              stroke="none"
              isFront
              shape={(dotProps: { cx?: number; cy?: number }) => {
                const { cx, cy } = dotProps;
                if (cx == null || cy == null) return null;
                return (
                  <g className="pulse-dot pointer-events-none" transform={`translate(${cx},${cy})`}>
                    <circle cx={0} cy={0} r={5} fill="#C89B5A" stroke="#fff" strokeWidth={1} />
                  </g>
                );
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function findCurrentLoanPayoffMonth(series: AmortMonth[]): number | null {
  for (let i = 0; i < series.length; i++) {
    if (series[i].balanceEnd <= 0.02) return i + 1;
  }
  return null;
}
