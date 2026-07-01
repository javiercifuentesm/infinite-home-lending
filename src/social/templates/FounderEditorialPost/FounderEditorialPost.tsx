import { useState } from "react";
import type { FounderEditorialPostProps, SocialPortrait } from "../../types";
import { FOUNDER_EDITORIAL_POST_DEFAULTS } from "./defaults";
import "./founderEditorialPost.css";

function PortraitFrame({ portrait }: { portrait: SocialPortrait }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="founder-editorial-post__portrait">
      {!failed ? (
        <img
          src={portrait.src}
          alt={portrait.alt}
          className="founder-editorial-post__portrait-image"
          width={420}
          height={525}
          decoding="sync"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="founder-editorial-post__portrait-fallback" aria-hidden="true">
          {portrait.fallbackInitials ?? "·"}
        </div>
      )}
    </figure>
  );
}

export function FounderEditorialPost(props: FounderEditorialPostProps) {
  const {
    collectionLabel = FOUNDER_EDITORIAL_POST_DEFAULTS.collectionLabel,
    headline = FOUNDER_EDITORIAL_POST_DEFAULTS.headline,
    founderByline = FOUNDER_EDITORIAL_POST_DEFAULTS.founderByline,
    supportingText = FOUNDER_EDITORIAL_POST_DEFAULTS.supportingText,
    footerTagline = FOUNDER_EDITORIAL_POST_DEFAULTS.footerTagline,
    websiteUrl = FOUNDER_EDITORIAL_POST_DEFAULTS.websiteUrl,
    logoSrc = FOUNDER_EDITORIAL_POST_DEFAULTS.logoSrc,
    logoAlt = FOUNDER_EDITORIAL_POST_DEFAULTS.logoAlt,
    founderPortraits = FOUNDER_EDITORIAL_POST_DEFAULTS.founderPortraits,
    className = "",
  } = props;

  const paragraphs = supportingText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article
      className={`founder-editorial-post${className ? ` ${className}` : ""}`}
      data-social-canvas="founder-editorial"
      data-social-size="1200x1200"
      aria-label={headline}
    >
      <div className="founder-editorial-post__card">
        <div className="founder-editorial-post__portraits">
          <PortraitFrame portrait={founderPortraits[0]} />
          <PortraitFrame portrait={founderPortraits[1]} />
        </div>

        <div className="founder-editorial-post__body">
          <p className="founder-editorial-post__label">{collectionLabel}</p>
          <h1 className="founder-editorial-post__headline">{headline}</h1>
          <p className="founder-editorial-post__byline">
            <span className="founder-editorial-post__byline-name">{founderByline[0]}</span>
            <span className="founder-editorial-post__byline-amp" aria-hidden="true">
              &
            </span>
            <span className="founder-editorial-post__byline-name">{founderByline[1]}</span>
          </p>
          <div className="founder-editorial-post__supporting">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`founder-editorial-post__supporting-paragraph${
                  index === 0 ? " founder-editorial-post__supporting-paragraph--lead" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <footer className="founder-editorial-post__footer">
          <p className="founder-editorial-post__footer-tagline">{footerTagline}</p>
          <div className="founder-editorial-post__footer-brand">
            <img
              src={logoSrc}
              alt={logoAlt}
              className="founder-editorial-post__logo"
              width={380}
              height={88}
              decoding="sync"
              draggable={false}
            />
            <p className="founder-editorial-post__website">{websiteUrl}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
