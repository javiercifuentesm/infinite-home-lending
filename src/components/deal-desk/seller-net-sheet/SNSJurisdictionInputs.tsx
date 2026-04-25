import type { JurisdictionKey, SellerNetInputs } from "../../../hooks/useSellerNetMath";

const label = "mb-1.5 block font-sans text-[12px] font-semibold text-[#0B2A4A]";
const input =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";
const select = input;

type Props = {
  inputs: SellerNetInputs;
  onChange: (next: SellerNetInputs) => void;
};

export function SNSJurisdictionInputs({ inputs, onChange }: Props) {
  const set = <K extends keyof SellerNetInputs>(key: K, value: SellerNetInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section id="sns-jurisdiction" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">2</span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Jurisdiction &amp; fees</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="sns-state" className={label}>
            State / jurisdiction
          </label>
          <select
            id="sns-state"
            className={select}
            value={inputs.state}
            onChange={(e) => set("state", e.target.value as JurisdictionKey)}
          >
            <optgroup label="Maryland">
              <option value="md_montgomery">MD — Montgomery County</option>
              <option value="md_pg">MD — Prince George&apos;s County</option>
              <option value="md_frederick">MD — Frederick County</option>
              <option value="md_other">MD — Other County (avg)</option>
            </optgroup>
            <optgroup label="Virginia">
              <option value="va_nova">VA — Northern Virginia (NoVA)</option>
              <option value="va_other">VA — Rest of Virginia</option>
            </optgroup>
            <optgroup label="DC">
              <option value="dc">Washington DC</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label htmlFor="sns-titleFee" className={label}>
            Title / settlement fee ($)
          </label>
          <input
            id="sns-titleFee"
            type="number"
            step={100}
            className={input}
            value={inputs.titleFee || ""}
            onChange={(e) => set("titleFee", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Estimate from your title company</p>
        </div>
        <div>
          <label htmlFor="sns-taxPro" className={label}>
            Property tax proration ($)
          </label>
          <input
            id="sns-taxPro"
            type="number"
            step={100}
            className={input}
            value={inputs.taxPro || ""}
            onChange={(e) => set("taxPro", Number.parseFloat(e.target.value) || 0)}
          />
          <p className="mt-1 font-sans text-[11px] text-slate-500">Seller&apos;s share based on closing date</p>
        </div>
        <div>
          <label htmlFor="sns-other" className={label}>
            Other seller costs ($)
          </label>
          <input
            id="sns-other"
            type="number"
            step={100}
            className={input}
            value={inputs.other || ""}
            onChange={(e) => set("other", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </section>
  );
}
