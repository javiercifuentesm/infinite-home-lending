import { useCallback, useRef, useState } from "react";
import { useMAAuth } from "../../hooks/useMAAuth";

type Props = { onAuth: () => void };

export function MAGate({ onAuth }: Props) {
  const { validateEmployeeId } = useMAAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleValidate = useCallback(() => {
    const raw = id.trim().toUpperCase();
    if (!raw || loading || success) return;
    setShowError(false);
    setLoading(true);
    window.setTimeout(() => {
      const ok = validateEmployeeId(raw);
      setLoading(false);
      if (ok) {
        setSuccess(true);
        window.setTimeout(() => onAuth(), 800);
      } else {
        setShowError(true);
        window.setTimeout(() => setShowError(false), 3000);
      }
    }, 600);
  }, [id, loading, success, validateEmployeeId, onAuth]);

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/ihl-logo.png" alt="Infinite Home Lending" className="h-14 mx-auto mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">MA Command Center</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_40px_rgba(10,25,47,0.08)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0B2A4A] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-[17px] font-semibold text-[#0B2A4A]">Employee Access</h2>
              <p className="font-sans text-[12px] text-slate-500">IHL Team Members Only</p>
            </div>
          </div>

          <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">
            Employee ID
          </label>
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            spellCheck={false}
            autoComplete="off"
            value={id}
            onChange={(e) => { setId(e.target.value.toUpperCase()); setShowError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            disabled={success}
            placeholder="IHL000000"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[15px] text-[#0B2A4A] tracking-widest placeholder:tracking-normal placeholder:text-slate-300 focus:outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20 transition-all mb-3"
          />

          {showError && (
            <p className="font-sans text-[12px] text-red-500 mb-3">
              That Employee ID doesn't match our records. Please try again or contact Javier.
            </p>
          )}

          <button
            type="button"
            onClick={handleValidate}
            disabled={loading || success || !id.trim()}
            className="w-full h-12 rounded-xl font-sans text-[14px] font-semibold transition-all disabled:opacity-40"
            style={{ background: success ? "#1D9E75" : "linear-gradient(135deg, #C6A15B 0%, #d4b06a 100%)", color: "#0B2A4A" }}
          >
            {loading ? "Verifying..." : success ? "✓ Welcome back!" : "Access Dashboard →"}
          </button>

          <p className="text-center font-sans text-[11px] text-slate-400 mt-5">
            Need help? Contact <span className="text-[#C6A15B]">javier.cifuentes@infinitehomelending.com</span>
          </p>
        </div>

        <p className="text-center font-sans text-[10px] text-slate-400 mt-6">
          Infinite Home Lending · NMLS #2831765 · Internal use only
        </p>
      </div>
    </div>
  );
}
