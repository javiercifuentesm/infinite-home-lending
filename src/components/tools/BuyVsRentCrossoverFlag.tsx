type Props = {
  crossoverYr: number | null;
};

export function BuyVsRentCrossoverFlag({ crossoverYr }: Props) {
  if (crossoverYr == null) return null;

  return (
    <div
      className="flex items-start gap-2 rounded-[var(--border-radius-md)] border px-3 py-2.5 text-[12px] text-[#854F0B]"
      style={{
        background: "rgba(198,161,91,0.12)",
        borderWidth: "0.5px",
        borderColor: "rgba(198,161,91,0.4)",
      }}
    >
      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </svg>
      <p>
        Buying takes the lead at <b>year {crossoverYr}</b> — the crossover point where owning starts building more wealth
        than renting + investing.
      </p>
    </div>
  );
}
