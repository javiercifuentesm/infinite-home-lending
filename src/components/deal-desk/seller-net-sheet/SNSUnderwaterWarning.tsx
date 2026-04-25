export function SNSUnderwaterWarning() {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-[rgba(163,45,45,0.2)] bg-[rgba(163,45,45,0.06)] px-4 py-3">
      <span className="shrink-0 text-[18px]" aria-hidden>
        ⚠
      </span>
      <p className="font-sans text-[12px] font-medium leading-relaxed text-[#A32D2D]">
        Seller is underwater at the asking price — net proceeds are negative. Review the payoff amount and pricing strategy before going to market.
      </p>
    </div>
  );
}
