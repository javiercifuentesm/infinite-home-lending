import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEVerdictBanner({ results }: Props) {
  const {
    closeCall,
    lockSignal,
    floatSignal,
    lifetimeRisk,
    rate,
    lockedPmt,
    monthlyRisk,
    monthlyUpside,
    term,
    dropScenario,
    riseScenario,
    daysToClose,
    rateEnv,
  } = results;

  if (closeCall) {
    return (
      <div
        className="rounded-r-lg border-l-4 px-5 py-4"
        style={{
          background: "rgba(198,161,91,0.1)",
          borderLeftColor: "rgba(198,161,91,0.2)",
          borderTop: "1px solid rgba(198,161,91,0.15)",
          borderRight: "1px solid rgba(198,161,91,0.15)",
          borderBottom: "1px solid rgba(198,161,91,0.15)",
        }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#633806" }}>
          The costs are nearly symmetric — this is a genuine judgment call.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#633806" }}>
          Your downside ({fmt(monthlyRisk)}/mo) and upside ({fmt(monthlyUpside)}/mo) are close. In this situation, locking provides
          certainty at almost no asymmetric cost. The peace of mind of a locked rate has real value that doesn&apos;t show up in
          the math.
        </p>
      </div>
    );
  }

  if (lockSignal) {
    const envLine =
      rateEnv === "rising"
        ? "In a rising rate environment, that risk is real."
        : "The protection a lock offers is concrete; the savings from floating are uncertain.";
    return (
      <div className="rounded-r-lg border-l-4 border-[#C6A15B] px-5 py-4" style={{ background: "#0B2A4A" }}>
        <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#C6A15B" }}>
          Locking now protects {fmtK(lifetimeRisk)} in lifetime interest.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          At {rate.toFixed(3)}% you have a payment of {fmt(lockedPmt)}/month — a number that works for you. Floating means betting
          that rates will drop {dropScenario}% before your closing in {daysToClose} days. If they rise {riseScenario}% instead,
          you pay {fmt(monthlyRisk)} more every month for {term} years. {envLine}
        </p>
      </div>
    );
  }

  if (floatSignal) {
    const envWord = rateEnv === "falling" ? "falling" : "stable";
    return (
      <div
        className="rounded-r-lg border-l-4 px-5 py-4"
        style={{
          background: "rgba(163,45,45,0.07)",
          borderLeftColor: "rgba(163,45,45,0.15)",
          border: "1px solid rgba(163,45,45,0.15)",
        }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#A32D2D" }}>
          Floating could save {fmt(monthlyUpside)}/month — but it&apos;s a bet.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#854F0B" }}>
          With {daysToClose} days to close in a {envWord} rate environment, there is a plausible case for floating. The risk: if
          rates jump instead of falling, you absorb {fmt(monthlyRisk)}/month more — indefinitely. A float-down option may give you
          the best of both worlds if your lender offers one.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-r-lg border-l-4 border-[#C6A15B] px-5 py-4" style={{ background: "#0B2A4A" }}>
      <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#C6A15B" }}>
        Locking now protects {fmtK(lifetimeRisk)} in lifetime interest.
      </p>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
        The asymmetry matters: floating is a {term}-year commitment to a number you haven&apos;t locked yet. Every month of
        floating is a day the market could move against you. Locking today turns uncertainty into a concrete number you can budget
        around.
      </p>
    </div>
  );
}
