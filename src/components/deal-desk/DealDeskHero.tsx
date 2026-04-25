import { Link } from "react-router-dom";

type Props = {
  onExploreClick: () => void;
};

export function DealDeskHero({ onExploreClick }: Props) {
  return (
    <section className="relative border-b border-slate-200/80 bg-[#F4F6F9]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(198,161,91,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
        <span className="inline-flex rounded-full bg-[#0B2A4A] px-4 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A15B]">
          For Real Estate Professionals
        </span>
        <h1 className="mt-8 font-[Georgia,serif] text-[2rem] font-medium leading-tight text-[#0B2A4A] sm:text-4xl sm:leading-tight">
          The Deal Desk
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.65] text-slate-600 sm:text-lg">
          Start with the Agent Playbook, then use five live tools at the moments that move deals — free for Deal Desk partner agents. The Deal Desk is a suite of real-time
          resources built specifically for MD, DC, and VA agents — so you can structure smarter offers, qualify clients faster, and close with confidence.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-md bg-[#0B2A4A] px-8 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm transition-colors hover:bg-[#0d3460]"
          >
            Explore the tools
          </button>
          <Link
            to="/contact?topic=deal-desk-partner"
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-[#C6A15B] bg-white px-8 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-[#0B2A4A] transition-colors hover:bg-[#C6A15B]/10"
          >
            Partner with IHL
          </Link>
        </div>
      </div>
    </section>
  );
}
