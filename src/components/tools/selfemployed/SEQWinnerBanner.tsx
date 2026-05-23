import type { SEQRunResult } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
};

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-white">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function SEQWinnerBanner({ path, results }: Props) {
  const { t } = useLanguage();
  const {
    tx,
    bs,
    txMaxLoan,
    txMaxPrice,
    txCanAfford,
    bsMaxLoan,
    bsMaxPrice,
    bsCanAfford,
    BASE_RATE,
    BS_RATE,
    targetPrice,
  } = results;

  const neither = txMaxLoan <= 0 && bsMaxLoan <= 0;
  const priceFmt = `$${fmt(targetPrice)}`;
  const txPriceK = `$${fmtK(txMaxPrice)}`;
  const bsPriceK = `$${fmtK(bsMaxPrice)}`;

  if (neither) {
    return (
      <div
        className="mb-8 w-full rounded-lg px-5 py-6 text-white"
        style={{ backgroundColor: "#854F0B" }}
      >
        <p className="font-serif text-[15px] font-semibold">{t("tool.seq.banner.neitherTitle")}</p>
        <p className="mt-2 text-[12px] text-white/80">{t("tool.seq.banner.neitherSub")}</p>
      </div>
    );
  }

  if (path === "taxreturn") {
    const lead = txCanAfford
      ? t("tool.seq.banner.taxQualifies").replace("${price}", priceFmt)
      : t("tool.seq.banner.taxMax").replace("${price}", txPriceK);
    const meta = t("tool.seq.banner.taxMeta")
      .replace("${inc}", fmt(tx.qualifyingMonthly))
      .replace("${loan}", fmtK(txMaxLoan))
      .replace("{rate}", BASE_RATE.toFixed(3));
    return (
      <div className="mb-8 w-full rounded-lg px-5 py-6 text-white" style={{ backgroundColor: "#0B2A4A" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <StarIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{t("tool.seq.banner.taxEyebrow")}</p>
            <p className="mt-1 font-serif text-[15px] font-semibold leading-snug">{lead}</p>
            <p className="mt-2 text-[12px] text-white/70">{meta}</p>
          </div>
        </div>
      </div>
    );
  }

  if (path === "bankstatement") {
    const lead = bsCanAfford
      ? t("tool.seq.banner.bsQualifies").replace("${price}", priceFmt)
      : t("tool.seq.banner.bsMax").replace("${price}", bsPriceK);
    const meta = t("tool.seq.banner.bsMeta")
      .replace("${inc}", fmt(bs.qualifyingMonthly))
      .replace("${loan}", fmtK(bsMaxLoan))
      .replace("{rate}", BS_RATE.toFixed(3));
    return (
      <div className="mb-8 w-full rounded-lg px-5 py-6 text-white" style={{ backgroundColor: "#3B6D11" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <StarIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{t("tool.seq.banner.bsEyebrow")}</p>
            <p className="mt-1 font-serif text-[15px] font-semibold leading-snug">{lead}</p>
            <p className="mt-2 text-[12px] text-white/70">{meta}</p>
          </div>
        </div>
      </div>
    );
  }

  const tie = txMaxPrice === bsMaxPrice;
  const taxWins = txMaxPrice >= bsMaxPrice;
  const bg = taxWins ? "#0B2A4A" : "#3B6D11";
  const winnerPathLabel = tie ? t("tool.seq.banner.pathBoth") : taxWins ? t("tool.seq.banner.pathTax") : t("tool.seq.banner.pathBs");
  const diff = Math.abs(txMaxPrice - bsMaxPrice);

  const lead = tie
    ? t("tool.seq.banner.compareTie")
    : t("tool.seq.banner.compareWinner").replace("{path}", winnerPathLabel).replace("${diff}", fmtK(diff));

  const meta = t("tool.seq.banner.compareMeta").replace("${txPrice}", fmtK(txMaxPrice)).replace("${bsPrice}", fmtK(bsMaxPrice));

  return (
    <div className="mb-8 w-full rounded-lg px-5 py-6 text-white" style={{ backgroundColor: bg }}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
          <StarIcon />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{t("tool.seq.banner.compareEyebrow")}</p>
          <p className="mt-1 font-serif text-[15px] font-semibold leading-snug">{lead}</p>
          <p className="mt-2 text-[12px] text-white/70">{meta}</p>
        </div>
      </div>
    </div>
  );
}
