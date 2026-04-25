export const RATE_TABLE: Record<number, number> = {
  580: 8.375,
  600: 8.0,
  620: 7.875,
  640: 7.5,
  660: 7.25,
  680: 7.0,
  700: 6.875,
  720: 6.75,
  740: 6.5,
};

export function getQualRate(score: number): number {
  const keys = Object.keys(RATE_TABLE)
    .map(Number)
    .sort((a, b) => b - a);
  for (const k of keys) {
    if (score >= k) return RATE_TABLE[k]!;
  }
  return 8.375;
}

export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (
    (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1)
  );
}

export function maxLoanFromDTI(annualIncome: number, monthlyDebts: number, annualRate: number): number {
  const maxPmt = (annualIncome / 12) * 0.43 - monthlyDebts;
  if (maxPmt <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = 360;
  return Math.round((maxPmt * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
}

export type ClientQualifierInputs = {
  income: number;
  debts: number;
  score: number;
  savings: number;
  target: number;
  vaEligible: boolean;
  marketRate: number;
  ptaxRate: number;
};

export type Readiness = "green" | "yellow" | "red";

export type DpScenarioRow = {
  pct: string;
  label: string;
  amt: number;
  totalNeeded: number;
  gap: number;
  status: "has" | "close" | "needs";
};

export type LoanOptionRow = {
  key: "va" | "conv" | "fha" | "usda";
  name: string;
  detail: string;
  available: boolean;
  note: string;
};

export type ActionItem = { color: "red" | "yellow" | "green" | "blue"; text: string };

export type RecommendedLoan = "va" | "conv" | "fha" | "none";

export type ClientQualifierResults = {
  income: number;
  debts: number;
  score: number;
  savings: number;
  target: number;
  vaEligible: boolean;
  marketRate: number;
  ptaxRate: number;
  qualRate: number;
  minDownPct: number;
  maxLoan: number;
  maxPrice: number;
  fhaPriceMax: number;
  vaPriceMax: number;
  qualifiesConv: boolean;
  qualifiesFHA: boolean;
  qualifiesVA: boolean;
  gap: number;
  readiness: Readiness;
  recommendedLoan: RecommendedLoan;
  dtiAtMax: number;
  pmtLow: number;
  pmtHigh: number;
  totalPmtLow: number;
  totalPmtHigh: number;
  taxMo: number;
  insMo: number;
  pmiMo: number;
  dpScenarios: DpScenarioRow[];
  closingCosts: number;
  loanOptions: LoanOptionRow[];
  actions: ActionItem[];
  insight: string;
  ctaHead: string;
};

export function runCalculation(inputs: ClientQualifierInputs): ClientQualifierResults {
  const { income, debts, score, savings, target, vaEligible, marketRate, ptaxRate } = inputs;

  const qualRate = getQualRate(score);
  const minDownPct = score >= 620 ? 0.03 : score >= 580 ? 0.035 : 0.1;
  const maxLoan = maxLoanFromDTI(income, debts, qualRate);
  const maxPrice = Math.round(maxLoan / (1 - minDownPct));

  const fhaRate = Math.max(qualRate, 6.5);
  const fhaLoan = score >= 580 ? maxLoanFromDTI(income, debts, fhaRate) : 0;
  const fhaPriceMax = fhaLoan > 0 ? Math.round(fhaLoan / (1 - 0.035)) : 0;

  const vaRate = Math.max(qualRate, 6.75);
  const vaLoan = vaEligible ? maxLoanFromDTI(income, debts, vaRate) : 0;
  const vaPriceMax = vaLoan;

  const qualifiesConv = maxPrice >= target;
  const qualifiesFHA = fhaPriceMax >= target;
  const qualifiesVA = vaEligible && vaPriceMax >= target;
  const gap = Math.max(0, target - maxPrice);
  const anyQualifies = qualifiesConv || qualifiesVA;

  let readiness: Readiness;
  if (anyQualifies) {
    readiness = "green";
  } else if (qualifiesFHA || gap <= 30000) {
    readiness = "yellow";
  } else {
    readiness = "red";
  }

  const actualPmt = monthlyPmt(maxLoan, qualRate, 360);
  const dtiAtMax = Math.round(((debts + actualPmt) / (income / 12)) * 100);

  const loanAt20 = Math.round(target * 0.8);
  const loanAt5 = Math.round(target * 0.95);
  const pmtLow = Math.round(monthlyPmt(loanAt20, qualRate, 360));
  const pmtHigh = Math.round(monthlyPmt(loanAt5, qualRate, 360));
  const taxMo = Math.round((target * ptaxRate) / 100 / 12);
  const insMo = Math.round((target * 0.005) / 12);
  const pmiMo =
    score < 720 && savings < target * 0.2 ? Math.round((loanAt5 * 0.008) / 12) : 0;
  const totalPmtLow = pmtLow + taxMo + insMo;
  const totalPmtHigh = pmtHigh + taxMo + insMo + pmiMo;

  const closingCosts = Math.round(target * 0.03);
  const dpScenariosRaw = [
    { pct: "3%", label: "Conv min", amt: Math.round(target * 0.03) },
    { pct: "3.5%", label: "FHA standard", amt: Math.round(target * 0.035) },
    { pct: "5%", label: "Conv standard", amt: Math.round(target * 0.05) },
    { pct: "10%", label: "Low PMI path", amt: Math.round(target * 0.1) },
    { pct: "20%", label: "No PMI — ideal", amt: Math.round(target * 0.2) },
  ]
    .filter((s) => s.amt <= savings * 3)
    .map((s) => {
      const totalNeeded = s.amt + closingCosts;
      let status: DpScenarioRow["status"];
      if (savings >= totalNeeded) status = "has";
      else if (savings >= totalNeeded * 0.85) status = "close";
      else status = "needs";
      return {
        ...s,
        totalNeeded,
        gap: Math.max(0, totalNeeded - savings),
        status,
      };
    });

  let recommendedLoan: RecommendedLoan;
  if (vaEligible && score >= 580) recommendedLoan = "va";
  else if (score >= 620) recommendedLoan = "conv";
  else if (score >= 580) recommendedLoan = "fha";
  else recommendedLoan = "none";

  const loanOptions: LoanOptionRow[] = [
    {
      key: "va",
      name: "VA Loan",
      detail: `0% down · No PMI · Rate ~${vaRate.toFixed(3)}%`,
      available: vaEligible && score >= 580,
      note: vaEligible
        ? "VA-eligible — strongest option. Confirm COE with IHL."
        : "Not eligible — no VA benefit indicated",
    },
    {
      key: "conv",
      name: "Conventional",
      detail: `${(minDownPct * 100).toFixed(0)}%+ down · PMI if <20% · Rate ~${qualRate.toFixed(3)}%`,
      available: score >= 620,
      note:
        score >= 620
          ? "Qualifies — standard path for this credit tier"
          : "Score below 620 — not available at current tier",
    },
    {
      key: "fha",
      name: "FHA Loan",
      detail: `3.5% down · MIP required · Rate ~${fhaRate.toFixed(3)}%`,
      available: score >= 580,
      note:
        score >= 580
          ? "Available — lower barrier, higher long-term MIP cost"
          : "Score below 580 — very limited options",
    },
    {
      key: "usda",
      name: "USDA Loan",
      detail: "0% down · Income limits · Rural/suburban eligible areas",
      available: score >= 640 && income < 150000,
      note:
        score >= 640 && income < 150000
          ? "May qualify — check property location eligibility"
          : "Income or location likely does not qualify",
    },
  ];

  const actions: ActionItem[] = [];

  if (score < 580) {
    actions.push({
      color: "red",
      text: "Credit is below FHA minimum (580). This buyer needs a structured credit recovery plan before any loan application. IHL offers a free credit improvement consultation.",
    });
  } else if (score < 620) {
    actions.push({
      color: "red",
      text: `Credit (${score}) is below conventional threshold. FHA is available at 580+, but moving to 620+ opens conventional options and better rates. Estimated time: 60–90 days with focused effort.`,
    });
  } else if (score < 680) {
    const yrSave = Math.round(
      (monthlyPmt(maxLoan, qualRate, 360) - monthlyPmt(maxLoan, getQualRate(680), 360)) * 12,
    );
    actions.push({
      color: "yellow",
      text: `Credit improvement opportunity: moving from ${score} to 680+ drops the rate from ${qualRate}% to ${getQualRate(680)}% — saving ~$${yrSave.toLocaleString()}/year. Often achievable in 60–90 days.`,
    });
  } else {
    actions.push({
      color: "green",
      text: `Credit is solid at ${score}. Qualifies for conventional financing at ${qualRate}% — no credit work needed before pre-approval.`,
    });
  }

  if (dtiAtMax > 43) {
    actions.push({
      color: "red",
      text: `DTI is ${dtiAtMax}% — above the 43% conventional limit. Buyer needs to pay down debts or increase income before qualifying. Each $100/month eliminated adds ~$15,000 in buying power.`,
    });
  } else if (dtiAtMax > 38) {
    actions.push({
      color: "yellow",
      text: `DTI is ${dtiAtMax}% — workable but tight. Paying down existing debts would create headroom and improve qualification comfort.`,
    });
  } else {
    actions.push({
      color: "green",
      text: `DTI is ${dtiAtMax}% — within guidelines. Debt load is manageable relative to income.`,
    });
  }

  const minNeeded = Math.round(target * 0.03) + closingCosts;
  if (savings < minNeeded * 0.7) {
    actions.push({
      color: "yellow",
      text: `Down payment savings may not cover minimum down + closing costs (~$${Math.round(minNeeded / 1000)}k). Ask IHL about down payment assistance programs in this buyer's county.`,
    });
  } else if (savings >= Math.round(target * 0.2) + closingCosts) {
    actions.push({
      color: "green",
      text: "Down payment is strong — covers 20%+ down + closing costs. No PMI required. Best conventional rate tier.",
    });
  } else {
    actions.push({
      color: "green",
      text: "Down payment covers minimum requirements. Consider DPA programs for additional cushion.",
    });
  }

  if (!anyQualifies && gap > 0) {
    if (gap <= 30000) {
      actions.push({
        color: "yellow",
        text: `Target price gap of $${Math.round(gap / 1000)}k is closable. Consider homes in the $${Math.round((maxPrice - 10000) / 1000) * 10}k–$${Math.round(maxPrice / 1000) * 1}k range now, or close the gap in 30–60 days.`,
      });
    } else {
      actions.push({
        color: "red",
        text: `Target price gap of $${Math.round(gap / 1000)}k requires either adjusting the search to ~$${Math.round(maxPrice / 1000) * 1}k or building a structured 6–12 month improvement plan.`,
      });
    }
  }

  if (vaEligible) {
    actions.push({
      color: "green",
      text: "VA loan is the strongest available path: 0% down, no PMI, competitive rate. Confirm Certificate of Eligibility (COE) with IHL before writing the first offer.",
    });
  }

  let insight: string;
  if (readiness === "green" && vaEligible) {
    insight = `This buyer's VA eligibility is their single biggest financial advantage in today's market. A 0% down offer with no PMI at a competitive rate is the cleanest path available. Confirm the Certificate of Eligibility with IHL before you write anything — it takes one call and changes the entire offer strategy.`;
  } else if (readiness === "green") {
    insight = `This buyer qualifies at their target price with today's numbers. The next call is to IHL for the pre-approval letter — it converts this snapshot from an estimate into a document you can put in an offer package. Most agents wait too long to make that call. Don't be one of them.`;
  } else if (readiness === "yellow") {
    insight = `This buyer is close, not far. The gap between where they are and where they need to be is $${Math.round(gap / 1000)}k — achievable with focused effort in 30–60 days. Set honest expectations now, share IHL's contact, and stay in touch. You'll be their first call when they're ready.`;
  } else {
    insight = `This buyer needs a plan, not a showing schedule. The honest conversation today — here's where you are, here's the timeline, here's what to do — is what keeps them as your client when they're ready in 6–12 months. IHL offers a free buyer improvement consultation. Make the introduction now.`;
  }

  let ctaHead: string;
  if (readiness === "green") {
    ctaHead = "Ready to convert this snapshot into a pre-approval letter?";
  } else if (readiness === "yellow") {
    ctaHead = "Get IHL on a call — they can fast-track this buyer.";
  } else {
    ctaHead = "Refer this buyer to IHL for a free improvement consultation.";
  }

  return {
    income,
    debts,
    score,
    savings,
    target,
    vaEligible,
    marketRate,
    ptaxRate,
    qualRate,
    minDownPct,
    maxLoan,
    maxPrice,
    fhaPriceMax,
    vaPriceMax,
    qualifiesConv,
    qualifiesFHA,
    qualifiesVA,
    gap,
    readiness,
    recommendedLoan,
    dtiAtMax,
    pmtLow,
    pmtHigh,
    totalPmtLow,
    totalPmtHigh,
    taxMo,
    insMo,
    pmiMo,
    dpScenarios: dpScenariosRaw,
    closingCosts,
    loanOptions,
    actions,
    insight,
    ctaHead,
  };
}

export function fmtK(n: number): string {
  const v = Math.max(0, Math.round(n));
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  return `$${Math.round(v / 1000)}k`;
}

export function fmtMoney(n: number): string {
  return `$${Math.max(0, Math.round(n)).toLocaleString()}`;
}
