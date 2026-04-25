import type { ReactNode } from "react";
import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

function Dot({ kind, children }: { kind: "check" | "warn" | "info"; children: ReactNode }) {
  const styles =
    kind === "check"
      ? "bg-[rgba(59,109,17,0.1)] text-[#3B6D11]"
      : kind === "warn"
        ? "bg-[rgba(198,161,91,0.15)] text-[#854F0B]"
        : "bg-[rgba(24,95,165,0.1)] text-[#185FA5]";
  const icon = kind === "check" ? "✓" : kind === "warn" ? "!" : "i";
  return (
    <li className="flex gap-2 font-sans text-[12px] leading-[1.5] text-[#0B2A4A]">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${styles}`}>
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

export function ACEligibility({ results }: Props) {
  const { loanType, loanBal, vaElig } = results;
  const vaFee = Math.round(loanBal * 0.005);

  let title = "Eligibility & process notes";
  if (loanType === "va") title = "VA loan — eligibility & process";
  else if (loanType === "fha") title = "FHA loan — eligibility & process";
  else title = "USDA loan — eligibility & process";

  return (
    <div id="ac-eligibility" className="rounded-xl border border-slate-200/80 bg-[rgba(244,246,249,0.95)] p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{title}</h3>
      <ul className="mt-4 space-y-3">
        {loanType === "va" && (
          <>
            <Dot kind="check">
              VA loans are assumable by anyone — military service is NOT required. Buyer must meet lender credit and income standards: typically 620+
              FICO, 41% DTI maximum.
            </Dot>
            <Dot kind="warn">
              Seller entitlement: If the buyer is not a veteran, the seller&apos;s VA entitlement stays tied to this property until the loan is paid
              off. Seller should discuss substitution of entitlement with IHL before agreeing to the assumption.
            </Dot>
            <Dot kind="info">
              VA funding fee: 0.5% of the assumed balance ({fmt(vaFee)}) for non-veterans. Disabled veterans may be exempt — confirm status.
            </Dot>
            {vaElig === "yes" && (
              <Dot kind="check">
                Buyer is VA-eligible: May qualify for substitution of entitlement, restoring the seller&apos;s VA benefit immediately. Discuss with
                IHL before writing the offer.
              </Dot>
            )}
            <Dot kind="info">
              Timeline: VA Circular 26-23-27 (Dec 2023) mandates servicers process assumptions within 45 days. Budget 45–75 days from application to
              close — build this into the offer timeline.
            </Dot>
          </>
        )}

        {loanType === "fha" && (
          <>
            <Dot kind="check">
              FHA loans are assumable by law (post-Dec 1986). Buyer must meet current FHA standards: 580+ credit score, 43–50% DTI maximum. Lender
              approval required.
            </Dot>
            <Dot kind="info">
              MIP carries over: The existing mortgage insurance premium terms transfer to the buyer. On older FHA loans, this MIP rate may be lower
              than today&apos;s rates — another hidden advantage.
            </Dot>
            <Dot kind="info">
              FHA assumption fee: Up to $1,800 (increased per HUD 4000.1). No new appraisal required in most cases — saves $500–$700 and removes
              appraisal risk from the transaction.
            </Dot>
            <Dot kind="warn">
              Loan must be current: FHA assumptions require the existing loan to have no missed payments or active delinquency. Verify with the
              servicer before presenting this to a buyer.
            </Dot>
          </>
        )}

        {loanType === "usda" && (
          <>
            <Dot kind="check">
              USDA loans are assumable with lender/servicer approval. Buyer must meet current USDA eligibility requirements: income limits, primary
              residence, rural property location.
            </Dot>
            <Dot kind="warn">
              Property must remain USDA-eligible: The address must qualify under current USDA rural development maps. Confirm eligibility before
              proceeding — maps are updated periodically.
            </Dot>
            <Dot kind="info">
              No USDA guarantee fee on assumption: The original borrower already paid it. This reduces the buyer&apos;s upfront cost compared to a
              new USDA loan.
            </Dot>
          </>
        )}

        <Dot kind="info">
          Timeline: Assumptions typically close in 45–75 days — longer than a standard purchase loan (30–45 days). Structure the offer with a
          realistic closing date and assumption contingency.
        </Dot>
        <Dot kind="warn">
          Confirm assumability directly with the servicer: Not all servicers process assumptions efficiently. Get written confirmation of assumability
          before making this a key selling point.
        </Dot>
      </ul>
    </div>
  );
}
