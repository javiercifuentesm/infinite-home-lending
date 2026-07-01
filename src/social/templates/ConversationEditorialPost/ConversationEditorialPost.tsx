import { useState } from "react";
import { applyPlatformLayoutProfile } from "../../config/applyPlatformLayoutProfile";
import {
  PLATFORM_LAYOUT_PROFILES,
  type PlatformLayoutProfileKey,
} from "../../config/platformLayoutProfiles";
import type { ConversationEditorialPostProps } from "../../types";
import { CONVERSATION_EDITORIAL_DEFAULTS } from "./defaults";
import "./conversationEditorialPost.css";

export function ConversationEditorialPost(props: ConversationEditorialPostProps) {
  const {
    headline = CONVERSATION_EDITORIAL_DEFAULTS.headline,
    supportingText = CONVERSATION_EDITORIAL_DEFAULTS.supportingText,
    footerTagline = CONVERSATION_EDITORIAL_DEFAULTS.footerTagline,
    logoSrc = CONVERSATION_EDITORIAL_DEFAULTS.logoSrc,
    logoAlt = CONVERSATION_EDITORIAL_DEFAULTS.logoAlt,
    heroImageSrc = CONVERSATION_EDITORIAL_DEFAULTS.heroImageSrc,
    heroImageAlt = CONVERSATION_EDITORIAL_DEFAULTS.heroImageAlt,
    layoutProfileKey = "facebookSquare",
    className = "",
  } = props;

  const [heroFailed, setHeroFailed] = useState(false);
  const layoutProfile = PLATFORM_LAYOUT_PROFILES[layoutProfileKey];

  const headlineLines = headline.split("\n").map((line) => line.trim()).filter(Boolean);
  const blocks = supportingText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  const ariaLabel = headlineLines.join(" ");

  return (
    <article
      className={`fe-conv${className ? ` ${className}` : ""}`}
      style={applyPlatformLayoutProfile(layoutProfile)}
      data-layout-profile={layoutProfileKey}
      data-social-canvas="conversation-editorial-v1"
      data-social-size="1200x1200"
      data-founder-collection="v1.0"
      aria-label={ariaLabel}
    >
      <div className="fe-conv__hero">
        <figure className="fe-conv__hero-frame">
          <div className="fe-conv__hero-media">
            {!heroFailed ? (
              <img
                src={heroImageSrc}
                alt={heroImageAlt}
                className="fe-conv__hero-image"
                width={1080}
                height={480}
                decoding="sync"
                draggable={false}
                onError={() => setHeroFailed(true)}
              />
            ) : (
              <div className="fe-conv__hero-fallback" aria-hidden="true">
                The Why
              </div>
            )}
          </div>
        </figure>
      </div>

      <div className="fe-conv__editorial">
        <h1 className="fe-conv__headline">
          {headlineLines.map((line) => (
            <span key={line} className="fe-conv__headline-line">
              {line}
            </span>
          ))}
        </h1>

        <div className="fe-conv__body">
          {blocks[0] ? <p className="fe-conv__supporting">{blocks[0]}</p> : null}
          {blocks[1] ? <p className="fe-conv__mission">{blocks[1]}</p> : null}
        </div>

        <div className="fe-conv__signature" aria-label="Brand signature">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="fe-conv__signature-logo"
            width={450}
            height={114}
            decoding="sync"
            draggable={false}
          />
          <p className="fe-conv__signature-tagline">{footerTagline}</p>
        </div>
      </div>
    </article>
  );
}
