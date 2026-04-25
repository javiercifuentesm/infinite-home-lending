import { Link } from "react-router-dom";
import { DealDeskHeader } from "./DealDeskHeader";
import { DealDeskPartnerCTA } from "./DealDeskPartnerCTA";

type Props = {
  toolName: string;
  description: string;
};

export function DealDeskToolPlaceholderLayout({ toolName, description }: Props) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[calc(var(--site-header-height)+0.25rem)]">
      <DealDeskHeader toolTitle={toolName} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-dashed border-[#C6A15B]/40 bg-white p-8 text-center shadow-sm">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#C6A15B]">Coming Soon</p>
          <h1 className="mt-4 font-[Georgia,serif] text-2xl font-medium text-[#0B2A4A]">{toolName}</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">{description}</p>
          <p className="mt-6 font-sans text-[14px] font-medium text-slate-700">This tool is in development.</p>
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/deal-desk"
            className="font-sans text-[14px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2 hover:text-[#C6A15B]"
          >
            ← Back to The Deal Desk
          </Link>
        </div>
      </div>
      <DealDeskPartnerCTA />
      <p className="mx-auto max-w-3xl px-4 py-8 text-center font-sans text-[10px] text-slate-500">
        The Deal Desk tools are for licensed real estate professionals. Outputs are educational only.
      </p>
    </div>
  );
}
