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
      className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#C6A15B]"
      title="Partner access active — 90-day session"
      aria-label="Partner access active, 90-day session"
    />
  );

  const exitDealDesk = () => {
    clearAccess();
    navigate("/deal-desk", { replace: true });
  };

  return (
    <header
      className={`relative sticky top-0 z-50 ${className}`}
      style={{
        background: "rgba(11, 42, 74, 0.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(198, 161, 91, 0.15)",
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          {toolTitle ? (
            <p className="font-[Georgia,serif] text-[15px] italic leading-snug text-[#C6A15B] sm:text-[17px]">
              <span className="inline-flex items-center gap-2 not-italic">
                {sessionDot}
                <span>The Deal Desk</span>
              </span>
              <span className="px-1.5 font-sans text-slate-400 not-italic">·</span>
              <span className="font-sans text-[15px] font-semibold not-italic text-[#F7F7F5] sm:text-[17px]">{toolTitle}</span>
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
              <div className="min-w-0 border-l border-[rgba(198,161,91,0.2)] pl-3 sm:pl-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7F7F5] sm:text-[11px]">Infinite Home Lending</p>
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
            className="font-sans text-[10px] text-[rgba(247,247,245,0.5)] underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#C6A15B]"
          >
            ← Exit Deal Desk
          </button>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.12em]"
            style={{
              border: "1px solid rgba(198,161,91,0.35)",
              background: "rgba(198,161,91,0.08)",
              color: "#C6A15B",
            }}
          >
            For Real Estate Professionals
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/deal-desk/playbook"
              aria-current={onPlaybookPage ? "page" : undefined}
              className={`inline-flex max-w-full items-center gap-1.5 rounded-md border border-[rgba(198,161,91,0.25)] bg-[rgba(198,161,91,0.08)] px-2.5 py-1.5 font-sans text-[12px] font-semibold text-[#F7F7F5] shadow-sm transition-[border-color,background-color] hover:bg-[rgba(198,161,91,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A15B]/40 ${
                onPlaybookPage ? "ring-1 ring-[#C6A15B]/35" : ""
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#C6A15B]" aria-hidden />
              <span className="leading-tight">
                Agent Playbook
                <span className="mt-0.5 block font-normal text-[10px] text-[rgba(247,247,245,0.45)]">
                  Step inside — how it all works
                </span>
              </span>
            </Link>
            <span className="hidden font-sans text-[12px] text-[rgba(198,161,91,0.3)] sm:inline" aria-hidden>
              ·
            </span>
            <Link
              to="/deal-desk"
              className="font-sans text-[12px] font-medium text-[rgba(247,247,245,0.65)] underline decoration-[#C6A15B]/40 underline-offset-2 transition-colors hover:text-[#C6A15B]"
            >
              ← All Deal Desk Tools
            </Link>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(198,161,91,0.5), transparent)",
        }}
      />
    </header>
  );
}
