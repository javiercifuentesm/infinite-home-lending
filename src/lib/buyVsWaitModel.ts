/**
 * Buy vs. Wait Analyzer — deterministic decision-support math.
 * Expandable: add closing costs, PMI, rate paths, etc. without changing call sites.
 */

import {
  buildAmortizationSchedule,
  computePaymentScenario,
  cumulativePIOverHorizon,
  buildPositionSnapshot,
  effectiveAnalysisMonths,
  paymentSplitForNthPayment,
  type AmortizationScheduleRow,
  type HorizonSlice,
} from "./mortgage";

export type { AmortizationScheduleRow };

export const BUY_VS_WAIT_TERM_YEARS = 30;

/** Annual home price appreciation (compound). Tunable default. */
export const DEFAULT_ANNUAL_HOME_APPRECIATION = 0.04;

/** When modeling a future purchase, assume rate drifts up slightly (percentage points). */
export const DEFAULT_RATE_DRIFT_POINTS = 0.125;

/** Property tax + insurance as % of value / year (aligned with Structure Simulator defaults). */
export const DEFAULT_TAX_PCT_ANNUAL = 1.1;
export const DEFAULT_INSURANCE_PCT_ANNUAL = 0.35;

export type BuyVsWaitHorizonYears = 1 | 2 | 3;

export type BuyVsWaitInputs = {
  purchasePrice: number;
  downPercent: number;
  interestRatePct: number;
  monthlyRent: number;
  horizonYears: BuyVsWaitHorizonYears;
  /** Optional overrides for sensitivity / future UI */
  annualHomeAppreciation?: number;
  rateDriftPoints?: number;
  taxPctOfValueAnnual?: number;
  insurancePctOfValueAnnual?: number;
};

/** Classifier output for headlines and insight — not a recommendation to buy/sell. */
export type BuyVsWaitOutcomeKind = "buy_now_stronger" | "wait_may_help_short_term" | "close_call";

export type BuyVsWaitAssumptionsUsed = {
  annualHomeAppreciation: number;
  rateDriftPoints: number;
  taxPctOfValueAnnual: number;
  insurancePctOfValueAnnual: number;
};

/** Mini P&I snapshot over the selected horizon — not a full schedule. */
export type BuyVsWaitAmortizationSnapshot = {
  startingBalance: number;
  endingBalance: number;
  principalPaid: number;
  firstPayment: { interest: number; principal: number };
  lastPaymentInHorizon: {
    month: number;
    interest: number;
    principal: number;
  };
};

/** Equity components over the horizon — buy-now path; missed equity is what waiting forgoes. */
export type BuyVsWaitEquityBreakdown = {
  /** P * (1+a)^n − P */
  appreciationOnly: number;
  /** Principal reduction from amortization over the horizon. */
  principalPaidDown: number;
  /** Loan balance after horizon months. */
  remainingLoanBalanceAtHorizon: number;
  /** Appreciation + principal paydown (incremental equity from owning). */
  totalEquityGained: number;
  /** Same as totalEquityGained — equity not accumulated if you wait. */
  missedEquity: number;
};

export type BuyVsWaitResult = {
  horizonYears: BuyVsWaitHorizonYears;
  horizonMonths: number;

  assumptionsUsed: BuyVsWaitAssumptionsUsed;

  equity: BuyVsWaitEquityBreakdown;

  /** Loan paydown & payment mix over the horizon (30-year term). */
  amortizationSnapshot: BuyVsWaitAmortizationSnapshot;

  /** P&I rows for months 1..horizon — for schedule modal only. */
  amortizationScheduleRows: AmortizationScheduleRow[];

  buyNow: {
    monthlyPaymentTotal: number;
    monthlyPrincipalAndInterest: number;
    totalCashSpent: number;
    /** Same as equity.principalPaidDown — kept for table/bar convenience. */
    principalPaid: number;
    /** Same as equity.totalEquityGained — appreciation + principal paydown over the horizon. */
    equityGained: number;
    homeValueEnd: number;
    loanBalanceEnd: number;
    downPayment: number;
  };

  wait: {
    rentPaidTotal: number;
    futurePurchasePrice: number;
    futureMonthlyPaymentTotal: number;
    futureMonthlyPrincipalAndInterest: number;
    lostEquityOpportunity: number;
  };

  /** Plain-language headline inputs */
  headline: {
    rentPaidTotal: number;
    /** Aligns with equity.missedEquity — used by classifier. */
    missedEquityApprox: number;
    futurePricePremium: number;
  };
};

function buildAmortizationSnapshot(
  loanAmount: number,
  rate: number,
  termMonths: number,
  horizonMonths: number,
  slice: HorizonSlice
): BuyVsWaitAmortizationSnapshot {
  const months = effectiveAnalysisMonths(horizonMonths, termMonths);
  if (loanAmount <= 0 || months <= 0) {
    return {
      startingBalance: 0,
      endingBalance: 0,
      principalPaid: 0,
      firstPayment: { interest: 0, principal: 0 },
      lastPaymentInHorizon: { month: 0, interest: 0, principal: 0 },
    };
  }

  const first = paymentSplitForNthPayment(loanAmount, rate, termMonths, 1);
  const last = paymentSplitForNthPayment(loanAmount, rate, termMonths, months);

  return {
    startingBalance: loanAmount,
    endingBalance: slice.remainingBalance,
    principalPaid: slice.principalPaid,
    firstPayment: { interest: first.interest, principal: first.principal },
    lastPaymentInHorizon: {
      month: months,
      interest: last.interest,
      principal: last.principal,
    },
  };
}

/**
 * Compares monthly PITI vs rent, then missed equity vs cumulative monthly “savings” from renting.
 * Intentionally scenario-based — not a verdict on whether to buy.
 */
export function classifyBuyVsWaitOutcome(
  result: BuyVsWaitResult,
  inputs: BuyVsWaitInputs
): BuyVsWaitOutcomeKind {
  const { buyNow, headline, horizonMonths } = result;
  const monthlyBuy = buyNow.monthlyPaymentTotal;
  const monthlyRent = Math.max(0, inputs.monthlyRent);
  const delta = monthlyBuy - monthlyRent;

  const paymentBand = Math.max(100, monthlyBuy * 0.04);

  if (Math.abs(delta) <= paymentBand) {
    return "close_call";
  }

  if (delta < 0) {
    return "buy_now_stronger";
  }

  const cumulativeSavingsRenting = delta * horizonMonths;
  const missed = result.equity.missedEquity;

  if (missed <= cumulativeSavingsRenting * 1.15) {
    return "wait_may_help_short_term";
  }

  return "buy_now_stronger";
}

export type BuyVsWaitOutcomeCopy = {
  kind: BuyVsWaitOutcomeKind;
  /** Headline — no numbers, not a math explanation. */
  headlineLead: string;
  /** Subhead — max ~10 words, no numbers. */
  headlineSupport: string;
  /** Max 2 bullets; no “this means” / “in this scenario”. */
  insightBullets: string[];
};

export function getBuyVsWaitOutcomeCopy(
  kind: BuyVsWaitOutcomeKind,
  result: BuyVsWaitResult,
  _inputs: BuyVsWaitInputs
): BuyVsWaitOutcomeCopy {
  const { horizonYears } = result;
  const xYears = horizonYears === 1 ? "1 year" : `${horizonYears} years`;

  if (kind === "buy_now_stronger") {
    return {
      kind,
      headlineLead: `Buying now puts you ahead over ${xYears}`,
      headlineSupport: "Driven by rent and missed equity",
      insightBullets: ["Amortization and appreciation favor owning in this window."],
    };
  }

  if (kind === "wait_may_help_short_term") {
    return {
      kind,
      headlineLead: `Waiting lowers your short-term cost over ${xYears}`,
      headlineSupport: "Driven by lower monthly cost",
      insightBullets: ["Cash now; equity and price when you buy later."],
    };
  }

  return {
    kind: "close_call",
    headlineLead: "Financially, both options are very similar",
    headlineSupport: "Differences are small over your timeframe",
    insightBullets: ["Rates or rent can still tip the balance."],
  };
}

/** Inputs for the segmented / comparison bar inside PrimaryTakeawayCard (no extra math). */
export type BuyVsWaitPrimaryTakeawayBar =
  | {
      kind: "buy_now_stronger";
      rent: number;
      missedEquity: number;
    }
  | { kind: "wait_may_help_short_term" }
  | { kind: "close_call"; monthlyRent: number; monthlyPiti: number };

/** Primary takeaway card — scenario-based, uses existing model outputs only. */
export type BuyVsWaitPrimaryTakeaway = {
  kind: BuyVsWaitOutcomeKind;
  title: string;
  /** Muted micro-label directly above the big number. */
  numberMicroLabel: string;
  mainValue: string;
  /** Plain-English one-liner; no numbers — under the main value, before the bar. */
  humanTranslation: string;
  /** Visual bar — derived from same numbers as breakdown; rendered between human line and sublabel. */
  bar: BuyVsWaitPrimaryTakeawayBar;
  mainSublabel: string;
  breakdown: {
    label: string;
    value: string;
    summary?: boolean;
    /** Visual tier for Primary Takeaway breakdown (buy-now case: drivers vs summary vs context). */
    tier?: "driver" | "summary" | "context";
  }[];
  /** Optional; hidden when empty to avoid stacking redundant lines. */
  supporting: string;
  /** One short trust line for equity framing (buy scenarios). */
  equityNote?: string;
  /** Single-sentence interpretation of the result (conclusion). */
  conclusionLine: string;
};

/** Verdict + amplifier copy — presentation only; driven by outcome kind. */
export type BuyVsWaitDecisionAmplification = {
  verdictTitle: string;
  verdictSupport: string;
  /** One or two short lines for the “What this means” strip. */
  whatThisMeansLines: string[];
  /** Lead-in above the advisor CTA. */
  ctaTransition: string;
};

export function buildDecisionAmplification(
  kind: BuyVsWaitOutcomeKind,
  result: BuyVsWaitResult
): BuyVsWaitDecisionAmplification {
  if (kind === "buy_now_stronger") {
    const { equity, headline } = result;
    const strongGap = equity.missedEquity >= headline.rentPaidTotal;
    return {
      verdictTitle: strongGap
        ? "Buying is financially ahead in this scenario"
        : "Buying looks stronger in this scenario",
      verdictSupport:
        "Over the selected time horizon, waiting creates a measurable financial gap compared to buying.",
      whatThisMeansLines: [
        "Waiting doesn't pause the market — it just delays your position in it.",
        "In this scenario, the longer you wait, the harder it becomes to catch up.",
      ],
      ctaTransition:
        "A good next step is seeing how this scenario translates into real loan options.",
    };
  }

  if (kind === "wait_may_help_short_term") {
    return {
      verdictTitle: "Waiting may help in the short term",
      verdictSupport:
        "In this scenario, holding off reduces near-term cost, but the longer-term tradeoffs still matter.",
      whatThisMeansLines: [
        "Waiting lowers your short-term exposure, but delays long-term ownership benefits.",
      ],
      ctaTransition:
        "You can still explore what buying would look like so you're ready when timing improves.",
    };
  }

  return {
    verdictTitle: "This is a close call",
    verdictSupport:
      "The difference between buying and waiting is relatively small, so timing and personal priorities matter more.",
    whatThisMeansLines: [
      "Your decision matters more than the timing — both paths are financially similar here.",
    ],
    ctaTransition: "We can map both paths in more detail so you can decide with confidence.",
  };
}

export function buildPrimaryTakeaway(
  kind: BuyVsWaitOutcomeKind,
  result: BuyVsWaitResult,
  inputs: BuyVsWaitInputs
): BuyVsWaitPrimaryTakeaway {
  const { headline, horizonMonths, buyNow, wait } = result;
  const monthlyRent = Math.max(0, inputs.monthlyRent);
  const monthlyBuy = buyNow.monthlyPaymentTotal;

  if (kind === "buy_now_stronger") {
    const { equity } = result;
    const combined = headline.rentPaidTotal + equity.missedEquity;
    return {
      kind,
      title: "",
      numberMicroLabel: "Estimated cost of waiting",
      mainValue: formatBuyVsWaitCurrency(combined),
      humanTranslation: "Waiting could cost more than expected due to rent and lost equity",
      bar: {
        kind: "buy_now_stronger",
        rent: headline.rentPaidTotal,
        missedEquity: equity.missedEquity,
      },
      mainSublabel: "Based on rent and equity over your timeframe.",
      breakdown: [
        { label: "Rent paid", value: formatBuyVsWaitCurrency(headline.rentPaidTotal), tier: "driver" },
        { label: "Appreciation gained", value: formatBuyVsWaitCurrency(equity.appreciationOnly), tier: "driver" },
        { label: "Principal paid down", value: formatBuyVsWaitCurrency(equity.principalPaidDown), tier: "driver" },
        {
          label: "Total missed equity by waiting",
          value: formatBuyVsWaitCurrency(equity.missedEquity),
          summary: true,
          tier: "summary",
        },
        {
          label: "Future home price (modeled)",
          value: formatBuyVsWaitCurrency(wait.futurePurchasePrice),
          tier: "context",
        },
      ],
      supporting: "",
      equityNote: "Equity includes both home value growth and loan paydown.",
      conclusionLine:
        "This gap is driven by home price growth and early equity buildup that you miss by waiting.",
    };
  }

  if (kind === "wait_may_help_short_term") {
    const delta = monthlyBuy - monthlyRent;
    const savings = Math.max(0, delta) * horizonMonths;
    return {
      kind,
      title: "",
      numberMicroLabel: "Estimated short-term savings",
      mainValue: formatBuyVsWaitCurrency(savings),
      humanTranslation: "Waiting reduces short-term cost but delays ownership benefits",
      bar: { kind: "wait_may_help_short_term" },
      mainSublabel: "Based on savings over your timeframe.",
      breakdown: [
        { label: "Monthly savings", value: formatBuyVsWaitCurrency(savings) },
        { label: "Future home price", value: formatBuyVsWaitCurrency(wait.futurePurchasePrice) },
        { label: "Rent paid", value: formatBuyVsWaitCurrency(wait.rentPaidTotal) },
      ],
      supporting: "",
      conclusionLine:
        "This outcome is driven by short-term cost differences that outweigh early ownership gains.",
    };
  }

  const paymentGapMonthly = Math.abs(monthlyBuy - monthlyRent);
  const paymentGapHorizon = paymentGapMonthly * horizonMonths;
  return {
    kind: "close_call",
    title: "",
    numberMicroLabel: "Estimated financial difference",
    mainValue: formatBuyVsWaitCurrency(paymentGapHorizon),
    humanTranslation: "From a financial standpoint, neither option clearly wins",
    bar: { kind: "close_call", monthlyRent: monthlyRent, monthlyPiti: monthlyBuy },
    mainSublabel: "Based on rent and payment over your timeframe.",
    breakdown: [
      { label: "Monthly difference", value: formatBuyVsWaitCurrency(paymentGapMonthly) },
      { label: "Rent", value: formatBuyVsWaitCurrency(monthlyRent) },
      { label: "Payment", value: formatBuyVsWaitCurrency(monthlyBuy) },
    ],
    supporting: "",
    conclusionLine: "Neither path clearly dominates financially over this timeframe.",
  };
}

function monthsFromYears(y: BuyVsWaitHorizonYears): number {
  return y * 12;
}

export function computeBuyVsWait(inputs: BuyVsWaitInputs): BuyVsWaitResult {
  const {
    purchasePrice: price,
    downPercent,
    interestRatePct: rate,
    monthlyRent: rent,
    horizonYears,
  } = inputs;

  const appreciation = inputs.annualHomeAppreciation ?? DEFAULT_ANNUAL_HOME_APPRECIATION;
  const rateDrift = inputs.rateDriftPoints ?? DEFAULT_RATE_DRIFT_POINTS;
  const taxPct = inputs.taxPctOfValueAnnual ?? DEFAULT_TAX_PCT_ANNUAL;
  const insPct = inputs.insurancePctOfValueAnnual ?? DEFAULT_INSURANCE_PCT_ANNUAL;

  const horizonMonths = monthsFromYears(horizonYears);
  const termMonths = BUY_VS_WAIT_TERM_YEARS * 12;

  const downPayment = price * (downPercent / 100);
  const loanAmount = Math.max(0, price - downPayment);

  const annualTax = price * (taxPct / 100);
  const annualInsurance = price * (insPct / 100);

  const breakdown = computePaymentScenario({
    price,
    downPercent,
    rate,
    termYears: BUY_VS_WAIT_TERM_YEARS,
    annualTax,
    annualInsurance,
  });

  const slice: HorizonSlice = cumulativePIOverHorizon(
    loanAmount,
    rate,
    termMonths,
    horizonMonths
  );

  const snapshot = buildPositionSnapshot(slice, breakdown, horizonMonths, termMonths);

  const homeValueEnd = price * Math.pow(1 + appreciation, horizonYears);
  const appreciationOnly = Math.max(0, homeValueEnd - price);
  const principalPaidDown = slice.principalPaid;
  const totalEquityGained = appreciationOnly + principalPaidDown;
  const missedEquity = totalEquityGained;

  const equity: BuyVsWaitEquityBreakdown = {
    appreciationOnly,
    principalPaidDown,
    remainingLoanBalanceAtHorizon: slice.remainingBalance,
    totalEquityGained,
    missedEquity,
  };

  const totalCashSpent = downPayment + snapshot.totalHousingOutflow;

  const rentPaidTotal = rent * horizonMonths;

  const futurePurchasePrice = price * Math.pow(1 + appreciation, horizonYears);
  const futureRate = rate + rateDrift;

  const futureAnnualTax = futurePurchasePrice * (taxPct / 100);
  const futureAnnualInsurance = futurePurchasePrice * (insPct / 100);

  const futureBreakdown = computePaymentScenario({
    price: futurePurchasePrice,
    downPercent,
    rate: futureRate,
    termYears: BUY_VS_WAIT_TERM_YEARS,
    annualTax: futureAnnualTax,
    annualInsurance: futureAnnualInsurance,
  });

  const lostEquityOpportunity = missedEquity;

  const assumptionsUsed: BuyVsWaitAssumptionsUsed = {
    annualHomeAppreciation: appreciation,
    rateDriftPoints: rateDrift,
    taxPctOfValueAnnual: taxPct,
    insurancePctOfValueAnnual: insPct,
  };

  const amortizationSnapshot = buildAmortizationSnapshot(loanAmount, rate, termMonths, horizonMonths, slice);
  const amortizationScheduleRows = buildAmortizationSchedule(loanAmount, rate, termMonths, horizonMonths);

  return {
    horizonYears,
    horizonMonths,
    assumptionsUsed,
    equity,
    amortizationSnapshot,
    amortizationScheduleRows,
    buyNow: {
      monthlyPaymentTotal: breakdown.total,
      monthlyPrincipalAndInterest: breakdown.principalAndInterest,
      totalCashSpent,
      principalPaid: slice.principalPaid,
      equityGained: totalEquityGained,
      homeValueEnd,
      loanBalanceEnd: slice.remainingBalance,
      downPayment,
    },
    wait: {
      rentPaidTotal,
      futurePurchasePrice,
      futureMonthlyPaymentTotal: futureBreakdown.total,
      futureMonthlyPrincipalAndInterest: futureBreakdown.principalAndInterest,
      lostEquityOpportunity,
    },
    headline: {
      rentPaidTotal,
      missedEquityApprox: missedEquity,
      futurePricePremium: Math.max(0, futurePurchasePrice - price),
    },
  };
}

/** USD display for all Buy vs. Wait UI — always includes $ and two decimal places. */
export function formatBuyVsWaitCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** @deprecated Use formatBuyVsWaitCurrency — identical (2 decimal places). */
export function formatBuyVsWaitCurrency2(n: number): string {
  return formatBuyVsWaitCurrency(n);
}

/** Short bullets for the trust-layer assumptions panel (scannable, grounded copy). */
export function getAssumptionsTrustBullets(a: BuyVsWaitAssumptionsUsed): string[] {
  const ap = (a.annualHomeAppreciation * 100).toFixed(1);
  const rd = a.rateDriftPoints;
  const tx = a.taxPctOfValueAnnual.toFixed(1).replace(/\.0$/, "");
  const ins = a.insurancePctOfValueAnnual.toFixed(2).replace(/\.?0+$/, "");

  return [
    `Home price growth modeled at ~${ap}% annually (in line with long-term U.S. housing trends).`,
    `Future rate modeled slightly higher (+${rd} percentage points) to reflect typical market variability.`,
    `Property tax (~${tx}%) and insurance (~${ins}%) of value per year, based on common national averages.`,
    `Both scenarios assume a standard 30-year loan for consistency. If you wait, only rent is counted through the horizon (no ownership equity until you buy).`,
  ];
}

