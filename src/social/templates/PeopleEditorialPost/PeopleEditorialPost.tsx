import { useState } from "react";
import type { PeopleEditorialPostProps } from "../../types";
import { PEOPLE_EDITORIAL_DEFAULTS } from "./defaults";
import "./peopleEditorialPost.css";

export function PeopleEditorialPost(props: PeopleEditorialPostProps) {
  const {
    editorialQuote = PEOPLE_EDITORIAL_DEFAULTS.editorialQuote,
    headline = PEOPLE_EDITORIAL_DEFAULTS.headline,
    supportingText = PEOPLE_EDITORIAL_DEFAULTS.supportingText,
    footerTagline = PEOPLE_EDITORIAL_DEFAULTS.footerTagline,
    logoSrc = PEOPLE_EDITORIAL_DEFAULTS.logoSrc,
    logoAlt = PEOPLE_EDITORIAL_DEFAULTS.logoAlt,
    heroImageSrc = PEOPLE_EDITORIAL_DEFAULTS.heroImageSrc,
    heroImageAlt = PEOPLE_EDITORIAL_DEFAULTS.heroImageAlt,
    className = "",
  } = props;

  const [heroFailed, setHeroFailed] = useState(false);

  const quoteLines = editorialQuote
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const headlineLines = headline
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article
      className={`fe-people${className ? ` ${className}` : ""}`}
      data-social-canvas="people-editorial-v1"
      data-social-size="1200x1200"
      data-founder-collection="v1.0"
      aria-label={headlineLines.join(" ")}
    >
      <div className="fe-people__hero">
        <figure className="fe-people__hero-frame">
          <div className="fe-people__hero-media">
            {!heroFailed ? (
              <img
                src={heroImageSrc}
                alt={heroImageAlt}
                className="fe-people__hero-image"
                width={1080}
                height={640}
                decoding="sync"
                draggable={false}
                onError={() => setHeroFailed(true)}
              />
            ) : (
              <div className="fe-people__hero-fallback" aria-hidden="true">
                The People
              </div>
            )}
          </div>
        </figure>
      </div>

      <div className="fe-people__editorial">
        <blockquote className="fe-people__quote" cite="">
          {quoteLines.map((line, index) => (
            <span
              key={line}
              className={`fe-people__quote-line${
                index === 0
                  ? " fe-people__quote-line--lead"
                  : " fe-people__quote-line--support"
              }`}
            >
              {line}
            </span>
          ))}
        </blockquote>

        <h1 className="fe-people__headline">
          {headlineLines.map((line) => (
            <span key={line} className="fe-people__headline-line">
              {line}
            </span>
          ))}
        </h1>

        <p className="fe-people__supporting">{supportingText}</p>

        <div className="fe-people__signature" aria-label="Brand signature">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="fe-people__signature-logo"
            width={450}
            height={114}
            decoding="sync"
            draggable={false}
          />
          <p className="fe-people__signature-tagline">{footerTagline}</p>
        </div>
      </div>
    </article>
  );
}
