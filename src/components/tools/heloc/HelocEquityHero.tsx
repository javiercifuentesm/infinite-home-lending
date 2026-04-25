import type { HelocInputs, HelocResult } from "../../../hooks/useHelocMath";
import { fmt, fmtK } from "../../../hooks/useHelocMath";

type Props = {
  inputs: HelocInputs;
  results: HelocResult;
};

export function HelocEquityHero({ inputs, results }: Props) {
  const { maxLine, equity, cltvAfter, equityRemaining } = results;
  const over = inputs.draw > maxLine;

  return (
    <div className="rounded-xl bg-[#0B2A4A] p-6 text-white sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.5)]">Your available HELOC credit limit</p>
          <p className="mt-2 font-[Georgia,serif] text-[38px] font-semibold leading-none text-[#C6A15B]">{fmtK(maxLine)}</p>
          <p className="mt-2 text-[12px] text-[rgba(255,255,255,0.6)]">
            Based on {inputs.cltv}% CLTV limit on {fmt(inputs.hv)} home
          </p>
          {over ? (
            <p className="mt-3 text-[12px] font-medium text-[rgba(255,200,100,0.9)]">
              Your requested draw exceeds your credit limit. Adjust the draw amount.
            </p>
          ) : null}
        </div>
        <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-lg">
          {[
            { label: "Current equity", val: fmt(equity) },
            { label: "CLTV after draw", val: `${cltvAfter}%` },
            { label: "Equity remaining", val: fmt(equityRemaining) },
          ].map((b) => (
            <div key={b.label} className="rounded-lg px-3 py-3" style={{ background: "rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] text-[rgba(255,255,255,0.45)]">{b.label}</p>
              <p className="mt-1 text-[15px] font-medium text-white">{b.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
