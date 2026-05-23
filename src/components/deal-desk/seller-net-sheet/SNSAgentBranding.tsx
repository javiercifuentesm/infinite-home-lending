import { useRef, type ChangeEvent } from "react";

export type AgentBranding = {
  name: string;
  brokerage: string;
  phone: string;
  email: string;
  logoDataUrl: string | null;
};

type Props = {
  branding: AgentBranding;
  onChange: (next: AgentBranding) => void;
};

const fieldClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-sans text-[13px] text-slate-900 shadow-sm outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30";
const labelClass = "mb-1 block font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500";

export function SNSAgentBranding({ branding, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const patch = (p: Partial<AgentBranding>) => onChange({ ...branding, ...p });

  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      patch({ logoDataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-[#C6A15B]/30 bg-[rgba(198,161,91,0.04)] p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#C6A15B]"
          style={{ background: "rgba(198,161,91,0.12)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </span>
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#854F0B]">PDF Branding</p>
          <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your agent information</h3>
        </div>
      </div>
      <p className="mb-5 font-sans text-[12px] leading-relaxed text-slate-500">
        This PDF is yours to present to your seller. Add your details and logo — the exported document will show your branding, not IHL's.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Your name</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="Jane Smith"
            value={branding.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Brokerage</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="Keller Williams / Compass / etc."
            value={branding.brokerage}
            onChange={(e) => patch({ brokerage: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            className={fieldClass}
            placeholder="(301) 555-0100"
            value={branding.phone}
            onChange={(e) => patch({ phone: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={fieldClass}
            placeholder="jane@brokerage.com"
            value={branding.email}
            onChange={(e) => patch({ email: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Logo (optional)</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200/90 bg-white px-4 py-2 font-sans text-[12px] font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#C6A15B]/60 hover:text-[#0B2A4A]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              {branding.logoDataUrl ? "Change logo" : "Upload logo"}
            </button>
            {branding.logoDataUrl ? (
              <div className="flex items-center gap-3">
                <img src={branding.logoDataUrl} alt="Logo preview" className="h-8 max-w-[120px] object-contain" />
                <button
                  type="button"
                  onClick={() => patch({ logoDataUrl: null })}
                  className="font-sans text-[11px] text-slate-400 underline hover:text-slate-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className="font-sans text-[11px] text-slate-400">PNG, JPG, SVG — appears in PDF header</span>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
          </div>
        </div>
      </div>
    </div>
  );
}
