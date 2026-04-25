import { Link } from "react-router-dom";
import type { PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";

type Props = { results: PowerMapResults };

export function PMCTA({ results }: Props) {
  const { powerGain, unlockedCount } = results;

  let heading: string;
  if (powerGain > 75000) {
    heading = `You have ${fmtK(powerGain)} in buying power waiting to be unlocked. Let us build the plan.`;
  } else if (unlockedCount >= 3) {
    heading = `You are already qualified for ${unlockedCount} markets — let us find your best option.`;
  } else {
    heading = "Ready to turn this roadmap into a real plan?";
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{heading}</h3>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          We&apos;ll run the actual numbers for your situation and connect you with any down payment assistance programs you may
          qualify for in MD, DC, or VA.
        </p>
      </div>
      <Link
        to="/contact?topic=homebuying-power-map"
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-6 py-3 text-[14px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
      >
        Talk to an advisor ↗
      </Link>
    </div>
  );
}
