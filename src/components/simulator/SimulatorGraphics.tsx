/** Supporting-detail visuals only — keep minimal so Horizon Snapshot stays dominant. */

const NAVY = "rgba(10, 25, 47, 0.55)";
const GOLD = "rgba(197, 160, 89, 0.45)";
const NEUTRAL = "rgba(148, 163, 184, 0.4)";

function formatCurrencyShort(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

type MonthlyMixProps = {
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
};

/**
 * Downgraded monthly mix: small, low-contrast, no motion — reference detail only.
 */
export function MonthlyPaymentMixDonut({ principalAndInterest, propertyTax, insurance }: MonthlyMixProps) {
  const pi = Math.max(0, principalAndInterest);
  const tx = Math.max(0, propertyTax);
  const ins = Math.max(0, insurance);
  const total = pi + tx + ins;
  const safe = total > 1e-6 ? total : 1;

  const p1 = (pi / safe) * 360;
  const p2 = (tx / safe) * 360;
  const p3 = (ins / safe) * 360;

  const g1 = `conic-gradient(from -90deg, ${NAVY} 0deg ${p1}deg, ${GOLD} ${p1}deg ${p1 + p2}deg, ${NEUTRAL} ${p1 + p2}deg ${p1 + p2 + p3}deg, rgba(226,232,240,0.35) ${p1 + p2 + p3}deg 360deg)`;

  return (
    <div className="pt-4 border-t border-slate-100/90">
      <p className="type-label text-navy/35 tracking-[0.12em] mb-3">Monthly payment mix</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div
          className="relative mx-auto sm:mx-0 shrink-0 w-16 h-16 opacity-90"
          aria-hidden
        >
          <div
            className="absolute inset-0 rounded-full border border-slate-200/50"
            style={{ background: g1, opacity: total > 1e-6 ? 1 : 0.4 }}
          />
          <div className="absolute inset-[24%] rounded-full bg-white border border-slate-100/80" />
        </div>
        <ul className="flex-1 min-w-0 space-y-1 text-[11px] sm:text-[12px] text-slate-500">
          <li className="flex justify-between gap-3">
            <span>P&amp;I</span>
            <span className="tabular-nums text-navy/70">{formatCurrencyShort(pi)}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span>Tax</span>
            <span className="tabular-nums text-navy/70">{formatCurrencyShort(tx)}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span>Insurance</span>
            <span className="tabular-nums text-navy/70">{formatCurrencyShort(ins)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
