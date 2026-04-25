import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { ClarityCard } from "../../data/knowledgeCenterContent";

type Props = {
  card: ClarityCard | null;
  onClose: () => void;
};

export function KnowledgeClarityModal({ card, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [card, onClose]);

  useEffect(() => {
    if (card) panelRef.current?.focus();
  }, [card]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clarity-modal-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-t-[6px] border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(10,25,47,0.18)] sm:rounded-[4px] max-h-[min(88vh,640px)] flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
          <h2 id="clarity-modal-title" className="font-heading text-lg sm:text-xl font-semibold text-navy leading-snug pr-2">
            {card.question}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm p-2 text-slate-500 hover:bg-slate-50 hover:text-navy transition-colors"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          <p className="type-body text-[15px] leading-[1.7] text-slate-600">{card.answer}</p>
        </div>
        {(card.readMorePillarId || card.applyTo) && (
          <div className="flex flex-wrap gap-4 border-t border-slate-100 px-6 py-4 sm:px-8">
            {card.readMorePillarId ? (
              <button
                type="button"
                onClick={() => {
                  document.getElementById(card.readMorePillarId!)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  onClose();
                }}
                className="type-label text-navy/70 border-b border-navy/15 hover:border-gold/45 hover:text-navy pb-0.5 transition-colors"
              >
                Read more →
              </button>
            ) : null}
            {card.applyTo ? (
              <Link
                to={card.applyTo}
                onClick={onClose}
                className="type-label text-gold/90 border-b border-gold/25 hover:border-gold/60 pb-0.5 transition-colors"
              >
                Apply this →
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
