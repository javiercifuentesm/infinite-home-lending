import type { PageMetadataOptions } from "../hooks/usePageMetadata";

const SITE = "https://www.infinitehomelending.com";

/** English defaults for tool and deal-desk routes (descriptions target 150–160 characters). */
export const PAGE_METADATA = {
  trueCostOfWaiting: {
    title: "True Cost of Waiting",
    description:
      "See what waiting to buy costs each month in Maryland, DC, and Virginia—rent paid, appreciation, larger down payments, and equity you miss while you delay.",
    canonical: `${SITE}/tools/true-cost-of-waiting`,
    ogTitle: "True Cost of Waiting — Infinite Home Lending",
  },
  buyVsRent: {
    title: "Buy vs Rent Calculator",
    description:
      "Compare renting vs buying over 30 years in MD, DC, and VA. Find your crossover year, monthly cost gap, and which path builds more net wealth for your timeline.",
    canonical: `${SITE}/tools/buy-vs-rent`,
    ogTitle: "Buy vs Rent Calculator — Infinite Home Lending",
  },
  principalAccelerator: {
    title: "Principal Accelerator",
    description:
      "Model extra mortgage principal payments and watch years and interest disappear. See how small monthly additions shorten your loan and save real money over time.",
    canonical: `${SITE}/tools/principal-accelerator`,
    ogTitle: "Principal Accelerator — Infinite Home Lending",
  },
  reverseMortgagePlanner: {
    title: "Reverse Mortgage Planner",
    description:
      "Compare reverse mortgage payout strategies, income gaps, and heir impact for homeowners 62+ in Maryland, DC, and Virginia—with clear, honest scenario modeling.",
    canonical: `${SITE}/tools/reverse-mortgage-planner`,
    ogTitle: "Reverse Mortgage Planner — Infinite Home Lending",
  },
  helocPlanner: {
    title: "HELOC Planner",
    description:
      "Estimate HELOC limits, rate scenarios, and payment cliffs for MD, DC, and VA homeowners. Compare HELOC vs equity loan vs cash-out refi for your specific goal.",
    canonical: `${SITE}/tools/heloc-planner`,
    ogTitle: "HELOC Planner — Infinite Home Lending",
  },
  conventionalVsFha: {
    title: "Conventional vs FHA Calculator",
    description:
      "Compare FHA and conventional loans side by side—MI crossover, upgrade strategy, and credit-score impact—so MD, DC, and VA buyers pick the right structure.",
    canonical: `${SITE}/tools/conventional-vs-fha`,
    ogTitle: "Conventional vs FHA Calculator — Infinite Home Lending",
  },
  creditScoreRoi: {
    title: "Credit Score ROI Calculator",
    description:
      "Calculate what raising your credit score is worth before you apply—monthly savings, lifetime interest, and an action plan for MD, DC, and VA homebuyers.",
    canonical: `${SITE}/tools/credit-score-roi`,
    ogTitle: "Credit Score ROI Calculator — Infinite Home Lending",
  },
  selfEmployedQualifier: {
    title: "Self-Employed Qualifier",
    description:
      "Model Schedule C, bank-statement, and planning paths for self-employed borrowers in MD, DC, and VA—see qualifying income and buying power before you apply.",
    canonical: `${SITE}/tools/self-employed-qualifier`,
    ogTitle: "Self-Employed Qualifier — Infinite Home Lending",
  },
  rateLockEngine: {
    title: "Rate Lock Decision Engine",
    description:
      "Quantify float vs lock risk in dollars—extension fees, float-down tradeoffs, and downside exposure for MD, DC, and VA borrowers deciding to lock or float.",
    canonical: `${SITE}/tools/rate-lock-engine`,
    ogTitle: "Rate Lock Decision Engine — Infinite Home Lending",
  },
  homebuyingPowerMap: {
    title: "Homebuying Power Map",
    description:
      "Map how your buying power changes over 90 days, 6 months, and 12 months across real MD, DC, and VA neighborhoods as credit, debt, and savings improve.",
    canonical: `${SITE}/tools/homebuying-power-map`,
    ogTitle: "Homebuying Power Map — Infinite Home Lending",
  },
  wealthTracker: {
    title: "Wealth Tracker",
    description:
      "Compare 30-year net worth renting vs owning in Maryland, DC, and Virginia—equity, appreciation, PMI, rent inflation, and the honest cost of your down payment.",
    canonical: `${SITE}/tools/wealth-tracker`,
    ogTitle: "Wealth Tracker — Infinite Home Lending",
  },
  loanStructureSimulator: {
    title: "Loan Structure Simulator",
    description:
      "Stress-test payment, affordability, and horizon scenarios before you commit. See how price, rate, down payment, and term shift outcomes in MD, DC, or VA.",
    canonical: `${SITE}/loan-structure-simulator`,
  },
  buyVsWaitAnalyzer: {
    title: "Buy vs Wait Analyzer",
    description:
      "Should you buy now or wait? Compare wealth, payment, and timing across 1–3 year horizons with adjustable assumptions for Maryland, DC, and Virginia markets.",
    canonical: `${SITE}/buy-vs-wait`,
  },
  refinanceRealMath: {
    title: "Refinance Real Math",
    description:
      "See when refinancing truly pays off—monthly payment vs total interest over your hold period—not just a rate quote. Built for Washington, DC homeowners.",
    canonical: `${SITE}/refinance-real-math`,
  },
  analytics: {
    title: "Lead Analytics",
    description:
      "Internal Sarah AI concierge lead analytics for Infinite Home Lending—review captured leads, conversation context, and follow-up intelligence for advisors.",
    canonical: `${SITE}/analytics`,
  },
  dealDesk: {
    title: "The Deal Desk",
    description:
      "Twelve live partner tools for MD, DC, and VA agents—net sheets, buyer qualifiers, offer math, and listing strategy at the deal table with Infinite Home Lending.",
    canonical: `${SITE}/deal-desk`,
  },
  dealDeskPartnerAccess: {
    title: "Deal Desk Partner Access",
    description:
      "Request partner access to The Deal Desk—MD, DC, and VA agent tools for net sheets, buyer qualification, offer optimization, and Nexio-powered deal intelligence.",
    canonical: `${SITE}/deal-desk`,
  },
  offerOptimizer: {
    title: "Offer Optimizer",
    description:
      "Compare a price cut vs seller-funded buydown—buyer payment relief, seller net proceeds, and qualification impact for MD, DC, and VA listing conversations.",
    canonical: `${SITE}/deal-desk/offer-optimizer`,
  },
  clientQualifier: {
    title: "Client Qualifier",
    description:
      "Run a 90-second buyer mortgage snapshot before the first showing—readiness score, max price, loan type, payment range, and down payment gap for MD, DC, and VA.",
    canonical: `${SITE}/deal-desk/client-qualifier`,
  },
  listingBoost: {
    title: "Listing Boost",
    description:
      "Show sellers how many more buyers qualify with a buydown vs a price cut—model concessions, buyer pool percentages, and net proceeds for MD, DC, and VA listings.",
    canonical: `${SITE}/deal-desk/listing-boost`,
  },
  assumableCalculator: {
    title: "Assumable Calculator",
    description:
      "Model FHA, VA, or USDA assumption—equity gap, blended rate, monthly savings, and lifetime interest vs a new loan—for MD, DC, and Virginia agent conversations.",
    canonical: `${SITE}/deal-desk/assumable-calculator`,
  },
  sellerNetSheet: {
    title: "Seller Net Sheet",
    description:
      "Build print-ready seller net sheets with three price scenarios and jurisdiction transfer taxes for Montgomery, Prince George's, Northern Virginia, and DC.",
    canonical: `${SITE}/deal-desk/net-sheet`,
  },
  loanMatchmaker: {
    title: "Loan Program Matchmaker",
    description:
      "Rank the best-fit loan programs for your buyer—Conventional, FHA, VA, USDA, Non-QM—plus MD, DC, and VA programs to stack before the first showing or offer.",
    canonical: `${SITE}/deal-desk/loan-matchmaker`,
  },
  narScripts: {
    title: "NAR Settlement Scripts",
    description:
      "Word-for-word scripts for post-NAR conversations—buyer agreements, commission objections, seller concessions, and open houses—for MD, DC, and Virginia agents.",
    canonical: `${SITE}/deal-desk/nar-scripts`,
  },
  dealRescue: {
    title: "Deal Rescue Tool",
    description:
      "When financing stalls, map ranked alternative loan paths and step-by-step actions for credit drops, appraisal gaps, job changes, DTI issues, and more.",
    canonical: `${SITE}/deal-desk/deal-rescue`,
  },
  dealDeskPlaybook: {
    title: "Deal Desk Playbook",
    description:
      "The complete agent guide to Deal Desk tools for MD, DC, and VA—scripts, walkthroughs, and deal strategies for net sheets, qualifiers, buydowns, and assumables.",
    canonical: `${SITE}/deal-desk/playbook`,
  },
} as const satisfies Record<string, PageMetadataOptions>;
