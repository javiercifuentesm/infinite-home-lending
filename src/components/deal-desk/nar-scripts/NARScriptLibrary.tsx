import { useState, Fragment } from "react";
import { DealDeskHeader } from "../DealDeskHeader";
import { Copy, Check, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

type Script = {
  objection: string;
  context: string;
  script: string;
  followUp?: string;
  tip: string;
};

type ScriptCategory = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  scripts: Script[];
};

const CATEGORIES: ScriptCategory[] = [
  {
    id: "buyer-agreement",
    title: "Buyer Representation Agreement",
    emoji: "📋",
    description: "Scripts for presenting and getting buyers comfortable with the new required buyer agency agreement.",
    scripts: [
      {
        objection: "\"Why do I have to sign something before you show me houses?\"",
        context: "Buyer is surprised or resistant to signing a buyer agreement before touring.",
        script: `"I completely understand — this is new for a lot of buyers. Here's what it really is: it's an agreement that protects you just as much as it protects me.\n\nThink of it like a listing agreement — sellers sign one with their agent so everyone knows exactly what to expect. This is your version of that. It lays out what I'll do for you, what my compensation is, and it means you're never left wondering how I get paid.\n\nThe good news is, in most deals, the seller still covers my fee as part of the transaction. You're not necessarily paying more — we're just being transparent about it upfront. Can I walk you through the specifics so you feel comfortable?"`,
        tip: "Never rush past this conversation. Agents who skip it lose buyers at the worst moment — when they're already emotionally attached to a home.",
      },
      {
        objection: "\"I'm not ready to commit to one agent yet.\"",
        context: "Buyer wants to shop around before signing.",
        script: `"That's a fair concern, and I respect it. You want to make sure you're working with the right person — I'd feel the same way.\n\nHere's what I'll suggest: let's do one thing together first — a 30-minute buyer consultation, no agreement required. I'll walk you through the market, what to expect, and what I'll do for you. You decide if I'm the right fit.\n\nIf you want to move forward, we sign the agreement and start looking together. If not, no hard feelings. Does that work?"`,
        followUp: "\"I'm not going to pressure you. But I should be transparent — under the new rules, I can't legally show you properties until we have a written agreement in place. So whenever you're ready to officially start searching, that's when we'll sign.\"",
        tip: "The buyer consultation close is your best move. It gives them a low-stakes first step and shows confidence in your value.",
      },
      {
        objection: "\"Other agents aren't asking me to sign anything.\"",
        context: "Buyer has spoken to agents not following the new rules.",
        script: `"I hear you — and honestly, some agents aren't following the new rules yet, which puts them and their clients at risk.\n\nThe requirement has been in effect since August 2024. Any agent who shows you a home without a written agreement is technically out of compliance with industry rules.\n\nI bring this up not to scare you, but because it matters for your protection. Let me take five minutes to explain exactly what the agreement says, and we'll get you properly protected from day one."`,
        tip: "Frame compliance as buyer protection, not agent protection. That's how you win this conversation every time.",
      },
    ],
  },
  {
    id: "commission",
    title: "Commission & Compensation Questions",
    emoji: "💰",
    description: "Scripts for explaining how buyer agent compensation works post-NAR settlement.",
    scripts: [
      {
        objection: "\"Why should I pay your commission? The seller used to pay it.\"",
        context: "Buyer is confused or upset about potential out-of-pocket commission costs.",
        script: `"You're right that historically the seller covered the buyer's agent fee — and in most transactions, that's still exactly what happens. Nothing has changed about who typically pays. What changed is how it's communicated.\n\nBefore the settlement, the commission was built into the MLS listing. Now we discuss it openly and put it in writing. The cost was always there — it was just less visible.\n\nIn most offers we write, we'll ask the seller to cover my fee as part of the negotiation. The seller still pays in most cases — it's just negotiated explicitly now rather than assumed."`,
        tip: "Reassure first, explain second. Once buyers understand sellers still typically pay, most of the anxiety disappears immediately.",
      },
      {
        objection: "\"How much do you charge? Is it negotiable?\"",
        context: "Buyer asking directly about commission rates.",
        script: `"My fee is [your rate], and yes — everything in real estate is negotiable by law. That's actually one of the things the NAR settlement was designed to clarify for consumers.\n\nWhat I'd encourage you to think about is value, not just rate. An agent who negotiates a better price, catches an inspection red flag, or structures your offer to beat out three competitors has more than paid for themselves.\n\nThat said, I'm happy to talk through the structure and make sure it works for your situation. What matters most to you in a buyer's agent?"`,
        tip: "Move the conversation from rate to value as fast as possible. Agents who compete only on price lose — and earn less for everyone.",
      },
      {
        objection: "\"The seller isn't offering buyer agent compensation. What happens?\"",
        context: "A listing has no buyer agent compensation pre-listed.",
        script: `"That's becoming more common, and here's how we handle it. We can still ask the seller to cover my fee — we just do it through the offer itself rather than it being pre-listed.\n\nIn our offer, we'll write a seller concession that covers my compensation. Whether the seller accepts is part of the negotiation, just like price and closing costs. Most sellers want to attract buyers, not push them away.\n\nLet's look at the full picture of this property first and see if it makes sense to pursue."`,
        tip: "Don't make the buyer feel stuck before you've even evaluated the deal. Frame it as a standard negotiation element — because it is.",
      },
    ],
  },
  {
    id: "seller-concessions",
    title: "Seller Concessions & Credits",
    emoji: "🤝",
    description: "Scripts for structuring offers with seller concessions to cover buyer agent fees or closing costs.",
    scripts: [
      {
        objection: "\"My seller doesn't want to offer buyer agent compensation.\"",
        context: "You represent a listing and the seller resists offering buyer agent comp.",
        script: `"I completely understand — it's absolutely your choice. But let me share what I'm seeing in the market.\n\nBuyers working with buyer's agents represent the vast majority of active buyers. If those buyers have to pay their agent out of pocket on top of a down payment and closing costs, some of them will look at homes that don't create that burden first.\n\nWhat I typically recommend: don't commit to a specific amount upfront. Leave it open for negotiation in the offer. If an offer comes in requesting a seller concession, we evaluate the whole package — price, terms, and that credit together — and decide if the net works for you. That way you're not giving anything away; you're staying open to the full market."`,
        tip: "Never frame it as a mandate. Frame it as a strategy to keep the seller's listing accessible to the widest pool of qualified buyers.",
      },
      {
        objection: "\"Can the seller concession cover my closing costs AND your fee?\"",
        context: "Buyer wants to maximize concessions in the offer.",
        script: `"Yes — and structuring it that way can be really smart, especially for buyers who want to preserve their cash.\n\nA seller concession can cover closing costs, prepaid items, and buyer agent compensation together. The key is making sure the purchase price supports the total concession and still gets the seller what they need.\n\nLet me have IHL put together a quick closing cost estimate so you know the full picture before we write the offer. That way you go in with eyes open."`,
        tip: "Always get a closing cost estimate from IHL before the offer. Buyers who see the numbers make faster, more confident decisions.",
      },
    ],
  },
  {
    id: "open-house",
    title: "Open House Conversations",
    emoji: "🏠",
    description: "Scripts for navigating buyer agreement conversations at open houses.",
    scripts: [
      {
        objection: "Walk-in at your open house wants a showing without signing anything",
        context: "You're the listing agent with an unrepresented buyer visitor.",
        script: `"Welcome — I'm glad you stopped in. I want to be upfront with you: I'm the listing agent here, which means I represent the seller. I can answer questions about this property, but if you want me to help you buy a home — this one or any other — I'd need to represent you separately, which requires a written agreement.\n\nIf you're just exploring today, that's completely fine. Take a look around. If you love this place and want to talk about making an offer, or want help finding homes more generally, let's grab five minutes and I can explain what working together looks like."`,
        tip: "Transparency builds trust instantly at open houses. Buyers who feel respected — not pressured — are the ones who call you back.",
      },
      {
        objection: "\"I just want to look — I'm not ready to sign anything.\"",
        context: "Open house visitor who isn't ready to commit.",
        script: `"That's completely fine — looking is exactly how you figure out what you want. You don't need to sign anything to tour this open house today.\n\nWhat I will say is that if at any point you want representation — someone fully in your corner when you find the right place — the agreement we'd sign is straightforward and actually protects you more than it locks you in. It just spells out exactly what I'll do for you and how I get paid.\n\nEnjoy the house. If you have questions, I'm right here."`,
        tip: "Plant the seed without any pressure. Open house visitors who feel relaxed are far more likely to circle back to you specifically.",
      },
    ],
  },
  {
    id: "value-prop",
    title: "Demonstrating Your Value",
    emoji: "⭐",
    description: "Scripts for articulating your value to skeptical or budget-conscious buyers.",
    scripts: [
      {
        objection: "\"I can just find homes on Zillow myself.\"",
        context: "Tech-savvy buyer who thinks they don't need an agent.",
        script: `"You absolutely can find homes on Zillow — and you're probably already doing it, which is great. The search part is easier than ever.\n\nWhere agents earn their keep is everything that happens after you fall in love with a house. Knowing which comparable sales actually support the price. Catching inspection issues before they become your problem. Structuring contingencies that protect you if things go sideways. Negotiating in ways that listing agents don't respect from buyers who go it alone.\n\nZillow shows you the listing. I help you figure out whether the listing is actually a good deal — and then I fight for you when it is."`,
        tip: "Agree with them first — it disarms defensiveness. Then pivot to what no platform can do. Never be defensive about your value.",
      },
      {
        objection: "\"My cousin / friend / family member is an agent.\"",
        context: "Buyer mentions they have someone they might use.",
        script: `"That's great — working with someone you trust personally is genuinely valuable. I'd encourage you to go with them if they're a good fit.\n\nThe one question worth asking is: are they active in this specific market? Real estate is hyper-local. Someone who closes deals regularly in this area knows which neighborhoods are moving, which listings are overpriced, and which sellers are motivated. That local knowledge makes a real difference in competitive situations.\n\nIf they know this market well, you're in good hands. I'm happy to be a resource if you ever want a second opinion."`,
        tip: "Never badmouth the competition. Show confidence, offer ongoing value, and be gracious. The long game always wins in real estate.",
      },
      {
        objection: "\"I want to make a lower offer — the market has cooled.\"",
        context: "Buyer wants to lowball based on general market news.",
        script: `"I hear you — and you're right that the market has shifted in a lot of areas. The key is knowing exactly what's happening in this specific neighborhood, with this specific type of home.\n\nBefore we decide on a number, let me pull the recent comparable sales so we're negotiating from data, not headlines. Sometimes the market has shifted exactly like you're thinking — and sometimes a specific property or area is still moving fast.\n\nI also want IHL to make sure your financing is tight before we write anything — a clean, well-structured offer is worth more than a low number in most sellers' eyes."`,
        tip: "Always anchor negotiation to local data, not national headlines. And bring IHL into the conversation early — financing strength is a real negotiating tool.",
      },
    ],
  },
  {
    id: "financing-conversations",
    title: "Financing Conversations with Clients",
    emoji: "🏦",
    description: "Scripts for guiding clients toward IHL without overstepping into financial advice.",
    scripts: [
      {
        objection: "\"Can you just tell me what I can afford?\"",
        context: "Buyer wants you to give them a mortgage number.",
        script: `"I wish I could give you a precise answer right here — but honestly, an accurate number requires someone to look at your full picture: income, debts, assets, and current market rates. If I guess and get it wrong, we could be targeting the wrong homes entirely.\n\nWhat I can do is get you in touch with IHL right now. They can have a real number for you within 24 hours — and it won't affect your credit to have that initial conversation. That way we're shopping in the right range from day one."`,
        tip: "Never guess at affordability. A wrong number wastes everyone's time and can cost you the client relationship when reality hits.",
      },
      {
        objection: "\"My bank already pre-approved me — do I really need IHL?\"",
        context: "Buyer has a pre-approval from their bank but you want to ensure they have the best option.",
        script: `"A pre-approval is a great first step — and I'm glad you have one. My honest recommendation is to at least have a 15-minute conversation with IHL before we start seriously writing offers.\n\nHere's why: IHL is an independent mortgage broker, which means they have access to multiple lenders, not just one bank's products. Sometimes the program or rate your bank offers is the best available. Sometimes it isn't. Either way, knowing you've shopped gives you confidence — and it costs you nothing to find out.\n\nI refer my buyers to IHL because they close on time and they find options banks don't always offer. Want me to make an introduction?"`,
        tip: "Never disrespect the bank pre-approval — that's dismissive and can feel personal. Frame IHL as an additional resource, not a replacement.",
      },
      {
        objection: "\"Interest rates are too high. I'm going to wait.\"",
        context: "Buyer is discouraged by current rate environment.",
        script: `"That's one of the most common things I'm hearing right now, and it's a completely fair concern. I want to make sure you're making this decision with complete information.\n\nA few things worth exploring with IHL before you decide: whether there are programs or structures that might affect your monthly payment, how the math compares between renting and owning in this specific market, and what waiting actually costs if prices move while you're on the sidelines.\n\nI'm not going to tell you the timing is definitely right — I genuinely don't know. But I don't want you to wait based on the headline rate without understanding the full picture first. Would you be open to a 15-minute call with IHL just to see what the numbers actually look like for your situation?"`,
        tip: "Never tell a buyer the market is a great time to buy — that's not your call and it damages trust. Redirect to IHL for the honest math.",
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-slate-600 shadow-sm transition-all hover:border-[#C6A15B]/50 hover:text-[#0B2A4A]">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy Script"}
    </button>
  );
}

function ScriptCard({ script }: { script: Script }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <button type="button" onClick={() => setExpanded(!expanded)} className="w-full px-5 py-4 text-left flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-[Georgia,serif] text-[0.95rem] font-medium text-[#0B2A4A] italic">{script.objection}</p>
          <p className="mt-1 font-sans text-[11px] text-slate-500">{script.context}</p>
        </div>
        <div className="mt-1 shrink-0 text-slate-400">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
      </button>
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/60">Your Script</div>
              <CopyButton text={script.script} />
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200/60 p-4">
              <p className="font-sans text-[13px] leading-[1.75] text-slate-800 whitespace-pre-line">{script.script}</p>
            </div>
          </div>
          {script.followUp && (
            <div>
              <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/60">If They Push Back</div>
              <div className="rounded-lg bg-blue-50/60 border border-blue-200/50 p-4">
                <p className="font-sans text-[13px] leading-[1.75] text-slate-800">{script.followUp}</p>
              </div>
            </div>
          )}
          <div className="rounded-lg bg-[#C6A15B]/10 border border-[#C6A15B]/30 px-4 py-3">
            <div className="mb-1 font-sans text-[10px] font-bold uppercase tracking-wider text-[#854F0B]">💡 Coach's Tip</div>
            <p className="font-sans text-[13px] leading-relaxed text-[#5c3a0a]">{script.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: ScriptCategory }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] overflow-hidden shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <h2 className="font-[Georgia,serif] text-[1.05rem] font-medium text-[#0B2A4A]">{category.title}</h2>
            <p className="font-sans text-[12px] text-slate-500 mt-0.5">{category.scripts.length} scripts</p>
          </div>
        </div>
        <div className="text-slate-400">{open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</div>
      </button>
      {open && (
        <div className="border-t border-slate-200/60 px-6 pb-6 pt-4">
          <p className="mb-4 font-sans text-[13px] text-slate-600">{category.description}</p>
          <div className="space-y-3">
            {category.scripts.map((script, i) => (
              <Fragment key={i}>
                <ScriptCard script={script} />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function NARScriptLibrary() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const filtered = activeFilter === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === activeFilter);
  const totalScripts = CATEGORIES.reduce((sum, c) => sum + c.scripts.length, 0);

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <DealDeskHeader toolTitle="NAR Settlement Script Library" />
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="border-b border-slate-200/90 pb-8">
          <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">NAR Settlement Script Library</h1>
          <p className="mt-1 font-sans text-[12px] font-medium text-slate-500">{totalScripts} ready-to-use scripts for the conversations every agent is having right now</p>
          <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">The NAR settlement changed how buyer agent compensation works — and left agents scrambling to explain it confidently. This library gives you word-for-word scripts for every objection, every awkward conversation, and every scenario you will face with buyers and sellers.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
            <span className="text-sm">⚠️</span>
            <span className="font-sans text-[11px] font-semibold text-amber-800">Updated for post-August 2024 rules · Written buyer agreements now required before any showing</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => setActiveFilter("all")} className={`rounded-full px-4 py-1.5 font-sans text-[12px] font-semibold transition-all ${activeFilter === "all" ? "bg-[#0B2A4A] text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
            All Scripts ({totalScripts})
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} type="button" onClick={() => setActiveFilter(cat.id)} className={`rounded-full px-4 py-1.5 font-sans text-[12px] font-semibold transition-all ${activeFilter === cat.id ? "bg-[#0B2A4A] text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
              {cat.emoji} {cat.title.split(" ")[0]} ({cat.scripts.length})
            </button>
          ))}
        </div>
        <div className="mt-8 space-y-6">
          {filtered.map((category) => (
            <Fragment key={category.id}>
              <CategorySection category={category} />
            </Fragment>
          ))}
        </div>
        <div className="mt-10 rounded-xl border border-[#C6A15B]/30 bg-[#0B2A4A] p-6 text-white">
          <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#C6A15B] mb-2">🎯 Need a Script for a Specific Situation?</div>
          <p className="font-sans text-[13px] leading-relaxed text-white/85 mb-2">The Deal Desk Assistant can help you craft language for any conversation you are navigating — just describe the situation. And whenever the conversation turns to financing specifics, always bring IHL in. That is where the real answers live.</p>
          <div className="flex items-center gap-2 mt-3">
            <BookOpen className="h-4 w-4 text-[#C6A15B]" />
            <p className="font-sans text-[11px] text-[#C6A15B]/80">These scripts are for educational and conversational purposes. Always review with your broker and ensure compliance with your state's licensing laws.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NARScriptLibrary;
