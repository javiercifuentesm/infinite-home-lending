import { useState, type FormEvent } from "react";
import { PageContainer } from "../components/PageContainer";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { apiUrl } from "../lib/apiBase";

const emailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const phoneValid = (value: string) => value.replace(/\D/g, "").length >= 10;
const formatPhoneNumber = (value: string) => value;
const contactSmsCheckboxClass = "mt-1 h-4 w-4 shrink-0 accent-[#0B2A4A]";

export default function ContactUs() {
 const { t, lang } = useLanguage();
 const [firstName, setFirstName] = useState("");
 const [email, setEmail] = useState("");
 const [phone, setPhone] = useState("");
 const [notes, setNotes] = useState("");
 const [smsConsent, setSmsConsent] = useState(false);
 const [submitted, setSubmitted] = useState(false);
 const [sending, setSending] = useState(false);
 const [error, setError] = useState("");
 usePageMetadata({ title: lang === "es" ? "Contáctenos | Infinite Home Lending" : "Contact Us | Infinite Home Lending", description: t("contact.meta.description"), canonical: "https://www.infinitehomelending.com/contact-us" });
 const canSubmit = firstName.trim().length > 0 && emailValid(email) && phoneValid(phone);
 async function onSubmit(event: FormEvent) {
  event.preventDefault(); if (!canSubmit || sending) return;
  setSending(true); setError("");
  const parts = firstName.trim().split(/\s+/);
  try {
   const response = await fetch(apiUrl("/api/submit-lead"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName: parts[0], lastName: parts.slice(1).join(" "), email: email.trim(), phone: phone.trim(), smsConsent, smsConsentSource: "/contact-us", path: "explore", answers: { "Notes": notes.trim(), "Entry context": "Standalone Contact Us (/contact-us)" }, hasUploadedStatement: false, submittedLang: lang }) });
   const data = await response.json();
   if (!response.ok || data.ok !== true) { setError(data.error || t("contact.error.generic")); return; }
   setSubmitted(true); setSmsConsent(false);
  } catch { setError(t("contact.error.network")); }
  finally { setSending(false); }
 }
 return <PageContainer><section className="mx-auto max-w-2xl px-5 py-10 sm:py-14" aria-labelledby="standalone-contact-title">
  {submitted ? <div role="status" className="py-12 text-center text-navy"><h1 className="font-display text-3xl">{lang === "es" ? "¡Gracias!" : "Thank you!"}</h1><p className="mt-5">{lang === "es" ? "Nos pondremos en contacto con usted en las próximas 24 horas o antes." : "We will be in touch in the next 24 hours or sooner."}</p><p className="mt-3">{lang === "es" ? "¡Esperamos conectar con usted!" : "We can't wait to connect with you!"}</p></div> : <>
  <h1 id="standalone-contact-title" className="text-center font-display text-2xl text-navy">{t("contact.step.details.title")}</h1>
  <form onSubmit={onSubmit} className="mt-7 space-y-6">
                      <div className="option-group mx-auto space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="sc-notes" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.notes.label")}
                          </label>
                          <textarea
                            id="sc-notes"
                            name="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t("contact.step.details.notes.placeholder")}
                            className="w-full resize-y rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="sc-first" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.name.label")} *
                          </label>
                          <input
                            id="sc-first"
                            required
                            type="text"
                            autoComplete="name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25"
                            placeholder={t("contact.step.details.name.placeholder")}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="sc-email" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.email.label")} *
                          </label>
                          <input
                            id="sc-email"
                            required
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={email.length > 0 && !emailValid(email)}
                            className={`w-full rounded-xl border bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:ring-2 focus:ring-[#C6A15B]/25 ${
                              email.length > 0 && !emailValid(email)
                                ? "border-red-400/80 focus:border-red-500"
                                : "border-[#E5E7EB] focus:border-[#C6A15B]"
                            }`}
                            placeholder={t("contact.step.details.email.placeholder")}
                          />
                          {email.length > 0 && !emailValid(email) ? (
                            <p className="font-sans text-[13px] text-red-600" role="alert">
                              {t("contact.step.details.email.error")}
                            </p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="sc-phone" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.phone.label")} *
                          </label>
                          <input
                            id="sc-phone"
                            required
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                            aria-invalid={phone.length > 0 && !phoneValid(phone)}
                            className={`w-full rounded-xl border bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:ring-2 focus:ring-[#C6A15B]/25 ${
                              phone.length > 0 && !phoneValid(phone)
                                ? "border-red-400/80 focus:border-red-500"
                                : "border-[#E5E7EB] focus:border-[#C6A15B]"
                            }`}
                            placeholder={t("contact.step.details.phone.placeholder")}
                          />
                          {phone.length > 0 && !phoneValid(phone) ? (
                            <p className="font-sans text-[13px] text-red-600" role="alert">
                              {t("contact.step.details.phone.error")}
                            </p>
                          ) : null}
                        </div>
                        <fieldset className="space-y-3 border-0 p-0">
                          <legend className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.sms.legend")}
                          </legend>
                          <div className="flex items-start gap-3">
                            <input
                              id="sc-sms-consent"
                              name="smsConsent"
                              type="checkbox"
                              checked={smsConsent}
                              onChange={(event) => setSmsConsent(event.target.checked)}
                              className={contactSmsCheckboxClass}
                            />
                            <label
                              htmlFor="sc-sms-consent"
                              className="cursor-pointer font-sans text-[14px] leading-relaxed text-navy"
                            >
                              {t("contact.step.details.sms.yes")}
                            </label>
                          </div>
                          <p className="font-sans text-[13px] leading-relaxed text-slate-600">
                            {t("contact.step.details.sms.linksPrefix")} {" "}
                            <a
                              href="https://www.infinitehomelending.com/privacy-policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t("contact.step.details.sms.privacyLink.aria")}
                              className="text-[#0B2A4A] underline decoration-[#C6A15B]/60 underline-offset-2 hover:text-[#C6A15B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/40"
                            >
                              {t("contact.step.details.sms.privacyLink")}
                            </a>
                            <span aria-hidden="true"> | </span>
                            <a
                              href="https://www.infinitehomelending.com/terms-of-use"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t("contact.step.details.sms.termsLink.aria")}
                              className="text-[#0B2A4A] underline decoration-[#C6A15B]/60 underline-offset-2 hover:text-[#C6A15B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/40"
                            >
                              {t("contact.step.details.sms.termsLink")}
                            </a>
                          </p>
                        </fieldset>
                      </div>

   {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
   <button type="submit" disabled={!canSubmit || sending} className="btn-primary min-h-[52px] w-full disabled:opacity-50">{sending ? t("contact.btn.sending") : t("contact.btn.connect")}</button>
  </form></>}
 </section></PageContainer>;
}
