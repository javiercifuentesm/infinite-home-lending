import type { LoanProductData } from "../components/LoanProductCard";

/** Grid layout: 3 + 3 + 3 */
export const LOAN_GRID_ROWS: readonly (readonly string[])[] = [
  ["conventional", "fha", "va"],
  ["usda", "refinance", "cash-out-refinance"],
  ["heloc", "reverse", "non-qm"],
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
  },
];

export function getLoanProductById(id: string): LoanProductData | undefined {
  return LOAN_PRODUCTS.find((p) => p.id === id);
}
