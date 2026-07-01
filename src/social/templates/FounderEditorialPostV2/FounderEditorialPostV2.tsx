import { useState } from "react";
import type { FounderEditorialPostV2Props, SocialPortrait } from "../../types";
import { FOUNDER_EDITORIAL_POST_V2_DEFAULTS } from "./defaults";
import "./founderEditorialPostV2.css";

function PortraitPlate({ portrait }: { portrait: SocialPortrait }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="fe-v2__portrait">
      {!failed ? (
        <img
          src={portrait.src}
          alt={portrait.alt}
          className="fe-v2__portrait-image"
          width={480}
          height={600}
          decoding="sync"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="fe-v2__portrait-fallback" aria-hidden="true">
          {portrait.fallbackInitials ?? "·"}
        </div>
      )}
    </figure>
  );
}

export function FounderEditorialPostV2(props: FounderEditorialPostV2Props) {
  const {
    seriesLabel = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.seriesLabel,
    editionLabel = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.editionLabel,
    eyebrow = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.eyebrow,
    headline = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.headline,
    founderByline = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.founderByline,
    supportingText = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.supportingText,
    footerTagline = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.footerTagline,
    websiteUrl = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.websiteUrl,
    logoSrc = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.logoSrc,
    logoAlt = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.logoAlt,
    founderPortraits = FOUNDER_EDITORIAL_POST_V2_DEFAULTS.founderPortraits,
    className = "",
  } = props;

  const paragraphs = supportingText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article
      className={`fe-v2${className ? ` ${className}` : ""}`}
      data-social-canvas="founder-editorial-v2"
      data-social-size="1200x1200"
      aria-label={headline}
    >
      <header className="fe-v2__masthead">
        <img
          src={logoSrc}
          alt=""
          className="fe-v2__masthead-mark"
          width={120}
          height={32}
          decoding="sync"
          draggable={false}
          aria-hidden="true"
        />
        <p className="fe-v2__masthead-series">
          {seriesLabel}
          {editionLabel ? (
            <>
              <span className="fe-v2__masthead-sep" aria-hidden="true">
                ·
              </span>
              {editionLabel}
            </>
          ) : null}
        </p>
      </header>

      <div className="fe-v2__spread">
        <aside className="fe-v2__visual" aria-label="Founders">
          <div className="fe-v2__visual-inner">
            <PortraitPlate portrait={founderPortraits[0]} />
            <PortraitPlate portrait={founderPortraits[1]} />
          </div>
        </aside>

        <div className="fe-v2__letter">
          <span className="fe-v2__eyebrow">{eyebrow}</span>
          <h1 className="fe-v2__headline">{headline}</h1>
          <p className="fe-v2__byline">
            <span>{founderByline[0]}</span>
            <span className="fe-v2__byline-amp" aria-hidden="true">
              &
            </span>
            <span>{founderByline[1]}</span>
          </p>
          <div className="fe-v2__body">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`fe-v2__paragraph${index === 0 ? " fe-v2__paragraph--opening" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <footer className="fe-v2__colophon">
        <p className="fe-v2__colophon-tagline">{footerTagline}</p>
        <div className="fe-v2__colophon-brand">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="fe-v2__colophon-logo"
            width={280}
            height={72}
            decoding="sync"
            draggable={false}
          />
          <p className="fe-v2__colophon-url">{websiteUrl}</p>
        </div>
      </footer>
    </article>
  );
}
