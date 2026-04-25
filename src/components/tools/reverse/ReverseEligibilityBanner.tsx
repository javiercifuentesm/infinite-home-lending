import type { ReverseInputs, ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";

type Props = {
  inputs: ReverseInputs;
  results: ReverseResult;
};

export function ReverseEligibilityBanner({ inputs, results }: Props) {
  const { eligible, grossPL, netPL, closingCosts, mipUpfront, effectiveAge } = results;
  const { age, homeVal, mortBal, intRate, coAge } = inputs;
  const rolled = closingCosts + mipUpfront;

  if (eligible) {
    return (
      <div
        className="rounded-xl border-l-4 p-5 sm:p-6"
        style={{
          background: "var(--color-background-success)",
          borderColor: "#3B6D11",
        }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium leading-snug" style={{ color: "#27500A" }}>
          You appear eligible — estimated principal limit: {fmt(grossPL)}
        </p>
        <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: "#3B6D11" }}>
          Based on your age ({age}), home value ({fmt(homeVal)}), and current rates (~{intRate.toFixed(2)}%), you may access
          approximately {fmt(netPL)} in net proceeds after paying off your existing mortgage
          {mortBal > 0 ? ` of ${fmt(mortBal)}` : ""}.
          {coAge != null ? ` Co-borrower age of ${coAge} is used for the calculation.` : ""} Closing costs and MIP (
          {fmt(rolled)}) are estimated and rolled into the loan.
        </p>
      </div>
    );
  }

  let body: string;
  if (age < 62) {
    body = "The youngest borrower must be at least 62 to qualify for a HECM.";
  } else if (coAge != null && coAge > 0 && coAge < 62) {
    body =
      "With a co-borrower under 62, HECM eligibility typically does not apply as shown. Please review ages with a specialist.";
  } else if (mortBal >= grossPL * 0.6) {
    body =
      "Your existing mortgage balance may exceed what the reverse mortgage can pay off. A proprietary (jumbo) reverse mortgage or other options may still apply.";
  } else {
    body = "Please review your inputs — home value or mortgage balance may need adjustment.";
  }

  return (
    <div
      className="rounded-xl border-l-4 p-5 sm:p-6"
      style={{
        background: "var(--color-background-danger)",
        borderColor: "#A32D2D",
      }}
    >
      <p className="font-[Georgia,serif] text-[15px] font-medium leading-snug" style={{ color: "#791F1F" }}>
        Eligibility concern — let&apos;s look at the details
      </p>
      <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: "#A32D2D" }}>
        {body}
      </p>
      <p className="mt-2 text-[12px] text-[#791F1F]/90">Effective age used for PLF estimate: {effectiveAge}.</p>
    </div>
  );
}
