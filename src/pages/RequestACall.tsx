import { useState, type FormEvent } from "react";
import { PageContainer } from "../components/PageContainer";
import { IHLLogo } from "../components/IHLLogo";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { apiUrl } from "../lib/apiBase";

const LOAN_PURPOSE_OPTIONS = [
  { value: "purchase", label: "Purchase a home" },
  { value: "refinance", label: "Refinance" },
  { value: "heloc", label: "Home equity line of credit (HELOC)" },
  { value: "reverse", label: "Reverse mortgage" },
] as const;

type FormState = {
  fullName: string;
  phone: string;
  loanPurpose: string;
  bestTimeToReach: string;
  focusNotes: string;
};

const INITIAL: FormState = {
  fullName: "",
  phone: "",
  loanPurpose: "",
  bestTimeToReach: "",
  focusNotes: "",
};

const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#0B2A4A]";

const fieldClass =
  "w-full border border-[#E5E5E0] bg-white px-4 py-3.5 text-sm text-[#2E2E2E] outline-none transition-colors focus:border-[#0B2A4A]";

export default function RequestACall() {
  usePageMetadata({
    title: "Request a Call | Infinite Home Lending",
    description:
      "Share a few details and a mortgage advisor will reach out within 2 hours during business hours to schedule a time to talk.",
    canonical: "https://www.infinitehomelending.com/request-a-call",
  });

  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Please enter your best phone number.");
      return;
    }
    if (!form.loanPurpose) {
      setError("Please select a loan purpose.");
      return;
    }
    if (!form.bestTimeToReach.trim()) {
      setError("Please tell us the best day and time to reach you.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/request-a-call"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          loanPurpose: form.loanPurpose,
          bestTimeToReach: form.bestTimeToReach.trim(),
          focusNotes: form.focusNotes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Submission failed");
      }

      setSubmitted(true);
      setForm(INITIAL);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Submission failed"
          ? err.message
          : "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="min-h-[calc(100vh-120px)] bg-[#F7F7F5] pb-16">
      <div className="mx-auto w-full max-w-xl px-5 pt-10 sm:px-6 sm:pt-14">
        <div className="border border-[#E5E5E0] bg-white px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 flex justify-center border-b border-[#E5E5E0] pb-8">
            <IHLLogo
              className="h-20 w-auto sm:h-24"
              fetchPriority="high"
              style={{ maxWidth: "min(100%, 280px)" }}
            />
          </div>

          {submitted ? (
            <div className="text-center">
              <h1
                className="font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-[#0B2A4A] sm:text-[2rem]"
              >
                Request received
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#2E2E2E]">
                Thank you. A mortgage advisor will reach out within 2 hours during business hours
                to schedule a time to talk.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 text-[11px] uppercase tracking-[0.12em] text-[#C6A15B] transition-opacity hover:opacity-80"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <>
              <header className="mb-8 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#C6A15B]">
                  Infinite Home Lending
                </p>
                <h1
                  className="font-display mt-3 text-[1.85rem] font-semibold tracking-[-0.02em] text-[#0B2A4A] sm:text-[2.1rem]"
                >
                  Request a call
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-[#2E2E2E]">
                  Share a few details and a mortgage advisor will reach out within 2 hours during
                  business hours to schedule a time to talk.
                </p>
              </header>

              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="rac-full-name" className={labelClass}>
                    Full name *
                  </label>
                  <input
                    id="rac-full-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="rac-phone" className={labelClass}>
                    Best phone number *
                  </label>
                  <input
                    id="rac-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="rac-loan-purpose" className={labelClass}>
                    Loan purpose *
                  </label>
                  <select
                    id="rac-loan-purpose"
                    required
                    value={form.loanPurpose}
                    onChange={(e) => update("loanPurpose", e.target.value)}
                    className={`${fieldClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%230B2A4A%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="" disabled>
                      Select loan purpose
                    </option>
                    {LOAN_PURPOSE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rac-best-time" className={labelClass}>
                    Best day &amp; time to reach you *
                  </label>
                  <input
                    id="rac-best-time"
                    type="text"
                    required
                    placeholder="e.g. Weekday mornings, Tuesday after 3pm"
                    value={form.bestTimeToReach}
                    onChange={(e) => update("bestTimeToReach", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="rac-focus" className={labelClass}>
                    What would you like to focus on during our call?
                  </label>
                  <textarea
                    id="rac-focus"
                    rows={4}
                    value={form.focusNotes}
                    onChange={(e) => update("focusNotes", e.target.value)}
                    className={`${fieldClass} min-h-[120px] resize-y`}
                  />
                </div>

                {error && (
                  <p className="text-sm text-[#A32D2D]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full border border-[#0B2A4A] bg-[#0B2A4A] px-4 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Request my call"}
                </button>
              </form>
            </>
          )}

          <p className="mt-8 border-t border-[#E5E5E0] pt-6 text-center text-[11px] leading-relaxed text-[#64748b]">
            Infinite Home Lending, LLC · NMLS #2831765 · Equal Housing Lender — Your information is
            shared only with your mortgage advisor and is never sold.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
