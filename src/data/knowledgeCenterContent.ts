/** Educational blurbs for Knowledge Center — advisory framing, not blog posts. */

export type PillarBlock = {
  id: string;
  title: string;
  featuredTitle: string;
  featuredPreview: string;
  supporting: { label: string; detail: string }[];
  ctaLabel: string;
  ctaTo: string;
};

export const KNOWLEDGE_PILLARS: PillarBlock[] = [
  {
    id: "pillar-options",
    title: "Understanding Your Options",
    featuredTitle: "Mortgage Broker vs. Bank: Why It Matters More Than Most People Realize",
    featuredPreview:
      "Where you get your loan shapes the guidance you receive — not just the rate on the page. Here’s how an advisory model differs from a single-product desk.",
    supporting: [
      { label: "Fixed vs Adjustable Rate", detail: "When each structure makes sense, and how to think beyond the payment." },
      { label: "What Pre-Approval Really Means", detail: "How it differs from pre-qualification and what it signals to sellers." },
      { label: "How Credit Impacts Your Mortgage", detail: "Score ranges, timing, and what actually moves the needle." },
    ],
    ctaLabel: "Explore your options with your numbers",
    ctaTo: "/loan-structure-simulator",
  },
  {
    id: "pillar-buying",
    title: "The Buying Process",
    featuredTitle: "The Homebuying Process, Step by Step",
    featuredPreview:
      "From first conversation to keys — a calm sequence so you always know what comes next and why it matters.",
    supporting: [
      { label: "Documents You’ll Need", detail: "A practical checklist so nothing surprises you mid-process." },
      { label: "How to Read a Loan Estimate", detail: "The numbers that actually matter for comparison." },
      { label: "What Happens at Closing", detail: "What to expect, who’s in the room, and how long it really takes." },
    ],
    ctaLabel: "See what buying looks like financially",
    ctaTo: "/buy-vs-wait",
  },
  {
    id: "pillar-refinance",
    title: "Refinancing & Equity",
    featuredTitle: "When Does a Refinance Actually Make Sense?",
    featuredPreview:
      "Break-even, goals, and structure — refinances should be evaluated like investments, not headlines.",
    supporting: [
      { label: "Break-even explained", detail: "How to weigh costs against real monthly and long-term benefit." },
      { label: "Cash-out vs Rate & Term", detail: "Different goals, different structures — clarity first." },
      { label: "What is a HELOC", detail: "How revolving equity lines differ from a traditional refinance." },
    ],
    ctaLabel: "Run your refinance scenario",
    ctaTo: "/loan-structure-simulator",
  },
  {
    id: "pillar-readiness",
    title: "Financial Readiness",
    featuredTitle: "How to Know If You’re Financially Ready to Buy",
    featuredPreview:
      "Readiness isn’t a single number — it’s cash flow, reserves, stability, and timing aligned with your goals.",
    supporting: [
      { label: "Improve your credit", detail: "High-impact moves that don’t rely on gimmicks." },
      { label: "DTI explained", detail: "What lenders weigh and how to think about your comfort zone." },
      { label: "Renting vs Buying", detail: "A framework beyond monthly payment — opportunity cost included." },
    ],
    ctaLabel: "Check your readiness",
    ctaTo: "/buy-vs-wait",
  },
];

export type ClarityCard = {
  id: string;
  question: string;
  preview: string;
  answer: string;
  /** Quick-answer cards only — pillar modals omit */
  category?: string;
  /** In-page pillar id for “Read more” — e.g. pillar-options */
  readMorePillarId?: string;
  /** Optional tool route for “Apply this” */
  applyTo?: string;
};

export const CLARITY_CARDS: ClarityCard[] = [
  {
    id: "pmi",
    category: "First-Time Buyer",
    question: "What is PMI?",
    preview: "Insurance that protects the lender — and when it can go away.",
    answer:
      "Private Mortgage Insurance (PMI) is typically required when your down payment is below 20% on a conventional loan. It protects the lender if you default — not you — but it helps you buy with less cash up front. PMI often drops off automatically once you reach sufficient equity, depending on your loan program and terms. We’ll show you how it fits your full picture, not just the monthly line item.",
    readMorePillarId: "pillar-readiness",
    applyTo: "/buy-vs-wait",
  },
  {
    id: "preapproval",
    category: "First-Time Buyer",
    question: "Pre-approval vs pre-qualification",
    preview: "They sound similar — they’re not the same thing.",
    answer:
      "Pre-qualification is usually a lighter review based on what you report. Pre-approval involves documented verification of income, assets, and credit — so it’s stronger for sellers and for your own planning. Neither is a final loan commitment, but pre-approval gets you much closer to real numbers you can rely on.",
    readMorePillarId: "pillar-options",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "dti",
    category: "Credit",
    question: "What is DTI?",
    preview: "Debt-to-income — and why it’s about more than a ratio.",
    answer:
      "Your debt-to-income ratio (DTI) compares your monthly debt payments to your gross monthly income. Lenders use it to gauge capacity — but your comfort level matters too. We help you understand both the guideline and what feels sustainable for your life.",
    readMorePillarId: "pillar-readiness",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "apr",
    category: "Refinance",
    question: "APR vs interest rate",
    preview: "Why the lower rate isn’t always the better deal.",
    answer:
      "The interest rate is the cost of borrowing the principal. APR includes certain fees and costs expressed as an annual percentage — useful for comparison, but the best structure still depends on how long you’ll keep the loan and your cash-flow goals.",
    readMorePillarId: "pillar-options",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "points",
    category: "Refinance",
    question: "What are points?",
    preview: "Buying down your rate — when it’s worth it.",
    answer:
      "Points are upfront fees paid to reduce your interest rate. Whether they make sense depends on how long you’ll hold the loan and your break-even timeline — something we model clearly before you commit.",
    readMorePillarId: "pillar-refinance",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "escrow",
    category: "First-Time Buyer",
    question: "What is escrow?",
    preview: "How taxes and insurance are collected with your payment.",
    answer:
      "Escrow is an account your servicer uses to pay property taxes and homeowners insurance on your behalf. Your monthly payment may include principal, interest, and a portion for escrow — we’ll walk through what’s included and how it can change over time.",
    readMorePillarId: "pillar-buying",
    applyTo: "/buy-vs-wait",
  },
];

export type GlossaryEntry = {
  term: string;
  letter: string;
  definition: string;
};

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  { term: "Amortization", letter: "A", definition: "Paying off debt over time in regular installments of principal and interest." },
  { term: "APR (Annual Percentage Rate)", letter: "A", definition: "A broader measure of borrowing cost than interest alone, including certain fees." },
  { term: "Closing costs", letter: "C", definition: "Fees and expenses to finalize your loan and transfer the property, separate from down payment." },
  { term: "DTI (Debt-to-Income)", letter: "D", definition: "Monthly debt payments divided by gross monthly income; used to assess capacity." },
  { term: "Escrow", letter: "E", definition: "An account used to collect and pay property taxes and insurance with your mortgage payment." },
  { term: "Fixed rate", letter: "F", definition: "An interest rate that stays the same for the life of the loan term." },
  { term: "HELOC", letter: "H", definition: "A Home Equity Line of Credit — revolving borrowing secured by your home." },
  { term: "Loan estimate", letter: "L", definition: "A standardized form showing key terms, payments, and costs so you can compare offers." },
  { term: "LTV (Loan-to-Value)", letter: "L", definition: "Loan amount divided by property value — affects rates and mortgage insurance." },
  { term: "PMI", letter: "P", definition: "Private Mortgage Insurance — often required on conventional loans with less than 20% down." },
  { term: "Points", letter: "P", definition: "Optional upfront fees used to buy down your interest rate." },
  { term: "Pre-approval", letter: "P", definition: "A stronger review with documentation than pre-qualification; closer to reliable numbers." },
  { term: "Refinance", letter: "R", definition: "Replacing your mortgage with a new one — often to change rate, term, or access equity." },
  { term: "Underwriting", letter: "U", definition: "The lender’s process of verifying your information and approving the loan." },
];
