export function SEQDocChecklist() {
  return (
    <section className="mb-10">
      <h3 className="mb-4 font-serif text-lg font-semibold text-[#0B2A4A]">What you&apos;ll need to document</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[12px] font-medium text-[#0B2A4A]">📋 Tax return path</p>
          <ul className="space-y-2 text-[11px] leading-[1.6] text-slate-600">
            <li>• 2 years personal tax returns (all schedules)</li>
            <li>• Schedule C with all supporting pages</li>
            <li>• 2 years business profit & loss</li>
            <li>• YTD P&L statement (if needed)</li>
            <li>• Business license or CPA letter</li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[12px] font-medium text-[#3B6D11]">🏦 Bank statement path</p>
          <ul className="space-y-2 text-[11px] leading-[1.6] text-slate-600">
            <li>• 12–24 months business bank statements</li>
            <li>• All pages, no gaps allowed</li>
            <li>• Business license required</li>
            <li>• CPA letter confirming self-employment</li>
            <li>• 1099s from major clients (some lenders)</li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[12px] font-medium text-[#854F0B]">📌 Both paths require</p>
          <ul className="space-y-2 text-[11px] leading-[1.6] text-slate-600">
            <li>• 2+ years self-employment history</li>
            <li>• Credit score 620+ (680+ preferred)</li>
            <li>• Signed 4506-C (IRS transcript auth.)</li>
            <li>• 3–6 months cash reserves</li>
            <li>• Business stability evidence</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
