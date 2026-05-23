import type { YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmtK } from "../../hooks/useBuyVsRentMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  snapshot: YearlySnapshot;
  viewYear: number;
  crossoverYr: number | null;
};

export function BuyVsRentVerdictBanner({ snapshot, viewYear, crossoverYr }: Props) {
  const { t } = useLanguage();
  const buy = snapshot.buyNetWealth;
  const rent = snapshot.rentPortfolio;
  const diff = Math.abs(buy - rent);
  const buyLeads = buy > rent;

  const bodyCrossoverBuy = crossoverYr
    ? t("tool.bvr.verdict.bodyCrossoverBuy").replace("{yr}", String(crossoverYr))
    : t("tool.bvr.verdict.bodyNoCrossoverBuy");

  const bodyCrossoverRent = crossoverYr
    ? t("tool.bvr.verdict.bodyCrossoverRent").replace("{yr}", String(crossoverYr))
    : t("tool.bvr.verdict.bodyNoCrossoverRent");

  const headlineBuyLeads = `${t("tool.bvr.verdict.buyLeadsPre")} ${viewYear}${t("tool.bvr.verdict.buyLeadsMid")} ${fmtK(diff)} ${t("tool.bvr.verdict.buyLeadsPost")}`;
  const headlineClose = `${t("tool.bvr.verdict.closePre")} ${viewYear}${t("tool.bvr.verdict.closeMid")} ${fmtK(diff)}${t("tool.bvr.verdict.closePost")}`;
  const headlineRentLeads = `${t("tool.bvr.verdict.rentLeadsPre")} ${viewYear}${t("tool.bvr.verdict.rentLeadsMid")} ${fmtK(diff)}${t("tool.bvr.verdict.rentLeadsPost")}`;

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
          {headlineBuyLeads}
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
          {headlineClose}
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
        {headlineRentLeads}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#185FA5" }}>
        {bodyCrossoverRent}
      </p>
    </div>
  );
}
