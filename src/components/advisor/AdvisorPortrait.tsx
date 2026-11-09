import { useEffect } from "react";
import { useAdvisor } from "../../context/AdvisorContext";
import { useLanguage } from "../../i18n/LanguageContext";

type AdvisorPortraitProps = {
  priority?: boolean;
  className?: string;
};

export function AdvisorPortrait({ priority = false, className = "" }: AdvisorPortraitProps) {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { headshot } = advisor;

  useEffect(() => {
    if (!priority) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = headshot.webpSrc;
    link.type = "image/webp";
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [priority, headshot.webpSrc]);

  const webpSrcSet = headshot.webpSrc640
    ? `${headshot.webpSrc640} 640w, ${headshot.webpSrc} ${headshot.width}w`
    : headshot.webpSrc;

  return (
    <figure className={`advisor-portrait ${className}`.trim()}>
      <div className="advisor-portrait__frame">
        <picture>
          <source srcSet={webpSrcSet} sizes="(min-width: 1024px) 42vw, 100vw" type="image/webp" />
          <img
            src={headshot.jpgSrc}
            alt={t(headshot.altKey)}
            className="advisor-portrait__img"
            width={headshot.width}
            height={headshot.height}
            sizes="(min-width: 1024px) 42vw, 100vw"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        </picture>
      </div>
    </figure>
  );
}
