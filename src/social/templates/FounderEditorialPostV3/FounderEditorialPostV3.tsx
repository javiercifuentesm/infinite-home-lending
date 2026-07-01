import { useState } from "react";
import type { FounderEditorialPostV3Props, SocialPortrait } from "../../types";
import { FOUNDER_EDITORIAL_POST_V3_DEFAULTS } from "./defaults";
import "./founderEditorialPostV3.css";

function HeroPortrait({ portrait }: { portrait: SocialPortrait }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="fe-v3__portrait">
      {!failed ? (
        <img
          src={portrait.src}
          alt={portrait.alt}
          className="fe-v3__portrait-image"
          width={520}
          height={650}
          decoding="sync"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="fe-v3__portrait-fallback" aria-hidden="true">
          {portrait.fallbackInitials ?? "·"}
        </div>
      )}
    </figure>
  );
}

export function FounderEditorialPostV3(props: FounderEditorialPostV3Props) {
  const {
    headline = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.headline,
    founderByline = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.founderByline,
    supportingText = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.supportingText,
    footerTagline = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.footerTagline,
    logoSrc = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.logoSrc,
    logoAlt = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.logoAlt,
    founderPortraits = FOUNDER_EDITORIAL_POST_V3_DEFAULTS.founderPortraits,
    className = "",
  } = props;

  const paragraphs = supportingText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article
      className={`fe-v3${className ? ` ${className}` : ""}`}
      data-social-canvas="founder-editorial-v3"
      data-social-size="1200x1200"
      data-founder-collection="v1.0"
      data-brand-status="Brand Approved"
      aria-label={headline}
    >
      <div className="fe-v3__hero">
        <div className="fe-v3__portraits">
          <HeroPortrait portrait={founderPortraits[0]} />
          <HeroPortrait portrait={founderPortraits[1]} />
        </div>
      </div>

      <div className="fe-v3__message">
        <h1 className="fe-v3__headline">{headline}</h1>
        <p className="fe-v3__byline">
          <span>{founderByline[0]}</span>
          <span className="fe-v3__byline-amp" aria-hidden="true">
            &
          </span>
          <span>{founderByline[1]}</span>
        </p>
        <div className="fe-v3__body">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`fe-v3__paragraph${index === 0 ? " fe-v3__paragraph--opening" : ""}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="fe-v3__signature" aria-label="Brand signature">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="fe-v3__signature-logo"
            width={450}
            height={114}
            decoding="sync"
            draggable={false}
          />
          <p className="fe-v3__signature-tagline">{footerTagline}</p>
        </div>
      </div>
    </article>
  );
}
