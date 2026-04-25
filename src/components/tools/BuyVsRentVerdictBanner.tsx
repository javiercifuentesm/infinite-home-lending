import type { YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmtK } from "../../hooks/useBuyVsRentMath";

type Props = {
  snapshot: YearlySnapshot;
  viewYear: number;
  crossoverYr: number | null;
};

export function BuyVsRentVerdictBanner({ snapshot, viewYear, crossoverYr }: Props) {
  const buy = snapshot.buyNetWealth;
  const rent = snapshot.rentPortfolio;
  const diff = Math.abs(buy - rent);
  const buyLeads = buy > rent;

  const bodyCrossoverBuy = crossoverYr
    ? `Buying crossed ahead of renting at year ${crossoverYr}. After that point, every year of ownership widens the gap. The longer you stay, the stronger the case for buying becomes.`
    : "Buying has been the stronger financial path from day one in this scenario.";

  const bodyCrossoverRent = crossoverYr
    ? `Buying takes the lead at year ${crossoverYr}. If you plan to stay past that point, the financial case for buying strengthens significantly.`
    : "In this scenario, renting and investing the difference leads through the 30-year window. The decision may still favor buying for non-financial reasons.";

  if (buyLeads) {
    return (
      <div
        className="rounded-xl border-l-4 p-5 sm:p-6"
        style={{
          background: "var(--color-background-success)",
          borderColor: "#3B6D11",
        }}
      >
        <p className="font-[Georgia,serif] text-[17px] font-medium leading-snug" style={{ color: "#27500A" }}>
          At year {viewYear}, buying puts you {fmtK(diff)} ahead.
        </p>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#3B6D11" }}>
          {bodyCrossoverBuy}
        </p>
      </div>
    );
  }

  if (diff < 30_000) {
    return (
      <div
        className="rounded-xl border-l-4 p-5 sm:p-6"
        style={{
          background: "var(--color-background-warning)",
          borderColor: "#854F0B",
        }}
      >
        <p className="font-[Georgia,serif] text-[17px] font-medium leading-snug" style={{ color: "#633806" }}>
          At year {viewYear}, the gap is close — within {fmtK(diff)}.
        </p>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#854F0B" }}>
          {bodyCrossoverRent}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border-l-4 p-5 sm:p-6"
      style={{
        background: "var(--color-background-info)",
        borderColor: "#185FA5",
      }}
    >
      <p className="font-[Georgia,serif] text-[17px] font-medium leading-snug" style={{ color: "#0C447C" }}>
        At year {viewYear}, renting + investing leads by {fmtK(diff)}.
      </p>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#185FA5" }}>
        {bodyCrossoverRent}
      </p>
    </div>
  );
}
