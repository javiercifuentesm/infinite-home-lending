import { DealDeskHeader } from "../DealDeskHeader";

/**
 * The Deal Rescue Tool — when the first loan path fails, surface alternatives.
 * (Component scaffold; extend with problem taxonomy and ranked paths as needed.)
 */
export default function DealRescueCalculator() {
  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <DealDeskHeader toolTitle="The Deal Rescue Tool" />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="border-b border-slate-200/90 pb-8">
          <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Deal Rescue Tool</h1>
          <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">
            Loan fell through? Enter the problem — credit, appraisal, employment, DTI, or program limits — and get ranked alternative financing paths
            with a step-by-step action plan.
          </p>
        </div>
        <p className="mt-8 font-sans text-[14px] text-slate-500">Inputs and ranked rescue paths will be wired in here.</p>
      </div>
    </div>
  );
}
