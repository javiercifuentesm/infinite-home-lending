import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useAdvisor } from "../../context/AdvisorContext";
import "./advisorExternalNavigation.css";

type Props = {
  open: boolean;
  destinationHref: string | null;
  returnFocusEl: HTMLElement | null;
  onStay: () => void;
  onOpenResource: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function AdvisorExternalNavigationModal({
  open,
  destinationHref,
  returnFocusEl,
  onStay,
  onOpenResource,
}: Props) {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();
  const advisorName = t(advisor.nameKey);

  const headline = t("advisor.externalNav.headline").replace("{name}", advisorName);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => openBtnRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onStay();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onStay]);

  useEffect(() => {
    if (open) return;
    if (returnFocusEl && typeof returnFocusEl.focus === "function") {
      const timer = window.setTimeout(() => returnFocusEl.focus(), 0);
      return () => window.clearTimeout(timer);
    }
  }, [open, returnFocusEl]);

  const onDialogKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
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

  const onBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onStay();
  };

  if (!open || !destinationHref) return null;

  return (
    <div
      className="advisor-ext-nav"
      role="presentation"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="advisor-ext-nav__dialog"
        onKeyDown={onDialogKeyDown}
      >
        <p className="type-eyebrow text-gold advisor-ext-nav__eyebrow">
          {t("advisor.externalNav.eyebrow")}
        </p>
        <h2 id={titleId} className="advisor-ext-nav__headline">
          {headline}
        </h2>
        <div className="advisor-ext-nav__rule" aria-hidden />
        <p id={descId} className="advisor-ext-nav__body">
          {t("advisor.externalNav.body")}
        </p>
        <div className="advisor-ext-nav__actions">
          <button
            ref={openBtnRef}
            type="button"
            className="btn-gold advisor-ext-nav__cta-primary"
            onClick={onOpenResource}
          >
            {t("advisor.externalNav.open")}
          </button>
          <button
            type="button"
            className="btn-secondary advisor-ext-nav__cta-secondary"
            onClick={onStay}
          >
            {t("advisor.externalNav.stay")}
          </button>
        </div>
      </div>
    </div>
  );
}
