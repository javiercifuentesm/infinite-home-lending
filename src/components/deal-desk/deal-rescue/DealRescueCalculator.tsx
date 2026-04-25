import { useState } from "react";
import { DealDeskHeader } from "../DealDeskHeader";
import { AlertTriangle, Phone, MessageSquare, XCircle, CheckCircle } from "lucide-react";

type FailureCategory = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
};

type RescuePlan = {
  title: string;
  whatHappened: string;
  questionsForLender: string[];
  scriptToCallIHL: string;
  whatToTellClient: string;
  whatNOTToSay: string[];
  keepAliveActions: string[];
};

const FAILURE_CATEGORIES: FailureCategory[] = [
  { id: "credit_drop", label: "Credit Score Dropped", emoji: "📉", desc: "Score changed after application or pre-approval was issued" },
  { id: "job_change", label: "Job Loss or Employment Change", emoji: "💼", desc: "Buyer lost their job, changed employers, or changed positions" },
  { id: "dti", label: "Debt-to-Income Issue", emoji: "⚖️", desc: "Monthly obligations are too high relative to income" },
  { id: "appraisal", label: "Low Appraisal", emoji: "🏚️", desc: "Property appraised below the agreed purchase price" },
  { id: "assets", label: "Not Enough Assets or Cash", emoji: "💰", desc: "Funds for down payment or closing costs fall short" },
  { id: "condo", label: "Condo Project Issue", emoji: "🏢", desc: "The condo complex does not meet lender requirements" },
  { id: "self_employed", label: "Self-Employed Income Problem", emoji: "📋", desc: "Tax returns or documentation do not support the needed income" },
  { id: "rate_payment", label: "Payment No Longer Affordable", emoji: "📈", desc: "Rate changes or recalculation made the monthly payment too high" },
  { id: "property", label: "Property Condition Issue", emoji: "🔧", desc: "Lender flagged condition concerns after inspection or appraisal" },
  { id: "other", label: "Something Else / Not Sure", emoji: "❓", desc: "Need help understanding what went wrong and what to do next" },
];

const RESCUE_PLANS: Record<string, RescuePlan> = {
  credit_drop: {
    title: "Credit Score Dropped",
    whatHappened: "Something changed in the buyer's credit profile between application and closing — a new account, a late payment, a balance change, or an error. Even small changes can affect loan terms or approval status depending on the program.",
    questionsForLender: [
      "What specifically triggered the change — can you show me the credit report comparison?",
      "Is this a hard stop or a condition we can address before closing?",
      "What would need to happen to restore the original approval?",
      "Are there alternative programs that might still work given the current profile?",
      "What is the fastest path to resolution you have seen in a situation like this?",
    ],
    scriptToCallIHL: "\"Hi, I have a deal that just hit a snag — the buyer's credit profile changed between pre-approval and closing. I don't know exactly why yet, but I want to understand our options before I have any further conversations with the seller's agent. Can you take a look at the situation and tell me what paths might exist? The buyer is [brief profile: purchase price, loan type, timeline].\"",
    whatToTellClient: "\"Something came up in your credit profile that we need to sort through. This happens sometimes and there are often paths forward — but I want to get the right people looking at it before we jump to conclusions. Let's get IHL on the phone together and understand exactly what happened and what our options are. Don't panic yet.\"",
    whatNOTToSay: [
      "\"Your credit is the problem\" — too alarming before you know the full picture",
      "\"You're going to lose the deal\" — you don't know that yet",
      "\"This happened because you opened a new credit card\" — don't diagnose without data",
      "\"The seller is going to find out\" — only share what's necessary, when it's necessary",
    ],
    keepAliveActions: [
      "Get the full credit report explanation from the current lender before anything else",
      "Call IHL immediately — they can assess whether alternative approaches exist",
      "Do not share details with the seller's agent until you understand your options",
      "Ask your lender about timeline — some issues resolve faster than others",
      "Keep the seller warm with a general 'working through a documentation item' message if needed",
    ],
  },
  job_change: {
    title: "Job Loss or Employment Change",
    whatHappened: "Employment is one of the most scrutinized factors in mortgage underwriting — lenders verify it right up to closing. A job loss, employer change, role change, or income shift can significantly affect a loan. The impact depends heavily on the specifics.",
    questionsForLender: [
      "What exactly triggered the employment flag — termination, voluntary change, or something else?",
      "If the buyer starts a new job, what documentation would be needed and when?",
      "Does the type of employment change affect the options?",
      "What is the minimum timeline you have seen a situation like this resolve within?",
      "Are there any programs more flexible on employment documentation?",
    ],
    scriptToCallIHL: "\"Hi, I have an urgent situation — my buyer had an employment change during the loan process and the current lender is concerned. I want to understand what options exist before I have to update the seller. The buyer [still has income / started a new job / is between jobs]. Can you help me triage this quickly?\"",
    whatToTellClient: "\"I know this feels scary, and I want you to know we are not giving up. Employment situations during the loan process are complicated — and the path forward really depends on the specific circumstances. I want IHL involved in this conversation immediately because they see more scenarios than any single lender. Let's get on a call together before we make any assumptions about where this is headed.\"",
    whatNOTToSay: [
      "\"You should have told me before you changed jobs\" — blame doesn't help now",
      "\"The deal is probably dead\" — you genuinely don't know that",
      "\"Just don't tell the lender\" — never advise concealment of material facts",
      "\"This happens all the time\" — minimizing can make buyers less proactive about solutions",
    ],
    keepAliveActions: [
      "Get the full story from your buyer before talking to anyone else",
      "Contact IHL immediately — the timeline matters enormously here",
      "Do not update the seller or their agent until you have clarity on your options",
      "If a closing extension is likely needed, begin that conversation early — frame it as a paperwork delay initially",
      "Document everything from this point forward",
    ],
  },
  dti: {
    title: "Debt-to-Income Issue",
    whatHappened: "The buyer's monthly debt obligations relative to their income exceeded the lender's parameters. This can happen because of new debt taken on during the process, income that came in lower than expected, or loan terms that changed the calculation.",
    questionsForLender: [
      "Can you show me exactly how the calculation was made and what the threshold is?",
      "Are there specific debts that are driving this issue?",
      "Are there alternative programs worth exploring?",
      "What would need to change to get back within range?",
      "Is adding a co-borrower something worth exploring in this scenario?",
    ],
    scriptToCallIHL: "\"Hi, I have a deal where the buyer was denied due to a debt-to-income issue. I am not sure yet whether it is a documentation problem, a debt problem, or a program-fit problem. Can you help me understand what alternatives might exist? The buyer is looking at [purchase price, loan type, general profile].\"",
    whatToTellClient: "\"The lender flagged a ratio that compares your monthly obligations to your income. There are a few different reasons this can happen and some of them are more workable than others. I have already reached out to IHL and I want us to get on a call with them before we draw any conclusions. They see situations like this regularly and know what options exist.\"",
    whatNOTToSay: [
      "\"You have too much debt\" — that's a judgment, not a solution",
      "\"If you had just paid off that car\" — unhelpful in the moment",
      "\"The underwriter is being unreasonable\" — don't undermine the process",
      "\"We might need to look at a cheaper house\" — only say this after exploring all options",
    ],
    keepAliveActions: [
      "Get the full breakdown of the calculation from the lender",
      "Call IHL before having any further conversations with the seller's agent",
      "Ask your buyer about any debts that might have changed recently",
      "Do not rush the buyer into financial decisions before IHL weighs in",
      "Request a closing extension if needed — frame it as a documentation review",
    ],
  },
  appraisal: {
    title: "Low Appraisal",
    whatHappened: "The property appraised below the agreed purchase price. This creates a gap between what the lender will finance based on appraised value and what the buyer agreed to pay. How big of a problem this is depends on the contract terms, the gap amount, and the seller's flexibility.",
    questionsForLender: [
      "Can you share the full appraisal report — specifically the comparable sales used?",
      "What is the formal process for a Reconsideration of Value and what is needed?",
      "Is the gap a hard stop or can it be addressed with a contract amendment?",
      "What are the buyer's options if the seller won't negotiate?",
      "Does the buyer's contract have an appraisal contingency — and what does it say exactly?",
    ],
    scriptToCallIHL: "\"Hi, we just got a low appraisal on a deal — the property came in under contract price. Before I start negotiating with the listing agent, I want to understand what our financing options look like under each scenario. Is a Reconsideration of Value worth pursuing? I want to go into the seller conversation knowing our full position.\"",
    whatToTellClient: "\"The appraisal came in below what we offered, which means the lender will base their loan on the lower number. This does not automatically kill the deal — it opens a negotiation. We have a few different directions we can go and I want to make sure we understand all of them before we approach the seller. Let me loop in IHL so we know exactly what the financing picture looks like under each scenario.\"",
    whatNOTToSay: [
      "\"The appraiser was wrong\" — appraisers have professional standards; approach a reconsideration strategically",
      "\"The seller has to come down\" — they don't have to do anything",
      "\"Just increase your down payment\" — don't give financial advice",
      "\"This happens all the time, it'll be fine\" — false reassurance damages trust",
    ],
    keepAliveActions: [
      "Get the full appraisal report and review the comparable sales immediately",
      "Call IHL to understand the financing implications of each possible path",
      "Review the contract's appraisal contingency language carefully",
      "Identify whether the seller has room to negotiate based on their situation",
      "Prepare for multiple scenarios — price reduction, gap coverage, reconsideration, or walk",
    ],
  },
  assets: {
    title: "Not Enough Assets or Cash to Close",
    whatHappened: "The buyer's documented funds for down payment or closing costs came in short — either the estimate was off, funds were not properly sourced and seasoned, or the cash to close number changed. This is one of the most common late-stage surprises.",
    questionsForLender: [
      "What specifically is the shortfall — down payment, closing costs, or reserves?",
      "What documentation would be needed if a family member wants to contribute funds?",
      "Are there seller concession options that could reduce the cash to close?",
      "Are there assistance programs that might still apply here?",
      "What is the minimum cash to close number that would work, and how was it calculated?",
    ],
    scriptToCallIHL: "\"Hi, I have a situation where my buyer's cash to close is coming up short. Before I talk to the seller's agent, I want to understand what assistance programs might exist, whether seller concessions could help, and what the actual minimum number looks like. Can you help me figure out what options we have?\"",
    whatToTellClient: "\"The closing cost number came in higher than we originally planned for. This is fixable in a lot of cases, but how we fix it matters. There are a few different directions this could go and I want IHL's input before we decide anything. Do not move any money around until we talk to them — how funds are documented matters.\"",
    whatNOTToSay: [
      "\"Just borrow money from a friend\" — undocumented loans are a serious underwriting issue",
      "\"Can your parents just wire you money?\" — gift funds have documentation requirements",
      "\"Just put it on a credit card\" — this could worsen the situation significantly",
      "\"The lender miscalculated\" — verify before assigning blame",
    ],
    keepAliveActions: [
      "Get an exact closing cost breakdown from the lender immediately",
      "Call IHL before your buyer moves any money anywhere",
      "Ask IHL about active assistance programs in MD, DC, or VA that might still apply",
      "Explore whether a seller concession could cover part of closing costs",
      "Do not let the buyer make financial moves without lender guidance on documentation",
    ],
  },
  condo: {
    title: "Condo Project Issue",
    whatHappened: "The condo complex does not meet the lender's project requirements. Different loan types have different condo project standards — what works for one program may not work for another. This is often a program-fit issue rather than a buyer issue.",
    questionsForLender: [
      "Which specific requirement is the condo complex failing to meet?",
      "Is this a hard ineligibility or something that could be addressed with documentation?",
      "Are there alternative loan programs that have different condo project requirements?",
      "What information would we need to gather from the HOA to explore options?",
      "Has IHL worked with this complex before or knows its status with various programs?",
    ],
    scriptToCallIHL: "\"Hi, I have a deal where the condo project is causing a problem with the buyer's current loan type. I don't know yet whether it's a project approval issue or something else. Before I tell my buyer we have a problem, I want to know if there are alternative programs that might look at this complex differently. Can you help me understand the options?\"",
    whatToTellClient: "\"The complex where you're buying has some requirements that need to be checked with the lender — this is fairly common with condos and it's usually about the building's financials or ownership mix, not anything about you personally. There are often ways around it depending on the loan type. I've already reached out to IHL and I want to understand what alternatives exist before we have a bigger conversation.\"",
    whatNOTToSay: [
      "\"This building has problems\" — this is a lender requirement issue, not necessarily a building problem",
      "\"The HOA is the problem\" — be careful assigning blame before you have full info",
      "\"You might have to walk away\" — only say this after exhausting options",
      "\"The seller should have disclosed this\" — focus on solutions before liability",
    ],
    keepAliveActions: [
      "Request HOA documents: budget, reserves, delinquency rate, owner-occupancy ratio",
      "Call IHL — they may know the building's status with various programs",
      "Do not tell the seller there is a financing problem until you understand the scope",
      "Review the contract's financing contingency carefully",
      "Ask the current lender specifically what documentation could resolve the issue",
    ],
  },
  self_employed: {
    title: "Self-Employed Income Problem",
    whatHappened: "The buyer's tax returns show less income than they actually earn — a common situation for self-employed buyers who legitimately reduce their taxable income through deductions. The lender is using the documented number, not the real cash flow number.",
    questionsForLender: [
      "Which income figure specifically is the lender using?",
      "What documentation alternatives exist for buyers whose tax returns do not reflect real income?",
      "Are there programs designed for self-employed buyers that IHL works with regularly?",
      "What would the buyer need to provide to make an alternative documentation approach work?",
      "What is the realistic timeline for a program switch at this stage?",
    ],
    scriptToCallIHL: "\"Hi, I have a self-employed buyer whose deal is in trouble because their tax returns show significantly less income than their actual cash flow. The current lender is stuck on the documented number. I know there are programs designed for situations like this — can you tell me whether my buyer is a candidate and what we'd need to make it work? Time is a factor.\"",
    whatToTellClient: "\"The challenge we're running into is that the income on your tax returns — after your business deductions — is lower than what you actually bring in. That's completely normal for business owners, but it creates a documentation puzzle for traditional lenders. The good news is there are programs specifically designed for people in your situation. IHL works with these regularly and I want them to look at this immediately. This is not a dead end — it's a fit problem.\"",
    whatNOTToSay: [
      "\"You shouldn't have written off so much\" — that's their business decision and not helpful now",
      "\"The lender doesn't understand self-employment\" — this is a documentation fit issue",
      "\"Just show them your bank statements\" — documentation requirements are specific; get IHL involved",
      "\"This happens all the time with self-employed buyers\" — it does, but don't minimize their stress",
    ],
    keepAliveActions: [
      "Ask the buyer to pull together 12 to 24 months of business and personal bank statements",
      "Call IHL immediately — they have alternative documentation program relationships",
      "Do not assume the deal is dead until IHL reviews the full picture",
      "Ask for a closing extension if needed — frame it as a documentation transition",
      "Keep communication with the seller's agent minimal and professional while options are explored",
    ],
  },
  rate_payment: {
    title: "Payment No Longer Affordable",
    whatHappened: "The buyer's monthly payment came in higher than expected — due to a rate change, a recalculation, insurance or tax estimates that changed, or the buyer realizing they are less comfortable than they thought. This is a buyer confidence and affordability conversation.",
    questionsForLender: [
      "What exactly changed in the payment calculation from original estimate to now?",
      "Are there any program options that could affect the monthly obligation?",
      "What does a seller-funded buydown look like for this transaction?",
      "What would a different loan structure do to the monthly payment?",
      "Are there any options IHL recommends exploring before we consider a price reduction?",
    ],
    scriptToCallIHL: "\"Hi, I have a buyer who is concerned about the payment — it came in higher than they were expecting. Before I have a longer conversation with them about whether to proceed, I want to understand if there are any structural options that could affect the monthly payment. Can you walk me through what might be available?\"",
    whatToTellClient: "\"I hear you — the payment feels higher than you were planning for and I want to take that seriously. Before we make any decisions, I want us to get IHL on the phone together. There may be some structures that could affect the monthly number, and I want to make sure you have the complete picture before deciding anything. You are not locked in yet — let's explore first.\"",
    whatNOTToSay: [
      "\"Rates might come down, just wait\" — never make rate predictions",
      "\"You're going to regret not buying\" — pressure is not your role here",
      "\"It's only a little more than renting\" — don't make financial comparisons without full data",
      "\"Everyone's payment feels high at first\" — dismissing their concern damages trust",
    ],
    keepAliveActions: [
      "Get an updated itemized payment breakdown from the lender immediately",
      "Call IHL to understand whether any payment-related structures exist",
      "Use the Offer Optimizer tool to model whether seller concessions or a buydown could help",
      "Give the buyer space — pressure at this stage backfires",
      "Have IHL speak directly with the buyer if they are open to it",
    ],
  },
  property: {
    title: "Property Condition Issue",
    whatHappened: "The lender flagged a property condition concern — either from the appraisal or from required inspection disclosures. Some loan programs have minimum property standards that must be met before they will fund.",
    questionsForLender: [
      "Which specific condition items is the lender requiring to be addressed?",
      "Are these conditions that must be fixed before closing, or can they be handled another way?",
      "Are there alternative programs with different property condition standards?",
      "What documentation would satisfy the lender's concerns?",
      "Has the appraiser flagged these as required repairs or as observations?",
    ],
    scriptToCallIHL: "\"Hi, we have a property condition issue that the lender is requiring be addressed before closing. I want to understand whether there are alternative programs with different property standards, and what the most realistic path to closing looks like. The issues are [brief description]. Can you help me think through the options?\"",
    whatToTellClient: "\"The lender has flagged some condition items on the property that need to be resolved before they will fund. This is not unusual — some loan types have specific property standards. What matters now is understanding exactly what needs to happen, who is responsible for it, and whether we have a path to closing that works for everyone. I want IHL involved in this conversation right away.\"",
    whatNOTToSay: [
      "\"The house has serious problems\" — frame this as a lender requirement, not a property condemnation",
      "\"The seller has to fix this\" — they may, but work out the negotiation strategy first",
      "\"This is going to delay everything\" — you don't know that yet",
      "\"You should have seen this coming in the inspection\" — not productive at this stage",
    ],
    keepAliveActions: [
      "Get the specific list of required items from the lender in writing",
      "Review the contract's inspection contingency and repair request terms",
      "Call IHL to explore whether alternative programs have different property standards",
      "Determine whether the seller is willing and able to address the items",
      "Explore whether an escrow holdback is possible for items not completed before closing",
    ],
  },
  other: {
    title: "Unknown or Complex Situation",
    whatHappened: "Something went wrong in the loan process and the path forward is not clear yet. Before making any moves, the most important step is understanding exactly what happened and who needs to be involved.",
    questionsForLender: [
      "Can you explain in plain terms exactly what the issue is and why it is a problem?",
      "Is this a hard stop or a condition that can potentially be addressed?",
      "What information would help you identify alternative options?",
      "What is the fastest path to resolution you have seen in similar situations?",
      "Is this something IHL should be involved in reviewing?",
    ],
    scriptToCallIHL: "\"Hi, I have a deal that hit an unexpected problem and I am still trying to understand exactly what happened. Before I make any decisions or have any conversations with the other side, I wanted to run it by you. Here is what I know so far: [brief description]. Can you help me figure out what I am dealing with and what the options might be?\"",
    whatToTellClient: "\"Something came up in the loan process that we need to understand better before we react to it. I don't want to give you an answer before I have the full picture — that would only create more confusion. I am getting IHL involved right now because they see a wide range of situations and can help us figure out exactly what we are dealing with. Sit tight and don't do anything with your finances until we talk.\"",
    whatNOTToSay: [
      "\"This is really bad\" — you don't have enough information yet",
      "\"I've never seen this before\" — even if true, it increases panic",
      "\"It's probably not a big deal\" — don't minimize before understanding",
      "\"The lender made a mistake\" — gather facts before assigning blame",
    ],
    keepAliveActions: [
      "Get everything in writing from the current lender before taking any action",
      "Call IHL immediately — they can help you interpret what you are looking at",
      "Do not communicate the problem to the other side until you understand your options",
      "Keep your buyer calm and focused on gathering information, not catastrophizing",
      "Ask your lender for a specific timeline — when do decisions need to be made?",
    ],
  },
};

function RescuePlanView({ plan }: { plan: RescuePlan }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/50">What Happened</div>
        <p className="font-sans text-[13px] leading-relaxed text-slate-700">{plan.whatHappened}</p>
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#0B2A4A]/50" />
          <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/50">Questions to Ask the Lender</div>
        </div>
        <p className="mb-3 font-sans text-[12px] text-slate-500 italic">Get these answers from your current lender before calling IHL — so you can brief IHL accurately.</p>
        <ul className="space-y-2.5">
          {plan.questionsForLender.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B2A4A]/8 font-sans text-[10px] font-bold text-[#0B2A4A]">{i + 1}</span>
              <span className="font-sans text-[13px] leading-relaxed text-slate-700">{q}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-[#0B2A4A]/15 bg-[#0B2A4A]/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Phone className="h-4 w-4 text-[#0B2A4A]" />
          <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]">Script to Call IHL</div>
        </div>
        <p className="mb-3 font-sans text-[12px] text-slate-600 italic">Use this framing when you call — it helps IHL understand the situation quickly and respond with the right options.</p>
        <div className="rounded-lg bg-white border border-[#0B2A4A]/10 p-4">
          <p className="font-sans text-[13px] leading-[1.75] text-[#0B2A4A] italic">{plan.scriptToCallIHL}</p>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#0B2A4A] px-4 py-3">
          <Phone className="h-4 w-4 text-[#C6A15B] shrink-0" />
          <div>
            <div className="font-sans text-[12px] font-bold text-white">Call IHL Now</div>
            <div className="font-sans text-[11px] text-[#C6A15B]">(301) 555-0123 · Available 7 days a week</div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/8 p-5">
        <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-[#854F0B]">💬 What to Tell Your Client</div>
        <p className="mb-2 font-sans text-[12px] text-[#854F0B] italic">Use this language to keep your client calm and focused while you work the problem.</p>
        <div className="rounded-lg bg-white border border-[#C6A15B]/20 p-4">
          <p className="font-sans text-[13px] leading-[1.75] text-slate-800 italic">{plan.whatToTellClient}</p>
        </div>
      </div>
      <div className="rounded-xl border border-red-200/60 bg-red-50/50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-red-600">What NOT to Say</div>
        </div>
        <p className="mb-3 font-sans text-[12px] text-red-700 italic">These responses feel natural under pressure — but they create bigger problems.</p>
        <ul className="space-y-2">
          {plan.whatNOTToSay.map((item, i) => {
            const parts = item.split(" — ");
            return (
              <li key={i} className="flex gap-2.5">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-sans text-[13px] text-slate-700">
                  <span className="font-semibold text-red-700">{parts[0]}</span>
                  {parts[1] && <span className="text-slate-500"> — {parts[1]}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-xl border border-green-200/60 bg-green-50/50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-green-700">Keep the Deal Alive — Actions to Take Now</div>
        </div>
        <ul className="space-y-2">
          {plan.keepAliveActions.map((action, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 font-sans text-[10px] font-bold text-green-700">{i + 1}</span>
              <span className="font-sans text-[13px] leading-relaxed text-slate-700">{action}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="font-sans text-[10px] leading-relaxed text-slate-400">
        This tool provides general educational guidance for real estate agents. It does not constitute financial, legal, or mortgage advice. All financing solutions and eligibility determinations must be made by a licensed mortgage professional. Contact IHL for case-specific guidance.
      </p>
    </div>
  );
}

export function DealRescueCalculator() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const plan = selected ? RESCUE_PLANS[selected] : null;

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <DealDeskHeader toolTitle="The Deal Rescue Tool" />
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="border-b border-slate-200/90 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-[#C6A15B]" />
            <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Deal Rescue Tool</h1>
          </div>
          <p className="font-sans text-[12px] font-medium text-slate-500">Loan fell through? Know what to ask, what to say, and when to call IHL</p>
          <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">When a deal hits a financing wall, the next 60 minutes matter. This tool helps you ask the right questions, say the right things to your client, and call IHL with the right framing — so you go into every conversation prepared, not panicked.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
            <span className="font-sans text-[11px] font-semibold text-red-800">Time matters — call IHL before calling the other agent</span>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="mb-1 font-[Georgia,serif] text-[1rem] font-medium text-[#0B2A4A]">What went wrong?</h2>
              <p className="mb-4 font-sans text-[12px] text-slate-500">Select the closest match to get your rescue plan</p>
              <div className="space-y-2">
                {FAILURE_CATEGORIES.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => { setSelected(cat.id); setShowPlan(false); }} className={`w-full rounded-xl border p-3.5 text-left transition-all ${selected === cat.id ? "border-[#0B2A4A] bg-[#0B2A4A]/5 ring-1 ring-[#0B2A4A]/20" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg shrink-0">{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-sans text-[13px] font-semibold ${selected === cat.id ? "text-[#0B2A4A]" : "text-slate-700"}`}>{cat.label}</div>
                        <div className="font-sans text-[11px] text-slate-400 mt-0.5">{cat.desc}</div>
                      </div>
                      {selected === cat.id && <CheckCircle className="h-4 w-4 text-[#0B2A4A] shrink-0 mt-0.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => { if (selected) setShowPlan(true); }} disabled={!selected} className="w-full rounded-xl bg-[#DC2626] px-6 py-4 font-sans text-[14px] font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#b91c1c] hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
              Get Rescue Plan →
            </button>
          </div>
          <div>
            {!showPlan ? (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DC2626]/20 bg-gradient-to-br from-red-50/60 via-white to-orange-50/30 p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DC2626] shadow-lg shadow-red-200">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>

                <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#DC2626]">
                  Deal in Trouble?
                </div>

                <h2 className="mb-4 font-[Georgia,serif] text-[1.5rem] font-medium leading-snug text-[#0B2A4A]">
                  Don't panic.<br />The Deal Rescue Tool is here.
                </h2>

                <p className="mb-6 max-w-sm font-sans text-[13px] leading-relaxed text-slate-600">
                  Transaction hit a wall? Whether it's a credit drop, a low appraisal, a self-employed income problem, or something you've never seen before — this tool tells you exactly what to ask, what to say, and how to call IHL with the right framing.
                </p>

                <div className="mb-8 w-full max-w-sm space-y-2.5">
                  {[
                    { emoji: "📋", text: "Questions to ask the lender" },
                    { emoji: "📞", text: "Script to call IHL — framed correctly" },
                    { emoji: "💬", text: "What to tell your client right now" },
                    { emoji: "🚫", text: "What NOT to say under pressure" },
                    { emoji: "✅", text: "Keep-the-deal-alive action steps" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 rounded-lg bg-white/80 border border-slate-200/60 px-4 py-2.5 shadow-sm">
                      <span className="text-base shrink-0">{item.emoji}</span>
                      <span className="font-sans text-[13px] font-medium text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#0B2A4A] px-5 py-2.5 shadow-md">
                  <AlertTriangle className="h-4 w-4 text-[#C6A15B]" />
                  <span className="font-sans text-[12px] font-bold text-white">Select a scenario on the left to get your rescue plan</span>
                </div>

                <p className="mt-4 font-sans text-[11px] text-slate-400">
                  10 scenarios covered · Instant results · Always drives to IHL
                </p>
              </div>
            ) : plan ? (
              <RescuePlanView plan={plan} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealRescueCalculator;
