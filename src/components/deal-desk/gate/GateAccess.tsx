import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDealDeskAuth } from "../../../hooks/useDealDeskAuth";

export function GateAccess() {
  const { validateCode } = useDealDeskAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqBrokerage, setReqBrokerage] = useState("");
  const [reqPhone, setReqPhone] = useState("");
  const [reqNote, setReqNote] = useState("");
  const [reqDone, setReqDone] = useState(false);

  const handleValidate = useCallback(() => {
    const raw = code.trim().toUpperCase();
    if (!raw || loading || success) return;

    setShowError(false);
    inputRef.current?.classList.remove("err", "ok");
    setLoading(true);

    window.setTimeout(() => {
      const ok = validateCode(raw);
      setLoading(false);
      if (ok) {
        setSuccess(true);
        inputRef.current?.classList.add("ok");
        window.setTimeout(() => {
          navigate("/deal-desk", { replace: true });
        }, 800);
      } else {
        setShowError(true);
        inputRef.current?.classList.add("err");
        window.setTimeout(() => {
          inputRef.current?.classList.remove("err");
        }, 600);
      }
    }, 600);
  }, [code, loading, success, validateCode, navigate]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const pos = el.selectionStart ?? 0;
    const next = el.value.toUpperCase();
    setCode(next);
    queueMicrotask(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    });
    if (showError) setShowError(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleValidate();
    }
  };

  const onReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim()) return;
    setReqDone(true);
    setReqName("");
    setReqEmail("");
    setReqBrokerage("");
    setReqPhone("");
    setReqNote("");
  };

  const benefits = [
    "All 12 Deal Desk tools — instant access",
    "Nexio AI Strategic Partner on every page",
    "Direct line to our Mortgage Advisors on every deal",
    "No referral quotas — no exclusivity requirements",
    "90-day browser session — enter once, use freely",
  ];

  return (
    <section className="gate-access">
      <div className="gate-access__inner">
        <div className="gate-fade">
          <p className="gate-section-label">Partner Access</p>
          <h2 className="gate-access__heading">Enter your partner code to access The Deal Desk.</h2>
          <p className="gate-access__intro">
            Partner codes are issued by our Mortgage Advisors during your Deal Desk onboarding. Each code grants 90 days of access from a single browser session.
          </p>
          <ul className="gate-access__benefits">
            {benefits.map((b) => (
              <li key={b} className="gate-access__benefit">
                <span className="gate-access__check" aria-hidden>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="gate-fade gate-d2">
          <div className="gate-code-card">
            <div className="gate-code-card__head">
              <span className="gate-code-card__head-icon" aria-hidden>
                🔐
              </span>
              <div>
                <h3 className="gate-code-card__head-title">Enter your partner code</h3>
                <p className="gate-code-card__head-sub">Issued by our Mortgage Advisors during onboarding</p>
              </div>
            </div>

            <div className="gate-code-card__body">
              <label className="gate-req-label" htmlFor="deal-desk-access-code">
                ACCESS CODE
              </label>
              <input
                id="deal-desk-access-code"
                ref={inputRef}
                type="text"
                inputMode="text"
                autoComplete="one-time-code"
                spellCheck={false}
                value={code}
                onChange={onInput}
                onKeyDown={onKeyDown}
                disabled={success}
                placeholder="IHL-XXXX"
                className="gate-code-input"
              />

              <p className={`gate-code-error ${showError ? "show" : ""}`}>
                That code doesn&apos;t match our records. Double-check or request access below.
              </p>

              <button
                type="button"
                onClick={handleValidate}
                disabled={loading || success}
                className={`gate-access__btn ${loading ? "loading" : ""} ${success ? "gate-access__btn--success" : ""}`}
              >
                {loading ? "Checking..." : success ? "✓ Welcome to The Deal Desk" : "Access The Deal Desk →"}
              </button>

              <p className="gate-access__forgot">
                Forgot your code?{" "}
                <Link className="gate-access__forgot-contact" to="/contact">
                  Contact a Mortgage Advisor
                </Link>
              </p>

              <div className="gate-access__divider">
                <span>or request access</span>
              </div>

              {!reqDone ? (
                <form
                  onSubmit={onReqSubmit}
                  className="gate-req-form"
                >
                  <label className="gate-req-label" htmlFor="gate-req-name">
                    NAME *
                  </label>
                  <input
                    id="gate-req-name"
                    required
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    placeholder="Your full name"
                    className="gate-req-input"
                  />

                  <label className="gate-req-label" htmlFor="gate-req-email">
                    EMAIL *
                  </label>
                  <input
                    id="gate-req-email"
                    type="email"
                    required
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    placeholder="you@brokerage.com"
                    className="gate-req-input"
                  />

                  <label className="gate-req-label" htmlFor="gate-req-brokerage">
                    BROKERAGE
                  </label>
                  <input
                    id="gate-req-brokerage"
                    value={reqBrokerage}
                    onChange={(e) => setReqBrokerage(e.target.value)}
                    placeholder="Your brokerage name"
                    className="gate-req-input"
                  />

                  <label className="gate-req-label" htmlFor="gate-req-phone">
                    PHONE
                  </label>
                  <input
                    id="gate-req-phone"
                    type="tel"
                    value={reqPhone}
                    onChange={(e) => setReqPhone(e.target.value)}
                    placeholder="(301) 555-0100"
                    className="gate-req-input"
                  />

                  <label className="gate-req-label" htmlFor="gate-req-note">
                    TELL US ABOUT YOUR BUSINESS (OPTIONAL)
                  </label>
                  <textarea
                    id="gate-req-note"
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    placeholder="Markets you work in, years of experience, etc."
                    className="gate-req-input gate-req-textarea"
                  />

                  <button type="submit" className="gate-req-submit">
                    Request Deal Desk Access →
                  </button>
                </form>
              ) : (
                <div className="gate-req-confirm show">
                  ✓ Got it — our Mortgage Advisors will reach out within 24 hours to get you set up.
                </div>
              )}

              <p className="gate-access__fine">
                Free for IHL partner agents in MD, DC, and VA. No subscription. Infinite Home Lending — NMLS #2831765.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
