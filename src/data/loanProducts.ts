import type { LoanProductData } from "../components/LoanProductCard";
import { LOAN_PRODUCTS_ES } from "./loanProducts.es";

/** Company Solutions grid layout — preserved from integration base (3 × 3). */
export const LOAN_GRID_ROWS: readonly (readonly string[])[] = [
  ["conventional", "fha", "va"],
  ["usda", "refinance", "cash-out-refinance"],
  ["heloc", "reverse", "non-qm"],
] as const;

/**
 * Advisor microsite loan library layout (original Alma experience).
 * Extra specialty programs remain in LOAN_PRODUCTS for lookup/modals but
 * only appear on company Solutions when added to LOAN_GRID_ROWS.
 */
export const ADVISOR_LOAN_GRID_ROWS: readonly (readonly string[])[] = [
  ["conventional", "fha", "dpa-advantage"],
  ["fha-repair-escrow", "fha-203k-limited", "va"],
  ["usda", "refinance", "cash-out-refinance"],
  ["heloc", "reverse", "non-qm"],
  ["bank-statement", "1099-income", "pl-loan"],
  ["asset-depletion", "dscr", "foreign-national"],
] as const;

export const LOAN_PRODUCTS: LoanProductData[] = [
  {
    id: "conventional",
    category: "purchase",
    featuredCard: true,
    tags: ["Most Common Path"],
    title: "Conventional Loans",
    shortDescription: "Flexible financing without government program overlays.",
    cardHook: "Own a home with flexible terms and broad lender choice—without agency program overlays.",
    highlightLine:
      "Put as little as **3% down** with options to **avoid mortgage insurance**",
    highlights: [
      "No FHA/VA/USDA rule overlays",
      "Strong fit when credit and income are documented clearly",
    ],
    expanded: {
      fullDescription:
        "Conventional loans are the most common path to home financing. They offer competitive rates and flexible terms for buyers with stable income and good credit. With a down payment of at least 3%, you can avoid many of the restrictions that come with government-backed programs while still accessing a wide range of term options.",
      whoFor: [
        "Buyers with stable income and good credit scores",
        "Those who prefer flexibility without government program overlays",
        "Borrowers who can document income and assets in a straightforward way",
      ],
      benefits: [
        "Flexible term lengths and fixed or adjustable options",
        "Potentially lower long-term costs when you put 20% down (no PMI)",
        "Widely available across lenders and property types",
        "Streamlined process compared with some government programs",
      ],
      howItWorks: [
        "Get pre-qualified to understand price range and monthly payment",
        "Submit a full application with income and asset documentation",
        "The lender reviews credit, employment, and the property appraisal",
        "Close on your loan and fund your purchase or refinance",
      ],
      reassurance: "Not sure if conventional is the right fit? We’ll compare options with you—no pressure.",
      primaryCta: { label: "See what this looks like for you", to: "/contact" },
    },
    modalDetail: {
      headline: "Competitive rates and flexible terms—without government program overlays",
      intro:
        "Conventional loans are the most common path to home financing. They offer competitive rates and flexible terms for buyers with stable income and good credit.",
      whenMakesSenseBullets: [
        "You have steady income and credit that fits typical lender expectations.",
        "You want flexibility without the extra rules of government-backed programs.",
        "You’re comparing fixed and adjustable options across many lenders.",
        "You may put less than 20% down and are okay discussing mortgage insurance tradeoffs.",
      ],
      atAGlance: {
        bestFor: "Buyers who can document income and assets clearly and prefer conventional guidelines",
        minCredit: "Varies by lender and program; stronger credit typically improves pricing",
        downPayment: "As low as 3% for qualified buyers",
        keyAdvantage: "Flexible term options and broad availability across property types",
      },
      overviewParagraphs: [
        "With a down payment of at least 3%, you can avoid many of the restrictions that come with government-backed programs while still accessing a wide range of term options.",
      ],
      whoTypically: [
        "Buyers with stable income and good credit scores",
        "Those who prefer flexibility without government program overlays",
        "Borrowers who can document income and assets in a straightforward way",
      ],
      keyRequirements: [
        "Credit score typically 620 or higher for many lenders (exact rules vary)",
        "Down payment often starts around 3%; putting down 20% usually avoids mortgage insurance",
        "Your monthly debts compared to income must fit your lender’s limits (often under roughly 45–50%)",
        "The home must meet appraisal standards and your lender’s property rules",
        "Mortgage insurance usually applies if you put down less than 20%",
      ],
      whyClientsChoose: [
        "Flexible term lengths and fixed or adjustable options",
        "Potentially lower long-term costs when you put 20% down (no PMI)",
        "Widely available across lenders and property types",
        "Streamlined process compared with some government programs",
      ],
      whatToKeepInMind: [
        "PMI may apply when you put less than 20% down—your loan officer can explain how it affects your payment.",
        "Closing costs and rate quotes vary by lender—compare the full picture, not just the rate.",
      ],
    },
  },
  {
    id: "fha",
    category: "purchase",
    featuredCard: true,
    tags: ["Low Down Payment"],
    title: "FHA Loans",
    shortDescription: "Buy with as little as 3.5% down.",
    cardHook: "Buy sooner with a lower down payment and guidelines that may be more forgiving than many standard loans.",
    highlightLine:
      "Start with as little as **3.5% down**—backed by Federal Housing Administration mortgage insurance.",
    highlights: [
      "More flexible credit than many conventional loans",
      "Fixed-rate and adjustable-rate options available",
    ],
    expanded: {
      fullDescription:
        "FHA loans are designed to help more people buy a home. They’re insured by the Federal Housing Administration, which allows lenders to offer lower down payments and more flexible credit requirements than many conventional products. They’re a strong option when you need a lower barrier to entry.",
      whoFor: [
        "First-time buyers or those with limited down payment savings",
        "Borrowers building or rebuilding credit",
        "Buyers who want a smaller upfront investment than many conventional loans require",
      ],
      benefits: [
        "Lower down payment than many conventional options",
        "Credit guidelines can be more forgiving",
        "Fixed-rate and adjustable-rate options available",
        "Can be used for purchase or refinance in many cases",
      ],
      howItWorks: [
        "Pre-approval helps you shop with a clear budget",
        "You apply with income, asset, and credit documentation",
        "The home must meet FHA property requirements",
        "At closing, you’ll have an FHA-insured mortgage with mortgage insurance as required",
      ],
      reassurance: "Wondering if FHA beats conventional for you? We’ll walk through the numbers together.",
      primaryCta: { label: "Run your numbers with this option", to: "/contact" },
    },
    modalDetail: {
      headline: "FHA insurance helps lenders offer lower down payments and more flexible credit guidelines",
      intro:
        "FHA loans are designed to help more people buy a home. They’re insured by the Federal Housing Administration, which allows lenders to offer lower down payments and more flexible credit requirements than many conventional products.",
      whenMakesSenseBullets: [
        "You want one of the lowest standard down payments available on many programs.",
        "Your credit is still improving and you need more forgiving guidelines.",
        "You’re comfortable with mortgage insurance as part of the monthly picture.",
        "The home can meet federal housing property standards.",
      ],
      atAGlance: {
        bestFor: "Buyers who need a lower barrier to entry or are building credit",
        minCredit: "Often more flexible than many conventional options (varies by lender)",
        downPayment: "As low as 3.5%",
        keyAdvantage: "Government-backed mortgage insurance supports access for more borrowers",
      },
      overviewParagraphs: ["They’re a strong option when you need a lower barrier to entry."],
      whoTypically: [
        "First-time buyers or those with limited down payment savings",
        "Borrowers building or rebuilding credit",
        "Buyers who want a smaller upfront investment than many conventional loans require",
      ],
      keyRequirements: [
        "Credit guidelines are often more flexible than on many standard loans (varies by lender)",
        "Down payment as low as 3.5% on many Federal Housing Administration loans",
        "Your monthly debts compared to income must fit your lender’s limits (often under roughly 45–50%)",
        "The home must meet federal housing property standards and pass appraisal",
        "Mortgage insurance (upfront and monthly) is required on these loans",
      ],
      whyClientsChoose: [
        "Lower down payment than many conventional options",
        "Credit guidelines can be more forgiving",
        "Fixed-rate and adjustable-rate options available",
        "Can be used for purchase or refinance in many cases",
      ],
      whatToKeepInMind: [
        "FHA loans require mortgage insurance—factor that into your monthly cost comparison.",
        "Property condition must meet FHA requirements—your agent and lender can help you verify.",
      ],
    },
    relatedProgramIds: ["dpa-advantage", "fha-repair-escrow", "fha-203k-limited"],
  },
  {
    id: "va",
    category: "purchase",
    tags: ["For Veterans"],
    title: "VA Loans",
    shortDescription: "Designed for eligible veterans and service members.",
    cardHook: "Own a home with $0 down and no private mortgage insurance in many cases—built for those who served.",
    highlightLine:
      "**$0 down** for eligible borrowers; private mortgage insurance typically not required.",
    highlights: [
      "Competitive rates when you qualify",
      "Designed for veterans, active-duty, and eligible surviving spouses",
    ],
    expanded: {
      fullDescription:
        "VA loans are available to veterans, active-duty service members, and eligible surviving spouses. They’re backed by the Department of Veterans Affairs and often allow $0 down with no PMI—making them one of the most powerful purchase tools for those who qualify.",
      whoFor: [
        "Veterans and active-duty members of the U.S. Armed Forces",
        "Eligible surviving spouses",
        "Those who meet VA eligibility and entitlement requirements",
      ],
      benefits: [
        "No down payment in many cases",
        "No PMI—potentially lower monthly cost than conventional with low down",
        "Competitive interest rates",
        "Limited closing costs and no prepayment penalty on VA loans",
      ],
      howItWorks: [
        "Obtain your Certificate of Eligibility (COE)",
        "Get pre-approved with a VA-approved lender",
        "Choose a home that meets VA minimum property requirements",
        "Close with your VA-backed loan",
      ],
      reassurance: "Thank you for your service. If you’re eligible, we’ll help you make the most of your VA benefit.",
      primaryCta: { label: "Talk through this scenario with an expert", to: "/contact" },
    },
    modalDetail: {
      headline: "VA backing can mean $0 down and no PMI for eligible borrowers",
      intro: "VA loans are available to veterans, active-duty service members, and eligible surviving spouses.",
      whenMakesSenseBullets: [
        "You have eligible service history and can obtain your certificate of eligibility.",
        "You want to limit cash at closing—$0 down is possible in many cases.",
        "You’d rather not pay private mortgage insurance in typical scenarios.",
        "The home you like can meet Department of Veterans Affairs property rules.",
      ],
      atAGlance: {
        bestFor: "Eligible veterans, service members, and qualifying surviving spouses",
        downPayment: "$0 down in many cases for eligible borrowers",
        keyAdvantage: "No PMI in typical scenarios—often a meaningful monthly savings versus low-down conventional",
      },
      overviewParagraphs: [
        "They’re backed by the Department of Veterans Affairs and often allow $0 down with no PMI—making them one of the most powerful purchase tools for those who qualify.",
      ],
      whoTypically: [
        "Veterans and active-duty members of the U.S. Armed Forces",
        "Eligible surviving spouses",
        "Those who meet VA eligibility and entitlement requirements",
      ],
      keyRequirements: [
        "Credit score expectations vary by lender; many look for a solid score",
        "No down payment in many cases for eligible borrowers",
        "Your monthly debts compared to income must fit your lender’s limits (often under roughly 45–50%)",
        "The home must meet Department of Veterans Affairs property rules and pass appraisal",
        "You need a Certificate of Eligibility that proves your service-based eligibility",
      ],
      whyClientsChoose: [
        "No down payment in many cases",
        "No PMI—potentially lower monthly cost than conventional with low down",
        "Competitive interest rates",
        "Limited closing costs and no prepayment penalty on VA loans",
      ],
      whatToKeepInMind: [
        "Eligibility and entitlement rules apply—your COE is a key step.",
        "VA funding fees and other costs may apply depending on service history and usage—ask for a clear fee breakdown.",
      ],
    },
  },
  {
    id: "usda",
    category: "purchase",
    tags: ["Rural & Suburban"],
    title: "USDA Loans",
    shortDescription: "Zero-down in eligible rural and suburban areas.",
    cardHook: "Buy in eligible areas with a no-down-payment path when United States Department of Agriculture rules fit.",
    highlightLine: "$0 down when you and the property qualify for the rural housing program.",
    highlights: [
      "Household income must fall within limits for your area",
      "Fixed-rate options for predictable payments",
    ],
    expanded: {
      fullDescription:
        "USDA loans help buyers purchase homes in eligible rural and suburban areas with no down payment. Income and property location must meet USDA guidelines—but for those who qualify, it’s a powerful way to buy with limited upfront cash.",
      whoFor: [
        "Buyers purchasing in USDA-eligible geographic areas",
        "Households within USDA income limits for the area",
        "Those comfortable with USDA property and appraisal requirements",
      ],
      benefits: [
        "$0 down for eligible borrowers and properties",
        "Below-market mortgage insurance costs in many cases",
        "Fixed-rate terms for predictable payments",
        "Supports homeownership in rural and some suburban communities",
      ],
      howItWorks: [
        "Confirm the property address is in an eligible USDA area",
        "Verify household income falls within limits for your region",
        "Apply through a USDA-approved lender",
        "Close with a USDA-guaranteed loan",
      ],
      reassurance: "Not sure if your area qualifies? We can check eligibility quickly.",
      primaryCta: { label: "See if this path fits your area", to: "/contact" },
    },
    modalDetail: {
      headline: "No-down financing when the home and household meet USDA eligibility rules",
      intro: "USDA loans help buyers purchase homes in eligible rural and suburban areas with no down payment.",
      whenMakesSenseBullets: [
        "The address is in an eligible rural or suburban area.",
        "Your household income fits the limits for your region.",
        "You want a no-down-payment path when you and the property qualify.",
        "You’re okay with program fees that work like mortgage insurance in the payment.",
      ],
      atAGlance: {
        bestFor: "Moderate-income buyers purchasing in USDA-eligible areas",
        downPayment: "$0 down for eligible borrowers and properties",
        keyAdvantage: "Below-market mortgage insurance costs in many cases",
      },
      overviewParagraphs: [
        "Income and property location must meet USDA guidelines—but for those who qualify, it’s a powerful way to buy with limited upfront cash.",
      ],
      whoTypically: [
        "Buyers purchasing in USDA-eligible geographic areas",
        "Households within USDA income limits for the area",
        "Those comfortable with USDA property and appraisal requirements",
      ],
      keyRequirements: [
        "Credit must meet your lender’s standards for the United States Department of Agriculture rural loan program",
        "No down payment when you and the property qualify",
        "Total household income must fall within limits for your area",
        "The home must sit in an eligible rural or suburban area and pass appraisal",
        "This program includes a guarantee fee that works like mortgage insurance",
      ],
      whyClientsChoose: [
        "$0 down for eligible borrowers and properties",
        "Below-market mortgage insurance costs in many cases",
        "Fixed-rate terms for predictable payments",
        "Supports homeownership in rural and some suburban communities",
      ],
      whatToKeepInMind: [
        "Eligibility is location- and income-specific—we’ll verify both before you commit.",
        "USDA loans include mortgage insurance—compare total monthly cost, not just the rate.",
      ],
    },
  },
  {
    id: "refinance",
    category: "refinance",
    tags: ["Rate/Term"],
    title: "Refinance",
    shortDescription: "Improve your rate or term—without cashing out equity.",
    cardHook: "Lower your payment or align your term—without increasing your balance to take cash out.",
    highlightLine: "Replace your loan on better terms when the savings justify closing costs.",
    highlights: [
      "Shorten or extend your term to match your goals",
      "Break-even clarity before you commit",
    ],
    expanded: {
      fullDescription:
        "A rate-and-term refinance replaces your existing mortgage with a new one to improve your interest rate, payment, or loan length—without increasing the loan balance to take cash out. It’s ideal when market rates drop, your credit improves, or you want to align your mortgage with how long you plan to stay in the home.",
      whoFor: [
        "Homeowners who want a lower rate or different term",
        "Those whose home value or credit has improved since closing",
        "Borrowers focused on monthly savings or paying off the loan sooner—not pulling equity as cash",
      ],
      benefits: [
        "Lower rate or payment when the numbers work in your favor",
        "Term flexibility—pay off faster or ease monthly strain",
        "Single monthly payment; no separate equity line",
        "Potential PMI removal when LTV allows",
      ],
      howItWorks: [
        "Compare your current loan to today’s rates and terms",
        "Apply and lock when the savings justify closing costs",
        "Appraisal and underwriting confirm value and eligibility",
        "Close—your old loan is paid off and the new one begins",
      ],
      reassurance: "We’ll show you the break-even math so you can decide with confidence.",
      primaryCta: { label: "Run the numbers on a refinance", to: "/contact" },
    },
    modalDetail: {
      headline: "Improve your rate or term—without increasing your balance to take cash out",
      intro:
        "A rate-and-term refinance replaces your existing mortgage with a new one to improve your interest rate, payment, or loan length—without increasing the loan balance to take cash out.",
      whenMakesSenseBullets: [
        "Today’s rates could improve your payment versus your current loan.",
        "Your credit or home value has improved since you closed.",
        "You want a different loan length to match how long you’ll stay.",
        "You don’t need to pull cash out—just better terms.",
      ],
      atAGlance: {
        bestFor: "Homeowners focused on rate, payment, or term—not pulling equity as cash",
        keyAdvantage: "One mortgage payment and clear break-even math when the numbers work",
      },
      overviewParagraphs: [
        "It’s ideal when market rates drop, your credit improves, or you want to align your mortgage with how long you plan to stay in the home.",
      ],
      whoTypically: [
        "Homeowners who want a lower rate or different term",
        "Those whose home value or credit has improved since closing",
        "Borrowers focused on monthly savings or paying off the loan sooner—not pulling equity as cash",
      ],
      keyRequirements: [
        "Credit score must meet your lender’s standards for a new loan",
        "You need enough equity so the new loan fits your lender’s rules for loan size compared to home value",
        "Your monthly debts compared to income must stay within what your lender allows (often under roughly 45–50%)",
        "The home must pass appraisal and meet your lender’s property rules",
        "You pay closing costs; the savings should justify the cost over the time you keep the loan",
      ],
      whyClientsChoose: [
        "Lower rate or payment when the numbers work in your favor",
        "Term flexibility—pay off faster or ease monthly strain",
        "Single monthly payment; no separate equity line",
        "Potential PMI removal when LTV allows",
      ],
      whatToKeepInMind: [
        "Closing costs matter—break-even timing should fit how long you plan to keep the loan.",
        "A rate/term refinance doesn’t pull cash out—if you need equity as cash, compare alternatives.",
      ],
    },
  },
  {
    id: "cash-out-refinance",
    category: "refinance",
    tags: ["Cash Out"],
    title: "Cash-Out Refinance",
    shortDescription: "Turn equity into cash with one new mortgage payment.",
    cardHook: "Unlock equity as cash while keeping one mortgage payment instead of juggling high-rate debts.",
    highlightLine: "Access funds often at rates below many credit cards or personal loans.",
    highlights: [
      "Lump sum from available equity at closing",
      "Single monthly payment to manage",
    ],
    expanded: {
      fullDescription:
        "A cash-out refinance replaces your current mortgage with a larger loan and pays you the difference at closing. It’s a common way to fund renovations, consolidate higher-rate debt, or cover large expenses—using home equity while keeping a single monthly payment.",
      whoFor: [
        "Homeowners with meaningful equity built up",
        "Those who prefer one loan payment over multiple high-rate debts",
        "Borrowers planning major home improvements or life expenses",
      ],
      benefits: [
        "Access a lump sum based on available equity and qualification",
        "Interest may be lower than unsecured borrowing options",
        "Potential tax considerations—consult a tax professional",
        "Structured payoff on a mortgage timeline you choose",
      ],
      howItWorks: [
        "Determine how much equity you can access safely",
        "Apply; underwriting reviews income, credit, and appraisal",
        "Close on a new loan larger than your payoff; receive cash difference",
        "Repay on the new loan’s schedule",
      ],
      reassurance: "We’ll walk through the numbers and alternatives—including HELOC—so you pick what fits.",
      primaryCta: { label: "See what cash-out could look like for you", to: "/contact" },
    },
    modalDetail: {
      headline: "Replace your mortgage with a larger loan and receive the difference at closing",
      intro: "A cash-out refinance replaces your current mortgage with a larger loan and pays you the difference at closing.",
      whenMakesSenseBullets: [
        "You have enough equity to borrow against while leaving a safe cushion.",
        "You want one lump sum for renovation, debt payoff, or a large expense.",
        "A mortgage rate may beat what you’d pay on cards or unsecured loans.",
        "You prefer one monthly payment instead of juggling several debts.",
      ],
      atAGlance: {
        bestFor: "Homeowners with meaningful equity who want a lump sum in one first mortgage",
        keyAdvantage: "Potential for lower rates than many unsecured borrowing options",
      },
      overviewParagraphs: [
        "It’s a common way to fund renovations, consolidate higher-rate debt, or cover large expenses—using home equity while keeping a single monthly payment.",
      ],
      whoTypically: [
        "Homeowners with meaningful equity built up",
        "Those who prefer one loan payment over multiple high-rate debts",
        "Borrowers planning major home improvements or life expenses",
      ],
      keyRequirements: [
        "Credit score must meet your lender’s standards for a cash-out loan",
        "You need enough equity after taking cash out—lenders set how much you can borrow",
        "Your monthly debts compared to income must support the new, larger payment (often under roughly 45–50%)",
        "The home must pass appraisal and meet your lender’s property rules",
        "You receive cash at closing and repay everything on one new mortgage",
      ],
      whyClientsChoose: [
        "Access a lump sum based on available equity and qualification",
        "Interest may be lower than unsecured borrowing options",
        "Potential tax considerations—consult a tax professional",
        "Structured payoff on a mortgage timeline you choose",
      ],
      whatToKeepInMind: [
        "Your home secures the loan—borrow within what you can sustain.",
        "Total interest paid can increase if you extend the term or raise the balance—review the long-term cost.",
      ],
    },
  },
  {
    id: "heloc",
    category: "equity",
    tags: ["Flexible Access"],
    title: "HELOC",
    shortDescription: "Access your home’s equity when you need it.",
    cardHook: "Tap equity on your schedule—draw what you need, when you need it, not a lump sum upfront.",
    highlightLine: "Keep your current mortgage while adding a flexible line of credit against your equity.",
    highlights: [
      "Rates usually beat most credit cards",
      "Repayment follows what you draw and your lender’s terms",
    ],
    expanded: {
      fullDescription:
        "A Home Equity Line of Credit (HELOC) lets you borrow against the equity you’ve built, with a revolving line you can draw from over a defined period. Instead of a single lump-sum refinance, you borrow what you need when you need it—then repay over time according to your draw and the lender’s terms.",
      whoFor: [
        "Homeowners with built-up equity",
        "Those needing flexible access to funds over time",
        "Home improvement, debt consolidation, or other planned uses",
      ],
      benefits: [
        "Borrow only what you need",
        "Lower rates than most credit cards",
        "Flexible repayment structure depending on balance drawn",
        "Keep your existing mortgage while adding a second lien",
      ],
      howItWorks: [
        "Your home equity is evaluated",
        "A credit line is approved up to a set limit",
        "You draw funds as needed during the draw period",
        "You repay over time per your lender’s schedule",
      ],
      reassurance: "Not sure if this is the right path? That’s completely okay.",
      primaryCta: { label: "Explore a line of credit for your home", to: "/contact" },
    },
    modalDetail: {
      headline: "A revolving line secured by your equity—draw what you need, when you need it",
      intro:
        "A Home Equity Line of Credit (HELOC) lets you borrow against the equity you’ve built, with a revolving line you can draw from over a defined period.",
      whenMakesSenseBullets: [
        "You want to draw over time instead of taking one lump sum now.",
        "You’re planning projects or costs that arrive in stages.",
        "You’d like to keep your current first mortgage in place.",
        "A line rate may beat what you’d pay on most credit cards.",
      ],
      atAGlance: {
        bestFor: "Homeowners who want flexibility and may not need a lump sum upfront",
        keyAdvantage: "Keep your existing mortgage while adding a second lien for access to funds",
      },
      overviewParagraphs: [
        "Instead of a single lump-sum refinance, you borrow what you need when you need it—then repay over time according to your draw and the lender’s terms.",
      ],
      whoTypically: [
        "Homeowners with built-up equity",
        "Those needing flexible access to funds over time",
        "Home improvement, debt consolidation, or other planned uses",
      ],
      keyRequirements: [
        "Credit score must meet your lender’s standards for a home equity line",
        "You need enough equity in your home to support the line and your lender’s limits",
        "Your monthly debts compared to income must stay within what your lender allows",
        "The home is collateral; your lender may require appraisal or a home valuation",
        "Your lender sets draw periods and repayment rules that you must follow",
      ],
      whyClientsChoose: [
        "Borrow only what you need",
        "Lower rates than most credit cards",
        "Flexible repayment structure depending on balance drawn",
        "Keep your existing mortgage while adding a second lien",
      ],
      whatToKeepInMind: [
        "Rates and draws can change over time—understand your draw period and repayment terms.",
        "A HELOC is a second lien—default risk is serious; treat draws as secured borrowing.",
      ],
    },
  },
  {
    id: "reverse",
    category: "equity",
    tags: ["62+ Only"],
    title: "Reverse Mortgage",
    shortDescription: "Equity access at 62+—no monthly mortgage payments to the lender.",
    cardHook: "At 62+, access equity with no monthly mortgage payments to the lender while you stay in your home.",
    highlightLine: "Receive funds as a lump sum, monthly payments, or line of credit—per program rules.",
    highlights: [
      "You still pay property taxes, insurance, and upkeep",
      "Repayment timing follows your contract—review with a qualified advisor",
    ],
    expanded: {
      fullDescription:
        "A reverse mortgage allows eligible homeowners aged 62 and older to access home equity without making monthly mortgage payments to the lender. You remain responsible for property taxes, homeowners insurance, and maintaining the home. Loan proceeds can be structured in several ways; repayment is typically due when the home is sold, the home is no longer your primary residence, or other contract terms apply. Consult a qualified advisor—this product has important long-term considerations.",
      whoFor: [
        "Homeowners age 62 and older",
        "Those looking to supplement retirement income",
        "Those who want to remain in their home long-term",
      ],
      benefits: [
        "No required monthly mortgage payments to the lender (obligations like taxes and insurance remain)",
        "Access to funds—consult a financial advisor about your situation",
        "Ability to stay in your home while accessing equity",
        "Flexible payout options depending on program",
      ],
      howItWorks: [
        "Home value and equity position are assessed",
        "Eligible loan amount is calculated based on age, rates, and program rules",
        "Funds may be distributed as a lump sum, monthly payments, or line of credit",
        "The loan is generally repaid when the home is sold or is no longer the primary residence",
      ],
      reassurance: "Have questions? We’ll walk you through it step by step.",
      primaryCta: { label: "Talk through this scenario with an expert", to: "/contact" },
    },
    modalDetail: {
      headline: "Access equity at 62+ without monthly mortgage payments to the lender",
      intro:
        "A reverse mortgage allows eligible homeowners aged 62 and older to access home equity without making monthly mortgage payments to the lender. You remain responsible for property taxes, homeowners insurance, and maintaining the home.",
      whenMakesSenseBullets: [
        "You’re 62 or older and plan to stay in this home for the foreseeable future.",
        "You want to access equity without monthly mortgage payments to the lender.",
        "You can keep up with property taxes, insurance, and maintenance.",
        "You’ll review long-term tradeoffs with a qualified advisor before deciding.",
      ],
      atAGlance: {
        bestFor: "Homeowners 62+ who want to stay in their home while accessing equity",
        keyAdvantage: "No required monthly mortgage payments to the lender (taxes, insurance, and maintenance remain)",
      },
      overviewParagraphs: [
        "Loan proceeds can be structured in several ways; repayment is typically due when the home is sold, the home is no longer your primary residence, or other contract terms apply.",
        "Consult a qualified advisor—this product has important long-term considerations.",
      ],
      whoTypically: [
        "Homeowners age 62 and older",
        "Those looking to supplement retirement income",
        "Those who want to remain in their home long-term",
      ],
      keyRequirements: [
        "Credit and income are reviewed to show you can pay taxes, insurance, and upkeep",
        "You must be old enough (typically 62 or older) and have enough equity",
        "Your income and debts must meet the program’s financial tests (details vary by lender)",
        "The home must be your primary residence and meet program property rules",
        "You must finish counseling with a federal housing counseling agency before closing",
      ],
      whyClientsChoose: [
        "No required monthly mortgage payments to the lender (obligations like taxes and insurance remain)",
        "Access to funds—consult a financial advisor about your situation",
        "Ability to stay in your home while accessing equity",
        "Flexible payout options depending on program",
      ],
      whatToKeepInMind: [
        "You must keep up with property taxes, homeowners insurance, and home maintenance.",
        "Repayment timing and triggers are contract-specific—review them carefully with a qualified advisor.",
        "Proceeds can affect benefits, taxes, and estate planning—consult qualified professionals for your situation.",
      ],
    },
  },
  {
    id: "non-qm",
    category: "purchase",
    tags: ["Flexible Qualification"],
    title: "Non-QM Loan",
    shortDescription: "Designed for borrowers outside traditional guidelines.",
    cardHook: "Qualify when your income story doesn’t fit the traditional mold—without giving up on financing.",
    highlightLine: "Bank statements, assets, or flexible underwriting built for self-employed and complex income.",
    highlights: [
      "Ideal for self-employed and non-traditional documentation",
      "Flexible underwriting approach with clear disclosures",
    ],
    expanded: {
      fullDescription:
        "Non-qualified mortgage (Non-QM) loans are for borrowers who do not fit standard agency or qualified mortgage guidelines. Lenders use flexible underwriting and alternative documentation—such as bank statements or asset-based income—to evaluate self-employed borrowers and others with complex finances. Terms, rates, and requirements vary by lender and program.",
      whoFor: [
        "Self-employed borrowers who need alternatives to traditional pay stubs",
        "Borrowers with complex income, investments, or multiple income streams",
        "Those who can qualify with strong assets or reserves but not traditional ratios alone",
      ],
      benefits: [
        "Alternative income documentation options",
        "Flexible underwriting for well-qualified borrowers outside standard boxes",
        "Can support purchase or refinance goals when traditional programs are not a fit",
        "Clear review of risks, rates, and costs for your situation",
      ],
      howItWorks: [
        "Share your goals and documentation so we can review Non-QM options",
        "The lender evaluates income, assets, credit, and the property under a Non-QM framework",
        "You receive terms and disclosures that reflect your unique situation",
        "Close on your loan with a clear understanding of repayment and costs",
      ],
      reassurance: "Wondering if Non-QM makes sense for you? We’ll compare options side by side—no pressure.",
      primaryCta: { label: "See what this looks like for your situation", to: "/contact" },
    },
    modalDetail: {
      headline: "Financing when your income or situation doesn’t fit the traditional mold",
      intro:
        "Non-qualified mortgage (Non-QM) loans serve borrowers who don’t meet standard agency or qualified mortgage guidelines. Lenders use alternative documentation and flexible underwriting to evaluate self-employed borrowers and others with complex finances.",
      whenMakesSenseBullets: [
        "You’re self-employed or your income doesn’t fit a simple pay stub.",
        "You can document income with bank statements, assets, or other allowed methods.",
        "Standard programs declined you—but your finances are still strong.",
        "You want a clear picture of rate, payment, and disclosures before you commit.",
      ],
      atAGlance: {
        bestFor: "Self-employed borrowers and others with complex or non-traditional income",
        minCredit: "Varies by lender and program; stronger credit typically improves pricing",
        downPayment: "Often higher than typical minimums; depends on lender and scenario",
        keyAdvantage: "Alternative income verification and flexible underwriting",
      },
      overviewParagraphs: [
        "These loans are not one-size-fits-all. Terms, rates, and requirements vary by lender and program, and you should receive clear disclosures about repayment and costs.",
        "Non-QM loans are not government-backed; your lender will explain how your loan fits your goals and risk tolerance.",
      ],
      whoTypically: [
        "Self-employed borrowers who need alternatives to traditional pay stubs",
        "Borrowers with complex income, investments, or multiple income streams",
        "Those who can qualify with strong assets or reserves but not traditional ratios alone",
      ],
      keyRequirements: [
        "Credit score expectations vary by lender and program (often different from traditional loans)",
        "Down payment is often higher than typical minimums; depends on your lender and scenario",
        "Your monthly debts compared to income must fit your lender’s non-qualified mortgage framework (often documented with bank statements or asset-based income)",
        "The home must pass appraisal and meet your lender’s property rules",
        "These loans are not government-backed; rates, fees, and disclosures vary by lender",
      ],
      whyClientsChoose: [
        "Alternative income documentation options",
        "Flexible underwriting for well-qualified borrowers outside standard boxes",
        "Can support purchase or refinance goals when traditional programs are not a fit",
        "Clear review of risks, rates, and costs for your situation",
      ],
      whatToKeepInMind: [
        "Non-QM pricing and terms can differ from traditional loans—compare the full cost, not just the rate.",
        "You should receive disclosures that explain your loan; ask questions until the payment and risks are clear.",
        "Regulatory protections may differ from qualified mortgage products—review with your loan officer.",
      ],
    },
    relatedProgramIds: ["bank-statement", "1099-income", "asset-depletion", "pl-loan", "foreign-national"],
  },
  {
    id: "dscr",
    category: "purchase",
    tags: ["Real Estate Investors"],
    title: "DSCR Investor Loans",
    shortDescription:
      "Business-purpose rental financing that may center on a property's expected cash flow.",
    cardHook:
      "Explore investment property financing when qualification may focus on rental income rather than traditional employment documentation.",
    highlightLine:
      "May support **eligible purchase or refinance** strategies built around the **property's rental profile**",
    highlights: [
      "Designed for eligible business-purpose rental properties",
      "May consider short-term and long-term rental strategies",
      "Traditional personal income documentation may not be required under eligible programs",
    ],
    expanded: {
      fullDescription:
        "DSCR financing is designed for real estate investors whose qualification may center on the rental property's expected cash flow rather than traditional employment income documentation. Whether you are purchasing another rental property, refinancing an existing investment, or expanding your portfolio, a DSCR loan may provide a financing approach built around the property itself.",
      whoFor: [
        "Rental property investors",
        "Short-term rentals",
        "Long-term rentals",
        "Portfolio growth",
        "Investment property refinancing",
      ],
      benefits: [
        "Property cash flow at the center — Qualification focuses primarily on the rental property's expected income and applicable housing obligation.",
        "Built for real estate investors — Designed specifically for eligible business-purpose rental property financing.",
        "Purchase or refinance — Explore eligible purchase, rate-and-term refinance, cash-out refinance, and other investment-financing strategies.",
        "Short-term and long-term rentals — Certain eligible short-term and traditional rental properties may be considered.",
      ],
      howItWorks: [
        "Start with the investment — We review the property, your investment goals, and the financing strategy you are considering.",
        "Review the rental profile — We evaluate the property's expected rental income and other applicable property information.",
        "Explore available DSCR options — We compare eligible financing structures based on the borrower, property, rental profile, and program requirements.",
        "Structure the financing — We help determine which available option best aligns with the investment strategy.",
        "Move forward with guidance — Infinite Home Lending stays involved from application through closing.",
      ],
      reassurance:
        "A strong investment begins with the right review. Let's explore whether a DSCR Loan aligns with your property's expected cash flow and investment goals.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Let the Property's Cash Flow Help Lead the Strategy.",
      intro:
        "DSCR financing is designed for real estate investors whose qualification may center on the rental property's expected cash flow rather than traditional employment income documentation. Whether you are purchasing another rental property, refinancing an existing investment, or expanding your portfolio, a DSCR loan may provide a financing approach built around the property itself.",
      whenMakesSenseBullets: [
        "You are financing a rental property — Eligible short-term or long-term rental strategies may be considered.",
        "You prefer a property-focused review — Qualification centers primarily on the property's expected rental income rather than traditional employment income.",
        "You are expanding your portfolio — Investors may use DSCR financing to pursue additional eligible rental properties.",
        "You want an alternative qualification approach — Traditional personal income documentation may not be required under eligible DSCR programs.",
      ],
      atAGlance: {
        bestFor: "Real estate investors pursuing eligible rental property financing",
        keyAdvantage:
          "Property-focused qualification that may center on expected rental income rather than traditional employment documentation",
      },
      overviewParagraphs: [
        "What is a DSCR loan? A DSCR loan is a business-purpose mortgage designed for eligible rental property investors. Qualification typically focuses on the property's expected rental cash flow rather than traditional employment income, subject to applicable program guidelines.",
        "Debt Service Coverage Ratio, or DSCR, compares a property's qualifying rental income with its applicable housing obligation. Unlike a traditional mortgage that may rely heavily on employment income, a DSCR loan evaluates the rental property's expected cash flow under the applicable program guidelines.",
        "How is DSCR different from a conventional investment-property loan? Traditional investment-property financing generally evaluates the borrower's personal income and debt obligations. DSCR financing places greater emphasis on the rental property's expected cash flow.",
        "Can DSCR financing be used for short-term rentals? Certain eligible short-term and long-term rental properties may qualify depending on the property and program requirements. Can an LLC own the property? Certain eligible business entities or trust structures may be permitted depending on the financing program and transaction structure.",
      ],
      whoTypically: [
        "Rental property investors",
        "Short-term rentals",
        "Long-term rentals",
        "Portfolio growth",
        "Investment property refinancing",
      ],
      keyRequirements: [
        "Rental income drives the analysis — The property's expected rental income plays a central role in qualification.",
        "Personal income may not be the focus — Traditional employment or personal-income documentation may not be required under eligible programs.",
        "Designed for investment properties — DSCR financing is generally intended for eligible business-purpose rental property transactions.",
        "Portfolio strategies may be supported — The program may help investors finance additional eligible properties as their rental portfolio grows.",
      ],
      whyClientsChoose: [
        "Qualification may center on the property's expected rental income and applicable housing obligation",
        "May support purchase, rate-and-term refinance, cash-out refinance, and other eligible investment strategies",
        "Designed for investors whose documentation or income structure may not fit traditional paths",
        "Guidance from application through closing with a clear, educational review of available options",
      ],
      whatToKeepInMind: [
        "Terms, eligibility, and structure vary by lender, program, property, and borrower—specific ratios and overlays are not quoted on this page.",
        "DSCR financing is generally intended for business-purpose rental property transactions, not owner-occupied primary residences.",
        "Eligible short-term rentals, entity ownership, and refinance strategies depend on the property and program requirements.",
        "This overview is educational; your loan officer will explain applicable disclosures and next steps for your scenario.",
      ],
    },
    relatedProgramIds: ["non-qm", "conventional", "foreign-national"],
  },
  {
    id: "foreign-national",
    category: "purchase",
    tags: ["International Investors"],
    title: "Foreign National Loans",
    shortDescription:
      "Explore U.S. investment-property financing designed for certain eligible international buyers whose income and assets are primarily documented outside the United States.",
    cardHook:
      "Explore U.S. investment-property financing designed for certain eligible international buyers whose income and assets are primarily documented outside the United States.",
    highlightLine:
      "Qualification may consider **property cash flow**, **international assets**, and **alternative financial documentation** under applicable program guidelines",
    highlights: [
      "Designed for eligible international investors",
      "U.S. investment-property financing",
      "International documentation may be considered",
    ],
    expanded: {
      fullDescription:
        "Foreign National financing may help certain eligible international buyers purchase or refinance investment property in the United States. Qualification may focus on the property's expected rental cash flow, available assets, international financial documentation, and the complete transaction profile rather than relying exclusively on traditional U.S. employment income or U.S. tax returns. Infinite Home Lending helps international investors understand the available documentation, property, ownership, and financing requirements before moving forward. Final eligibility depends on the borrower's residency, documentation, assets, property, ownership structure, and current program guidelines.",
      whoFor: [
        "International Investors",
        "Non-U.S. Residents",
        "U.S. Investment Property",
        "Rental Properties",
        "Cross-Border Buyers",
        "Entity Ownership",
      ],
      benefits: [
        "DESIGNED FOR INTERNATIONAL INVESTORS — Certain eligible non-U.S. residents may pursue financing for qualifying investment property in the United States.",
        "U.S. EMPLOYMENT MAY NOT BE REQUIRED — Qualification may not rely on traditional U.S. employment income or U.S. tax-return documentation.",
        "PROPERTY CASH FLOW MAY SUPPORT THE REVIEW — The property's expected rental income may play an important role in evaluating the financing request.",
        "ELIGIBLE ENTITY OWNERSHIP MAY BE CONSIDERED — Certain qualifying U.S. business ownership structures may be permitted, subject to program and legal requirements.",
      ],
      howItWorks: [
        "REVIEW THE INVESTMENT STRATEGY — We discuss the target property, intended use, ownership plans, country of residence, and financing goals.",
        "IDENTIFY THE DOCUMENTATION PATH — We review the available passport, residency, banking, asset, credit-reference, entity, and other applicable documentation.",
        "EVALUATE THE PROPERTY — The lender reviews the property type, expected rental profile, valuation, transaction structure, and applicable program requirements.",
        "STRUCTURE THE FINANCING — We compare available purchase or refinance options based on the borrower, property, assets, ownership structure, and program.",
        "MOVE FORWARD WITH GUIDANCE — Infinite Home Lending helps coordinate the application, documentation, underwriting, and closing process.",
      ],
      reassurance:
        "Investing in U.S. real estate from abroad involves unique documentation and structure questions. Let's review whether Foreign National financing may align with your property, assets, and investment goals.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Investing in U.S. Real Estate From Abroad? There May Be a Financing Path.",
      intro:
        "Foreign National financing may help certain eligible international buyers purchase or refinance investment property in the United States. Qualification may focus on the property's expected rental cash flow, available assets, international financial documentation, and the complete transaction profile rather than relying exclusively on traditional U.S. employment income or U.S. tax returns. Infinite Home Lending helps international investors understand the available documentation, property, ownership, and financing requirements before moving forward. Final eligibility depends on the borrower's residency, documentation, assets, property, ownership structure, and current program guidelines.",
      whenMakesSenseBullets: [
        "YOU LIVE OUTSIDE THE UNITED STATES — You are an eligible international buyer whose primary residence and financial activity are outside the United States.",
        "YOU ARE PURSUING U.S. INVESTMENT PROPERTY — You want to purchase or refinance an eligible property intended for investment purposes.",
        "YOUR FINANCIAL DOCUMENTATION IS INTERNATIONAL — Your income, assets, banking records, or credit references may originate outside the United States.",
        "YOU WANT A PROPERTY-FOCUSED REVIEW — Qualification may place meaningful emphasis on the property's expected rental profile and the complete investment transaction.",
      ],
      atAGlance: {
        bestFor:
          "Eligible international investors purchasing or refinancing qualifying U.S. investment property",
        keyAdvantage:
          "Financing may be evaluated using the property, available assets, international documentation, and transaction structure without relying exclusively on traditional U.S. employment income",
      },
      overviewParagraphs: [
        "What is a Foreign National Loan? A Foreign National Loan is a mortgage program designed for certain eligible borrowers whose primary residence and financial activity are outside the United States. These programs may help qualifying international buyers purchase or refinance eligible U.S. real estate, commonly for investment purposes. Qualification may consider the property's expected rental income, the borrower's assets, international financial records, ownership structure, and other program-specific documentation. Requirements vary significantly by lender, country, borrower profile, property, and transaction.",
        "Who may consider this program? This approach may be relevant for eligible non-U.S. residents, international real estate investors, buyers who primarily live and work outside the United States, borrowers whose income and assets are documented internationally, buyers purchasing qualifying U.S. investment property, existing foreign investors refinancing qualifying U.S. property, buyers considering eligible U.S. entity ownership, and investors without an established traditional U.S. employment profile. Citizenship or residency status alone does not determine eligibility.",
        "Do I need U.S. income? Traditional U.S. employment income may not be required under certain Foreign National programs. However, the lender will still evaluate the borrower's assets, international financial documentation, ability to complete the transaction, property profile, and applicable program requirements.",
        "Do I need U.S. credit? An established traditional U.S. credit profile may not always be required. Depending on the program, the lender may review alternative credit references, international credit information, banking history, assets, housing history, or other documentation. Credit evaluation requirements vary by lender and borrower profile.",
        "Is this a DSCR loan? Some Foreign National programs use a property-focused qualification approach similar to DSCR financing. The lender may compare the property's expected rental income with its applicable housing obligation. However, not every Foreign National program is structured identically, and additional borrower, asset, entity, property, and transaction requirements still apply.",
        "What property use is typically considered? Foreign National financing is commonly designed for eligible investment properties rather than owner-occupied primary residences.",
        "Can I purchase through an LLC? Certain qualifying U.S. business entities may be permitted to hold title, depending on the lender, transaction, property, ownership structure, and program requirements. The borrower should consult appropriate legal and tax professionals regarding entity formation and ownership. Infinite Home Lending does not provide legal or tax advice.",
        "Can I purchase or refinance? Eligible purchase and refinance transactions may be considered. Certain programs may also support rate-and-term refinance, cash-out refinance, or delayed-financing strategies, subject to current guidelines.",
        "What financial documents may be required? Borrowers should expect to provide acceptable identification, residency documentation, international bank statements, asset statements, source-of-funds documentation, credit references or alternative credit records, housing history, business-entity documents where applicable, property and rental documentation, and verification of funds needed for closing and reserves. Foreign documents may require translation or certification, and additional lender-requested documentation may apply.",
        "Can my funds remain outside the United States? Some programs may allow certain funds to remain in an eligible foreign financial institution, while other funds may need to be transferred, sourced, seasoned, or held in an acceptable U.S. account before closing. The exact timing and account requirements depend on the lender and program.",
        "Do I need a visa? Visa, residency, entry-status, and identification requirements vary by lender and program. Some programs may require acceptable immigration or travel documentation, while others may evaluate residency differently. The borrower should provide current documentation for review and consult an immigration attorney for legal immigration guidance.",
        "What is the difference between a Foreign National and an ITIN Loan? A Foreign National Loan is generally designed for borrowers whose primary residence and financial activity remain outside the United States. An ITIN Loan is generally designed for certain borrowers living or earning income in the United States who use an Individual Taxpayer Identification Number instead of a Social Security number. The correct path depends on residency, income location, documentation, immigration status, and the property transaction.",
      ],
      whoTypically: [
        "International real estate investors",
        "Non-U.S. residents",
        "Buyers living primarily outside the United States",
        "Investors purchasing U.S. rental property",
        "Investors refinancing eligible U.S. property",
        "Borrowers using international assets",
        "Buyers with international financial documentation",
        "Investors using an eligible U.S. entity",
        "Buyers without traditional U.S. employment income",
        "Buyers whose qualification may center partly on property cash flow",
      ],
      keyRequirements: [
        "The borrower must meet the program's residency definition",
        "Acceptable identification and residency documentation are required",
        "The property must meet eligible investment-property requirements",
        "International assets must be documented and sourced",
        "Funds required for closing and reserves must be verified",
        "Alternative or international credit references may be required",
        "Property cash flow may be reviewed",
        "Eligible ownership structures must be documented",
        "Foreign documents may require translation or certification",
        "Banking and transfer requirements may apply",
        "The borrower, property, ownership structure, and transaction must meet current underwriting standards",
        "Final eligibility depends on complete review",
      ],
      whyClientsChoose: [
        "They want to invest in U.S. real estate while living abroad",
        "They may not have traditional U.S. employment income",
        "Their financial records and assets are maintained internationally",
        "The property's expected rental profile may support qualification",
        "Certain U.S. entity structures may be considered",
        "Purchase and refinance strategies may be available",
        "Infinite Home Lending helps organize a cross-border documentation path",
        "The program provides an alternative to traditional U.S. borrower qualification",
      ],
      whatToKeepInMind: [
        "Requirements vary substantially by lender and borrower country",
        "Investment-property restrictions commonly apply",
        "Larger borrower contributions may be required than under traditional financing",
        "Reserves and liquid assets may be required",
        "Foreign assets must be documented and acceptable",
        "Currency conversion and transfer requirements may apply",
        "International documents may require certified translation",
        "U.S. banking requirements may apply before closing",
        "Credit references or alternative credit documentation may be needed",
        "Entity ownership does not remove personal documentation requirements",
        "Rates and pricing may differ from traditional agency financing",
        "Tax, legal, immigration, and entity questions should be reviewed with qualified professionals",
        "Approval depends on the complete borrower, property, ownership, and transaction profile",
        "Program availability may vary by state, lender, property location, and borrower circumstances",
      ],
    },
    relatedProgramIds: ["dscr", "non-qm", "asset-depletion"],
  },
  {
    id: "bank-statement",
    category: "purchase",
    tags: ["Self-Employed"],
    title: "Bank Statement Loans",
    shortDescription:
      "Alternative income documentation using personal or business bank statements for eligible self-employed borrowers.",
    cardHook:
      "Document qualifying income through eligible bank-statement history when traditional tax-return paths may not reflect how you earn.",
    highlightLine:
      "May support **eligible purchase or refinance** strategies built around **bank-deposit activity** rather than traditional tax returns alone",
    highlights: [
      "Designed for eligible self-employed borrowers and business owners",
      "Personal or business bank statements may help document qualifying income",
      "Primary residences, second homes, and investment properties may be considered",
    ],
    expanded: {
      fullDescription:
        "Bank Statement Loans offer an alternative way for eligible self-employed borrowers to document qualifying income using personal or business bank statements rather than relying solely on traditional tax-return documentation. Whether you are purchasing a home, refinancing an existing mortgage, or exploring financing for another eligible property, a Bank Statement Loan may provide an alternative qualification path built around how you actually earn income.",
      whoFor: [
        "Self-Employed",
        "Business Owners",
        "Independent Contractors",
        "Entrepreneurs",
        "Alternative Income Documentation",
      ],
      benefits: [
        "Income documentation built around your business — Eligible borrowers may document income using a history of personal or business bank statements.",
        "Less reliance on traditional tax returns — Qualification may use alternative income documentation rather than relying solely on traditional tax-return analysis.",
        "Flexible property strategies — Eligible primary residences, second homes, and investment properties may be considered depending on program requirements.",
        "Purchase or refinance — Available strategies may include eligible purchases, rate-and-term refinances, cash-out refinances, and other qualifying transactions.",
      ],
      howItWorks: [
        "Start with your income story — We learn how you earn income, how your business operates, and what you want the financing to accomplish.",
        "Review your bank statement history — We evaluate eligible personal or business bank statements and other applicable documentation.",
        "Determine qualifying income — The lender applies the appropriate program methodology to determine eligible qualifying income.",
        "Compare available options — Infinite Home Lending reviews available Bank Statement programs across participating lenders.",
        "Move forward with guidance — We stay involved through underwriting and closing so you understand the process and next steps.",
      ],
      reassurance:
        "Your income story matters. Let's explore whether a Bank Statement Loan aligns with how you earn and what you want to accomplish.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Self-employed? Your bank statements may tell the story differently.",
      intro:
        "Bank Statement Loans offer an alternative way for eligible self-employed borrowers to document qualifying income using personal or business bank statements rather than relying solely on traditional tax-return documentation. Whether you are purchasing a home, refinancing an existing mortgage, or exploring financing for another eligible property, a Bank Statement Loan may provide an alternative qualification path built around how you actually earn income.",
      whenMakesSenseBullets: [
        "You are self-employed — Your income may not fit neatly into traditional W-2 documentation.",
        "Your bank deposits reflect your business activity — Eligible personal or business bank statements may be used to help document qualifying income.",
        "You own all or part of a business — Certain programs may accommodate eligible borrowers who own a qualifying share of the business.",
        "You are buying or refinancing — Bank Statement financing may support eligible purchase and refinance strategies.",
      ],
      atAGlance: {
        bestFor:
          "Self-employed borrowers whose qualifying income may be better represented through eligible bank-statement activity",
        keyAdvantage:
          "Alternative income documentation that may reduce reliance on traditional tax-return analysis",
      },
      overviewParagraphs: [
        "What is a Bank Statement Loan? A Bank Statement Loan is an alternative-documentation mortgage that may allow eligible self-employed borrowers to use personal or business bank statements to help establish qualifying income instead of relying solely on traditional tax returns.",
        "Who is a Bank Statement Loan typically designed for? Bank Statement financing is generally designed for eligible self-employed borrowers, business owners, entrepreneurs, and independent contractors whose income may not be fully represented by traditional documentation.",
        "How many months of bank statements are reviewed? Depending on the program, lenders may review a defined history of eligible personal or business bank statements. The exact documentation period varies by program and borrower profile.",
        "Do I have to own 100% of my business? Not necessarily. Certain programs may accommodate eligible borrowers who own only a qualifying portion of the business.",
        "Can Bank Statement Loans be used for investment properties? Certain eligible primary residences, second homes, and investment properties may qualify depending on program requirements.",
        "Can I refinance with a Bank Statement Loan? Eligible programs may support rate-and-term and cash-out refinance strategies.",
        "How is business income calculated? The lender reviews eligible deposits and applies the applicable program methodology to determine qualifying income. Depending on the business and program, additional documentation may be required.",
        "How is a Bank Statement Loan different from a 1099 Income Loan? A Bank Statement Loan generally analyzes eligible bank-deposit history, while a 1099 Income program centers more specifically on documented 1099 earnings.",
      ],
      whoTypically: [
        "Self-Employed",
        "Business Owners",
        "Independent Contractors",
        "Entrepreneurs",
        "Alternative Income Documentation",
      ],
      keyRequirements: [
        "Bank activity can help document income — Rather than relying exclusively on traditional tax returns, qualifying income may be evaluated using eligible bank-statement history.",
        "Built for self-employed income — The program is designed for borrowers whose income structure may not fit traditional documentation methods.",
        "Business ownership can be flexible — Certain eligible programs may accommodate borrowers who own less than 100% of a business.",
        "Additional documentation may support the review — Depending on the program and business structure, additional documentation such as a profit-and-loss statement or third-party expense analysis may be required.",
      ],
      whyClientsChoose: [
        "Income may be documented through eligible personal or business bank-statement history",
        "May reduce reliance on traditional tax-return analysis for qualifying income",
        "Eligible primary residences, second homes, and investment properties may be considered",
        "Guidance from application through closing with a clear, educational review of available options",
      ],
      whatToKeepInMind: [
        "Terms, eligibility, documentation, and loan structure vary by lender, program, borrower, and property.",
        "Bank Statement programs use specific methods for determining eligible deposits and qualifying income.",
        "Additional documentation may be required depending on the borrower's business structure and the applicable program.",
        "Property eligibility and available transaction types vary by program.",
        "This page is educational. Infinite Home Lending will review the applicable program requirements for the borrower's individual scenario.",
      ],
    },
    relatedProgramIds: ["1099-income", "non-qm", "dscr", "asset-depletion", "pl-loan"],
  },
  {
    id: "1099-income",
    category: "purchase",
    tags: ["Self-Employed"],
    title: "1099 Income Loans",
    shortDescription:
      "Alternative qualification for eligible borrowers whose earnings are documented through 1099 income.",
    cardHook:
      "Qualify using documented 1099 earnings when traditional W-2 employment paths may not reflect how you earn.",
    highlightLine:
      "May support **eligible purchase or refinance** strategies built around **documented 1099 earnings** rather than traditional employment income alone",
    highlights: [
      "Designed for eligible independent contractors, freelancers, and gig workers",
      "Documented 1099 earnings may help establish qualifying income",
      "Owner-occupied homes, second homes, and investment properties may be considered",
    ],
    expanded: {
      fullDescription:
        "1099 Income Loans offer an alternative qualification path for eligible self-employed borrowers whose earnings are documented through 1099 income rather than traditional W-2 employment. For independent contractors, freelancers, consultants, gig workers, and other qualifying 1099 earners, this program may provide a way to document income without relying solely on traditional tax-return analysis.",
      whoFor: [
        "Independent Contractors",
        "Freelancers",
        "Consultants",
        "Gig Workers",
        "Self-Employed Borrowers",
      ],
      benefits: [
        "Use documented 1099 income — Eligible borrowers may qualify using documented 1099 earnings instead of relying solely on traditional tax-return analysis.",
        "Built for independent workers — Designed for eligible contractors, freelancers, consultants, gig workers, and other professionals receiving 1099 income.",
        "Current earnings can support the review — Depending on the program, current year-to-date earnings may be verified using applicable earnings statements, paystubs, bank statements, or other required documentation.",
        "Purchase or refinance — Eligible programs may support purchase, rate-and-term refinance, cash-out refinance, and other qualifying financing strategies.",
      ],
      howItWorks: [
        "Start with how you earn — We review your 1099 income, work history, current earnings, and what you want the financing to accomplish.",
        "Review your 1099 documentation — We evaluate the applicable 1099 forms and other documentation required for the program.",
        "Verify current earnings — Current year-to-date income may be reviewed using applicable earnings statements, paystubs, bank statements, or other program-required documentation.",
        "Compare available options — Infinite Home Lending reviews eligible 1099 Income programs across participating lenders.",
        "Move forward with guidance — We stay involved through underwriting and closing so you understand the process and next steps.",
      ],
      reassurance:
        "How you earn matters. Let's explore whether a 1099 Income Loan aligns with your documented earnings and what you want to accomplish.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Independent contractor? Your 1099 income may open another path.",
      intro:
        "1099 Income Loans offer an alternative qualification path for eligible self-employed borrowers whose earnings are documented through 1099 income rather than traditional W-2 employment. For independent contractors, freelancers, consultants, gig workers, and other qualifying 1099 earners, this program may provide a way to document income without relying solely on traditional tax-return analysis.",
      whenMakesSenseBullets: [
        "You earn income through 1099s — Your income comes primarily from contract, freelance, consulting, or other self-employed work.",
        "Your income does not fit a traditional W-2 profile — Eligible borrowers may qualify using documented 1099 earnings rather than traditional employment income.",
        "Your earnings show consistency — A documented history of 1099 income and current earnings may help support qualification, subject to program requirements.",
        "You are buying or refinancing — 1099 Income financing may support eligible purchase and refinance strategies.",
      ],
      atAGlance: {
        bestFor:
          "Independent contractors, freelancers, consultants, gig workers, and other eligible borrowers whose income is primarily documented through 1099 earnings",
        keyAdvantage:
          "Alternative income documentation that may allow eligible 1099 earners to qualify without relying solely on traditional tax-return analysis",
      },
      overviewParagraphs: [
        "What is a 1099 Income Loan? A 1099 Income Loan is an alternative-documentation mortgage that may allow eligible self-employed borrowers to use documented 1099 earnings to establish qualifying income rather than relying solely on traditional tax returns.",
        "Who is a 1099 Income Loan typically designed for? It is generally designed for eligible independent contractors, freelancers, consultants, gig workers, and other self-employed borrowers who receive 1099 income.",
        "Do I need traditional tax returns to qualify? Certain eligible 1099 Income programs may allow qualification using documented 1099 earnings and other required income documentation instead of relying solely on traditional tax-return analysis.",
        "How are current earnings verified? Depending on the program, current year-to-date earnings may be verified using applicable earnings statements, paystubs, bank statements, or other required documentation.",
        "Is a work history required? The lender may review the borrower's self-employed work history, line of work, and consistency of earnings as part of the qualification process. Exact requirements vary by program.",
        "Can a 1099 Income Loan be used for a refinance? Eligible programs may support rate-and-term refinance, cash-out refinance, and other qualifying refinance strategies.",
        "What types of properties may qualify? Depending on the program, eligible owner-occupied residences, second homes, and investment properties may be considered.",
        "How is a 1099 Income Loan different from a Bank Statement Loan? A 1099 Income Loan generally centers on documented 1099 earnings, while a Bank Statement Loan typically analyzes eligible personal or business bank-deposit history to help determine qualifying income.",
      ],
      whoTypically: [
        "Independent Contractors",
        "Freelancers",
        "Consultants",
        "Gig Workers",
        "Self-Employed Borrowers",
      ],
      keyRequirements: [
        "Your 1099 earnings drive the review — Qualification may center on documented 1099 income rather than traditional W-2 employment.",
        "Current earnings may be verified differently — Depending on the program, year-to-date earnings may be reviewed through applicable earnings statements, paystubs, bank statements, or other required documentation.",
        "Built for independent work — The program is designed for borrowers whose income comes from contract, freelance, consulting, gig, or other qualifying self-employed work.",
        "Property options may be available — Depending on the program, eligible owner-occupied homes, second homes, and investment properties may be considered.",
      ],
      whyClientsChoose: [
        "Qualification may center on documented 1099 earnings rather than traditional W-2 employment",
        "Current year-to-date earnings may be reviewed using applicable program documentation",
        "Eligible owner-occupied homes, second homes, and investment properties may be considered",
        "Guidance from application through closing with a clear, educational review of available options",
      ],
      whatToKeepInMind: [
        "Terms, eligibility, documentation, and loan structure vary by lender, program, borrower, and property.",
        "1099 Income programs may require a documented history of self-employed earnings and evidence of current income.",
        "The lender may review continuity of work, source of income, and applicable year-to-date documentation.",
        "Property eligibility and available transaction types vary by program.",
        "This page is educational. Infinite Home Lending will review the applicable program requirements for the borrower's individual scenario.",
      ],
    },
    relatedProgramIds: ["bank-statement", "non-qm", "dscr", "asset-depletion", "pl-loan"],
  },
  {
    id: "dpa-advantage",
    category: "purchase",
    tags: ["Down Payment Assistance"],
    title: "DPA Advantage",
    shortDescription:
      "Grant-based down-payment assistance for eligible homebuyers purchasing a qualifying primary residence.",
    cardHook:
      "Homeownership may be closer when part of the upfront cash needed for the purchase can be supported by eligible grant assistance.",
    highlightLine:
      "May provide **grant assistance equal to 2% or 3.5%** of the purchase price with **no repayment** and **no second lien**, subject to eligibility",
    highlights: [
      "Designed for eligible homebuyers purchasing a qualifying primary residence",
      "Grant assistance may reduce personal funds needed toward the down payment",
      "May be paired with eligible FHA financing structures",
    ],
    expanded: {
      fullDescription:
        "DPA Advantage is designed to help eligible homebuyers reduce one of the biggest upfront challenges of purchasing a home: the down payment. The program may provide grant assistance equal to 2% or 3.5% of the purchase price when used with an eligible FHA financing structure. Because the assistance is structured as a grant, there is no repayment requirement and no second lien on the property. Eligibility and available program combinations are subject to applicable guidelines.",
      whoFor: [
        "Homebuyers",
        "First-Time Buyers",
        "Down Payment Assistance",
        "Primary Residence",
        "FHA Financing",
      ],
      benefits: [
        "Grant-based assistance — Eligible borrowers may receive grant assistance equal to 2% or 3.5% of the purchase price, subject to program requirements.",
        "No repayment required — The DPA Advantage assistance is structured as a grant rather than a repayable second mortgage.",
        "No second lien — The grant does not require a second lien to be placed on the property.",
        "May work with eligible FHA options — DPA Advantage may be combined with qualifying FHA financing and certain eligible FHA renovation programs, subject to applicable guidelines.",
      ],
      howItWorks: [
        "Start with your homeownership goals — We review what you are hoping to purchase, your available funds, and where down-payment assistance may help.",
        "Review DPA eligibility — We evaluate the borrower, property, financing structure, and applicable DPA Advantage eligibility path.",
        "Pair the grant with eligible financing — We determine whether DPA Advantage can be combined with an available FHA financing option for your scenario.",
        "Complete required homebuyer education — Eligible borrowers complete the applicable homeownership counseling or homebuyer education requirement.",
        "Move forward with guidance — Infinite Home Lending stays involved through application, underwriting, and closing so the financing and assistance remain clearly coordinated.",
      ],
      reassurance:
        "Down-payment assistance can change the math of buying a home. Let's review whether DPA Advantage may fit your goals and eligible financing path.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Your Down Payment Doesn't Have to Stand Between You and Homeownership.",
      intro:
        "DPA Advantage is designed to help eligible homebuyers reduce one of the biggest upfront challenges of purchasing a home: the down payment. The program may provide grant assistance equal to 2% or 3.5% of the purchase price when used with an eligible FHA financing structure. Because the assistance is structured as a grant, there is no repayment requirement and no second lien on the property. Eligibility and available program combinations are subject to applicable guidelines.",
      whenMakesSenseBullets: [
        "You need help with the down payment — Eligible borrowers may receive grant assistance that can reduce the amount of personal funds needed toward the purchase.",
        "You're buying a primary residence — DPA Advantage is designed for eligible homebuyers purchasing a qualifying primary residence.",
        "You may qualify through one of several eligibility paths — The program includes multiple potential eligibility paths, including certain first-time homebuyers and qualifying occupational, income, or property-location categories.",
        "You're open to homebuyer education — Eligible borrowers must complete applicable homeownership counseling or homebuyer education as part of the program requirements.",
      ],
      atAGlance: {
        bestFor:
          "Eligible homebuyers who may benefit from grant assistance toward the down payment on a qualifying primary residence",
        keyAdvantage:
          "Grant-based down-payment assistance with no repayment requirement and no second lien, subject to program eligibility",
      },
      overviewParagraphs: [
        "What is DPA Advantage? DPA Advantage is a down-payment-assistance program designed to provide eligible borrowers with grant funds toward the purchase of a qualifying primary residence when paired with eligible financing.",
        "How much assistance may be available? The program provides two grant options: 2% or 3.5% of the purchase price, subject to eligibility and applicable program requirements.",
        "Does the grant have to be repaid? The program guidelines state that repayment is not required.",
        "Does DPA Advantage create a second mortgage or lien? The program guidelines state that no second lien on the property is required for the grant.",
        "Eligible program combinations may include FHA 203(b), FHA Repair Escrow, and FHA Limited or Standard 203(k), subject to applicable guidelines and transaction requirements.",
      ],
      whoTypically: [
        "Eligible first-time homebuyers",
        "Certain qualifying first responders",
        "Certain educators",
        "Certain medical personnel",
        "Certain civil servants",
        "Certain military personnel",
        "Borrowers who may qualify under applicable income criteria",
        "Eligible properties located in qualifying underserved census tracts",
        "Other eligible homebuyers meeting applicable program requirements",
      ],
      keyRequirements: [
        "The home must generally be an eligible primary residence.",
        "Borrower and property eligibility must meet applicable FHA and DPA Advantage requirements.",
        "Homeownership counseling or approved homebuyer education is required.",
        "The program must be paired with an eligible financing structure.",
        "Property type and program-combination requirements apply.",
      ],
      whyClientsChoose: [
        "May reduce the personal funds needed toward the down payment",
        "Grant assistance does not require repayment",
        "No second lien required for the grant",
        "Multiple potential borrower eligibility paths",
        "May complement certain eligible FHA financing and renovation strategies",
        "IHL reviews the financing and assistance together rather than treating them as separate decisions",
      ],
      whatToKeepInMind: [
        "DPA Advantage is subject to borrower, property, FHA, lender, and program eligibility requirements.",
        "Not every FHA transaction or FHA program can be combined with DPA Advantage.",
        "Homebuyer education or counseling is required under the program.",
        "Income, credit, occupancy, property, geographic, and financing requirements may apply.",
        "Program availability and guidelines may change.",
        "Infinite Home Lending will review current requirements for the borrower's specific scenario.",
      ],
    },
    relatedProgramIds: ["fha", "fha-repair-escrow", "fha-203k-limited"],
  },
  {
    id: "asset-depletion",
    category: "purchase",
    tags: ["Alternative Qualification"],
    title: "Asset Depletion Mortgage",
    shortDescription:
      "Explore mortgage qualification using certain eligible assets when traditional employment income may not tell the full financial story.",
    cardHook:
      "Explore mortgage qualification using certain eligible assets when traditional employment income may not tell the full financial story.",
    highlightLine:
      "Qualifying assets may be **converted into a calculated monthly income amount** under applicable program guidelines",
    highlights: [
      "Asset-focused qualification",
      "Primary residences and second homes",
      "Purchase or eligible rate-and-term refinance",
    ],
    expanded: {
      fullDescription:
        "Asset Depletion financing may help eligible borrowers qualify by converting certain qualifying assets into a calculated monthly income amount. It can provide an alternative path for retirees, self-employed individuals, high-net-worth borrowers, and others whose financial strength may be reflected more clearly by their assets than by traditional employment income. Eligible assets, documentation, calculations, property requirements, and loan availability remain subject to applicable program and lender guidelines.",
      whoFor: [
        "Retirees",
        "High-Net-Worth Borrowers",
        "Self-Employed Borrowers",
        "Investors",
        "Substantial Liquid Assets",
        "Alternative Qualification",
      ],
      benefits: [
        "QUALIFICATION MAY CENTER ON ELIGIBLE ASSETS — Certain qualifying assets may be used to calculate a monthly income amount for mortgage qualification.",
        "TRADITIONAL EMPLOYMENT MAY NOT BE THE FOCUS — Eligible borrowers may qualify without relying primarily on salary or standard employment-income documentation.",
        "BUILT FOR ASSET-RICH FINANCIAL PROFILES — The program may fit borrowers whose balance sheet is stronger than their traditional documented income.",
        "PURCHASE OR ELIGIBLE REFINANCE OPTIONS — Asset Depletion financing may support qualifying primary-residence or second-home purchase and rate-and-term refinance strategies.",
      ],
      howItWorks: [
        "REVIEW YOUR FINANCIAL PROFILE — We discuss your property goals, available assets, income structure, and overall financing needs.",
        "IDENTIFY POTENTIALLY ELIGIBLE ASSETS — Applicable checking, savings, investment, or retirement accounts are reviewed under program guidelines.",
        "CALCULATE QUALIFYING INCOME — Eligible asset values are evaluated and converted into a calculated monthly income amount using the applicable program methodology.",
        "STRUCTURE THE FINANCING — We compare available purchase or eligible refinance options based on the borrower, property, assets, and program requirements.",
        "MOVE FORWARD WITH GUIDANCE — Infinite Home Lending helps coordinate documentation, underwriting, and the loan process from application through closing.",
      ],
      reassurance:
        "Your income documents may not reflect your full financial strength. Let's explore whether Asset Depletion may align with your assets, property goals, and overall financing needs.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Your Assets May Help Tell the Full Story.",
      intro:
        "Asset Depletion financing may help eligible borrowers qualify by converting certain qualifying assets into a calculated monthly income amount. It can provide an alternative path for retirees, self-employed individuals, high-net-worth borrowers, and others whose financial strength may be reflected more clearly by their assets than by traditional employment income. Eligible assets, documentation, calculations, property requirements, and loan availability remain subject to applicable program and lender guidelines.",
      whenMakesSenseBullets: [
        "YOU HAVE SUBSTANTIAL ELIGIBLE ASSETS — Your financial profile may include meaningful savings, investments, or retirement assets that could potentially support qualification.",
        "TRADITIONAL INCOME DOES NOT TELL THE FULL STORY — You may have strong financial resources even if salary, employment income, or tax returns do not reflect your overall ability to qualify.",
        "YOU ARE RETIRED OR NEARING RETIREMENT — Eligible borrowers who rely on savings or investments rather than regular employment income may benefit from an asset-focused review.",
        "YOU WANT AN ALTERNATIVE QUALIFICATION PATH — A calculated monthly income amount may be derived from eligible assets under applicable program guidelines.",
      ],
      atAGlance: {
        bestFor:
          "Eligible borrowers with substantial qualifying assets whose traditional employment or documented income may not fully represent their financial strength",
        keyAdvantage:
          "Certain eligible assets may be converted into calculated monthly qualifying income under applicable program guidelines",
      },
      overviewParagraphs: [
        "What is an Asset Depletion Mortgage? An Asset Depletion Mortgage is an alternative qualification approach that may allow eligible borrowers to use qualifying assets to generate a calculated monthly income amount for mortgage underwriting. Rather than relying primarily on salary, wages, or traditional employment income, the program evaluates eligible assets under an applicable calculation method. This does not necessarily mean the borrower must spend or liquidate those assets. The assets are reviewed as part of the qualification analysis, subject to applicable program requirements.",
        "Who may consider Asset Depletion? This approach may be relevant for retirees living from savings or investments, high-net-worth borrowers, self-employed individuals with fluctuating income, borrowers with substantial qualifying liquid assets, and borrowers whose traditional documented income does not reflect their full financial position. It may also apply to eligible borrowers purchasing a primary residence or second home, or considering an eligible rate-and-term refinance. Belonging to one of these groups does not guarantee eligibility.",
        "How is qualifying income calculated? Eligible asset values are reviewed under applicable program rules and may be divided over a defined period to produce a calculated monthly qualifying-income amount. Under the supplied program guidelines, eligible assets are evaluated using a defined depletion calculation that may divide applicable asset values over 84 months. The exact treatment depends on the asset type and current program requirements. Not every lender or every Asset Depletion program uses the same calculation.",
        "What types of assets may be considered? Potentially eligible assets may include certain deposit, investment, and retirement accounts such as checking accounts, savings accounts, certificates of deposit, money-market accounts, publicly traded stocks, bonds, mutual funds, and certain retirement accounts. The amount recognized for qualification can vary by asset type, ownership, accessibility, and program rules. Some deposit accounts may be recognized differently than certain publicly traded investment assets, and retirement assets may receive different treatment. These are lender-specific underwriting mechanics—not universal rules.",
        "Do I have to liquidate my assets? Not necessarily. Asset Depletion qualification typically uses eligible assets to calculate a monthly qualifying-income amount. Whether any funds must be used for down payment, closing costs, reserves, or another transaction requirement depends on the borrower, property, and applicable program guidelines.",
        "Is employment or traditional income required? Traditional employment income may not be required under an eligible Asset Depletion program. However, the borrower's full financial profile, liabilities, assets, property, and transaction still require underwriting review.",
        "What transactions may be eligible? Asset Depletion financing may be available for eligible primary-residence or second-home purchases and certain rate-and-term refinances. Cash-out refinance availability is not represented on this page.",
        "What property types may be considered? Eligible property types may include certain single-family homes, townhomes, PUDs, and condominiums used as a primary residence or second home, subject to applicable guidelines.",
        "What asset documentation is needed? Borrowers should expect to provide account statements and documentation establishing ownership, value, accessibility, and source of potentially qualifying assets. Assets may need to be documented and maintained for an applicable period under current program requirements.",
      ],
      whoTypically: [
        "Retirees",
        "High-net-worth borrowers",
        "Self-employed borrowers",
        "Borrowers living from savings or investments",
        "Borrowers with substantial liquid assets",
        "Primary-residence buyers",
        "Second-home buyers",
        "Eligible rate-and-term refinance borrowers",
      ],
      keyRequirements: [
        "Borrower eligibility requirements apply",
        "Assets must meet applicable ownership and documentation standards",
        "Only eligible assets may be used in the calculation",
        "Account values may be adjusted based on asset type",
        "Funds needed for closing, down payment, and reserves may be treated separately",
        "Required remaining assets may apply",
        "Primary-residence or second-home restrictions may apply",
        "Eligible purchase or rate-and-term refinance requirements apply",
        "Property and appraisal requirements apply",
        "Final eligibility depends on the borrower, property, assets, and loan structure",
      ],
      whyClientsChoose: [
        "Their assets may represent their financial strength more accurately than traditional income",
        "It may provide an alternative to employment-focused qualification",
        "It can be useful for retirees or borrowers with significant investments",
        "Eligible purchase and rate-and-term refinance options may be available",
        "It provides a structured review rather than assuming traditional income is the only path",
        "Infinite Home Lending can compare the strategy with other alternative qualification options",
      ],
      whatToKeepInMind: [
        "Not every asset is eligible",
        "Different asset types may receive different qualifying values",
        "Funds needed for down payment, closing costs, or reserves may not be available for the income calculation",
        "Minimum remaining assets may apply",
        "Property occupancy restrictions may apply",
        "Cash-out refinance may not be available under the supplied program",
        "Asset ownership, accessibility, sourcing, and documentation must be verified",
        "Terms and requirements vary by lender and program",
        "Approval is not based solely on total net worth",
        "The complete borrower and property profile must be reviewed",
      ],
    },
    relatedProgramIds: ["bank-statement", "non-qm", "1099-income", "pl-loan", "foreign-national"],
  },
  {
    id: "pl-loan",
    category: "purchase",
    tags: ["Self-Employed"],
    title: "P&L Loan",
    shortDescription:
      "Explore mortgage qualification using an acceptable Profit and Loss statement when traditional tax-return income may not reflect current business performance.",
    cardHook:
      "Explore mortgage qualification using an acceptable Profit and Loss statement when traditional tax-return income may not reflect current business performance.",
    highlightLine:
      "Current business income may be evaluated through a **professionally prepared P&L** under applicable program guidelines",
    highlights: [
      "Built for self-employed borrowers",
      "One-year or two-year P&L options may be available",
      "Purchase and eligible refinance strategies",
    ],
    expanded: {
      fullDescription:
        "A P&L Loan may help eligible self-employed borrowers qualify using an acceptable Profit and Loss statement instead of relying primarily on traditional tax-return income. This approach may be useful for established business owners, consultants, independent professionals, and other self-employed borrowers whose current business performance may not be fully reflected in traditional income documentation. Final eligibility depends on the borrower, business history, supporting documentation, property, and applicable program requirements.",
      whoFor: [
        "Self-Employed Borrowers",
        "Business Owners",
        "Consultants",
        "Independent Professionals",
        "Established Businesses",
        "Alternative Documentation",
      ],
      benefits: [
        "USE A PROFESSIONALLY PREPARED P&L — An acceptable Profit and Loss statement may be used to document business income for qualification.",
        "CURRENT BUSINESS PERFORMANCE MAY BE CONSIDERED — The review may focus on recent operating results rather than relying exclusively on older tax-return income.",
        "MULTIPLE TRANSACTION TYPES MAY BE AVAILABLE — Eligible purchase, rate-and-term refinance, cash-out refinance, or delayed-financing options may be considered.",
        "MULTIPLE OCCUPANCY TYPES MAY BE CONSIDERED — Eligible primary residences, second homes, and investment properties may be supported under applicable guidelines.",
      ],
      howItWorks: [
        "REVIEW YOUR BUSINESS AND FINANCING GOALS — We discuss your business history, income structure, property plans, and financing objectives.",
        "COLLECT THE P&L DOCUMENTATION — An acceptable Profit and Loss statement prepared by a qualified professional is reviewed along with applicable supporting documents.",
        "EVALUATE BUSINESS INCOME — The lender reviews the P&L, business history, expense structure, supporting statements, and other required documentation.",
        "COMPARE AVAILABLE OPTIONS — We evaluate eligible purchase or refinance structures based on the borrower, business, property, and program requirements.",
        "MOVE FORWARD WITH GUIDANCE — Infinite Home Lending helps coordinate the application, documentation, underwriting, and closing process.",
      ],
      reassurance:
        "Your business may be performing well even if traditional tax documents do not fully reflect it. Let's explore whether a P&L Loan aligns with how you earn and what you want to accomplish.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Self-Employed? Your Business Performance May Help You Qualify.",
      intro:
        "A P&L Loan may help eligible self-employed borrowers qualify using an acceptable Profit and Loss statement instead of relying primarily on traditional tax-return income. This approach may be useful for established business owners, consultants, independent professionals, and other self-employed borrowers whose current business performance may not be fully reflected in traditional income documentation. Final eligibility depends on the borrower, business history, supporting documentation, property, and applicable program requirements.",
      whenMakesSenseBullets: [
        "YOU ARE SELF-EMPLOYED — You own or operate an established business and receive income outside a traditional W-2 employment structure.",
        "YOUR CURRENT BUSINESS PERFORMANCE MATTERS — A professionally prepared Profit and Loss statement may help document the business income used for qualification.",
        "YOUR TAX RETURNS MAY NOT TELL THE FULL STORY — Recent business performance may differ from income reflected in prior-year tax returns.",
        "YOU WANT AN ALTERNATIVE DOCUMENTATION PATH — Eligible borrowers may qualify using a P&L statement with applicable supporting documentation.",
      ],
      atAGlance: {
        bestFor:
          "Established self-employed borrowers whose qualifying income may be supported through an acceptable Profit and Loss statement",
        keyAdvantage:
          "Current business performance may be considered through an alternative documentation approach instead of relying exclusively on traditional tax-return income",
      },
      overviewParagraphs: [
        "What is a P&L Loan? A P&L Loan is an alternative-documentation mortgage program designed for certain eligible self-employed borrowers. Instead of relying primarily on traditional tax-return income, the program may use an acceptable Profit and Loss statement to help determine qualifying business income. The P&L must meet applicable program standards and may need to be prepared or validated by a qualified professional. Supporting bank statements, business documentation, or other records may also be required depending on the transaction and program.",
        "Who may consider a P&L Loan? This approach may be relevant for self-employed borrowers, established business owners, consultants, independent professionals, sole proprietors, partners or eligible business owners, and borrowers whose recent business performance may differ from prior tax-return income. It may also apply to borrowers pursuing an eligible purchase or refinance, or considering a primary residence, second home, or investment property. Self-employment alone does not guarantee eligibility.",
        "How is income documented? Qualifying income may be evaluated using an acceptable Profit and Loss statement covering the required review period. Eligible borrowers may use a one-year or two-year Profit and Loss statement, subject to applicable documentation and underwriting requirements. The P&L may need to be prepared by a CPA, tax preparer, or other qualified professional. Supporting bank statements or additional documentation may be required depending on the transaction structure and applicable guidelines. A borrower-prepared spreadsheet alone is generally not sufficient.",
        "Are bank statements required? They may be. Some P&L programs may permit qualification using the P&L with limited supporting bank statements, while other structures may require additional statements or documentation. The amount and type of supporting documentation depend on the borrower, transaction, business profile, and current program guidelines.",
        "How is this different from a Bank Statement Loan? A P&L Loan generally evaluates income using a professionally prepared Profit and Loss statement. A Bank Statement Loan generally evaluates qualifying deposits shown in personal or business bank statements and may apply an expense factor. Both are alternative-documentation strategies, but they rely on different evidence to evaluate income.",
        "How is this different from a 1099 Income Loan? A 1099 Income Loan generally evaluates documented contractor earnings reported on one or more 1099 forms. A P&L Loan evaluates business performance using an acceptable Profit and Loss statement. The appropriate path depends on how the borrower earns income and which documents most accurately support the financial profile.",
        "What transactions may be eligible? Eligible purchase, rate-and-term refinance, cash-out refinance, and delayed-financing transactions may be considered, subject to current program requirements.",
        "What property types may be considered? Eligible primary residences, second homes, and investment properties may be considered, subject to property and program requirements.",
        "Who prepares the P&L? The Profit and Loss statement may need to be prepared or validated by a qualified CPA, tax preparer, accountant, or other acceptable professional, depending on applicable program guidelines. The borrower should expect the lender to review the preparer, reporting period, business information, income, expenses, and supporting documentation.",
        "Do tax returns have to be provided? Traditional tax returns may not be the primary income document under an eligible P&L program. However, the lender may still require other business, asset, credit, or transaction documentation. Final documentation requirements depend on the borrower and program.",
      ],
      whoTypically: [
        "Self-employed borrowers",
        "Business owners",
        "Consultants",
        "Independent professionals",
        "Sole proprietors",
        "Eligible partners",
        "Borrowers with established operating history",
        "Borrowers whose current business income may not be reflected fully in prior tax returns",
        "Primary-residence buyers",
        "Second-home buyers",
        "Real estate investors",
        "Eligible refinance borrowers",
      ],
      keyRequirements: [
        "The borrower must meet applicable self-employment requirements",
        "The business must have an acceptable operating history",
        "The P&L must cover the required review period",
        "The P&L must meet applicable preparation and validation standards",
        "Supporting bank statements may be required",
        "Business ownership and income must be documented",
        "The lender must review the expense structure and business stability",
        "Property and transaction requirements apply",
        "Credit, assets, liabilities, and reserves remain subject to underwriting review",
        "Final eligibility depends on the complete borrower and property profile",
      ],
      whyClientsChoose: [
        "Their current business performance may be stronger than older tax-return income suggests",
        "Their income is generated through a business rather than traditional W-2 employment",
        "A professionally prepared financial statement may better explain the business",
        "Multiple transaction types may be available",
        "Primary residences, second homes, and investment properties may be considered",
        "The program offers an alternative to deposit-only income analysis",
        "Infinite Home Lending can compare P&L, Bank Statement, 1099, and other alternative-documentation options",
      ],
      whatToKeepInMind: [
        "The P&L must meet current program standards",
        "Not every self-prepared P&L will be accepted",
        "Supporting bank statements may be required",
        "Business stability and operating history matter",
        "Expenses and net income will be reviewed",
        "Additional business documentation may be required",
        "Terms and documentation vary by lender and program",
        "Rates and pricing may differ from traditional agency financing",
        "Investment property rules may differ from owner-occupied rules",
        "Approval is based on the complete borrower, business, property, and transaction profile",
        "A P&L does not guarantee approval",
      ],
    },
    relatedProgramIds: ["bank-statement", "1099-income", "non-qm", "asset-depletion"],
  },
  {
    id: "fha-repair-escrow",
    category: "purchase",
    tags: ["HUD Homes"],
    title: "FHA Repair Escrow",
    shortDescription:
      "Purchase certain eligible HUD homes that need limited repairs and complete approved work after closing through a repair escrow.",
    cardHook:
      "Buy certain eligible HUD-owned homes that need limited repairs—then complete approved work after closing with funds held in escrow.",
    highlightLine:
      "Approved repairs may be **completed after closing** using funds held in **escrow**, subject to HUD and FHA requirements",
    highlights: [
      "Designed for certain HUD-owned homes",
      "Limited repairs may be financed through escrow",
      "Purchase financing only",
    ],
    expanded: {
      fullDescription:
        "FHA Repair Escrow may allow eligible buyers to purchase certain HUD-owned homes that need limited repairs before fully meeting FHA property requirements. Instead of requiring every qualifying repair to be completed before closing, approved repair funds may be placed into an escrow account so eligible work can be completed after the purchase. The program is intended for limited repairs and remains subject to HUD, FHA, property, lender, and program requirements.",
      whoFor: [
        "HUD Homes",
        "FHA Buyers",
        "Limited Repairs",
        "Owner-Occupants",
        "Purchase Financing",
      ],
      benefits: [
        "Purchase an eligible home that needs repairs — Certain HUD-owned homes may still qualify for FHA financing when required repairs can be handled through an approved repair escrow.",
        "Complete approved repairs after closing — Eligible repair funds may be held in escrow so the necessary work can be completed after the purchase closes.",
        "Limited repair financing built into the transaction — The program may provide a simpler path for homes requiring modest repairs rather than a full renovation financing structure.",
        "May work with certain FHA purchase strategies — Depending on applicable guidelines, FHA Repair Escrow may be used with certain eligible FHA purchase programs.",
      ],
      howItWorks: [
        "Find an eligible HUD property — We review the property, purchase opportunity, and available FHA financing structure.",
        "Identify required repairs — The property is evaluated to determine which repairs are necessary to satisfy applicable HUD/FHA property requirements.",
        "Establish the repair escrow — Approved repair funds are included in the transaction and placed into an escrow account for eligible work.",
        "Close and complete the repairs — After closing, the approved repairs are completed within the program's required timeframe.",
        "Finalize the repair process — Required inspections are completed and escrow funds are released according to lender and program requirements.",
      ],
      reassurance:
        "A home that needs repairs does not have to be out of reach. Let's review whether FHA Repair Escrow may fit the property and your purchase goals.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "A Home That Needs Repairs May Still Be Within Reach.",
      intro:
        "FHA Repair Escrow may allow eligible buyers to purchase certain HUD-owned homes that need limited repairs before fully meeting FHA property requirements. Instead of requiring every qualifying repair to be completed before closing, approved repair funds may be placed into an escrow account so eligible work can be completed after the purchase. The program is intended for limited repairs and remains subject to HUD, FHA, property, lender, and program requirements.",
      whenMakesSenseBullets: [
        "You're buying an eligible HUD home — The program is designed for certain HUD Real Estate Owned properties offered with FHA-insured financing.",
        "The home needs limited repairs — The property may not fully meet FHA minimum property requirements in its current condition but may become acceptable after eligible repairs are completed.",
        "You want to close before the repairs are finished — Eligible repair funds may be placed into escrow so approved work can be completed after closing.",
        "The repairs are limited in scope — The program permits qualifying repairs up to $10,000, subject to HUD and lender requirements.",
      ],
      atAGlance: {
        bestFor:
          "Eligible buyers purchasing certain HUD-owned properties that require limited repairs to satisfy applicable FHA property requirements",
        keyAdvantage:
          "Approved repairs may be completed after closing using funds held in escrow rather than requiring all qualifying work to be finished before the purchase",
      },
      overviewParagraphs: [
        "What is FHA Repair Escrow? FHA Repair Escrow is a financing feature that may allow an eligible buyer to purchase certain HUD-owned properties that require limited repairs before fully satisfying FHA minimum property requirements. Approved funds for qualifying repairs are placed into an escrow account and the work is completed after closing.",
        "What type of property is this designed for? The program specifically applies to certain HUD Real Estate Owned (REO) properties that may be considered insurable with repair escrow. This is not intended as a general repair program for every property.",
        "How much repair work may be included? The program permits repairs of up to $10,000. The final approved escrow amount may also reflect the cost necessary to satisfy applicable HUD requirements plus the program's required contingency. Not every repair scenario up to that limit automatically qualifies.",
        "How long do repairs have to be completed? Repairs must be completed within 90 days after closing, subject to applicable lender and program rules. Completion, inspection, and release-of-funds requirements apply before escrow funds are fully released.",
        "May this be combined with other FHA programs? FHA Repair Escrow may be combined with certain eligible FHA purchase programs, such as FHA $100 Down, Good Neighbor Next Door (GNND), or certain 203(k) structures, subject to applicable guidelines.",
      ],
      whoTypically: [
        "Buyers purchasing eligible HUD-owned homes",
        "FHA borrowers",
        "Owner-occupant buyers",
        "Properties requiring limited repairs",
        "Buyers who want to complete eligible repairs after closing",
        "Buyers considering qualifying HUD purchase opportunities",
      ],
      keyRequirements: [
        "Purchase transactions only",
        "Property must be an eligible HUD-owned property",
        "Repairs must fall within applicable program limits",
        "Property must meet applicable HUD/FHA requirements after the repairs",
        "Repair funds are held in escrow",
        "Required repairs must be completed within the program timeframe",
        "Inspections are required before escrow funds are fully released",
        "Occupancy, property-type, borrower, and FHA eligibility requirements apply",
      ],
      whyClientsChoose: [
        "Opens the door to certain HUD properties needing limited repairs",
        "May avoid requiring all eligible repairs to be completed before closing",
        "Repair funds are coordinated within the FHA purchase transaction",
        "Useful when the property needs modest rather than extensive renovation",
        "May work alongside certain qualifying FHA purchase strategies",
        "IHL helps coordinate the financing, property requirements, and repair process",
      ],
      whatToKeepInMind: [
        "FHA Repair Escrow applies only to eligible properties and repair scenarios",
        "It is not a substitute for a full renovation loan when repairs are more extensive",
        "Repair limits and escrow requirements apply",
        "Repairs must be completed within the required timeframe",
        "Property inspections and lender approval are required",
        "FHA, HUD, lender, and property requirements all apply",
        "Prior HUD property purchase restrictions may apply",
        "Program availability and requirements may change",
        "Infinite Home Lending will review the current requirements for the borrower's specific property and transaction",
      ],
    },
    relatedProgramIds: ["fha", "dpa-advantage", "fha-203k-limited"],
  },
  {
    id: "fha-203k-limited",
    category: "purchase",
    tags: ["FHA Renovation"],
    title: "FHA 203(k) Limited Renovation",
    shortDescription:
      "Finance an eligible home purchase or refinance together with qualifying smaller-scale renovations through one FHA mortgage.",
    cardHook:
      "Purchase or refinance a home while financing qualifying smaller-scale, non-structural improvements through the same first mortgage.",
    highlightLine:
      "One mortgage can help finance both the home and **eligible non-structural improvements**",
    highlights: [
      "Purchase or eligible refinance",
      "Smaller-scale renovations",
      "Non-structural improvements",
    ],
    expanded: {
      fullDescription:
        "FHA 203(k) Limited can help eligible borrowers purchase or refinance a home while financing qualifying repairs, improvements, or upgrades through the same first mortgage. Designed for smaller-scale, non-structural projects, it can provide a practical way to finance a home that may need updating without arranging a separate renovation loan after closing. Program availability, eligible improvements, property requirements, and financing are subject to FHA and applicable lender guidelines.",
      whoFor: [
        "Homebuyers",
        "Homeowners",
        "Renovation",
        "Non-Structural Improvements",
        "Purchase",
        "Refinance",
      ],
      benefits: [
        "Home + improvements in one mortgage — Finance an eligible purchase or refinance together with qualifying renovation costs through one first mortgage.",
        "Designed for smaller renovations — The Limited program is intended for qualifying projects that do not involve structural work.",
        "Turn potential into possibility — A home that needs updating may still become the right home when eligible improvements can be incorporated into the financing strategy.",
        "A more coordinated renovation process — Rather than arranging separate financing after closing, eligible improvement costs can be addressed as part of the mortgage transaction.",
      ],
      howItWorks: [
        "Explore the property and your plans — We review the home, your financing goals, and the improvements you are considering.",
        "Identify eligible improvements — The proposed project is reviewed to determine whether the work fits applicable FHA 203(k) Limited requirements.",
        "Build the financing strategy — Eligible renovation costs are incorporated into the mortgage structure along with the purchase or refinance.",
        "Close the loan — Once the mortgage and renovation requirements are satisfied, the transaction closes and the renovation process can move forward.",
        "Complete the approved work — Renovation funds are administered according to applicable FHA and lender requirements as approved work is completed.",
      ],
      reassurance:
        "You do not necessarily have to find a completely renovated home. Let's review whether FHA 203(k) Limited may fit the property, your plans, and your financing goals.",
      primaryCta: { label: "Let's Talk", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Buy the Home. Make It Yours.",
      intro:
        "FHA 203(k) Limited can help eligible borrowers purchase or refinance a home while financing qualifying repairs, improvements, or upgrades through the same first mortgage. Designed for smaller-scale, non-structural projects, it can provide a practical way to finance a home that may need updating without arranging a separate renovation loan after closing. Program availability, eligible improvements, property requirements, and financing are subject to FHA and applicable lender guidelines.",
      whenMakesSenseBullets: [
        "You found the right home — but it needs some work — A property may have the location or potential you want even if certain areas need updating.",
        "You want to finance the improvements — Eligible renovation costs may be included with the home financing rather than requiring a completely separate financing strategy after closing.",
        "Your project is smaller in scope — FHA 203(k) Limited is intended for qualifying improvements that are non-structural in nature.",
        "You're purchasing or refinancing — The program may be used for eligible purchase or refinance transactions.",
      ],
      atAGlance: {
        bestFor:
          "Eligible homebuyers or homeowners who want to finance smaller-scale, non-structural improvements as part of a purchase or refinance",
        keyAdvantage:
          "Eligible home financing and renovation costs may be combined into one first mortgage",
      },
      overviewParagraphs: [
        "What is FHA 203(k) Limited? FHA 203(k) Limited is an FHA renovation mortgage designed to help eligible borrowers finance a home together with qualifying smaller-scale repairs, improvements, or upgrades. The financing may be used in connection with an eligible purchase or refinance and is structured through one first mortgage.",
        "What type of renovations is it designed for? FHA 203(k) Limited is intended for smaller-scale projects that are non-structural in nature. This is a broader renovation-financing strategy than FHA Repair Escrow, which applies to certain eligible HUD-owned properties requiring limited repairs necessary to satisfy applicable property requirements.",
        "Can it be used to purchase a home? Yes. Eligible borrowers may finance both the purchase of a home and qualifying repair, upgrade, or improvement costs through one first mortgage.",
        "Can it be used for a refinance? Yes. The program is also available for eligible refinance transactions. Final eligibility depends on the property, transaction, proposed improvements, and applicable FHA and lender requirements.",
        "How much renovation work can be financed? Under the supplied program guidelines, eligible rehabilitation costs may total up to $75,000, subject to FHA, lender, property, and transaction requirements. There is no minimum rehabilitation cost stated in the supplied guidelines. This is a program limit under current guidelines — not a guaranteed amount available to every borrower.",
        "Is a HUD consultant required? FHA 203(k) Limited generally does not require the HUD consultant structure associated with more extensive renovation projects, subject to applicable program requirements.",
        "How are renovation funds handled? Renovation funds are managed through the loan's renovation process and released as approved work progresses, subject to applicable documentation, inspection, and lender requirements.",
        "Eligible property types may include certain primary residences, manufactured homes, FHA-approved condominiums, PUDs, and HUD-owned properties, subject to applicable FHA and program requirements.",
      ],
      whoTypically: [
        "Buyers considering homes that need updating",
        "Homeowners planning qualifying improvements during a refinance",
        "Borrowers who prefer to finance eligible renovations with the mortgage",
        "Properties needing smaller-scale improvements",
        "Borrowers whose planned work is non-structural",
        "Buyers who see potential in a home that is not move-in perfect",
      ],
      keyRequirements: [
        "FHA borrower eligibility requirements apply",
        "Property eligibility requirements apply",
        "Primary-residence requirements apply",
        "Proposed improvements must qualify under FHA 203(k) Limited guidelines",
        "Projects must remain within applicable Limited-program scope",
        "Renovation documentation and contractor requirements may apply",
        "Work and funds are administered according to applicable FHA and lender requirements",
        "Purchase and eligible refinance transactions may qualify",
        "Final approval depends on the borrower, property, project, and financing structure",
      ],
      whyClientsChoose: [
        "Finance the home and qualifying improvements together",
        "Useful when a home has potential but needs updating",
        "Designed specifically for smaller-scale renovation projects",
        "Can reduce the need to arrange separate renovation financing after closing",
        "Available for certain purchases and refinances",
        "IHL helps coordinate the mortgage and renovation financing strategy",
      ],
      whatToKeepInMind: [
        "FHA 203(k) Limited is intended for non-structural projects",
        "More extensive renovation needs may require a different renovation program",
        "Eligible improvements and costs must meet applicable guidelines",
        "Contractors, documentation, inspections, and fund-control requirements may apply",
        "Renovation funds are not simply given to the borrower as unrestricted cash",
        "Property and FHA eligibility requirements apply",
        "This program is different from FHA Repair Escrow, which is designed for certain eligible HUD-owned properties requiring limited repairs through an escrow after purchase",
        "DPA Advantage may be used in conjunction with FHA 203(k) Limited for eligible borrowers, subject to program requirements — not every 203(k) borrower qualifies for down-payment assistance",
        "Program guidelines and availability can change",
        "Final eligibility is determined based on the specific borrower, property, project, and transaction",
      ],
    },
    relatedProgramIds: ["fha", "fha-repair-escrow", "dpa-advantage"],
  },
];

export function getLoanProductById(id: string, lang?: string): LoanProductData | undefined {
  const products = lang === "es" ? LOAN_PRODUCTS_ES : LOAN_PRODUCTS;
  return products.find((p) => p.id === id);
}

export function getLoanProductsForLang(lang?: string): LoanProductData[] {
  return lang === "es" ? LOAN_PRODUCTS_ES : LOAN_PRODUCTS;
}
