import { useState, Fragment } from "react";
import { DealDeskHeader } from "../DealDeskHeader";
import { ChevronDown, ChevronUp, BookOpen, Phone } from "lucide-react";

type BuyerSignal = {
  isVeteran: boolean;
  isFirstTime: boolean;
  hasLimitedSavings: boolean;
  isSelfEmployed: boolean;
  isRural: boolean;
  hasCreditChallenges: boolean;
  isHighIncome: boolean;
  wantsLowDown: boolean;
};

type ProgramOverview = {
  name: string;
  emoji: string;
  tagline: string;
  bestFor: string;
  whatMakesItDifferent: string;
  questionsToAskIHL: string[];
  whatToTellYourClient: string;
  highlighted: boolean;
};

const ALL_PROGRAMS: ProgramOverview[] = [
  {
    name: "VA Loan",
    emoji: "🎖️",
    tagline: "The most powerful loan available — exclusively for veterans and active military.",
    bestFor: "Veterans, active military, and eligible surviving spouses.",
    whatMakesItDifferent: "Backed by the Department of Veterans Affairs. One of the most competitive loan products on the market — and most veterans don't fully understand what they have access to. No private mortgage insurance required in most cases.",
    questionsToAskIHL: [
      "Does my buyer's service history make them eligible for VA?",
      "Do they have a disability rating that might affect their costs?",
      "What does the VA appraisal process look like for the property we're targeting?",
      "How does VA work in a competitive offer situation?",
    ],
    whatToTellYourClient: "\"As a veteran, you may have access to a loan program with significant advantages that most buyers don't have. Before we talk about anything else, let's make sure you're using every benefit you've earned. I want IHL to walk you through exactly what you qualify for.\"",
    highlighted: false,
  },
  {
    name: "FHA Loan",
    emoji: "🏠",
    tagline: "The most accessible path to homeownership for buyers building toward their goals.",
    bestFor: "Buyers who are earlier in their financial journey — building credit, saving, or recovering from past challenges.",
    whatMakesItDifferent: "Insured by the Federal Housing Administration. Designed to make homeownership accessible to a wider range of buyers. More flexible underwriting than conventional in many scenarios. Gift funds from family members are generally permitted toward the down payment.",
    questionsToAskIHL: [
      "Is FHA the right fit for my buyer's current profile?",
      "How does FHA work with gift funds from family?",
      "What should my buyer know about mortgage insurance on an FHA loan?",
      "Are there property condition requirements I should be aware of?",
      "How does FHA compare to Conventional for this specific buyer?",
    ],
    whatToTellYourClient: "\"There's a loan program specifically designed to make homeownership more accessible — it tends to have more flexible requirements than conventional loans, and family members can often help with the down payment. I want IHL to look at your full picture and tell you if this is the right path.\"",
    highlighted: false,
  },
  {
    name: "Conventional Loan",
    emoji: "📋",
    tagline: "The standard for buyers with strong financial profiles — and the most flexible long-term.",
    bestFor: "Buyers with well-established credit and solid savings who want the most options and lowest long-term cost.",
    whatMakesItDifferent: "Follows guidelines set by Fannie Mae and Freddie Mac. Private mortgage insurance (if required) can be removed once sufficient equity is built. Wide range of term and structure options. Generally the most competitive product for buyers with strong profiles.",
    questionsToAskIHL: [
      "Is my buyer's profile well-suited for Conventional?",
      "How does Conventional compare to FHA for this buyer's total monthly picture?",
      "What first-time buyer programs exist within Conventional?",
      "How does the down payment amount affect the overall cost picture?",
    ],
    whatToTellYourClient: "\"The most common loan type is called a conventional loan — it's not government-backed, which means it can offer more flexibility and lower long-term costs for buyers with strong financial profiles. IHL will tell us quickly whether this is the right fit or if another program makes more sense.\"",
    highlighted: false,
  },
  {
    name: "USDA Loan",
    emoji: "🌾",
    tagline: "A zero-down option that works in far more areas than most agents realize.",
    bestFor: "Buyers purchasing in eligible rural and suburban areas. Ask your IHL advisor about qualifying locations.",
    whatMakesItDifferent: "Backed by the U.S. Department of Agriculture. Designed to encourage homeownership outside of major urban centers. Many agents overlook this program entirely because they assume only farmland qualifies — that's often not accurate.",
    questionsToAskIHL: [
      "Does the area my buyer is targeting qualify for USDA?",
      "What income and household factors are considered for this program?",
      "How does the USDA process compare to FHA or Conventional in terms of timeline?",
      "What property types work with USDA?",
    ],
    whatToTellYourClient: "\"There's a government-backed program for homes in certain areas that many people don't know about — and a lot of suburban communities qualify that most people don't expect. Let me have IHL check whether the area you're looking in is eligible before we rule it out.\"",
    highlighted: false,
  },
  {
    name: "Non-QM / Alternative Documentation",
    emoji: "💼",
    tagline: "A path forward for buyers whose income doesn't fit neatly on a tax return.",
    bestFor: "Self-employed buyers, business owners, freelancers, investors, and others whose income is real but doesn't show up cleanly in traditional documentation.",
    whatMakesItDifferent: "Non-QM stands for Non-Qualified Mortgage — portfolio products that allow lenders to use alternative ways to verify income and financial strength. This is not a last resort — it's the right tool for buyers whose financial lives are more complex than a W-2.",
    questionsToAskIHL: [
      "My buyer is self-employed — what documentation approaches are available?",
      "What does a bank statement approach look like and is my buyer a good candidate?",
      "What should my buyer understand about rates and terms with Non-QM vs conventional?",
      "What's the realistic timeline and process for this type of approval?",
    ],
    whatToTellYourClient: "\"Being self-employed doesn't mean you can't buy a home — it just means we need the right lender who knows how to work with your type of income. There are programs designed specifically for people in your situation. I want IHL to look at your full picture because the right program makes all the difference.\"",
    highlighted: false,
  },
  {
    name: "Jumbo Loan",
    emoji: "🏛️",
    tagline: "For purchases above conventional loan limits — with portfolio flexibility.",
    bestFor: "Buyers purchasing higher-priced properties that exceed the area's conforming loan limit.",
    whatMakesItDifferent: "Jumbo loans aren't backed by Fannie Mae or Freddie Mac — they're held in the lender's portfolio. In high-cost markets like the DC metro area, jumbo loans are more common than many buyers realize. Getting IHL involved early is especially important for these buyers.",
    questionsToAskIHL: [
      "At what loan amount does a jumbo loan apply in this specific market?",
      "What does the jumbo underwriting process look like compared to conventional?",
      "How early in the process should jumbo buyers be pre-approved?",
      "What reserve and documentation requirements should my buyer prepare for?",
    ],
    whatToTellYourClient: "\"For homes at this price point, we're likely looking at what's called a jumbo loan — it works differently than a standard mortgage and has its own approval process. IHL works with these regularly in this market. I want to get them involved early so you're as competitive as possible.\"",
    highlighted: false,
  },
  {
    name: "Down Payment Assistance Programs",
    emoji: "🤝",
    tagline: "Washington, DC & Maryland have active programs that most buyers don't know exist.",
    bestFor: "First-time buyers, moderate-income buyers, and buyers in specific professions or geographic areas — eligibility varies by program.",
    whatMakesItDifferent: "DPA programs are offered by state and local housing agencies to reduce the barrier of the down payment and closing costs. MD, DC, and VA each have multiple active programs. IHL stays current on all active programs and can quickly determine eligibility.",
    questionsToAskIHL: [
      "What DPA programs are currently active in Washington, DC & Maryland?",
      "Does my buyer's situation make them a candidate for any programs?",
      "How does DPA affect the offer — do sellers see it differently?",
      "Can DPA be combined with other loan types?",
      "What's the timeline impact of using a DPA program?",
    ],
    whatToTellYourClient: "\"Washington, DC & Maryland have programs that help buyers with down payment and closing costs — and most people have no idea they exist or that they might qualify. I want IHL to check your eligibility before we assume you need to come up with the full amount yourself.\"",
    highlighted: false,
  },
  {
    name: "Assumable Mortgage",
    emoji: "🔑",
    tagline: "A hidden advantage on select listings — the buyer takes over the seller's existing loan.",
    bestFor: "Buyers purchasing a property where the seller has a government-backed loan with favorable terms.",
    whatMakesItDifferent: "With an assumable mortgage, the buyer takes over the seller's existing loan — including its rate and terms. In a higher-rate environment, this can translate to a meaningfully lower monthly payment. Most agents don't know how to identify or structure these opportunities.",
    questionsToAskIHL: [
      "Is the loan on this property assumable?",
      "What's the process and realistic timeline for a loan assumption?",
      "What does my buyer need to go through to assume this loan?",
      "How does the assumption work if there's equity in the property?",
    ],
    whatToTellYourClient: "\"This property may have something called an assumable mortgage — meaning you could potentially take over the seller's existing loan at their original rate instead of getting a new one at today's rates. That could mean a meaningfully lower monthly payment. I want IHL to look at this before we write the offer.\"",
    highlighted: false,
  },
];

function getHighlightedPrograms(signals: BuyerSignal): ProgramOverview[] {
  return ALL_PROGRAMS.map((p) => {
    let highlighted = false;
    if (p.name === "VA Loan" && signals.isVeteran) highlighted = true;
    if (p.name === "USDA Loan" && signals.isRural) highlighted = true;
    if (p.name === "FHA Loan" && (signals.hasCreditChallenges || signals.hasLimitedSavings || signals.isFirstTime)) highlighted = true;
    if (p.name === "Conventional Loan" && signals.isHighIncome && !signals.hasCreditChallenges) highlighted = true;
    if (p.name === "Non-QM / Alternative Documentation" && signals.isSelfEmployed) highlighted = true;
    if (p.name === "Down Payment Assistance Programs" && (signals.isFirstTime || signals.hasLimitedSavings)) highlighted = true;
    if (p.name === "Jumbo Loan" && signals.isHighIncome) highlighted = true;
    if (p.name === "Assumable Mortgage" && signals.wantsLowDown) highlighted = true;
    return { ...p, highlighted };
  }).sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));
}

function SignalToggle({ label, emoji, sub, checked, onChange }: { label: string; emoji: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`w-full rounded-xl border p-4 text-left transition-all ${checked ? "border-[#0B2A4A] bg-[#0B2A4A]/5 ring-1 ring-[#0B2A4A]/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0" role="img" aria-label={label}>{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className={`font-sans text-[13px] font-semibold ${checked ? "text-[#0B2A4A]" : "text-slate-700"}`}>{label}</div>
          <div className="font-sans text-[11px] text-slate-400 mt-0.5">{sub}</div>
        </div>
        <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-all flex items-center justify-center ${checked ? "border-[#0B2A4A] bg-[#0B2A4A]" : "border-slate-300"}`}>
          {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}

function ProgramCard({ program }: { program: ProgramOverview }) {
  const [expanded, setExpanded] = useState(program.highlighted);
  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${program.highlighted ? "border-[#C6A15B]/40 shadow-md ring-1 ring-[#C6A15B]/15" : "border-slate-200/80 shadow-sm"} bg-white`}>
      <button type="button" onClick={() => setExpanded(!expanded)} className="w-full px-5 py-4 text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0 mt-0.5">{program.emoji}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-[Georgia,serif] text-[1rem] font-medium text-[#0B2A4A]">{program.name}</span>
                {program.highlighted && <span className="rounded-full bg-[#C6A15B]/15 px-2.5 py-0.5 font-sans text-[10px] font-bold text-[#854F0B]">Worth Exploring</span>}
              </div>
              <p className="mt-1 font-sans text-[12px] text-slate-500">{program.tagline}</p>
            </div>
          </div>
          <div className="shrink-0 text-slate-400 mt-1">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-5">
          <div>
            <div className="mb-1.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/50">Best For</div>
            <p className="font-sans text-[13px] leading-relaxed text-slate-700">{program.bestFor}</p>
          </div>
          <div>
            <div className="mb-1.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/50">What Makes It Different</div>
            <p className="font-sans text-[13px] leading-relaxed text-slate-700">{program.whatMakesItDifferent}</p>
          </div>
          <div className="rounded-lg bg-[#0B2A4A]/5 border border-[#0B2A4A]/10 px-4 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#0B2A4A]/60" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/60">Questions to Ask IHL</span>
            </div>
            <ul className="space-y-2">
              {program.questionsToAskIHL.map((q, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-sans text-[12px] text-[#0B2A4A]/40 shrink-0 mt-0.5">→</span>
                  <span className="font-sans text-[13px] leading-relaxed text-[#0B2A4A]">{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-[#C6A15B]/10 border border-[#C6A15B]/25 px-4 py-4">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-[#854F0B]" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#854F0B]">What to Tell Your Client</span>
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-[#5c3a0a] italic">{program.whatToTellYourClient}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function LoanMatchmakerCalculator() {
  const [signals, setSignals] = useState<BuyerSignal>({ isVeteran: false, isFirstTime: false, hasLimitedSavings: false, isSelfEmployed: false, isRural: false, hasCreditChallenges: false, isHighIncome: false, wantsLowDown: false });
  const [hasFiltered, setHasFiltered] = useState(false);
  const update = <K extends keyof BuyerSignal>(key: K, value: boolean) => setSignals((prev) => ({ ...prev, [key]: value }));
  const programs = hasFiltered ? getHighlightedPrograms(signals) : ALL_PROGRAMS;
  const highlighted = programs.filter((p) => p.highlighted);

  const SIGNALS = [
    { key: "isVeteran" as const, label: "Veteran or Active Military", emoji: "🎖️", sub: "May have access to VA loan benefits" },
    { key: "isFirstTime" as const, label: "First-Time Homebuyer", emoji: "🏠", sub: "May unlock state and local assistance programs" },
    { key: "hasLimitedSavings" as const, label: "Limited Savings for Down Payment", emoji: "💰", sub: "Exploring low or zero down payment options" },
    { key: "isSelfEmployed" as const, label: "Self-Employed or 1099", emoji: "💼", sub: "Income may not fit traditional documentation" },
    { key: "isRural" as const, label: "Looking in Suburban or Rural Areas", emoji: "🌾", sub: "Geographic programs may apply" },
    { key: "hasCreditChallenges" as const, label: "Building or Rebuilding Credit", emoji: "📈", sub: "Credit history may be limited or has past challenges" },
    { key: "isHighIncome" as const, label: "High Income / Strong Financial Profile", emoji: "⭐", sub: "Looking for most competitive long-term product" },
    { key: "wantsLowDown" as const, label: "Wants to Minimize Cash to Close", emoji: "🎯", sub: "Preserving cash for reserves or other goals" },
  ];

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <DealDeskHeader toolTitle="Loan Program Matchmaker" />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="border-b border-slate-200/90 pb-8">
          <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Loan Program Matchmaker</h1>
          <p className="mt-1 font-sans text-[12px] font-medium text-slate-500">Understand the landscape — know which programs to explore and what questions to ask IHL</p>
          <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">This tool helps you understand what mortgage programs exist and what they are designed for — so you can have smarter conversations with your clients and ask IHL the right questions. Program eligibility and specifics are always determined by IHL based on the buyer's full picture.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-sans text-[11px] font-semibold text-blue-800">Educational resource only — IHL determines actual eligibility and fit</span>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="mb-1 font-[Georgia,serif] text-[1rem] font-medium text-[#0B2A4A]">Tell me about your buyer</h2>
              <p className="mb-4 font-sans text-[12px] text-slate-500">Select any that apply — programs worth exploring will be highlighted</p>
              <div className="space-y-2">
                {SIGNALS.map((s) => (
                  <Fragment key={s.key}>
                    <SignalToggle label={s.label} emoji={s.emoji} sub={s.sub} checked={signals[s.key]} onChange={(v) => update(s.key, v)} />
                  </Fragment>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setHasFiltered(true)} className="w-full rounded-xl bg-[#0B2A4A] px-6 py-4 font-sans text-[14px] font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#0d3460] hover:shadow-lg">Show Programs →</button>
            {hasFiltered && <button type="button" onClick={() => setHasFiltered(false)} className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 font-sans text-[13px] text-slate-500 hover:border-slate-300 transition-all">Browse All Programs</button>}
          </div>
          <div className="space-y-4">
            {!hasFiltered ? (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0B2A4A]/15 bg-gradient-to-br from-[#0B2A4A]/5 via-white to-[#C6A15B]/5 p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0B2A4A] shadow-lg shadow-[#0B2A4A]/20">
                  <span className="text-4xl">🎯</span>
                </div>

                <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A15B]">
                  Know Before You Show
                </div>

                <h2 className="mb-4 font-[Georgia,serif] text-[1.5rem] font-medium leading-snug text-[#0B2A4A]">
                  Find the right loan program<br />before the first showing.
                </h2>

                <p className="mb-6 max-w-sm font-sans text-[13px] leading-relaxed text-slate-600">
                  Tell us about your buyer and instantly see which programs are worth exploring — with plain-English explanations, questions to ask IHL, and exactly what to tell your client.
                </p>

                <div className="mb-8 w-full max-w-sm space-y-2.5">
                  {[
                    { emoji: "🎖️", text: "VA, FHA, Conventional, USDA, Non-QM & more" },
                    { emoji: "💡", text: "What makes each program different" },
                    { emoji: "📞", text: "Questions to ask IHL for your buyer" },
                    { emoji: "💬", text: "What to tell your client — word for word" },
                    { emoji: "🤝", text: "MD, DC & VA programs to stack" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 rounded-lg bg-white/80 border border-slate-200/60 px-4 py-2.5 shadow-sm">
                      <span className="text-base shrink-0">{item.emoji}</span>
                      <span className="font-sans text-[13px] font-medium text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#0B2A4A] px-5 py-2.5 shadow-md">
                  <span className="text-sm">🎯</span>
                  <span className="font-sans text-[12px] font-bold text-[#C6A15B]">Select your buyer's signals on the left to get started</span>
                </div>

                <p className="mt-4 font-sans text-[11px] text-slate-400">
                  8 programs covered · Educational only · Always drives to IHL
                </p>
              </div>
            ) : (
              <>
                {highlighted.length > 0 && (
                  <div className="rounded-xl border border-[#C6A15B]/30 bg-amber-50/50 p-4">
                    <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#854F0B] mb-1">{highlighted.length} Program{highlighted.length !== 1 ? "s" : ""} Worth Exploring</div>
                    <p className="font-sans text-[13px] text-amber-900">Based on the signals you selected — call IHL to determine actual fit and eligibility for your buyer's specific situation.</p>
                  </div>
                )}
                {programs.map((program) => (
                  <Fragment key={program.name}>
                    <ProgramCard program={program} />
                  </Fragment>
                ))}
                <div className="rounded-xl border border-[#C6A15B]/30 bg-[#0B2A4A] p-5 text-white">
                  <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#C6A15B] mb-2">📞 Ready to Find the Right Fit?</div>
                  <p className="font-sans text-[13px] leading-relaxed text-white/85 mb-3">This library helps you understand the landscape. IHL determines the actual best program based on your buyer's complete financial picture — income, assets, credit history, goals, and the specific property.</p>
                  <p className="font-sans text-[12px] font-semibold text-[#C6A15B]">(301) 507-7609 · Info@infinitehomelending.com</p>
                </div>
                <p className="font-sans text-[10px] leading-relaxed text-slate-500">This tool is for educational purposes only. Program descriptions are general overviews and do not constitute lending advice, qualification determinations, or commitment to lend. All program eligibility is determined by IHL based on the buyer's complete application. Programs and guidelines are subject to change.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanMatchmakerCalculator;
