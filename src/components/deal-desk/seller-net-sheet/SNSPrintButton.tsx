export function SNSPrintButton() {
  return (
    <div className="sns-print-row flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <button
        type="button"
        onClick={() => window.print()}
        className="run-btn inline-flex items-center justify-center rounded-md border-2 border-[#0B2A4A] bg-white px-5 py-2.5 font-sans text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#0B2A4A] hover:text-white"
      >
        🖨 Print / Save as PDF
      </button>
      <p className="font-sans text-[11px] text-slate-500">Share with your seller at the listing appointment</p>
    </div>
  );
}
