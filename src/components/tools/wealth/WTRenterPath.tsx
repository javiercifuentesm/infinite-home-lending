import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";

type Props = { results: WealthResults };

export function WTRenterPath({ results }: Props) {
  const {
    ownerFinal,
    monthlyToMatch,
    rent,
    rentAtYear30,
    rentInc,
    totalRentInflationExtra,
    invReturn,
  } = results;

  const row5 =
    invReturn >= 8 ? "(aggressive — requires disciplined investing)" : "(reasonable historical average)";

  const rows = [
    {
      label: `To accumulate ${fmtK(ownerFinal)} by year 30, a renter needs to invest:`,
      value: <span className="font-semibold">{fmt(monthlyToMatch)}/mo</span>,
    },
    { label: "Current rent starting at", value: <span className="font-medium">{fmt(rent)}/mo</span> },
    {
      label: `Rent at year 30 (at ${rentInc.toFixed(1)}%/yr growth)`,
      value: <span className="font-medium text-[#A32D2D]">{fmt(rentAtYear30)}/mo</span>,
    },
    {
      label: "Rent inflation — 30-year cumulative extra cost",
      value: <span className="font-medium text-[#A32D2D]">{fmtK(totalRentInflationExtra)}</span>,
    },
    {
      label: "Investment return assumption",
      value: (
        <span className="font-medium">
          {invReturn.toFixed(1)}%/yr {row5}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        The renter&apos;s path — what it takes to match homeowner wealth
      </h3>
      <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">
        If you continue renting, here&apos;s what you&apos;d need to invest each month to accumulate the same net worth as the
        homeowner scenario by year 30.
      </p>
      <dl className="mt-4 divide-y divide-slate-200/80">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-start">
            <dt className="max-w-xl text-[12px] text-slate-500">{row.label}</dt>
            <dd className="text-right text-[12px] text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
