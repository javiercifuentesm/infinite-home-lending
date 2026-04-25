import { useEffect, useRef, useCallback, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useAgentV2 } from "../../context/AgentV2Context";
import { AgentV2Shell } from "./AgentV2Shell";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AgentV2Modal() {
  const { state, closeAgentV2 } = useAgentV2();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!state.isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      const root = panelRef.current;
      const first = root?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAgentV2();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state.isOpen, closeAgentV2]);

  const onBackdropKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAgentV2();
    },
    [closeAgentV2],
  );

  const onModalKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ) as HTMLElement[];
      const visible = focusables.filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (visible.length === 0) return;
      const first = visible[0]!;
      const last = visible[visible.length - 1]!;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  useEffect(() => {
    if (state.isOpen) return;
    previouslyFocused.current?.focus?.();
  }, [state.isOpen]);

  if (!state.isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-[2px] transition-opacity duration-200"
        aria-hidden
        onClick={closeAgentV2}
      />
      <div
        className="relative z-[101] flex w-full max-w-[min(100%,520px)] flex-1 sm:max-h-[min(92vh,880px)] sm:flex-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-v2-title"
        onKeyDown={onBackdropKeyDown}
      >
        <div
          ref={panelRef}
          className="flex w-full flex-col justify-end sm:justify-center"
          onKeyDown={onModalKeyDown}
        >
          <div className="max-h-[100dvh] sm:max-h-[min(92vh,880px)]">
            <AgentV2Shell />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
