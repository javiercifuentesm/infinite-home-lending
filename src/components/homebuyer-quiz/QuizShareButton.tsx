import { useCallback, useState } from "react";
import { Share2 } from "lucide-react";

type Props = {
  theme?: "light" | "dark";
};

export function QuizShareButton({ theme = "light" }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const handleClick = async () => {
    setPulse(true);
    window.setTimeout(() => setPulse(false), 180);

    const url = `${window.location.origin}${window.location.pathname}`;
    const text =
      "I ran the Home Buying Diagnosis — constraint, cause, and what to do next. Compare what you get.";
    const toastOk = "Ready to share — see what someone else gets 👀";

    const copyFallback = async () => {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        showToast(toastOk);
      } catch {
        showToast("Couldn't copy — try from the browser menu.");
      }
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Home Buying Diagnosis",
          text,
          url,
        });
        showToast(toastOk);
        return;
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    }

    await copyFallback();
  };

  const isDark = theme === "dark";
  const btnClass = isDark
    ? `inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-[13px] font-medium text-white/90 transition-transform duration-150 hover:bg-white/10 ${pulse ? "scale-[1.05]" : "scale-100"}`
    : `inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-navy transition-transform duration-150 shadow-sm hover:border-gold/40 hover:bg-gold/[0.06] ${pulse ? "scale-[1.05]" : "scale-100"}`;
  const iconClass = isDark ? "text-gold/90" : "text-gold";

  return (
    <div className="relative">
      <button type="button" onClick={handleClick} className={btnClass}>
        <Share2 size={16} strokeWidth={1.75} className={iconClass} aria-hidden />
        Share your diagnosis
      </button>
      {toast ? (
        <p
          className={`pointer-events-none absolute -bottom-11 left-1/2 z-10 w-[min(100%,280px)] -translate-x-1/2 rounded-md border px-3 py-2 text-center text-[12px] leading-snug shadow-lg ${
            isDark ? "border-gold/25 bg-[#0A192F] text-white/90" : "border-slate-200 bg-navy text-white"
          }`}
          role="status"
        >
          {toast}
        </p>
      ) : null}
    </div>
  );
}
