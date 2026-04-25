import type { UseCaseKey } from "./HelocUseCaseSelector";

type VerdictDef = {
  title: string;
  verdict: string;
  detail: string;
  tags: { text: string; bg: string }[];
};

const DATA: Record<UseCaseKey, VerdictDef> = {
  reno: {
    title: "Home renovation",
    verdict: "Strong fit.",
    detail:
      "HELOC interest is tax-deductible when used for home improvements. Flexible draws let you pay contractors as work progresses — you only pay interest on what you've drawn, not the full line. Avoid drawing the full amount upfront.",
    tags: [
      { text: "Tax deductible", bg: "#EAF3DE" },
      { text: "Flexible draws", bg: "#E6F1FB" },
      { text: "Adds home value", bg: "#EAF3DE" },
    ],
  },
  debt: {
    title: "Debt consolidation",
    verdict: "Proceed with caution.",
    detail:
      "Trading high-interest debt for HELOC debt can save significantly on interest — but your home is now at risk. Only makes sense if you won't run the original debt back up. Variable rate means your payment can rise. If rates jump 2%, recalculate.",
    tags: [
      { text: "Lower rate", bg: "#EAF3DE" },
      { text: "Risk: home as collateral", bg: "#FCEBEB" },
      { text: "Variable rate risk", bg: "#FAEEDA" },
    ],
  },
  edu: {
    title: "Education expenses",
    verdict: "Consider alternatives first.",
    detail:
      "HELOCs can fund education, but federal student loans have built-in protections (income-based repayment, deferment, forgiveness) that home equity debt doesn't. For private loan refinancing at rates above [RATE]%, this may make sense. For federal loans, likely not.",
    tags: [
      { text: "Flexible access", bg: "#EAF3DE" },
      { text: "No federal protections", bg: "#FAEEDA" },
      { text: "Lower rate possible", bg: "#E6F1FB" },
    ],
  },
  emergency: {
    title: "Emergency reserve",
    verdict: "Excellent strategic fit.",
    detail:
      "Using a HELOC as a standby emergency fund — rather than drawing it now — is one of the smartest uses of home equity. You pay nothing until you draw, and the line is available when you need it. The risk: if you lose income during an emergency, the HELOC payment adds pressure.",
    tags: [
      { text: "Pay nothing until needed", bg: "#EAF3DE" },
      { text: "Grows as you repay", bg: "#EAF3DE" },
      { text: "Credit line standby", bg: "#E6F1FB" },
    ],
  },
  invest: {
    title: "Investment / rental property",
    verdict: "Higher risk — model carefully.",
    detail:
      "Using home equity to fund investments introduces leverage risk. If the investment underperforms or the property is vacant, you still owe the HELOC payment. Only makes sense if your projected return exceeds [RATE]% after tax. Variable rate erosion of returns is real.",
    tags: [
      { text: "Leverage amplifies gains AND losses", bg: "#FAEEDA" },
      { text: "Rate risk", bg: "#FCEBEB" },
      { text: "Return must exceed [RATE]%", bg: "#E6F1FB" },
    ],
  },
  other: {
    title: "General use",
    verdict: "Think it through before drawing.",
    detail:
      "Before drawing on a HELOC for non-home-improvement purposes, ask: is the purchase worth securing with your home? Could a 0% intro credit card or personal loan serve this purpose without putting your equity at risk? HELOCs are powerful tools — they deserve a strategic purpose.",
    tags: [
      { text: "Home secured", bg: "#FAEEDA" },
      { text: "Interest may not be deductible", bg: "#FAEEDA" },
      { text: "Variable rate", bg: "#FAEEDA" },
    ],
  },
};

type Props = {
  activeUse: UseCaseKey;
  rate: number;
};

export function HelocUseCaseVerdict({ activeUse, rate }: Props) {
  const d = DATA[activeUse];
  const detail = d.detail.replace("[RATE]", rate.toFixed(2));
  const tags = d.tags.map((t) => ({
    ...t,
    text: t.text.replace("[RATE]", rate.toFixed(2)),
  }));

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <p className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        {d.title}: <span className="text-[#C6A15B]">{d.verdict}</span>
      </p>
      <p className="mt-3 text-[12px] leading-[1.5] text-[var(--color-text-tertiary)]">{detail}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t.text}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium text-[#444]"
            style={{ background: t.bg }}
          >
            {t.text}
          </span>
        ))}
      </div>
    </div>
  );
}
