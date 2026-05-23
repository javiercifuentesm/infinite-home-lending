import { useCallback, useEffect, useState } from "react";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import { DealDeskHeader } from "../../components/deal-desk/DealDeskHeader";
import { IHLLogo } from "../../components/IHLLogo";
import { PlaybookFAQ } from "../../components/deal-desk/playbook/PlaybookFAQ";
import { PlaybookHero } from "../../components/deal-desk/playbook/PlaybookHero";
import { PlaybookPartnerCTA } from "../../components/deal-desk/playbook/PlaybookPartnerCTA";
import { PlaybookScripts } from "../../components/deal-desk/playbook/PlaybookScripts";
import { PlaybookTimeline } from "../../components/deal-desk/playbook/PlaybookTimeline";
import { PlaybookClientQualifierGuide } from "../../components/deal-desk/playbook/PlaybookClientQualifierGuide";
import { PlaybookListingBoostGuide } from "../../components/deal-desk/playbook/PlaybookListingBoostGuide";
import { PlaybookAssumableGuide } from "../../components/deal-desk/playbook/PlaybookAssumableGuide";
import { PlaybookSellerNetGuide } from "../../components/deal-desk/playbook/PlaybookSellerNetGuide";
import { PlaybookCompletion } from "../../components/deal-desk/playbook/PlaybookCompletion";
import { PlaybookToolGuides } from "../../components/deal-desk/playbook/PlaybookToolGuides";
import Nexio from "../../components/Nexio";
import { printPlaybookQuickReference } from "../../utils/generatePlaybookPDF";

const PHONE_DISPLAY = "(301) 555-0123";
const NMLS_ID = "2831765";

export default function DealDeskPlaybook() {
  const [pdfLoading, setPdfLoading] = useState(false);

  usePageMetadata(PAGE_METADATA.dealDeskPlaybook);

  const handleDownload = useCallback(() => {
    setPdfLoading(true);
    const onAfterPrint = () => {
      setPdfLoading(false);
      window.removeEventListener("afterprint", onAfterPrint);
    };
    window.addEventListener("afterprint", onAfterPrint);
    printPlaybookQuickReference();
    window.setTimeout(() => {
      setPdfLoading(false);
      window.removeEventListener("afterprint", onAfterPrint);
    }, 4000);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[calc(var(--site-header-height)+0.25rem)]">
      <div className="print:hidden">
        <DealDeskHeader toolTitle="Agent Playbook" />
        <PlaybookHero onDownloadPdf={handleDownload} pdfLoading={pdfLoading} />
        <PlaybookTimeline />
        <PlaybookToolGuides />
        <PlaybookClientQualifierGuide />
        <PlaybookListingBoostGuide />
        <PlaybookAssumableGuide />
        <PlaybookSellerNetGuide />
        <PlaybookScripts />
        <PlaybookFAQ />
        <PlaybookCompletion />
        <PlaybookPartnerCTA />
      </div>

      <div
        id="playbook-pdf"
        className="hidden print:block"
        aria-hidden
      >
        <div className="min-h-[10.5in] max-w-[8.5in] bg-white p-[0.55in] font-sans text-[10px] leading-snug text-[#0B2A4A]">
          <header className="flex items-center gap-4 border-b-2 border-[#C6A15B] pb-3">
            <IHLLogo className="h-12 w-auto" alt="" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B2A4A]">Infinite Home Lending</p>
              <p className="font-[Georgia,serif] text-[14px] italic text-[#C6A15B]">The Deal Desk</p>
              <p className="mt-1 text-[9px] text-slate-600">Where serious agents bring their deals.</p>
            </div>
          </header>

          <div className="mt-4 grid grid-cols-[1fr_9.2rem] gap-4">
            <div>
              <h2 className="border-b border-[#0B2A4A]/20 pb-1 font-sans text-[11px] font-bold uppercase tracking-wide text-[#0B2A4A]">
                Tool reference
              </h2>
              <table className="mt-2 w-full border-collapse text-[8.5px]">
                <thead>
                  <tr className="border-b border-[#0B2A4A] bg-[#0B2A4A] text-left text-white">
                    <th className="p-1.5 font-semibold">Tool</th>
                    <th className="p-1.5 font-semibold">When to use</th>
                    <th className="p-1.5 font-semibold">Key number to show</th>
                    <th className="p-1.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "The Offer Optimizer",
                      "At the offer table",
                      'Seller nets $X more with buydown vs. price cut',
                      "Live at infinitehomelending.com/deal-desk",
                    ],
                    [
                      "The Client Qualifier",
                      "Before first showing",
                      "Max qualifying price + loan type recommendation",
                      "Live at infinitehomelending.com/deal-desk/client-qualifier",
                    ],
                    [
                      "The Listing Boost",
                      "Stale listings",
                      "# of additional buyers who qualify at buydown payment",
                      "Live at infinitehomelending.com/deal-desk/listing-boost",
                    ],
                    [
                      "The Assumable Calculator",
                      "FHA/VA assumable loans",
                      "Monthly savings vs. new loan at current rates",
                      "Live at infinitehomelending.com/deal-desk/assumable-calculator",
                    ],
                    [
                      "The Seller Net Sheet",
                      "Listing appointments",
                      "Walk-away proceeds at 3 price scenarios",
                      "Live at infinitehomelending.com/deal-desk/net-sheet",
                    ],
                  ].map((row, ri) => (
                    <tr key={ri} className="border-b border-slate-200">
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-1.5 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="border-b border-[#0B2A4A]/20 pb-1 font-sans text-[10px] font-bold uppercase text-[#0B2A4A]">Offer Optimizer — quick steps</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-3.5 text-[8.5px] text-slate-800">
                <li>Enter concession budget</li>
                <li>Select 2-1 buydown (most common)</li>
                <li>Lead with Year 1 payment (Panel B)</li>
                <li>Show seller net proceeds comparison</li>
                <li>Get the pre-approval letter from IHL</li>
              </ol>
              <h2 className="mt-3 border-b border-[#0B2A4A]/20 pb-1 font-sans text-[10px] font-bold uppercase text-[#0B2A4A]">Scripts (1 line)</h2>
              <ul className="mt-2 space-y-1.5 text-[8.5px] text-slate-800">
                <li>
                  <span className="font-semibold text-[#C6A15B]">Seller:</span> &quot;Same $15k — you net more with the buydown.&quot;
                </li>
                <li>
                  <span className="font-semibold text-[#C6A15B]">Buyer:</span> &quot;Your Year 1 payment is $X — $Y less than without it.&quot;
                </li>
                <li>
                  <span className="font-semibold text-[#C6A15B]">Listing agent:</span> &quot;Pre-approval references this specific structure.&quot;
                </li>
              </ul>
            </div>
          </div>

          <footer className="mt-6 border-t border-[#C6A15B]/40 pt-3 text-center text-[8px] text-slate-600">
            <p>
              Questions? Call/text Javier: {PHONE_DISPLAY} &nbsp;|&nbsp; Alma: {PHONE_DISPLAY}
            </p>
            <p className="mt-0.5 font-semibold text-[#0B2A4A]">infinitehomelending.com/deal-desk</p>
            <p className="mt-1">
              NMLS #{NMLS_ID} · Equal Housing Lender
            </p>
          </footer>
        </div>
      </div>
      <Nexio />
    </div>
  );
}
