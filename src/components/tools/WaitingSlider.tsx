import { formatCompactWait, formatWaitPeriodLabel } from "../../hooks/useWaitingMath";

type Props = {
  waitMonths: number;
  onChange: (months: number) => void;
};

export function WaitingSlider({ waitMonths, onChange }: Props) {
  const safe = Math.min(36, Math.max(1, Math.floor(waitMonths)));

  return (
    <div className="rounded-xl border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-[Georgia,serif] text-[17px] font-medium text-[var(--tcw-text-primary,#0B2A4A)]">
          How long are you thinking of waiting?
        </h3>
        <span
          className="rounded-full border border-[#C6A15B]/40 bg-[#C6A15B]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#854F0B]"
          aria-live="polite"
        >
          {formatWaitPeriodLabel(safe)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="font-[Georgia,serif] text-2xl font-semibold text-[#0B2A4A]">{formatCompactWait(safe)}</span>
        <span className="text-[13px] text-[var(--tcw-text-muted,#64748b)]">selected</span>
      </div>
      <input
        type="range"
        min={1}
        max={36}
        step={1}
        value={safe}
        onInput={(e) => onChange(parseInt((e.target as HTMLInputElement).value, 10))}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-4 h-2 w-full cursor-pointer accent-[#C6A15B]"
        aria-valuemin={1}
        aria-valuemax={36}
        aria-valuenow={safe}
      />
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--tcw-text-muted,#64748b)]">
        Slide to see the cost of waiting different amounts of time.
      </p>
    </div>
  );
}
