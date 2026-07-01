import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  getFounderStoryDefinition,
  type FounderStorySelection,
} from "./founderStoryConfig";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type FounderStoryModalProps = {
  selection: FounderStorySelection | null;
  onClose: () => void;
  onSwitchStory: (selection: FounderStorySelection) => void;
  t: (key: string) => string;
};

export function FounderStoryModal({
  selection,
  onClose,
  onSwitchStory,
  t,
}: FounderStoryModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const prevTypeRef = useRef<FounderStorySelection["type"] | null>(null);
  const reduceMotion = useReducedMotion();
  const open = Boolean(selection);

  useEffect(() => {
    if (!selection) {
      wasOpenRef.current = false;
      prevTypeRef.current = null;
      return;
    }

    const isTypeSwitch =
      wasOpenRef.current &&
      prevTypeRef.current !== null &&
      prevTypeRef.current !== selection.type;
    prevTypeRef.current = selection.type;
    wasOpenRef.current = true;

    if (isTypeSwitch) {
      scrollRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      const timer = window.setTimeout(() => {
        document.getElementById(titleId)?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(".about-founder-modal-close")
        ?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, selection?.founder, selection?.type, titleId, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    previouslyFocused.current?.focus?.();
  }, [open]);

  const onPanelKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (typeof document === "undefined") return null;

  const definition = selection ? getFounderStoryDefinition(selection) : null;
  const founderPrefix = selection ? `about.founders.${selection.founder}` : "";
  const founderName = founderPrefix ? t(`${founderPrefix}.name`) : "";
  const founderRole = founderPrefix ? t(`${founderPrefix}.role`) : "";
  const crosslinkTargetType: FounderStorySelection["type"] =
    selection?.type === "letter" ? "bio" : "letter";
  const crosslinkPromptKey = founderPrefix
    ? t(
        `${founderPrefix}.${selection?.type === "letter" ? "crosslinkBioPrompt" : "crosslinkLetterPrompt"}`,
      )
    : "";
  const crosslinkLinkKey = founderPrefix
    ? `${founderPrefix}.${selection?.type === "letter" ? "linkBio" : "linkLetter"}`
    : "";

  const handleCrosslink = useCallback(() => {
    if (!selection) return;
    onSwitchStory({ founder: selection.founder, type: crosslinkTargetType });
  }, [crosslinkTargetType, onSwitchStory, selection]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

  return createPortal(
    <AnimatePresence>
      {selection && definition ? (
        <motion.div
          role="presentation"
          className="about-founder-modal-root fixed inset-0 flex items-end justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <button
            type="button"
            className="about-founder-modal-backdrop absolute inset-0 bg-navy/45 backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
            aria-label={t("about.founders.modal.close")}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="about-founder-modal-panel relative z-[1] flex w-full max-w-[850px] flex-col rounded-t-[4px] border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(10,25,47,0.14)] sm:rounded-[4px] max-h-[min(92dvh,880px)] min-h-0 outline-none"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 }}
            transition={transition}
            onKeyDown={onPanelKeyDown}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="about-founder-modal-mobile-header flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3.5 sm:hidden">
              <p
                className="about-founder-modal-mobile-title min-w-0 truncate font-heading text-[1.0625rem] font-semibold leading-snug text-navy tracking-[-0.02em]"
                aria-hidden="true"
              >
                {t(definition.titleKey)}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="about-founder-modal-close about-founder-modal-close--mobile shrink-0 rounded-[3px] p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
                aria-label={t("about.founders.modal.close")}
              >
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="about-founder-modal-close absolute right-4 top-4 z-10 hidden rounded-[3px] p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 sm:block"
              aria-label={t("about.founders.modal.close")}
            >
              <X size={20} strokeWidth={1.75} aria-hidden />
            </button>

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-5 sm:px-10 sm:pb-10 sm:pt-9"
            >
              <header className="pr-10">
                <p className="about-founder-modal-name font-heading text-[1.35rem] sm:text-[1.5rem] font-semibold text-navy tracking-[-0.025em]">
                  {founderName}
                </p>
                <p className="about-founder-modal-role mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                  {founderRole}
                </p>
                <div className="about-founder-modal-divider mt-5 h-px w-full bg-gold/45" aria-hidden />
              </header>

              <div className="mt-7 sm:mt-8">
                <h2
                  id={titleId}
                  tabIndex={-1}
                  className="about-founder-modal-title font-heading text-[1.25rem] sm:text-[1.375rem] font-semibold text-navy tracking-[-0.02em] outline-none focus-visible:ring-2 focus-visible:ring-gold/35 focus-visible:ring-offset-2 rounded-[2px]"
                >
                  {t(definition.titleKey)}
                </h2>

                <div className="about-founder-modal-body mt-6 space-y-5">
                  {definition.paragraphKeys.map((key) => (
                    <div key={key}>
                      <p className="type-body text-[15px] sm:text-[16px] leading-[1.75] text-slate-600 text-pretty">
                        {t(key)}
                      </p>
                      {definition.pullquoteKey && key.endsWith(".p2") ? (
                        <blockquote className="about-founder-modal-pullquote my-6 border-l-[3px] border-gold/35 pl-5 pr-2">
                          <p className="font-heading text-[1.05rem] sm:text-[1.125rem] italic text-navy/90 leading-[1.65]">
                            {t(definition.pullquoteKey)}
                          </p>
                        </blockquote>
                      ) : null}
                    </div>
                  ))}
                </div>

                {definition.showSignature ? (
                  <footer className="about-founder-modal-signature mt-8 border-t border-slate-200/70 pt-6">
                    <p className="font-heading text-lg text-navy font-medium tracking-[-0.02em]">
                      — {founderName}
                    </p>
                    <p className="type-body-sm mt-2 text-slate-500 font-normal">{founderRole}</p>
                  </footer>
                ) : null}

                <section
                  className="about-founder-modal-crosslink mt-8"
                  aria-label={crosslinkPromptKey}
                >
                  <div className="about-founder-modal-divider h-px w-full bg-gold/45" aria-hidden />
                  <p className="about-founder-modal-crosslink-prompt mt-6 type-body text-[15px] sm:text-[16px] leading-[1.65] text-slate-600">
                    {crosslinkPromptKey}
                  </p>
                  <button
                    type="button"
                    className={`about-founder-modal-crosslink-action about-founder-action-link ${
                      selection.type === "letter"
                        ? "about-founder-action-link--letter"
                        : "about-founder-action-link--meet"
                    }`}
                    onClick={handleCrosslink}
                  >
                    {t(crosslinkLinkKey)}
                  </button>
                </section>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
