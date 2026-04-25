import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt, fmtK } from "../../../hooks/useHelocMath";

type Props = { results: HelocResult };

export function HelocComparison({ results }: Props) {
  const {
    ioPmt,
    piPmtVal,
    totalInt,
    hePmt,
    heTotalInt,
    heRate,
    cashPmt,
    cashTotalInt,
    cashRate,
    helocWins,
    heWins,
  } = results;

  /** Cash-out is never highlighted; if it has lowest interest, show border on the better of HELOC vs HE. */
  const noHelocHeWinner = !helocWins && !heWins;
  const highlightHeloc =
    helocWins || (noHelocHeWinner && totalInt <= heTotalInt);
  const highlightHe = heWins || (noHelocHeWinner && heTotalInt < totalInt);

  const helocBorder = highlightHeloc ? "border-2 border-[#27500A]" : "border-[0.5px] border-[var(--color-border-tertiary)]";
  const heBorder = highlightHe ? "border-2 border-[#27500A]" : "border-[0.5px] border-[var(--color-border-tertiary)]";
  const cashBorder = "border-[0.5px] border-[var(--color-border-tertiary)]";

  const winC = (w: boolean) => (w ? "text-[#27500A]" : "text-[#A32D2D]");
  const helocIntGreen = helocWins || highlightHeloc;
  const heIntGreen = heWins || highlightHe;

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">HELOC vs. your other options</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-xl bg-white p-5 shadow-sm ${helocBorder}`}>
          <h4 className={`font-[Georgia,serif] text-[16px] font-semibold ${highlightHeloc ? "text-[#27500A]" : "text-[var(--color-text-tertiary)]"}`}>
            HELOC (this option)
          </h4>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Draw period pmt</span>
              <span className="font-semibold text-[#27500A]">{fmt(ioPmt)}/mo</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Repayment pmt</span>
              <span className="font-semibold text-[#0B2A4A]">{fmt(piPmtVal)}/mo</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Rate type</span>
              <span className="font-medium">Variable</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Keeps 1st mortgage</span>
              <span className="font-semibold text-[#27500A]">Yes</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Total interest</span>
              <span className={`font-semibold ${winC(helocIntGreen)}`}>{fmtK(totalInt)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Flexibility</span>
              <span className="font-semibold text-[#27500A]">Draw as needed</span>
            </li>
          </ul>
        </div>

        <div className={`rounded-xl bg-white p-5 shadow-sm ${heBorder}`}>
          <h4 className={`font-[Georgia,serif] text-[16px] font-semibold ${highlightHe ? "text-[#27500A]" : "text-[var(--color-text-tertiary)]"}`}>
            Home equity loan
          </h4>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Monthly payment</span>
              <span className="font-semibold text-[#0B2A4A]">{fmt(hePmt)}/mo</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Rate type</span>
              <span className="font-medium">Fixed</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Est. rate</span>
              <span className="font-medium">{heRate.toFixed(2)}%</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Keeps 1st mortgage</span>
              <span className="font-semibold text-[#27500A]">Yes</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Total interest (20yr)</span>
              <span className={`font-semibold ${winC(heIntGreen)}`}>{fmtK(heTotalInt)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Flexibility</span>
              <span className="font-semibold text-[#A32D2D]">Lump sum only</span>
            </li>
          </ul>
        </div>

        <div className={`rounded-xl bg-white p-5 shadow-sm ${cashBorder}`}>
          <h4 className="font-[Georgia,serif] text-[16px] font-semibold text-[var(--color-text-tertiary)]">Cash-out refinance</h4>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Monthly payment</span>
              <span className="font-semibold text-[#A32D2D]">{fmt(cashPmt)}/mo</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Rate type</span>
              <span className="font-medium">Fixed (new)</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Est. rate</span>
              <span className="font-medium">{cashRate.toFixed(2)}%</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Keeps 1st mortgage</span>
              <span className="font-semibold text-[#A32D2D]">No — replaces it</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Total interest (30yr)</span>
              <span className="font-semibold text-[#A32D2D]">{fmtK(cashTotalInt)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">Flexibility</span>
              <span className="font-semibold text-[#A32D2D]">Lump sum only</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
