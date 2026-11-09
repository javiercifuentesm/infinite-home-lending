import { useCallback, useEffect, useId, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Landmark, X, type LucideIcon } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { trackEvent } from "../../../lib/analytics";
import { getLoanProductById } from "../../../data/loanProducts";
import { PROGRAM_DISPLAY_CATEGORY } from "../../../config/solutionsFlagshipConfig";
import { getLoanProgramIcon } from "../../../lib/loanProgramIcons";
import {
  getAdvisorLoanProgramModalView,
} from "../../../lib/advisorLoanProgramModal";
import { useAdvisorLoanProgramModal } from "./AdvisorLoanProgramModalContext";
import "./advisorLoanProgramModal.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const DISPLAY_CATEGORY_I18N = {
  purchase: "solutions.displayCategory.purchase",
  equity: "solutions.displayCategory.equity",
  specialty: "solutions.displayCategory.specialty",
} as const;

export function AdvisorLoanProgramModal() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const { openProgramId, returnFocusEl, closeModal } = useAdvisorLoanProgramModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);
  const titleId = useId();
  const descId = useId();

  const product = openProgramId ? getLoanProductById(openProgramId, lang) : undefined;
  const view = product ? getAdvisorLoanProgramModalView(product) : null;
  const open = Boolean(view);
  const programId = view?.programId ?? openProgramId;
  const contactHref = advisorPath(advisor.slug, "contact");
  const advisorFirstName = t(advisor.nameKey).split(/\s+/)[0] ?? t(advisor.nameKey);

  const displayCategory = product ? PROGRAM_DISPLAY_CATEGORY[product.id] : undefined;
  const categoryLabel = displayCategory ? t(DISPLAY_CATEGORY_I18N[displayCategory]) : null;
  const Icon: LucideIcon = product ? getLoanProgramIcon(product.id) : Landmark;

  const trackClose = useCallback(
    (method: string) => {
      if (!programId) return;
      trackEvent("advisor_loan_modal_close", {
        advisor_slug: advisor.slug,
        program_id: programId,
        language: lang,
        close_method: method,
      });
    },
    [advisor.slug, lang, programId],
  );

  const handleClose = useCallback(
    (method: string) => {
      trackClose(method);
      closeModal();
    },
    [closeModal, trackClose],
  );

  useEffect(() => {
    if (!open || !programId) return;

    trackEvent("advisor_loan_modal_open", {
      advisor_slug: advisor.slug,
      program_id: programId,
      language: lang,
    });

    scrollYRef.current = window.scrollY;
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarGap = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.width = "100%";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      body.style.paddingRight = prevPaddingRight;
      window.scrollTo(0, scrollYRef.current);
      window.clearTimeout(focusTimer);
    };
  }, [open, advisor.slug, lang, programId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose("escape");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) return;
    if (returnFocusEl && typeof returnFocusEl.focus === "function") {
      const timer = window.setTimeout(() => returnFocusEl.focus(), 0);
      return () => window.clearTimeout(timer);
    }
  }, [open, returnFocusEl]);

  const onDialogKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        !node.hasAttribute("disabled") &&
        node.getAttribute("aria-hidden") !== "true",
    );
    if (nodes.length === 0) return;
    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const onBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose("backdrop");
    }
  };

  if (!open || !view || !programId) return null;

  return (
    <div className="advisor-loan-modal" role="presentation" onMouseDown={onBackdropMouseDown}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="advisor-loan-modal__dialog"
        data-program-id={view.programId}
        onKeyDown={onDialogKeyDown}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="advisor-loan-modal__icon-close"
          aria-label={t("advisor.loanSolutions.modal.close")}
          onClick={() => handleClose("x")}
        >
          <X size={20} strokeWidth={1.75} aria-hidden />
        </button>

        <div className="advisor-loan-modal__scroll">
          <div className="advisor-loan-modal__meta">
            <span className="advisor-loan-modal__icon" aria-hidden>
              <Icon size={22} strokeWidth={1.5} />
            </span>
            {categoryLabel ? (
              <p className="advisor-loan-modal__category">{categoryLabel}</p>
            ) : null}
          </div>

          <h2 id={titleId} className="advisor-loan-modal__title">
            {view.title}
          </h2>
          <p className="advisor-loan-modal__headline">{view.headline}</p>
          <div className="advisor-loan-modal__rule" aria-hidden />

          <p id={descId} className="advisor-loan-modal__overview">
            {view.overview}
          </p>

          {view.fitItems.length > 0 ? (
            <section
              className="advisor-loan-modal__section advisor-loan-modal__section--fit"
              aria-labelledby={`${titleId}-fit`}
            >
              <h3 id={`${titleId}-fit`} className="advisor-loan-modal__section-title">
                {t("advisor.loanSolutions.modal.couldBeFit")}
              </h3>
              <ul className="advisor-loan-modal__list">
                {view.fitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {view.benefitItems.length > 0 ? (
            <section className="advisor-loan-modal__section" aria-labelledby={`${titleId}-benefits`}>
              <h3 id={`${titleId}-benefits`} className="advisor-loan-modal__section-title">
                {t("advisor.loanSolutions.modal.whyConsider")}
              </h3>
              <ul className="advisor-loan-modal__list">
                {view.benefitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {view.keepInMindItems.length > 0 ? (
            <section className="advisor-loan-modal__section" aria-labelledby={`${titleId}-mind`}>
              <h3 id={`${titleId}-mind`} className="advisor-loan-modal__section-title">
                {t("advisor.loanSolutions.modal.keepInMind")}
              </h3>
              <ul className="advisor-loan-modal__list">
                {view.keepInMindItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="advisor-loan-modal__disclaimer">{t("solutions.hero.disclosure")}</p>
        </div>

        <div className="advisor-loan-modal__footer">
          <Link
            to={contactHref}
            className="btn-gold advisor-loan-modal__cta-primary"
            onClick={() => {
              trackEvent("advisor_loan_modal_cta", {
                advisor_slug: advisor.slug,
                program_id: programId,
                language: lang,
                cta_id: "talk_with_advisor",
              });
              handleClose("cta");
            }}
          >
            {t("advisor.loanSolutions.modal.talkWithAdvisor").replace("{name}", advisorFirstName)}
          </Link>
          <a
            href={view.detailPath}
            target="_blank"
            rel="noopener noreferrer"
            data-advisor-nav-exempt="true"
            className="advisor-loan-modal__cta-secondary"
            onClick={() => {
              trackEvent("advisor_loan_modal_cta", {
                advisor_slug: advisor.slug,
                program_id: programId,
                language: lang,
                cta_id: "view_full_program",
              });
              handleClose("view_full_program");
            }}
          >
            {t("advisor.loanSolutions.modal.viewFullProgram")}
          </a>
          <button
            type="button"
            className="advisor-loan-modal__cta-close"
            onClick={() => handleClose("button")}
          >
            {t("advisor.loanSolutions.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
