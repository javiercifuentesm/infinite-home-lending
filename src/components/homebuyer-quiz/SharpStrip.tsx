import type { SharpBlock } from "../../lib/financialReality/sharpLines";

type Props = {
  sharp: SharpBlock;
  /** Optional title above the stack */
  title?: string;
  variant?: "light" | "flagship";
};

const ROWS: { key: keyof SharpBlock; label: string; emoji: string }[] = [
  { key: "hit", label: "Hit", emoji: "💣" },
  { key: "reality", label: "Reality", emoji: "⚠️" },
  { key: "interpretation", label: "Truth", emoji: "🧠" },
  { key: "escalation", label: "Gone", emoji: "🚨" },
  { key: "micDrop", label: "Line", emoji: "🎯" },
];

/**
 * Five-line sharp stack — screenshot-friendly.
 */
export function SharpStrip({ sharp, title, variant = "light" }: Props) {
  const isFlagship = variant === "flagship";
  const card = isFlagship
    ? "border border-white/12 bg-[#0B1F3A]/80 px-3 py-2.5 shadow-inner sm:px-4 sm:py-3"
    : "border border-slate-200/80 bg-white/90 px-3 py-2.5 shadow-sm sm:px-4 sm:py-3";
  const titleCls = isFlagship ? "text-white/45" : "text-slate-500";
  const labelCls = isFlagship ? "text-white/40" : "text-slate-400";
  const lineCls = isFlagship ? "text-white" : "text-navy";

  return (
    <div className="space-y-3">
      {title ? (
        <p className={`font-sans text-[10px] font-semibold uppercase tracking-[0.2em] ${titleCls}`}>{title}</p>
      ) : null}
      <ul className="space-y-2.5">
        {ROWS.map(({ key, label, emoji }) => (
          <li key={key} className={`flex gap-3 rounded-lg ${card}`}>
            <span className="shrink-0 text-[13px]" aria-hidden>
              {emoji}
            </span>
            <div className="min-w-0 flex-1">
              <span className={`font-sans text-[9px] font-semibold uppercase tracking-[0.14em] ${labelCls}`}>{label}</span>
              <p className={`mt-0.5 font-heading text-[14px] font-bold leading-snug sm:text-[15px] ${lineCls}`}>{sharp[key]}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
