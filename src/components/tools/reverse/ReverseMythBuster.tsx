const MYTHS: { myth: string; fact: string }[] = [
  {
    myth: "Myth: The bank takes your home",
    fact: "You retain full title and ownership. The loan is repaid when you sell, move, or pass away — not before.",
  },
  {
    myth: "Myth: Your heirs will inherit debt",
    fact: "This is a non-recourse loan. Heirs never owe more than the home's value at sale. Any remaining equity after repayment goes to them.",
  },
  {
    myth: "Myth: You can outlive the loan",
    fact: "Tenure payments continue for life as long as you live in the home. You cannot be forced out due to the loan balance.",
  },
  {
    myth: "Myth: Social Security and Medicare are affected",
    fact: "Reverse mortgage proceeds are not taxable income and do not affect Social Security or Medicare benefits.",
  },
  {
    myth: "Myth: Only desperate people use reverse mortgages",
    fact: "Many financially sophisticated retirees use reverse mortgages strategically — particularly the line of credit, which grows over time.",
  },
];

export function ReverseMythBuster() {
  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">
        The 5 things most people get wrong about reverse mortgages
      </h3>
      <ul className="mt-5 space-y-5">
        {MYTHS.map((m) => (
          <li key={m.myth} className="flex gap-3">
            <span
              className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--color-background-danger)" }}
              aria-hidden
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="3">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-medium text-[#A32D2D]">{m.myth}</p>
              <p className="mt-1 text-[12px] leading-[1.4] text-[var(--color-text-primary)]">{m.fact}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
