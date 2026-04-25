import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** Primary: deep navy — trust-first */
const primary =
  "bg-[#0B1F3A] text-white shadow-[0_8px_28px_rgba(11,31,58,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(11,31,58,0.28)]";
/** Secondary: gold — high-visibility alternate */
const secondary =
  "bg-[#D4AF37] text-[#0B1F3A] shadow-[0_8px_28px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,175,55,0.45)]";

type Base = {
  children: ReactNode;
  className?: string;
};

/** Primary CTA — navy fill, white label */
export function FlagshipCtaPrimary({ to, children, className = "" }: Base & { to: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[16px] font-bold transition-all duration-200 ${primary} ${className}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
    </Link>
  );
}

export function FlagshipCtaPrimaryButton({
  type = "button",
  onClick,
  children,
  className = "",
  disabled = false,
  "aria-busy": ariaBusy,
}: Base & {
  type?: "button" | "submit";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  "aria-busy"?: boolean;
}) {
  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      aria-busy={ariaBusy === true ? true : undefined}
      className={`inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[16px] font-bold transition-all duration-200 sm:w-auto ${primary} ${disabled ? "pointer-events-none opacity-40" : ""} ${className}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );
}

/** Secondary CTA — gold fill, navy label */
export function FlagshipCtaSecondary({ to, children, className = "" }: Base & { to: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[16px] font-bold transition-all duration-200 ${secondary} ${className}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
    </Link>
  );
}

export function FlagshipTextLink({ to, children, className = "" }: Base & { to: string }) {
  return (
    <Link
      to={to}
      className={`text-[14px] font-semibold text-[#0B1F3A]/80 underline-offset-4 transition-colors hover:text-[#0B1F3A] hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}
