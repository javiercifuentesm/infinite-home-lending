import { useLanguage } from "../../../i18n/LanguageContext";
import type { AdvisorAboutImage as AdvisorAboutImageConfig } from "../../../config/advisors/types";

type Props = {
  image: AdvisorAboutImageConfig;
  className?: string;
  priority?: boolean;
  variant?: "default" | "compact" | "editorial";
};

export function AdvisorAboutImage({
  image,
  className = "",
  priority = false,
  variant = "default",
}: Props) {
  const { t } = useLanguage();

  const webpSrcSet = image.webpSrc640
    ? `${image.webpSrc640} 640w, ${image.webpSrc ?? image.jpgSrc} ${image.width}w`
    : image.webpSrc;

  const sizes =
    variant === "editorial"
      ? "(min-width: 1024px) 512px, min(92vw, 420px)"
      : variant === "compact"
        ? "(min-width: 1024px) 240px, min(72vw, 280px)"
        : "(min-width: 1024px) 380px, 100vw";

  return (
    <figure
      className={`advisor-about-image advisor-about-image--${variant} ${className}`.trim()}
    >
      <div className="advisor-about-image__frame">
        <picture>
          {webpSrcSet ? (
            <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
          ) : null}
          <img
            src={image.jpgSrc}
            alt={t(image.altKey)}
            className="advisor-about-image__img"
            width={image.width}
            height={image.height}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
          />
        </picture>
      </div>
    </figure>
  );
}
