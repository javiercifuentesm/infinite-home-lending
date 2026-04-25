import { Link } from "react-router-dom";
import { Download } from "lucide-react";

type Props = {
  onDownloadPdf: () => void;
  pdfLoading: boolean;
};

export function PlaybookHero({ onDownloadPdf, pdfLoading }: Props) {
  return (
    <section className="border-b border-slate-200/90 bg-white px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C6A15B]">The Deal Desk Playbook</p>
        <h1 className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-tight text-[#0B2A4A]">
          Five tools. Five moments. One lender partner.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-[16px] leading-relaxed text-slate-600">
          Everything you need to know to use The Deal Desk tools in real transactions — including the exact scripts that move sellers, qualify buyers,
          and position you as the most prepared agent in the room.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B2A4A] px-6 py-3 font-sans text-[14px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-70"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden />
            {pdfLoading ? "Opening print…" : "Download Quick Reference Card (PDF)"}
          </button>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md border-2 border-[#C6A15B] bg-white px-6 py-3 font-sans text-[14px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#C6A15B]/10"
          >
            Partner with IHL
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 font-sans text-[12px] text-slate-500">
          <span>Playbook + 5 tools</span>
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <span>Built for MD-DC-VA</span>
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <span>Free for partner agents</span>
        </div>
      </div>
    </section>
  );
}
