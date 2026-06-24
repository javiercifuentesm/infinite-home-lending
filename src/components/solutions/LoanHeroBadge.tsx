type LoanHeroBadgeProps = {
  label: string;
};

/**
 * Category pill above each Solutions loan program headline.
 * Styled via `.loan-hero-badge` — navy glass, gold border, gold text.
 */
export function LoanHeroBadge({ label }: LoanHeroBadgeProps) {
  return <p className="loan-hero-badge">{label}</p>;
}
