import { useEffect, useState, type FormEvent } from "react";
import { PageContainer } from "../components/PageContainer";
import { IHLLogo } from "../components/IHLLogo";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { apiUrl } from "../lib/apiBase";
import { formatPhoneNumber } from "../lib/formatPhoneNumber";

const LOAN_PURPOSE_OPTIONS = [
  { value: "purchase", label: "Purchase a home" },
  { value: "refinance", label: "Refinance" },
  { value: "heloc", label: "Home equity line of credit (HELOC)" },
  { value: "reverse", label: "Reverse mortgage" },
] as const;

const BEST_DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const BEST_TIME_OPTIONS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
] as const;

const LEAD_SOURCE_OPTIONS = [
  "Facebook",
  "Instagram",
  "Google Search",
  "Referral – Friend or Family",
  "Realtor Referral",
  "Other Lending Professional",
  "Other",
] as const;

const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type UtmParams = Partial<Record<(typeof UTM_PARAM_KEYS)[number], string>>;

type FormState = {
  fullName: string;
  phone: string;
  smsConsent: boolean;
  email: string;
  loanPurpose: string;
  propertyState: string;
  leadSource: string;
  bestDay: string;
  bestTime: string;
  focusNotes: string;
};

const INITIAL: FormState = {
  fullName: "",
  phone: "",
  smsConsent: false,
  email: "",
  loanPurpose: "",
  propertyState: "",
  leadSource: "",
  bestDay: "",
  bestTime: "",
  focusNotes: "",
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#0B2A4A]";

const fieldClass =
  "w-full border border-[#E5E5E0] bg-white px-4 py-3.5 text-sm text-[#2E2E2E] outline-none transition-colors focus:border-[#0B2A4A]";

const selectClass = `${fieldClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%230B2A4A%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10`;

const checkboxClass =
  "mt-0.5 h-4 w-4 shrink-0 border border-[#E5E5E0] text-[#0B2A4A] focus:ring-[#0B2A4A] focus:ring-offset-0";

export default function RequestACall() {
  usePageMetadata({
    title: "Request a Call | Infinite Home Lending",
    description:
      "Share a few details and a mortgage advisor will reach out within 2 hours during business hours to schedule a time to talk.",
    canonical: "https://www.infinitehomelending.com/request-a-call",
  });

  const [form, setForm] = useState<FormState>(INITIAL);
  const [utmParams, setUtmParams] = useState<UtmParams>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captured: UtmParams = {};
    for (const key of UTM_PARAM_KEYS) {
      const value = params.get(key)?.trim();
      if (value) captured[key] = value;
    }
    setUtmParams(captured);
  }, []);

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
    if (!form.email.trim() || !isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.loanPurpose) {
      setError("Please select a loan purpose.");
      return;
    }
    if (!form.propertyState) {
      setError("Please select the property state.");
      return;
    }
    if (!form.leadSource) {
      setError("Please select how you heard about us.");
      return;
    }
    if (!form.bestDay) {
      setError("Please select the best day to reach you.");
      return;
    }
    if (!form.bestTime) {
      setError("Please select the best time to reach you.");
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
          smsConsent: form.smsConsent === true,
          email: form.email.trim(),
          loanPurpose: form.loanPurpose,
          propertyState: form.propertyState,
          leadSource: form.leadSource,
          bestDay: form.bestDay,
          bestTime: form.bestTime,
          focusNotes: form.focusNotes.trim() || undefined,
          ...utmParams,
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
                    placeholder="(312) 234-2345"
                    value={form.phone}
                    onChange={(e) => update("phone", formatPhoneNumber(e.target.value))}
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      id="rac-sms-consent"
                      name="smsConsent"
                      type="checkbox"
                      checked={form.smsConsent}
                      onChange={(e) => update("smsConsent", e.target.checked)}
                      className={checkboxClass}
                    />
                    <label
                      htmlFor="rac-sms-consent"
                      className="cursor-pointer text-sm leading-relaxed text-[#2E2E2E]"
                    >
                      I agree to receive SMS text messages from Infinite Home Lending regarding
                      my inquiry, loan application, loan status, appointment reminders, document
                      requests, and customer support. Message frequency varies. Message and data
                      rates may apply. Reply STOP to opt out or HELP for assistance. Consent is not
                      a condition of purchasing any products or services.
                    </label>
                  </div>
                  <p className="pl-7 text-sm leading-relaxed text-[#2E2E2E]">
                    <a
                      href="https://www.infinitehomelending.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Privacy Policy (opens in a new tab)"
                      className="text-[#0B2A4A] underline decoration-[#C6A15B]/60 underline-offset-2 hover:text-[#C6A15B]"
                    >
                      Privacy Policy
                    </a>
                    <span aria-hidden="true"> | </span>
                    <a
                      href="https://www.infinitehomelending.com/sms-terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="SMS Terms & Conditions (opens in a new tab)"
                      className="text-[#0B2A4A] underline decoration-[#C6A15B]/60 underline-offset-2 hover:text-[#C6A15B]"
                    >
                      SMS Terms &amp; Conditions
                    </a>
                  </p>
                </div>

                <div>
                  <label htmlFor="rac-email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    id="rac-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
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
                    className={selectClass}
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
                  <label htmlFor="rac-property-state" className={labelClass}>
                    Property state *
                  </label>
                  <select
                    id="rac-property-state"
                    required
                    value={form.propertyState}
                    onChange={(e) => update("propertyState", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select property state
                    </option>
                    <option value="MD">Maryland</option>
                    <option value="DC">Washington, DC</option>
                    <option value="VA">Virginia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rac-lead-source" className={labelClass}>
                    How did you hear about us? *
                  </label>
                  <select
                    id="rac-lead-source"
                    required
                    value={form.leadSource}
                    onChange={(e) => update("leadSource", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {LEAD_SOURCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rac-best-day" className={labelClass}>
                    Best day to reach you *
                  </label>
                  <select
                    id="rac-best-day"
                    required
                    value={form.bestDay}
                    onChange={(e) => update("bestDay", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select best day
                    </option>
                    {BEST_DAY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rac-best-time" className={labelClass}>
                    Best time to reach you *
                  </label>
                  <select
                    id="rac-best-time"
                    required
                    value={form.bestTime}
                    onChange={(e) => update("bestTime", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select best time
                    </option>
                    {BEST_TIME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
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
