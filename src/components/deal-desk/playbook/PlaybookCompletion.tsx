import { Link } from "react-router-dom";

const ROWS = [
  {
    tool: "The Offer Optimizer",
    when: "At the offer table — buydown vs. price cut",
    to: "/deal-desk/offer-optimizer",
  },
  {
    tool: "The Client Qualifier",
    when: "Before the first showing — 90-second buyer snapshot",
    to: "/deal-desk/client-qualifier",
  },
  {
    tool: "The Listing Boost",
    when: "Stale listings — expand the buyer pool",
    to: "/deal-desk/listing-boost",
  },
  {
    tool: "The Assumable Calculator",
    when: "FHA/VA/USDA listings — is the assumption worth it?",
    to: "/deal-desk/assumable-calculator",
  },
  {
    tool: "The Seller Net Sheet",
    when: "Listing appointment — real numbers before the agreement",
    to: "/deal-desk/net-sheet",
  },
] as const;

export function PlaybookCompletion() {
  return (
    <section id="deal-desk-complete" className="scroll-mt-28 border-b border-slate-200/90 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-[Georgia,serif] text-2xl font-medium text-[#0B2A4A] sm:text-[1.5rem]">The Deal Desk is complete.</h2>
        <p className="mx-auto mt-4 max-w-[600px] text-center font-sans text-[16px] leading-relaxed text-slate-600">
          12 tools. Every moment that moves a deal. One lender partner who brings the math to every listing appointment, buyer consultation, and offer
          negotiation.
        </p>

        <div className="mt-10 overflow-hidden rounded-xl border border-slate-200/90">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#0B2A4A] text-white">
                <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wide">Tool</th>
                <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wide">When to use</th>
                <th className="hidden px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wide sm:table-cell">Route</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.to}
                  className={`border-b border-slate-200/80 ${i % 2 === 1 ? "bg-[rgba(11,42,74,0.02)]" : "bg-white"}`}
                >
                  <td className="px-4 py-3 font-sans text-[13px] font-semibold text-[#0B2A4A]">
                    <Link to={row.to} className="underline decoration-[#C6A15B]/40 underline-offset-2 hover:text-[#C6A15B]">
                      {row.tool}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-sans text-[12px] leading-relaxed text-slate-700">{row.when}</td>
                  <td className="hidden px-4 py-3 font-sans text-[11px] text-slate-500 sm:table-cell">
                    <Link to={row.to} className="text-[#185FA5] hover:underline">
                      {row.to}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B2A4A] text-2xl text-[#C6A15B]">🔧</div>
            <p className="mt-3 font-sans text-[14px] font-semibold text-[#0B2A4A]">All 12 Deal Desk tools — free forever for IHL partner agents</p>
            <p className="mt-2 font-sans text-[12px] leading-relaxed text-slate-600">
              Run every calculator as often as you need — no paywall, no limits.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B2A4A] text-2xl text-[#C6A15B]">📋</div>
            <p className="mt-3 font-sans text-[14px] font-semibold text-[#0B2A4A]">Co-branded outputs — your name alongside IHL on every analysis</p>
            <p className="mt-2 font-sans text-[12px] leading-relaxed text-slate-600">
              Professional presentation that reinforces your brand with the lender.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B2A4A] text-2xl text-[#C6A15B]">📞</div>
            <p className="mt-3 font-sans text-[14px] font-semibold text-[#0B2A4A]">Direct access to Javier and Alma — not a call center</p>
            <p className="mt-2 font-sans text-[12px] leading-relaxed text-slate-600">
              Real answers, fast — from the people who underwrite your deals.
            </p>
          </div>
        </div>

        <Link
          to="/contact"
          className="mt-12 flex h-[52px] w-full items-center justify-center rounded-lg bg-[#0B2A4A] font-sans text-[16px] font-semibold text-[#C6A15B] transition-colors hover:bg-[#0a2340]"
        >
          Become a Deal Desk Partner →
        </Link>
      </div>
    </section>
  );
}
