import { useState } from "react";

export function LeadershipPortrait(props: {
  src: string;
  alt: string;
  placeholderInitials: string;
  placeholderFilename: string;
  className?: string;
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const { src, alt, placeholderInitials, placeholderFilename, className = "" } = props;

  return (
    <figure className={`w-full max-w-[min(100%,320px)] shrink-0 mx-auto ${className}`.trim()}>
      <div className="relative overflow-hidden rounded-[22px] border border-gold/25 bg-white shadow-[0_22px_58px_-14px_rgba(10,25,47,0.24)] ring-1 ring-gold/15">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px]">
          {!showPlaceholder ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover object-[center_22%]"
              width={640}
              height={800}
              sizes="(min-width: 1024px) 320px, 100vw"
              loading="lazy"
              decoding="async"
              onError={() => setShowPlaceholder(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 px-5 py-10 bg-gradient-to-b from-surface to-white"
              aria-hidden
            >
              <span className="font-heading text-2xl text-navy/[0.1] tracking-tight">{placeholderInitials}</span>
              <p className="type-caption text-slate-400 max-w-[10.5rem] text-center leading-relaxed">
                Add <span className="font-mono text-[11px] text-slate-500">{placeholderFilename}</span>
              </p>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-navy/[0.04] via-transparent to-white/[0.08]"
            aria-hidden
          />
        </div>
      </div>
    </figure>
  );
}
