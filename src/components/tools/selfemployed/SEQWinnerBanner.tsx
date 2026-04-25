import type { SEQRunResult } from "../../../hooks/useSEQMath";
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

  if (neither) {
    return (
      <div
        className="mb-8 w-full rounded-lg px-5 py-6 text-white"
        style={{ backgroundColor: "#854F0B" }}
      >
        <p className="font-serif text-[15px] font-semibold">Income too low to qualify at current DTI</p>
        <p className="mt-2 text-[12px] text-white/80">Reduce debts, increase income, or adjust your target home price.</p>
      </div>
    );
  }

  if (path === "taxreturn") {
    return (
      <div className="mb-8 w-full rounded-lg px-5 py-6 text-white" style={{ backgroundColor: "#0B2A4A" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <StarIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Tax return path result</p>
            <p className="mt-1 font-serif text-[15px] font-semibold leading-snug">
              {txCanAfford
                ? `You qualify for your $${fmt(targetPrice)} target home`
                : `Your maximum qualifying home price is $${fmtK(txMaxPrice)}`}
            </p>
            <p className="mt-2 text-[12px] text-white/70">
              Qualifying monthly income: ${fmt(tx.qualifyingMonthly)} · Max DTI loan: ${fmtK(txMaxLoan)} · Rate:{" "}
              {BASE_RATE.toFixed(3)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (path === "bankstatement") {
    return (
      <div className="mb-8 w-full rounded-lg px-5 py-6 text-white" style={{ backgroundColor: "#3B6D11" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <StarIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Bank statement path result</p>
            <p className="mt-1 font-serif text-[15px] font-semibold leading-snug">
              {bsCanAfford
                ? `You qualify for your $${fmt(targetPrice)} target home`
                : `Your maximum qualifying home price is $${fmtK(bsMaxPrice)}`}
            </p>
            <p className="mt-2 text-[12px] text-white/70">
              Qualifying monthly income: ${fmt(bs.qualifyingMonthly)} · Max DTI loan: ${fmtK(bsMaxLoan)} · Rate:{" "}
              {BS_RATE.toFixed(3)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // compare
  const tie = txMaxPrice === bsMaxPrice;
  const taxWins = txMaxPrice >= bsMaxPrice;
  const bg = taxWins ? "#0B2A4A" : "#3B6D11";
  const winnerLabel = tie ? "Both paths" : taxWins ? "Tax Return" : "Bank Statement";
  const diff = Math.abs(txMaxPrice - bsMaxPrice);

  return (
    <div className="mb-8 w-full rounded-lg px-5 py-6 text-white" style={{ backgroundColor: bg }}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
          <StarIcon />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Best path for your situation</p>
          <p className="mt-1 font-serif text-[15px] font-semibold leading-snug">
            {tie
              ? "Both paths qualify you for the same amount"
              : `${winnerLabel} path qualifies you for $${fmtK(diff)} more home`}
          </p>
          <p className="mt-2 text-[12px] text-white/70">
            Tax return: ${fmtK(txMaxPrice)} · Bank statement: ${fmtK(bsMaxPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
