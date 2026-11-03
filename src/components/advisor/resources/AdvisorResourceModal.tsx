import { useCallback, useEffect, useId, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { trackEvent } from "../../../lib/analytics";
import {
  getResourceModalSummary,
  getResourceModalSummaryCopy,
} from "../../../data/resourceModalSummaries";
import { useAdvisorResourceModal } from "./AdvisorResourceModalContext";
import "./advisorResourceModal.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function AdvisorResourceModal() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const { openResourceId, returnFocusEl, closeModal } = useAdvisorResourceModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);
  const titleId = useId();
  const descId = useId();

  const summary = getResourceModalSummary(openResourceId);
  const copy = getResourceModalSummaryCopy(openResourceId, lang);
  const open = Boolean(summary && copy);
  const resourceId = summary?.resourceId ?? openResourceId;
  const contactHref = advisorPath(advisor.slug, "contact");
  const advisorFirstName = t(advisor.nameKey).split(/\s+/)[0] ?? t(advisor.nameKey);

  const trackClose = useCallback(
    (method: string) => {
      if (!resourceId) return;
      trackEvent("advisor_resource_modal_close", {
        advisor_slug: advisor.slug,
        resource_id: resourceId,
        language: lang,
        close_method: method,
      });
    },
    [advisor.slug, lang, resourceId],
  );

  const handleClose = useCallback(
    (method: string) => {
      trackClose(method);
      closeModal();
    },
    [closeModal, trackClose],
  );

  useEffect(() => {
    if (!open || !resourceId) return;

    trackEvent("advisor_resource_modal_open", {
      advisor_slug: advisor.slug,
      resource_id: resourceId,
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
  }, [open, advisor.slug, lang, resourceId]);

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

  if (!open || !copy || !summary || !resourceId) return null;

  return (
    <div className="advisor-resource-modal" role="presentation" onMouseDown={onBackdropMouseDown}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="advisor-resource-modal__dialog"
        data-resource-id={summary.resourceId}
        data-source-path={summary.sourcePath}
        onKeyDown={onDialogKeyDown}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="advisor-resource-modal__icon-close"
          aria-label={t("advisor.resources.modal.close")}
          onClick={() => handleClose("x")}
        >
          <X size={20} strokeWidth={1.75} aria-hidden />
        </button>

        <div className="advisor-resource-modal__scroll">
          <p className="advisor-resource-modal__category">{copy.category}</p>
          <h2 id={titleId} className="advisor-resource-modal__headline">
            {copy.headline}
          </h2>
          <div className="advisor-resource-modal__rule" aria-hidden />

          <p id={descId} className="advisor-resource-modal__context">
            {copy.context}
          </p>

          <section className="advisor-resource-modal__meaning" aria-labelledby={`${titleId}-meaning`}>
            <h3 id={`${titleId}-meaning`} className="advisor-resource-modal__meaning-title">
              {copy.meaningTitle}
            </h3>
            <p className="advisor-resource-modal__meaning-body">{copy.meaningBody}</p>
          </section>

          <section className="advisor-resource-modal__considerations" aria-labelledby={`${titleId}-consider`}>
            <h3 id={`${titleId}-consider`} className="advisor-resource-modal__considerations-title">
              {copy.considerationsTitle}
            </h3>
            <ul className="advisor-resource-modal__list">
              {copy.considerations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <p className="advisor-resource-modal__disclaimer">{copy.disclaimer}</p>
        </div>

        <div className="advisor-resource-modal__footer">
          <Link
            to={contactHref}
            className="btn-gold advisor-resource-modal__cta-primary"
            onClick={() => {
              trackEvent("advisor_resource_modal_cta", {
                advisor_slug: advisor.slug,
                resource_id: resourceId,
                language: lang,
                cta_id: "talk_with_advisor",
              });
              handleClose("cta");
            }}
          >
            {t("advisor.resources.modal.talkWithAdvisor").replace("{name}", advisorFirstName)}
          </Link>
          <a
            href={summary.sourcePath}
            target="_blank"
            rel="noopener noreferrer"
            data-advisor-nav-exempt="true"
            className="advisor-resource-modal__cta-secondary"
            onClick={() => {
              trackEvent("advisor_resource_modal_cta", {
                advisor_slug: advisor.slug,
                resource_id: resourceId,
                language: lang,
                cta_id: "learn_more",
              });
              handleClose("learn_more");
            }}
          >
            {t("advisor.resources.modal.learnMore")}
          </a>
          <button
            type="button"
            className="advisor-resource-modal__cta-close"
            onClick={() => handleClose("button")}
          >
            {t("advisor.resources.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
