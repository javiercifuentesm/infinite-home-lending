import { DealDeskToolCard } from "./DealDeskToolCard";

const TOOLS = [
  {
    name: "The Agent Playbook",
    to: "/deal-desk/playbook",
    description:
      "Your guide to The Deal Desk: how the suite fits together, scripts, timelines, and when to use each tool — plus a downloadable Quick Reference Card.",
    comingSoon: false,
  },
  {
    name: "The Offer Optimizer",
    to: "/deal-desk/offer-optimizer",
    description:
      "Model price cuts vs. seller-funded buydowns side by side. Know which concession does more for your buyer — before the offer.",
    comingSoon: false,
  },
  {
    name: "The Client Qualifier",
    to: "/deal-desk/client-qualifier",
    description: "90-second buyer mortgage snapshot. Run it before the first showing and know exactly who's ready.",
    comingSoon: false,
  },
  {
    name: "The Listing Boost",
    to: "/deal-desk/listing-boost",
    description: "Show sellers what a buydown does to their buyer pool. Move stale listings without cutting price.",
    comingSoon: false,
  },
  {
    name: "The Assumable Calculator",
    to: "/deal-desk/assumable-calculator",
    description: "Calculate the payment advantage of an assumable FHA or VA loan. A feature most agents don't know how to price.",
    comingSoon: false,
  },
  {
    name: "The Seller Net Sheet",
    to: "/deal-desk/net-sheet",
    description: "Professional net proceeds calculator for listing presentations. Three price scenarios, one clean summary.",
    comingSoon: false,
  },
  {
    name: "The Loan Program Matchmaker",
    to: "/deal-desk/loan-matchmaker",
    description:
      "Input your buyer's profile and instantly get the best-fit loan program — Conventional, FHA, VA, USDA, Non-QM — ranked and explained with MD/DC/VA-specific programs to stack.",
    comingSoon: false,
  },
  {
    name: "NAR Settlement Script Library",
    to: "/deal-desk/nar-scripts",
    description:
      "Ready-to-use word-for-word scripts for buyer agreements, commission objections, seller concessions, and open house conversations. Copy and use instantly.",
    comingSoon: false,
  },
  {
    name: "The Deal Rescue Tool",
    to: "/deal-desk/deal-rescue",
    description:
      "Loan fell through? Input the problem — credit drop, appraisal gap, job loss, DTI — and get ranked alternative financing paths with step-by-step action plans.",
    comingSoon: false,
  },
] as const;

export function DealDeskToolGrid() {
  return (
    <section
      id="deal-desk-tools"
      className="scroll-mt-[calc(var(--site-header-height)+0.5rem)] py-14 sm:py-16"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(198,161,91,0.1)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3">
          <span
            className="inline-flex rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: "rgba(198,161,91,0.08)",
              border: "1px solid rgba(198,161,91,0.25)",
              color: "#C6A15B",
            }}
          >
            12 Tools Live · Nexio AI · Intelligence Loop
          </span>
          <h2 className="text-center font-[Georgia,serif] text-2xl font-medium text-[#F7F7F5] sm:text-[1.65rem]">
            The Deal Desk Tools
          </h2>
        </div>
        <p
          className="mx-auto mt-3 max-w-xl text-center font-sans text-[14px]"
          style={{ color: "rgba(247,247,245,0.6)" }}
        >
          Start with the Agent Playbook, then use five live tools at the moments that move deals — free for Deal Desk partner agents.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {TOOLS.map((t) => (
            <DealDeskToolCard
              key={t.to}
              name={t.name}
              description={t.description}
              to={t.to}
              comingSoon={t.comingSoon}
              variant={t.to === "/deal-desk/playbook" ? "welcome" : "default"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
