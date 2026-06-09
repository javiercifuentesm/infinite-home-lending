import { useState, type FormEvent, type ReactNode } from "react";
import { apiUrl } from "../../lib/apiBase";
import { careersColors, careersFonts } from "./careersTheme";

type FormState = {
  name: string;
  email: string;
  phone: string;
  nmls: string;
  experience: string;
  employer: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  nmls: "",
  experience: "",
  employer: "",
  message: "",
};

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  color: "#ffffff",
} as const;

const labelStyle = {
  fontFamily: careersFonts.body,
  fontSize: "10px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.45)",
};

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block" style={labelStyle}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

export function CareersContactForm() {
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

    if (!form.name.trim() || !form.email.trim() || !form.nmls.trim()) {
      setError("Please complete your name, email, and NMLS number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/careers-contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      setForm(INITIAL);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-sm p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(198,161,91,0.25)",
        }}
      >
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
        >
          Thank you for reaching out.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
          We appreciate your interest in Infinite Home Lending. A member of our team will review
          your information and be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-[11px] uppercase tracking-[0.1em]"
          style={{
            background: "transparent",
            border: "none",
            color: careersColors.gold,
            cursor: "pointer",
            fontFamily: careersFonts.body,
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldClass =
    "w-full min-h-[48px] rounded-sm px-4 py-3.5 text-sm outline-none transition-colors focus:border-[rgba(198,161,91,0.45)]";

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
      <Field id="careers-name" label="Full Name" required>
        <input
          id="careers-name"
          type="text"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={fieldClass}
          style={inputStyle}
        />
      </Field>

      <Field id="careers-email" label="Email" required>
        <input
          id="careers-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={fieldClass}
          style={inputStyle}
        />
      </Field>

      <Field id="careers-phone" label="Phone">
        <input
          id="careers-phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={fieldClass}
          style={inputStyle}
        />
      </Field>

      <Field id="careers-nmls" label="NMLS Number" required>
        <input
          id="careers-nmls"
          type="text"
          inputMode="numeric"
          required
          value={form.nmls}
          onChange={(e) => update("nmls", e.target.value)}
          className={fieldClass}
          style={inputStyle}
        />
      </Field>

      <Field id="careers-experience" label="Years of Experience">
        <input
          id="careers-experience"
          type="text"
          value={form.experience}
          onChange={(e) => update("experience", e.target.value)}
          className={fieldClass}
          style={inputStyle}
        />
      </Field>

      <Field id="careers-employer" label="Current Employer">
        <input
          id="careers-employer"
          type="text"
          value={form.employer}
          onChange={(e) => update("employer", e.target.value)}
          className={fieldClass}
          style={inputStyle}
        />
      </Field>

      <Field id="careers-message" label="What are you looking to build?">
        <textarea
          id="careers-message"
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${fieldClass} min-h-[120px] resize-y`}
          style={inputStyle}
        />
      </Field>

      {error && (
        <p className="text-sm" style={{ color: "#f87171" }} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full min-h-[48px] py-4 text-[11px] font-medium uppercase tracking-[0.12em] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: careersColors.gold,
          color: careersColors.navy,
          border: "none",
          cursor: submitting ? "not-allowed" : "pointer",
          fontFamily: careersFonts.body,
        }}
      >
        {submitting ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
