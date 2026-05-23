import { useEffect, useState } from "react";

type Props = {
  showWarning: boolean;
  resetTimer: () => void;
  logout: () => void;
};

export function InactivityWarning({ showWarning, resetTimer, logout }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!showWarning) return;
    setSecondsLeft(60);
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-desk-inactivity-title"
      aria-describedby="deal-desk-inactivity-desc"
    >
      <div
        className="relative max-w-md rounded-2xl border p-6 shadow-2xl sm:p-8"
        style={{
          backgroundColor: "#0B2A4A",
          borderColor: "rgba(198,161,91,0.35)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
        }}
      >
        <h2 id="deal-desk-inactivity-title" className="font-[Georgia,serif] text-xl font-semibold text-white sm:text-2xl">
          Still working?
        </h2>
        <p id="deal-desk-inactivity-desc" className="mt-3 font-sans text-[15px] leading-relaxed text-white/85">
          You&apos;ll be logged out in 1 minute due to inactivity.
        </p>
        <p
          className="mt-5 font-sans text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl"
          style={{ color: "#C6A15B" }}
          aria-live="polite"
        >
          {secondsLeft}
          <span className="text-lg font-medium text-white/70 sm:text-xl"> sec</span>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            className="min-h-[44px] flex-1 rounded-lg px-4 py-2.5 font-sans text-[14px] font-semibold text-[#0B2A4A] transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A4A]"
            style={{ backgroundColor: "#C6A15B" }}
            onClick={() => resetTimer()}
          >
            Stay Logged In
          </button>
          <button
            type="button"
            className="min-h-[44px] flex-1 rounded-lg border-2 bg-transparent px-4 py-2.5 font-sans text-[14px] font-semibold text-white transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A4A]"
            style={{ borderColor: "#C6A15B", color: "#C6A15B" }}
            onClick={() => logout()}
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
