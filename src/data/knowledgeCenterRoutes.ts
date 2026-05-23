/**
 * Guided Knowledge Center routes — decision-support content, not blog posts.
 */

import { FEATURED_MISUNDERSTANDINGS_ES, KNOWLEDGE_ROUTES_ES } from "./knowledgeCenterRoutes.es";

export type KnowledgeRouteId =
  | "start-here"
  | "buying"
  | "numbers"
  | "loan-options"
  | "refinance-equity"
  | "quick-answers";

export type FaqItem = { q: string; a: string };

/** Expandable clarity topic */
export type ClarityCardBlock = {
  id: string;
  title: string;
  summary: string;
  learnMore: string;
  /** Optional <details> label (default in UI: “Learn more”) */
  expandLabel?: string;
};

/** Numbered step with optional expansion */
export type HowItWorksStep = {
  id: string;
  title: string;
  summary: string;
  /** Omit or leave empty to hide “Expand step” (e.g. Quick Answers guide blocks) */
  learnMore?: string;
  /** Optional muted line shown above this step (e.g. narrative bridge) */
  beforeTransition?: string;
};

export type KnowledgeRoute = {
  id: KnowledgeRouteId;
  label: string;
  cardDescription: string;
  /** Legacy single string for search */
  heroIntro: string;
  /** 2–3 short lines — context header */
  contextLines: string[];
  /** 3–4 emphasized insights (not card chrome) */
  whatMattersMost: string[];
  /** Clarity cards with inline “Learn more” */
  clarityCards: ClarityCardBlock[];
  /** 4–6 steps, each expandable */
  howItWorksSteps: HowItWorksStep[];
  /** Optional intro paragraph below “How it works” heading */
  howItWorksIntro?: string;
  /** Optional — overrides default “How it works” section heading */
  howItWorksSectionTitle?: string;
  /** Full FAQ pool — UI shows subset + “view more” */
  faqAll: FaqItem[];
  /** Override default first-screen FAQ count (e.g. 5 for Numbers) */
  faqInitialCount?: number;
  /** Honest / contrarian trust block */
  realTalk: { headline: string; points: string[] };
  /** Bottom of topic */
  contextualCta: {
    line: string;
    subline?: string;
    buttonLabel: string;
    /** Optional reassurance above headline (e.g. conversion confidence) */
    ctaReassurance?: string;
  };
  /** Optional — overrides default “Clarity cards” section heading */
  claritySectionTitle?: string;
  /** Optional bridge after clarity cards (before How it works) */
  afterClarityBridge?: { headline: string; body: string };
};

function joinSearch(r: KnowledgeRoute): string {
  return [
    r.cardDescription,
    r.heroIntro,
    ...r.contextLines,
    ...r.whatMattersMost,
    ...r.clarityCards.flatMap((c) => [c.title, c.summary, c.learnMore, c.expandLabel ?? ""]),
    r.howItWorksIntro ?? "",
    r.howItWorksSectionTitle ?? "",
    ...r.howItWorksSteps.flatMap((s) => [
      s.beforeTransition ?? "",
      s.title,
      s.summary,
      s.learnMore ?? "",
    ]),
    ...r.faqAll.flatMap((f) => [f.q, f.a]),
    r.realTalk.headline,
    ...r.realTalk.points,
    r.contextualCta.subline ?? "",
    r.contextualCta.ctaReassurance ?? "",
    r.claritySectionTitle ?? "",
    r.afterClarityBridge
      ? `${r.afterClarityBridge.headline} ${r.afterClarityBridge.body}`
      : "",
  ].join(" ");
}

export const KNOWLEDGE_ROUTES: Record<KnowledgeRouteId, KnowledgeRoute> = {
  "start-here": {
    id: "start-here",
    label: "Start Here",
    cardDescription:
      "Calm entry — orientation, pacing, and a clear path into the rest of the Knowledge Center.",
    heroIntro:
      "If the mortgage world feels loud, you’re not alone. Start here for a simple map: what matters first, how decisions unfold, and how to use what’s ahead without drowning in detail.",
    contextLines: [
      "You don’t need every answer today — just enough to see where you are and what comes next.",
      "We’ll orient you first, then point you to the topics that match your next real question.",
      "Once the sequence clicks, the rest feels lighter — including the conversations ahead.",
      "Most people start in this exact place — unsure where to begin. You’re not behind.",
      "Here’s how to think about the process:",
    ],
    whatMattersMost: [
      "You’re not behind — you’re at the beginning. Most stress comes from not seeing the shape of the journey.",
      "A good next step fits your life and timeline — not a one-size checklist from the internet.",
      "The win isn’t memorizing jargon — it’s knowing enough to move forward without second-guessing every turn.",
    ],
    clarityCards: [
      {
        id: "sh-c1",
        title: "Why orientation comes first",
        summary:
          "Mortgages are a series of decisions in order — not one “best rate” moment you have to nail blindly.",
        expandLabel: "Explore this",
        learnMore:
          "When you understand what’s decided at each step, it’s easier to focus on what matters right now — without carrying uncertainty from what comes next.\n\nThat’s how this space is designed: start with the map, then go deeper where it actually helps.",
      },
      {
        id: "sh-c2",
        title: "Clarity before pressure",
        summary:
          "You should understand trade-offs before anything feels like a push to pick a product.",
        expandLabel: "Go deeper",
        learnMore:
          "Advisory means understanding your options in plain language — aligned to your goals, not a script.\n\nIf something doesn’t feel clear yet, that’s your signal to pause and explore further — not to rush into a decision.",
      },
      {
        id: "sh-c3",
        title: "How to move through these topics",
        summary:
          "Skim what helps, go deep where it matters, and skip what doesn’t apply to your stage.",
        expandLabel: "See how it works",
        learnMore:
          "You don’t need to go through everything.\n\nStart with what matches your situation today, and move deeper only where it adds value.\n\nYou can always return — this space is built to meet you wherever you are in the process.",
      },
    ],
    howItWorksSteps: [
      {
        id: "sh-s1",
        title: "Arrive as you are",
        summary:
          "No prerequisites — if you’re new to this, you’re in the right place.",
        learnMore:
          "You don’t need polished language or perfect numbers to start.\n\nThe point is orientation: a little structure so the process stops feeling like a blind turn every week.",
      },
      {
        id: "sh-s2",
        title: "Understand where you actually stand today",
        summary:
          "Buying, refinancing, or “just understanding” — honesty about today sets which door to open next.",
        learnMore:
          "This is the moment most people either gain clarity — or stay stuck.\n\nYou don’t have to commit to a path on day one — but naming the direction helps.\n\nEven a rough goal keeps the noise down: you’ll know which topics to skim and which to slow down for.",
      },
      {
        id: "sh-s3",
        title: "See how decisions usually unfold",
        summary:
          "Sequence matters: some questions naturally come before others — and that’s a relief, not a hurdle.",
        learnMore:
          "Mortgages aren’t random — income, assets, timeline, and structure connect in a predictable rhythm.\n\nSeeing the order makes it easier to pace yourself instead of trying to solve everything at once.",
      },
      {
        id: "sh-s4",
        title: "Pick the topic that matches your next question",
        summary:
          "Use the Knowledge Center as a set of doors — not a wall of homework.",
        learnMore:
          "Jump into what feels most relevant — numbers, buying, loan types, refinancing, or quick answers.\n\nIf you’re unsure, keep it light: start with summaries, then expand only when something calls for more clarity.",
      },
      {
        id: "sh-s5",
        title: "Carry clarity into what’s next",
        summary:
          "Whether you keep reading or talk with someone, you’ll know what you’re trying to learn.",
        learnMore:
          "Confidence isn’t about knowing everything — it’s about knowing which question you’re answering.\n\nWith that clarity, the rest of this space — and any conversation you choose to have — becomes far more useful.\n\nThe next step is simple: explore the sections that align with what you want to understand next.",
      },
    ],
    faqInitialCount: 4,
    faqAll: [
      {
        q: "Do I need to read everything before I do anything else?",
        a: "No. Start with what matches your question — depth can wait until it’s relevant.",
      },
      {
        q: "Do I need to pick a loan type before we talk?",
        a: "No. Most people start with goals and timing; product fit follows once the picture is clearer.",
      },
      {
        q: "Will exploring options hurt my credit?",
        a: "A structured conversation isn’t a credit pull. When a formal review is needed, we’ll tell you first.",
      },
      {
        q: "Is this going to feel like a sales pitch?",
        a: "We’re built around strategy and comparison — you should leave with fewer open questions, not more pressure.",
      },
      {
        q: "How long does initial clarity take?",
        a: "Often one focused conversation — longer if your situation has more moving parts.",
      },
      {
        q: "What should I bring to a first call?",
        a: "Goals, timeline, and rough numbers help. Full documentation comes when you’re ready to go deeper.",
      },
    ],
    realTalk: {
      headline: "A quiet truth",
      points: [
        "Most overwhelm isn’t from the math — it’s from not knowing what happens next.",
        "You don’t need every acronym on day one; you need a steady sense of order.",
        "When someone won’t explain trade-offs, they’re selling a product — not helping you choose a path.",
      ],
    },
    contextualCta: {
      line: "Ready to explore what’s next for you?",
      subline:
        "Browse the topics below at your pace — or talk with us when you want a guide beside you.",
      buttonLabel: "Talk to an advisor",
    },
  },
  buying: {
    id: "buying",
    label: "Buying a Home",
    cardDescription:
      "Pre-approval, cash to close, and offers that win — the buying path without the guesswork.",
    heroIntro:
      "Buying a home can feel overwhelming — not because it’s complicated, but because most people are never shown how it actually works. We break it down step by step so you know what matters, what to expect, and how to decide with confidence.",
    contextLines: [
      "Buying a home can feel overwhelming — not because it’s complicated, but because most people are never shown how it actually works.",
      "We break it down step by step: what matters, what to expect, and how to decide with confidence.",
    ],
    whatMattersMost: [
      "Start with your numbers — not the home search. Fall in love with a payment range before you fall in love with a listing.",
      "Pre-approval isn’t paperwork — it’s leverage. It defines what you can do and whether sellers take you seriously.",
      "Cash to close blindsides more buyers than the mortgage payment. Down payment is only part of the story.",
      "The lowest rate isn’t the win — the right structure is. A “cheap” loan with the wrong terms can cost you more.",
    ],
    clarityCards: [
      {
        id: "b-c1",
        title: "How much home can I afford?",
        summary:
          "The number you qualify for isn’t the number you should live on.",
        learnMore:
          "Lenders stress-test maximums — not your real life.\n\nExample: Approved for $3,200/month doesn’t mean $3,200 feels safe after everything else you run.\n\nWe line up both so you don’t buy a house and choke the rest of your budget.",
      },
      {
        id: "b-c2",
        title: "Do I need 20% down?",
        summary: "Waiting for 20% down is one of the costliest mistakes buyers make.",
        learnMore:
          "You can buy with far less:\n\n• 3–5% down (Conventional)\n\n• 3.5% (FHA)\n\n• 0% (VA / USDA)\n\nThe real question isn’t “how little” — it’s which structure puts you strongest for the long haul.",
      },
      {
        id: "b-c3",
        title: "What is pre-approval really?",
        summary: "It’s not a letter — it’s proof you can close.",
        learnMore:
          "A serious pre-approval means:\n\n• Credit reviewed\n\n• Income validated\n\n• Underwriting started\n\nNo estimates pretending to be facts — and you negotiate from strength.",
      },
      {
        id: "b-c4",
        title: "What is cash to close?",
        summary: "It’s rarely “just the down payment” — and that gap breaks budgets.",
        learnMore:
          "Cash to close stacks:\n\n• Down payment\n• Closing costs (often 2–5%)\n• Prepaids and escrows\n\nExample: $400K home, 5% down = $20K down — total cash to close often lands closer to $28K–$32K.",
      },
      {
        id: "b-c5",
        title: "Self-employed or 1099?",
        summary: "What you earn and what lenders can use on a mortgage are often different.",
        learnMore:
          "If you file Schedule C, take bank deposits, or have irregular income, standard calculators can mislead you. Lenders apply add-backs, averaging rules, and sometimes bank-statement programs.\n\nInfinite Home Lending’s Self-Employed Mortgage Qualifier at infinitehomelending.com/tools/self-employed-qualifier models tax return paths, bank statement cash flow, and a planning scenario for write-offs vs. buying power — side by side.",
      },
    ],
    howItWorksSteps: [
      {
        id: "b-s1",
        title: "Understand your numbers",
        summary:
          "Lock your budget and payment range before you tour a single house.",
        learnMore:
          "That’s how you stop chasing listings that don’t match your reality.",
      },
      {
        id: "b-s2",
        title: "Get pre-approved",
        summary: "This is where you stop guessing and start acting from a real position.",
        learnMore:
          "You know what you qualify for, what the payment looks like, and which strategy fits — and sellers treat you like a buyer who can perform.",
      },
      {
        id: "b-s3",
        title: "Search with clarity",
        summary: "Shop inside your range — not around it.",
        learnMore:
          "When your limits are clear, you decide faster and you don’t negotiate against yourself.",
      },
      {
        id: "b-s4",
        title: "Make an offer",
        summary: "Winning offers are built — not bluffed.",
        learnMore:
          "Price is one lever. Terms, contingencies, and timing decide who gets the callback.\n\nThe strongest offer is usually the cleanest — not always the highest.",
      },
      {
        id: "b-s5",
        title: "Close with confidence",
        summary: "From contract to keys: appraisal, underwriting, final approval — in sequence.",
        learnMore:
          "This phase is procedural if the file is clean — and fragile if it isn’t.\n\nStay financially steady here; surprises at the table almost always start earlier.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "How much house can I afford if I improve my credit?",
        a: "Your buying power depends on income, debts, score-based rates, and down payment — not the score alone. Infinite Home Lending’s Homebuying Power Map (infinitehomelending.com/tools/homebuying-power-map) projects buying power today and at 90 days, 6 months, and 12 months as you model credit, debt payoff, savings, and income — mapped to median prices in real MD-DC-VA markets.",
      },
      {
        q: "Does buying a home build wealth compared to renting?",
        a: "It depends on your assumptions — especially home appreciation, rent growth, and what you’d earn if you invested your down payment elsewhere. Infinite Home Lending’s Mortgage Wealth Tracker (infinitehomelending.com/tools/wealth-tracker) models six wealth streams in parallel (including honest opportunity cost) and shows net worth at years 5, 10, 20, and 30 so you can see the full picture, not a one-sided headline.",
      },
      {
        q: "Should I lock my mortgage rate while I’m under contract?",
        a: "No one can predict short-term rate moves — but you can quantify what each choice costs you personally. Infinite Home Lending’s interactive Rate Lock Decision Engine (infinitehomelending.com/tools/rate-lock-engine) models downside vs. upside from floating, extension fees, and float-down options in dollar terms so you can align the decision with your risk tolerance and timeline.",
      },
      {
        q: "What’s the difference between pre-qualification and pre-approval?",
        a: "Pre-qualification is an estimate. Pre-approval is verified and carries real weight.",
      },
      {
        q: "How much home can I actually afford?",
        a: "What you qualify for vs what fits your life are different. We help define both.",
      },
      {
        q: "What are closing costs?",
        a: "Typically 2–5% covering fees, services, and prepaids.",
      },
      {
        q: "What is cash to close?",
        a: "Total out-of-pocket including down payment and closing costs.",
      },
      {
        q: "What happens if the appraisal comes in low?",
        a: "You can renegotiate, cover the gap, or adjust structure depending on contract.",
      },
      {
        q: "How long does pre-approval take?",
        a: "Often a few days with complete documentation — timing depends on your file and responsiveness.",
      },
      {
        q: "Can I change my loan amount after I’m pre-approved?",
        a: "Sometimes — material changes to income, debt, or price can require an update. We’ll keep your position aligned with reality.",
      },
      {
        q: "What is earnest money?",
        a: "A deposit showing good faith on an offer — handled per contract and local practice.",
      },
    ],
    realTalk: {
      headline: "Real talk",
      points: [
        "Open houses don’t come first — your file does. Skip the numbers and you’re shopping blind.",
        "“Perfect timing” is a myth. Rates move. Prices move. Readiness beats the calendar.",
        "Chasing the lowest rate is a trap. Total cost, flexibility, and how long you’ll hold the loan decide the real winner.",
        "Fast offers lose to clear ones. The buyers who win know exactly what they’re doing — and what they won’t do.",
      ],
    },
    contextualCta: {
      line: "Let’s map out what this actually looks like for you.",
      subline:
        "Your numbers, your options, and a clear next step — no pressure, no guesswork.",
      buttonLabel: "Start the conversation",
    },
  },
  numbers: {
    id: "numbers",
    label: "Understanding My Numbers",
    cardDescription:
      "Credit, DTI, usable income, and how lenders actually evaluate your profile — not guesswork.",
    heroIntro:
      "This is where most of the confusion lives — and where the smartest decisions are made. We break down how lenders evaluate your profile so you know what’s working, what’s holding you back, and what you can improve.",
    contextLines: [
      "This is where most of the confusion lives — and where the smartest decisions are made.",
      "We break down how lenders actually evaluate your profile so you understand what’s working for you, what’s holding you back, and what you can improve.",
    ],
    whatMattersMost: [
      "Building readiness is not guesswork — you can tie score, debt, and savings to a concrete price path. Tools that map improvement over time to real local medians help you see when specific neighborhoods move into range.",
      "Your credit score doesn’t just determine approval — it determines how expensive your loan becomes. Small differences in score can translate into thousands of dollars over time.",
      "Income isn’t what matters — usable income is. What lenders can actually count is often different from what you earn.",
      "One monthly payment can quietly reduce your buying power by tens of thousands. A single obligation can significantly change how much you qualify for.",
      "You’re often closer than you think — or further than you realize. Guessing your numbers leads to bad decisions. Clarity changes everything.",
    ],
    clarityCards: [
      {
        id: "n-c1",
        title: "What credit score do I need?",
        summary:
          "The minimum is often lower than people expect — but the real impact is on your terms.",
        learnMore:
          "Most Conventional loans start around 620, FHA can go as low as 580.\n\nBut what matters more is how your score affects your rate. A 740 vs 680 score can significantly change your interest rate — and over time, that difference can cost or save tens of thousands.",
      },
      {
        id: "n-c2",
        title: "What is debt-to-income (DTI)?",
        summary: "This is one of the most important numbers in your approval.",
        learnMore:
          "DTI measures how much of your monthly income goes toward debt.\n\nExample: If you earn $6,000/month and have $2,400 in debt → your DTI is 40%.\n\nMost programs allow around 43–50%, depending on the scenario. Lower DTI = stronger approval and better options.\n\nFor many buyers, removing a $300–$500 monthly debt can increase buying power by $30,000–$60,000 depending on income.",
      },
      {
        id: "n-c3",
        title: "How is my income evaluated?",
        summary: "What you earn and what lenders can use are not always the same.",
        learnMore:
          "W-2 income is usually straightforward. Self-employed income is based on tax returns after deductions. Bonuses and commissions often require a history.\n\nThis is why planning ahead matters — especially for self-employed borrowers.\n\nTo see Schedule C add-backs, bank statement cash flow, and a write-off vs. buying-power scenario modeled together, use Infinite Home Lending’s Self-Employed Mortgage Qualifier at infinitehomelending.com/tools/self-employed-qualifier.",
      },
      {
        id: "n-c4",
        title: "Can I still qualify with credit issues?",
        summary: "In many cases, yes — it depends on the full picture.",
        learnMore:
          "Late payments, collections, or even past bankruptcy do not automatically disqualify you.\n\nWhat matters most: time since the event, current payment behavior, and overall financial profile.\n\nThere is often a path forward — it just needs to be structured correctly.",
      },
    ],
    howItWorksSteps: [
      {
        id: "n-s1",
        title: "Review your credit profile",
        summary:
          "We look beyond the score at payment history, usage, and account structure — not just a three-digit number.",
        learnMore:
          "We go beyond the score and look at payment history, credit usage, and account structure. Sometimes small adjustments can improve your position quickly.",
      },
      {
        id: "n-s2",
        beforeTransition: "Now that we understand your credit…",
        title: "Calculate your DTI",
        summary:
          "We weigh your income against monthly obligations — this is where buying power is unlocked or constrained.",
        learnMore:
          "We analyze your income and monthly obligations to determine your borrowing capacity. This is where buying power is either unlocked or restricted.",
      },
      {
        id: "n-s3",
        beforeTransition: "Next, we look at what you actually earn…",
        title: "Analyze your income",
        summary: "Not all income is treated equally — documentation and history shape what counts.",
        learnMore:
          "Not all income is treated equally. We structure your income properly so it reflects your true qualifying strength.",
      },
      {
        id: "n-s4",
        title: "Identify opportunities to improve",
        summary: "Small, targeted moves can raise your ceiling — timing matters.",
        learnMore:
          "Examples include paying off specific debt, adjusting credit usage, or timing your application. Small moves can create meaningful improvements.",
      },
      {
        id: "n-s5",
        title: "Align numbers with your goals",
        summary: "Approval isn’t the finish line — fit with your life is.",
        learnMore:
          "Approval is not the goal — alignment is. We match your numbers to your comfort level and long-term plans.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "How do I know what I can afford as my finances improve?",
        a: "Start with income, debts, and score-based rates — then stress-test a timeline. Infinite Home Lending’s Homebuying Power Map at infinitehomelending.com/tools/homebuying-power-map projects buying power at 90 days, 6 months, and 12 months against median prices in MD-DC-VA markets so you can see when specific areas may move into range.",
      },
      {
        q: "Is now the right time to buy — for wealth, not just payment?",
        a: "The honest answer depends on how long you’ll hold, local market behavior, and whether you’d actually invest cash you’d put toward a home. For a transparent 30-year comparison of owning vs. renting that includes opportunity cost and rent inflation, use Infinite Home Lending’s Mortgage Wealth Tracker at infinitehomelending.com/tools/wealth-tracker — it’s built to show when each path wins under your inputs, not to claim buying always wins.",
      },
      {
        q: "What credit score do I need to buy a home?",
        a: "It depends on the loan program, but many options exist below what people expect. The bigger impact is how your score affects your rate and long-term cost. For an interactive estimate of lifetime interest by score tier, use Infinite Home Lending’s Credit Score ROI Calculator at infinitehomelending.com/tools/credit-score-roi.",
      },
      {
        q: "My credit isn’t great — should I wait?",
        a: "Not necessarily. The best first step is understanding where you stand before deciding.\n\nMany buyers are closer than they think.",
      },
      {
        q: "How does DTI affect my mortgage?",
        a: "DTI directly impacts how much you can qualify for. Lower DTI typically means more flexibility and better options.",
      },
      {
        q: "I’m self-employed — is it harder to qualify?",
        a: "It’s more complex, but very manageable with the right structure. Planning ahead makes a big difference.\n\nFor an educational model of tax return vs. bank statement qualifying income (including common add-backs), use Infinite Home Lending’s Self-Employed Mortgage Qualifier at infinitehomelending.com/tools/self-employed-qualifier.",
      },
      {
        q: "Can I use gift funds?",
        a: "Yes. Most loan programs allow gift funds with proper documentation.",
      },
      {
        q: "What counts as debt for my DTI?",
        a: "Generally, recurring monthly obligations on your credit report — car loans, student loans, credit cards, child support, and your new housing payment. Rules vary slightly by program.",
      },
      {
        q: "How long do I need to be at my job?",
        a: "Stability matters. Many programs look for a solid work history in the same line of work; job changes aren’t automatic disqualifiers if documented properly.",
      },
      {
        q: "Will rate shopping hurt my credit?",
        a: "Multiple mortgage inquiries in a short window are often treated as one inquiry for scoring purposes — your advisor can explain the window that applies to you.",
      },
    ],
    realTalk: {
      headline: "Real talk",
      points: [
        "Most people focus on the wrong number — they chase purchase price instead of understanding payment.",
        "Your approval limit is not your budget. Just because you’re approved for it doesn’t mean you should spend it.",
        "Small changes can create big results. Paying off one debt can significantly increase your buying power.",
        "Guessing your numbers is the fastest way to make a bad decision. Clarity changes everything.",
        "Most bad homebuying decisions don’t come from bad intentions — they come from not understanding the numbers.",
      ],
    },
    contextualCta: {
      ctaReassurance: "No commitment. Just clarity.",
      line: "Want to see what your numbers actually look like?",
      subline:
        "We’ll walk through your numbers, your options, and what actually makes sense — no pressure.",
      buttonLabel: "Talk to an advisor",
    },
  },
  "loan-options": {
    id: "loan-options",
    label: "Loan Options & Programs",
    cardDescription:
      "Structure first, rate second — the loan that fits your plan, not the ad.",
    heroIntro:
      "Most people think choosing a loan is about finding the lowest rate. It’s not. The structure of your loan — how it’s built, how long you keep it, and how it fits your plan — often matters more than the rate itself. We help you understand your options so you can choose the strategy that actually works for you.",
    contextLines: [
      "Most people think choosing a loan is about finding the lowest rate. It’s not.",
      "The structure of your loan — how it’s built, how long you keep it, and how it fits your plan — often matters more than the rate itself.",
      "We help you understand your options so you can choose the strategy that actually works for you.",
    ],
    whatMattersMost: [
      "The lowest rate is often not the cheapest loan.",
      "Match the loan to your exit timeline — not the other way around.",
      "Flexibility is an asset. A locked-in ‘deal’ can cost you if life moves.",
      "One quote isn’t a choice — it’s a default.",
    ],
    clarityCards: [
      {
        id: "lo-c1",
        title: "What’s the difference between loan types?",
        summary:
          "Not all loans are built the same — and the differences matter more than most people realize.",
        learnMore:
          "The most common options include:\n\n• Conventional loans — flexible, strong long-term option\n• FHA loans — lower down payment, more flexible credit\n• VA loans — no down payment for eligible buyers\n• USDA loans — 0% down in eligible areas\n\nThe right choice depends on your credit profile, down payment, and long-term plan.",
      },
      {
        id: "lo-c2",
        title: "What’s the difference between a 30-year and 15-year loan?",
        summary: "It’s not just about the payment — it’s about how you use the loan.",
        learnMore:
          "Rough example on a $400K loan: a 15-year might pay hundreds more per month than a 30 — but can save five figures in total interest over the life of the loan if you stay put.\n\nA 30-year frees cash flow for reserves, investing, or life — if you’ll actually use it that way.\n\nThe winner isn’t the smaller payment — it’s the structure that matches how long you’ll hold and how you handle cash.",
      },
      {
        id: "lo-c3",
        title: "What is an adjustable-rate mortgage (ARM)?",
        summary:
          "A loan that changes over time — but not always in the way people think.",
        learnMore:
          "ARMs usually start with a lower rate than fixed for a set period — often 5, 7, or 10 years.\n\nCounterintuitive: if you’re moving or refinancing inside that window, you may never pay the adjusted rate — you captured the cheaper years and left.\n\nExample mindset: a 7-year ARM with a 0.375% lower start than fixed can save thousands in the first 84 months on a typical balance. If your plan is shorter than the fixed period, the risk is often overstated — the mismatch is what hurts, not the ARM itself.",
      },
      {
        id: "lo-c4",
        title: "Should I focus only on the interest rate?",
        summary: "This is where most buyers make the wrong decision.",
        learnMore:
          "Rate is one line on the page — not the whole math.\n\nReal scenario: Loan A is 0.25% lower rate but $4K more in points. If you sell or refi before break-even (often years), the ‘lower rate’ lost money.\n\nWe weigh structure, upfront costs, and how long you’ll hold — so the loan that looks cheaper on the surface doesn’t quietly cost you more.",
      },
    ],
    howItWorksSteps: [
      {
        id: "lo-s1",
        title: "Understand your timeline",
        summary: "Your loan should match how long you plan to keep the home.",
        learnMore:
          "Short-term vs long-term ownership changes rate strategy, loan type, and cost structure — this step is non-negotiable.",
      },
      {
        id: "lo-s2",
        title: "Review your options",
        summary: "If you’re only shown one option, you’re not seeing the full picture.",
        learnMore:
          "We lay out multiple loan types and rate/structure combinations side by side — comparison is the process, not a bonus.",
      },
      {
        id: "lo-s3",
        title: "Compare total cost — not just payment",
        summary: "Monthly payment alone doesn’t tell the full story.",
        learnMore:
          "We stress-test total interest, upfront costs, and break-even — so ‘affordable monthly’ doesn’t hide expensive total cost.",
      },
      {
        id: "lo-s4",
        title: "Choose the structure that fits your plan",
        summary: "Pick the loan that fits your life — not the one that looks cheapest on the page.",
        learnMore:
          "The right structure lines up with your goals, timeline, and comfort — not the smallest number in the headline.",
      },
      {
        id: "lo-s5",
        title: "Lock and move forward with confidence",
        summary: "Once the strategy is clear, execution becomes simple.",
        learnMore:
          "You move forward knowing why you chose it, how it behaves over time, and what to expect at each step.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "How do I think about locking my rate vs. floating?",
        a: "Treat it as a risk-and-cost question, not a prediction. The Rate Lock Decision Engine at infinitehomelending.com/tools/rate-lock-engine shows hypothetical upside and downside in monthly and lifetime dollars, compares extension fees to a higher rate, and walks through float-down thresholds — so you can see the tradeoffs clearly before you choose.",
      },
      {
        q: "How do FHA and Conventional loans compare on total cost?",
        a: "The rate is only part of the story — mortgage insurance (PMI vs. MIP), how long you stay, and your credit tier change the winner. Our Smart Tools include a side-by-side calculator that shows cumulative cost, the MI crossover year, and an FHA-to-Conventional refinance at year 5.\n\nIf you’re self-employed, also see the Self-Employed Mortgage Qualifier at infinitehomelending.com/tools/self-employed-qualifier for how tax return and bank statement income compare to your numbers.",
      },
      {
        q: "What’s the best type of loan?",
        a: "There’s no single best loan — only the one that fits your situation and plan.",
      },
      {
        q: "Is a 15-year loan always better than a 30-year?",
        a: "Not necessarily. It depends on your goals, cash flow, and flexibility needs.",
      },
      {
        q: "Are adjustable-rate mortgages risky?",
        a: "Not inherently. When matched to the right timeline, they can be very effective.",
      },
      {
        q: "Should I always choose the lowest rate?",
        a: "No. Structure, flexibility, and long-term cost often matter more.",
      },
      {
        q: "How many options should I be shown?",
        a: "At least 2–3. Seeing one option limits your ability to make the right decision.",
      },
      {
        q: "What’s the difference between APR and interest rate?",
        a: "Rate is the cost of the loan; APR folds in certain costs to help compare offers — both matter, but structure still comes first.",
      },
      {
        q: "When do discount points make sense?",
        a: "When you’ll keep the loan past the break-even point — otherwise you may pay for a lower rate you never fully realize.",
      },
      {
        q: "Can I change loan programs after I lock?",
        a: "Sometimes, but it can affect pricing and timing. We’ll align any change with your strategy before you commit.",
      },
    ],
    realTalk: {
      headline: "Real talk",
      points: [
        "Most buyers don’t choose a loan — they accept the one they’re given.",
        "Wrong loan, wrong reason: usually not bad intent — only one option on the table.",
        "The lowest rate sells itself. The right structure takes explanation — that’s the difference.",
        "The best loan fits your life, timeline, and plan. Most people never see that comparison.",
      ],
    },
    contextualCta: {
      line: "Let’s map out the loan structures that actually work for you.",
      subline:
        "Side-by-side trade-offs, plain-English outcomes, and a clear path forward — no pressure, no guesswork.",
      buttonLabel: "Explore your options",
    },
  },
  "refinance-equity": {
    id: "refinance-equity",
    label: "Refinancing & Equity",
    cardDescription:
      "When refinancing makes sense, when it doesn’t, and how to think about equity strategically.",
    heroIntro:
      "Refinancing isn’t just about getting a lower rate — it’s about improving your position. We help you understand when it makes sense, when it doesn’t, and what to consider before making a move.",
    contextLines: [
      "Refinancing isn’t just about getting a lower rate.",
      "It’s about improving your position — whether that means lowering your payment, accessing equity, or restructuring your loan to better fit your goals.",
      "We help you understand when it makes sense, when it doesn’t, and what to consider before making a move.",
    ],
    whatMattersMost: [
      "A lower rate doesn’t automatically mean a better loan.",
      "The right timing follows your goals and horizon — not a rate headline.",
      "Equity is leverage: powerful when planned, costly when casual.",
      "Sometimes the best refinance is no refinance.",
    ],
    clarityCards: [
      {
        id: "r-c1",
        title: "When does refinancing actually make sense?",
        summary: "A better headline isn’t the same as a better outcome.",
        learnMore:
          "Refinancing typically makes sense when you lower your monthly payment meaningfully, reduce total long-term cost, or improve loan structure.\n\nIf the benefit is small — or takes too long to recover — it may not be worth it.",
      },
      {
        id: "r-c2",
        title: "What is a break-even point?",
        summary: "The number that turns a “deal” into real savings — or an expensive mistake.",
        learnMore:
          "Your break-even point is how long it takes to recover the cost of refinancing.\n\nExample: If closing costs are $6,000 and you save $200/month, break-even is 30 months.\n\nIf you refinance and move before your break-even point, you lose money — even with a lower rate.\n\nIf you don’t plan to stay past break-even, refinancing may not make sense.",
      },
      {
        id: "r-c3",
        title: "What is a cash-out refinance?",
        summary: "Cash in hand today — a larger loan tomorrow.",
        learnMore:
          "A cash-out refinance lets you access equity as cash and replace your current loan with a larger one.\n\nCommon uses include debt consolidation, home improvements, and major expenses.\n\nYou’re increasing your loan balance — so it needs to be strategic.",
      },
      {
        id: "r-c4",
        title: "What is a HELOC vs refinance?",
        summary: "Same equity — two different bets on structure and risk.",
        learnMore:
          "Refinance replaces your current loan with new rate and terms.\n\nA HELOC is a second loan on top of your mortgage — flexible access to funds, often with a variable rate.\n\nThe right option depends on how much you need, how you plan to use it, and your risk tolerance.",
      },
    ],
    howItWorksSteps: [
      {
        id: "r-s1",
        title: "Understand your current position",
        summary: "Before making a move, you need to know where you stand.",
        learnMore:
          "We review your current rate, loan balance, monthly payment, and equity position.",
      },
      {
        id: "r-s2",
        title: "Define your goal",
        summary: "Refinancing without a clear goal leads to poor decisions.",
        learnMore:
          "Common goals include lowering your payment, reducing total cost, accessing equity, or changing loan structure.",
      },
      {
        id: "r-s3",
        title: "Evaluate scenarios",
        summary: "You should see multiple options — not just one.",
        learnMore:
          "We compare new loan terms, cost vs savings, and break-even timelines.",
      },
      {
        id: "r-s4",
        title: "Determine if it’s worth it",
        summary: "This is where most people make the wrong decision — rate looks good, math doesn’t close.",
        learnMore:
          "This step is where enthusiasm beats arithmetic: a shiny rate can hide fees, reset amortization, or a break-even you’ll never reach.\n\nIf the benefit is minimal or short-lived, it may not justify the cost.\n\nSometimes the best decision is no decision.",
      },
      {
        id: "r-s5",
        title: "Move forward with clarity",
        summary: "If it makes sense, execution is straightforward.",
        learnMore:
          "You move forward knowing why you’re doing it, what it saves or changes, and how it fits your plan.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "How much does it cost to refinance?",
        a: "Typically 2–5% of the loan amount, depending on structure and fees.",
      },
      {
        q: "How much does my rate need to drop to refinance?",
        a: "There’s no fixed rule — it depends on your break-even and goals.",
      },
      {
        q: "Can I access cash from my home?",
        a: "Yes, through a cash-out refinance or HELOC, depending on your situation.",
      },
      {
        q: "What is a break-even point?",
        a: "The time it takes to recover the cost of refinancing through savings.",
      },
      {
        q: "Is refinancing always a good idea?",
        a: "No. It only makes sense if it improves your position.",
      },
      {
        q: "How long until I break even on a refinance?",
        a: "Divide closing costs by monthly savings to get months to recover — we’ll walk through your numbers in plain terms.",
      },
      {
        q: "Will refinancing reset my amortization?",
        a: "Often yes on a new loan — that trade-off is part of what we explain before you decide.",
      },
      {
        q: "HELOC vs cash-out refinance — which is better?",
        a: "It depends on how much you need, how you’ll use funds, and whether you want a fixed structure or flexible draws — we compare both paths to your goal.",
      },
    ],
    realTalk: {
      headline: "Real talk",
      points: [
        "A lower rate is easy to sell — because it’s easy to understand.",
        "Refinancing is one of the most over-marketed parts of the mortgage industry — and the pitch stays simple on purpose.",
        "But a lower rate doesn’t always mean a better outcome: most people refi without mapping cost, timeline, or long-term impact.",
        "Sometimes the smartest move is doing nothing.",
      ],
    },
    contextualCta: {
      line: "Let’s break down whether refinancing actually improves your position.",
      subline:
        "We’ll walk through your current loan, your options, and what the numbers really say — so you can decide calmly, with the full picture.",
      buttonLabel: "Review your options",
    },
  },
  "quick-answers": {
    id: "quick-answers",
    label: "Quick Answers",
    cardDescription: "Direct answers to common questions — scan fast, expand when you want more.",
    heroIntro:
      "Not every question needs a long explanation. Clear answers here so you can move forward without getting stuck.",
    contextLines: [
      "Not every question needs a long explanation.",
      "Here are clear, direct answers to the things most people ask — so you can move forward without getting stuck.",
    ],
    whatMattersMost: [
      "Most questions have simple answers — if explained clearly. Confusion usually comes from how things are presented, not the topic itself.",
      "You don’t need to know everything to move forward — you need clarity on what matters right now.",
      "Getting unstuck beats getting perfect — progress comes from clarity, not overthinking.",
    ],
    claritySectionTitle: "Quick answers",
    clarityCards: [
      {
        id: "qa-c1",
        title: "What credit score do I need to buy a home?",
        summary:
          "Many programs work with scores in the 580–620 range. Higher scores usually mean better pricing — but the right loan type matters just as much.",
        learnMore:
          "Lenders aren’t judging your worth; they’re measuring risk. A stronger score usually means a lower rate and a smoother path — but the right program still matters as much as the number on the page.\n\nThink of score as one lever: income, savings, and how much you’re borrowing all shape the full picture.",
      },
      {
        id: "qa-c2",
        title: "How much do I need for a down payment?",
        summary:
          "Often 3–5% conventional, 3.5% FHA, 0% VA/USDA when you qualify. You rarely need 20% down to buy.",
        learnMore:
          "Less down can mean a higher monthly payment or mortgage insurance — that’s the trade-off, not a trap. The goal is matching your cash today with the payment you can live with tomorrow.\n\nConventional often starts around 3–5% down, FHA at 3.5%, and VA/USDA can be 0% for eligible buyers. Your loan officer maps which path fits your file.",
      },
      {
        id: "qa-c3",
        title: "What are closing costs?",
        summary:
          "Expect roughly 2–5% of the price — separate from your down payment. It’s the cost of finishing the loan and transferring the home.",
        learnMore:
          "These aren’t mystery fees in a single bucket: lender costs, title, recording, and setting up taxes and insurance are common pieces.\n\nKnowing the range early helps you budget so the finish line doesn’t feel like a surprise.",
      },
      {
        id: "qa-c4",
        title: "What is pre-approval?",
        summary:
          "A documented look at your credit, income, and assets — so you know what you can borrow before you fall in love with a house.",
        learnMore:
          "It beats a quick guess because sellers (and you) get a realistic number, not a vibe.\n\nPre-qualification is lighter; pre-approval is stronger because paperwork is already in motion. In a competitive offer situation, that difference can matter.",
      },
      {
        id: "qa-c5",
        title: "How long does the process take?",
        summary:
          "After you’re under contract, many purchases close in about 21–30 days — timing depends on appraisal, underwriting, and how complete the file is.",
        learnMore:
          "The clock really starts once you’re in contract: appraisal and underwriting need time to line up.\n\nGetting pre-approved upfront shortens the emotional runway — you’re not learning your budget the same week you’re negotiating.",
      },
      {
        id: "qa-c6",
        title: "Can I buy with debt?",
        summary:
          "Yes. Car loans, student loans, and cards are normal. What counts is whether your income can comfortably cover your debts plus the new house payment.",
        learnMore:
          "Underwriters look at debt-to-income — basically monthly obligations vs. gross income — not a moral scorecard.\n\nPaying debt down can help, but you don’t need a perfectly empty slate to qualify. The question is balance, not zero.",
      },
      {
        id: "qa-c7",
        title: "Should I wait for rates to drop?",
        summary:
          "Nobody rings a bell when rates hit the bottom. Waiting only wins if the savings outweigh what you give up while you wait — rent, prices, or timing.",
        learnMore:
          "Rates are one input; your life is the bigger one. A slightly higher rate on the right home can still beat waiting years for a “perfect” number that may never arrive.\n\nThe useful question isn’t “timing the market” — it’s whether buying fits your budget and plans today.",
      },
      {
        id: "qa-c8",
        title: "What happens after I go under contract?",
        summary:
          "Your loan goes through appraisal, then underwriting, then a final approval — then you sign and fund. Same order most of the time.",
        learnMore:
          "Appraisal checks value for the lender; underwriting checks that your file meets the rules; closing is when documents and funds line up.\n\nYou’ll upload a few things, answer a few questions, and we’ll flag anything early so closing day feels calm, not chaotic.",
      },
    ],
    afterClarityBridge: {
      headline: "Still have a question?",
      body: "Some situations need more than a quick answer — and that’s where we help.",
    },
    howItWorksIntro:
      "These answers are designed to give you clarity quickly — but the real value comes from understanding how they apply to your situation.\n\nEach answer highlights one piece of the bigger picture. The goal isn’t to learn everything at once — it’s to get clear on what matters right now.",
    howItWorksSteps: [
      {
        id: "qa-s1",
        title: "Focus on the question behind your question",
        summary:
          "What you type into search isn’t always what you’re actually worried about.",
        learnMore:
          "Most people don’t just have a question — they have a concern behind it.\n\nFor example:\n- “How much do I need?” often means → Can I actually afford this?\n- “What credit score do I need?” often means → Am I ready yet?\n\nStart there.\nThat’s what helps you move forward.",
      },
      {
        id: "qa-s2",
        title: "Use answers to eliminate uncertainty — not add more",
        summary:
          "You don’t need to solve the whole picture at once — remove one unknown at a time.",
        learnMore:
          "Once you understand what you’re really asking…\n\nYou don’t need to figure everything out at once.\n\nTrying to understand every detail can actually slow you down.\n\nInstead:\n→ use these answers to eliminate one uncertainty at a time\n\nThat’s how clarity builds.",
      },
      {
        id: "qa-s3",
        title: "The same answer means different things depending on you",
        summary:
          "A fact on a page isn’t the same as that fact in your life.",
        learnMore:
          "Now that you’re filtering the noise…\n\nAn answer by itself is helpful — but your situation determines its impact.\n\nFor example:\n- Yes, you can qualify with a certain credit score\n- But improving it might change your payment, options, or flexibility\n\nSo the real question becomes:\nHow does this apply to me?",
      },
      {
        id: "qa-s4",
        title: "If something feels unclear, that’s useful",
        summary:
          "Confusion usually means you’re at a decision point — not that you’re behind.",
        learnMore:
          "At this point, some uncertainty is normal…\n\nConfusion isn’t a setback — it’s a signal.\n\nMost people feel unsure at this stage — you’re not behind.\n\nIt usually means:\n→ there’s a decision that needs more context\n\nAnd that’s completely normal.\n\nThis process isn’t about having perfect answers —\nit’s about getting clear enough to move forward with confidence.",
      },
      {
        id: "qa-s5",
        title: "This is your starting point — not your final step",
        summary:
          "Use this section to get unstuck — then plug in your real numbers and goals.",
        learnMore:
          "These answers are here to help you get unstuck.\n\nFrom here, the next step is simple:\n→ connect this clarity to your actual numbers and goals\n\nThat’s where everything starts to come together.",
      },
    ],
    faqAll: [],
    realTalk: {
      headline: "Straight talk",
      points: [
        "If an answer avoids your numbers, it’s avoiding your situation.",
        "Fast answers remove friction — they don’t replace underwriting.",
        "The right next question beats a perfect answer to the wrong one.",
      ],
    },
    contextualCta: {
      line: "Let’s get you clear on what matters for your situation.",
      subline:
        "We’ll answer your questions, walk through your options, and help you move forward with confidence.",
      buttonLabel: "Get your answers",
    },
  },
};

export const KNOWLEDGE_ROUTE_ORDER: KnowledgeRouteId[] = [
  "start-here",
  "buying",
  "numbers",
  "loan-options",
  "refinance-equity",
  "quick-answers",
];

export type FeaturedMisunderstanding = {
  id: string;
  title: string;
  summary: string;
};

export const FEATURED_MISUNDERSTANDINGS: FeaturedMisunderstanding[] = [
  {
    id: "fm-1",
    title: "The lowest rate wins",
    summary: "Structure, timeline, and closing costs often matter more than a fraction on the rate line.",
  },
  {
    id: "fm-2",
    title: "Pre-approval is optional decoration",
    summary: "In competitive markets, documented pre-approval signals seriousness — to you and to sellers.",
  },
  {
    id: "fm-3",
    title: "Refinance = automatic savings",
    summary: "Break-even and goals decide whether a refi improves your life — not the headline alone.",
  },
  {
    id: "fm-4",
    title: "Credit apps tell the whole story",
    summary: "Underwriting uses documented history — we align expectations before surprises.",
  },
];

export type SearchHit = {
  id: string;
  kind: "route" | "article" | "faq";
  routeId: KnowledgeRouteId;
  title: string;
  subtitle?: string;
};

export function getKnowledgeRoutes(lang?: string): Record<KnowledgeRouteId, KnowledgeRoute> {
  return lang === "es"
    ? (KNOWLEDGE_ROUTES_ES as Record<KnowledgeRouteId, KnowledgeRoute>)
    : KNOWLEDGE_ROUTES;
}

export function getFeaturedMisunderstandings(lang?: string) {
  return lang === "es" ? FEATURED_MISUNDERSTANDINGS_ES : FEATURED_MISUNDERSTANDINGS;
}

export function searchKnowledgeCenter(query: string, limit = 8, lang?: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const hits: SearchHit[] = [];
  const routes = getKnowledgeRoutes(lang);

  for (const rid of KNOWLEDGE_ROUTE_ORDER) {
    const r = routes[rid];
    const hay = joinSearch(r).toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        id: `route-${rid}`,
        kind: "route",
        routeId: rid,
        title: r.label,
        subtitle: r.cardDescription,
      });
    }
    for (const c of r.clarityCards) {
      if (`${c.title} ${c.summary} ${c.learnMore}`.toLowerCase().includes(q)) {
        hits.push({
          id: `clarity-${rid}-${c.id}`,
          kind: "article",
          routeId: rid,
          title: c.title,
          subtitle: c.summary,
        });
      }
    }
    for (const s of r.howItWorksSteps) {
      if (`${s.title} ${s.summary} ${s.learnMore}`.toLowerCase().includes(q)) {
        hits.push({
          id: `step-${rid}-${s.id}`,
          kind: "article",
          routeId: rid,
          title: s.title,
          subtitle: s.summary,
        });
      }
    }
    for (const it of r.faqAll) {
      if (`${it.q} ${it.a}`.toLowerCase().includes(q)) {
        hits.push({
          id: `faq-${rid}-${it.q.slice(0, 28)}`,
          kind: "faq",
          routeId: rid,
          title: it.q,
        });
      }
    }
  }

  const seen = new Set<string>();
  const unique: SearchHit[] = [];
  for (const h of hits) {
    if (seen.has(h.id)) continue;
    seen.add(h.id);
    unique.push(h);
    if (unique.length >= limit) break;
  }
  return unique;
}
