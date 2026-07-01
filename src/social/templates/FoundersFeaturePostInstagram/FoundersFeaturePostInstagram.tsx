import { useState } from "react";
import type { FounderFeatureCard, FoundersFeaturePostProps, SocialPortrait } from "../../types";
import { FOUNDERS_FEATURE_DEFAULTS } from "../FoundersFeaturePost/defaults";
import "./foundersFeaturePostInstagram.css";

function FounderPortrait({ portrait }: { portrait: SocialPortrait }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="fe-founders-ig__portrait">
      {!failed ? (
        <img
          src={portrait.src}
          alt={portrait.alt}
          className="fe-founders-ig__portrait-image"
          width={216}
          height={270}
          decoding="sync"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="fe-founders-ig__portrait-fallback" aria-hidden="true">
          {portrait.fallbackInitials ?? "·"}
        </div>
      )}
    </figure>
  );
}

function FounderCard({ card }: { card: FounderFeatureCard }) {
  return (
    <article className="fe-founders-ig__card">
      <FounderPortrait portrait={card.portrait} />
      <h2 className="fe-founders-ig__card-name">{card.name}</h2>
      <p className="fe-founders-ig__card-mission">{card.mission}</p>
    </article>
  );
}

export function FoundersFeaturePostInstagram(props: FoundersFeaturePostProps) {
  const {
    headline = FOUNDERS_FEATURE_DEFAULTS.headline,
    supportingText = FOUNDERS_FEATURE_DEFAULTS.supportingText,
    founderCards = FOUNDERS_FEATURE_DEFAULTS.founderCards,
    footerTagline = FOUNDERS_FEATURE_DEFAULTS.footerTagline,
    logoSrc = FOUNDERS_FEATURE_DEFAULTS.logoSrc,
    logoAlt = FOUNDERS_FEATURE_DEFAULTS.logoAlt,
    className = "",
  } = props;

  const blocks = supportingText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article
      className={`fe-founders-ig${className ? ` ${className}` : ""}`}
      data-social-canvas="founders-feature-v1-instagram"
      data-social-size="1080x1350"
      data-founder-collection="v1.0"
      aria-label={headline}
    >
      <header className="fe-founders-ig__header">
        <h1 className="fe-founders-ig__headline">{headline}</h1>
        <div className="fe-founders-ig__intro">
          {blocks[0] ? <p className="fe-founders-ig__lead">{blocks[0]}</p> : null}
          {blocks[1] ? <p className="fe-founders-ig__lead">{blocks[1]}</p> : null}
          {blocks[2] ? <p className="fe-founders-ig__supporting">{blocks[2]}</p> : null}
        </div>
      </header>

      <div className="fe-founders-ig__cards">
        <FounderCard card={founderCards[0]} />
        <FounderCard card={founderCards[1]} />
      </div>

      <div className="fe-founders-ig__signature" aria-label="Brand signature">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="fe-founders-ig__signature-logo"
          width={405}
          height={103}
          decoding="sync"
          draggable={false}
        />
        <p className="fe-founders-ig__signature-tagline">{footerTagline}</p>
      </div>
    </article>
  );
}
