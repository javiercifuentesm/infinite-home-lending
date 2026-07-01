import { useState } from "react";
import type { ConversationEditorialPostProps } from "../../types";
import { CONVERSATION_EDITORIAL_DEFAULTS } from "../ConversationEditorialPost/defaults";
import "./conversationEditorialPostInstagram.css";

export function ConversationEditorialPostInstagram(props: ConversationEditorialPostProps) {
  const {
    headline = CONVERSATION_EDITORIAL_DEFAULTS.headline,
    supportingText = CONVERSATION_EDITORIAL_DEFAULTS.supportingText,
    footerTagline = CONVERSATION_EDITORIAL_DEFAULTS.footerTagline,
    logoSrc = CONVERSATION_EDITORIAL_DEFAULTS.logoSrc,
    logoAlt = CONVERSATION_EDITORIAL_DEFAULTS.logoAlt,
    heroImageSrc = CONVERSATION_EDITORIAL_DEFAULTS.heroImageSrc,
    heroImageAlt = CONVERSATION_EDITORIAL_DEFAULTS.heroImageAlt,
    className = "",
  } = props;

  const [heroFailed, setHeroFailed] = useState(false);

  const headlineLines = headline.split("\n").map((line) => line.trim()).filter(Boolean);
  const blocks = supportingText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  const ariaLabel = headlineLines.join(" ");

  return (
    <article
      className={`fe-conv-ig${className ? ` ${className}` : ""}`}
      data-social-canvas="conversation-editorial-v1-instagram"
      data-social-size="1080x1350"
      data-founder-collection="v1.0"
      aria-label={ariaLabel}
    >
      <div className="fe-conv-ig__hero">
        <figure className="fe-conv-ig__hero-frame">
          <div className="fe-conv-ig__hero-media">
            {!heroFailed ? (
              <img
                src={heroImageSrc}
                alt={heroImageAlt}
                className="fe-conv-ig__hero-image"
                width={972}
                height={560}
                decoding="sync"
                draggable={false}
                onError={() => setHeroFailed(true)}
              />
            ) : (
              <div className="fe-conv-ig__hero-fallback" aria-hidden="true">
                The Why
              </div>
            )}
          </div>
        </figure>
      </div>

      <div className="fe-conv-ig__editorial">
        <h1 className="fe-conv-ig__headline">
          {headlineLines.map((line) => (
            <span key={line} className="fe-conv-ig__headline-line">
              {line}
            </span>
          ))}
        </h1>

        <div className="fe-conv-ig__body">
          {blocks[0] ? <p className="fe-conv-ig__supporting">{blocks[0]}</p> : null}
          {blocks[1] ? <p className="fe-conv-ig__mission">{blocks[1]}</p> : null}
        </div>

        <div className="fe-conv-ig__signature" aria-label="Brand signature">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="fe-conv-ig__signature-logo"
            width={405}
            height={103}
            decoding="sync"
            draggable={false}
          />
          <p className="fe-conv-ig__signature-tagline">{footerTagline}</p>
        </div>
      </div>
    </article>
  );
}
