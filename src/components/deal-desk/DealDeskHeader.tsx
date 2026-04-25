import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { IHLLogo } from "../IHLLogo";
import { useDealDeskAuth } from "../../hooks/useDealDeskAuth";

type Props = {
  /** Subtitle next to logo — e.g. tool name */
  toolTitle?: string;
  /**
   * Hub landing (/deal-desk): hide logo and “Infinite Home Lending”; show only
   * “The Deal Desk” as the main subtitle (matches bar treatment on tool pages).
   */
  hubOnly?: boolean;
  /** Optional extra class for outer wrapper */
  className?: string;
};

export function DealDeskHeader({ toolTitle, hubOnly = false, className = "" }: Props) {
  const { clearAccess } = useDealDeskAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onPlaybookPage = pathname === "/deal-desk/playbook";

  const sessionDot = (
    <span
      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B6D11]"
      title="Partner access active — 90-day session"
      aria-label="Partner access active, 90-day session"
    />
  );

  const exitDealDesk = () => {
    clearAccess();
    navigate("/deal-desk", { replace: true });
  };

  return (
    <header className={`border-b border-slate-200/90 bg-white ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          {toolTitle ? (
            <p className="font-[Georgia,serif] text-[15px] italic leading-snug text-[#C6A15B] sm:text-[17px]">
              <span className="inline-flex items-center gap-2 not-italic">
                {sessionDot}
                <span>The Deal Desk</span>
              </span>
              <span className="px-1.5 font-sans text-slate-400 not-italic">·</span>
              <span className="font-sans text-[15px] font-semibold not-italic text-[#0B2A4A] sm:text-[17px]">{toolTitle}</span>
            </p>
          ) : hubOnly ? (
            <p className="flex items-center gap-2 font-[Georgia,serif] text-[15px] italic leading-snug text-[#C6A15B] sm:text-[17px]">
              {sessionDot}
              <span>The Deal Desk</span>
            </p>
          ) : (
            <>
              <Link
                to="/"
                className="flex shrink-0 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/40 focus-visible:ring-offset-2"
                aria-label="Infinite Home Lending home"
              >
                <IHLLogo className="h-10 w-auto sm:h-11 md:h-12" />
              </Link>
              <div className="min-w-0 border-l border-slate-200/90 pl-3 sm:pl-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B2A4A] sm:text-[11px]">Infinite Home Lending</p>
                <p className="mt-0.5 flex items-center gap-2 font-[Georgia,serif] text-[11px] italic text-[#C6A15B]">
                  {sessionDot}
                  The Deal Desk
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={exitDealDesk}
            className="font-sans text-[10px] text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#0B2A4A]"
          >
            ← Exit Deal Desk
          </button>
          <span className="inline-flex items-center rounded-full border-2 border-[#C6A15B] bg-white px-3 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0B2A4A]">
            For Real Estate Professionals
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/deal-desk/playbook"
              aria-current={onPlaybookPage ? "page" : undefined}
              className={`inline-flex max-w-full items-center gap-1.5 rounded-md border bg-gradient-to-r from-[#C6A15B]/[0.12] to-transparent px-2.5 py-1.5 font-sans text-[12px] font-semibold text-[#0B2A4A] shadow-sm transition-[border-color,background-color] hover:border-[#C6A15B]/55 hover:from-[#C6A15B]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A15B]/40 ${
                onPlaybookPage
                  ? "border-[#C6A15B] ring-1 ring-[#C6A15B]/35"
                  : "border-[#C6A15B]/35"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#8b6914]" aria-hidden />
              <span className="leading-tight">
                Agent Playbook
                <span className="mt-0.5 block font-normal text-[10px] text-slate-600">Step inside — how it all works</span>
              </span>
            </Link>
            <span className="hidden font-sans text-[12px] text-slate-300 sm:inline" aria-hidden>
              ·
            </span>
            <Link
              to="/deal-desk"
              className="font-sans text-[12px] font-medium text-[#0B2A4A] underline decoration-[#C6A15B]/40 underline-offset-2 transition-colors hover:text-[#C6A15B]"
            >
              ← All Deal Desk Tools
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
