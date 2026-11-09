import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { useAdvisor } from "../../context/AdvisorContext";
import { advisorPath } from "../../config/advisorChrome";
import { AdvisorPortrait } from "./AdvisorPortrait";
import { AdvisorTrustStrip } from "./AdvisorTrustStrip";
import { AdvisorApplyNowLink } from "./AdvisorApplyNowLink";

export function AdvisorHero() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { hero } = advisor;
  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <section className="advisor-hero" aria-labelledby="advisor-hero-heading">
      <div className="advisor-hero__watermark" aria-hidden />

      <div className="advisor-hero__inner">
        <div className="advisor-hero__copy">
          <p className="type-eyebrow text-gold advisor-hero__eyebrow">{t(hero.eyebrowKey)}</p>

          <h1 id="advisor-hero-heading" className="type-display-xl text-navy advisor-hero__headline">
            {t(hero.headlineKey)}
          </h1>

          <p className="type-lead text-slate-600 advisor-hero__body advisor-hero__body--desktop">
            {t(hero.bodyKey)}
          </p>
          <p className="type-body-lg text-slate-600 advisor-hero__body advisor-hero__body--mobile">
            {t(hero.bodyMobileKey)}
          </p>

          <div className="advisor-hero__actions">
            <AdvisorApplyNowLink className="btn-gold advisor-hero__cta-primary">
              {t("advisor.cta.applyNow")}
            </AdvisorApplyNowLink>
            <Link to={contactHref} className="btn-secondary advisor-hero__cta-secondary">
              {t("advisor.cta.talkWithMe")}
            </Link>
          </div>

          <p className="advisor-hero__reassurance">{t(hero.reassuranceKey)}</p>

          {advisor.signatureMark ? (
            <img
              src={advisor.signatureMark.src}
              alt=""
              width={advisor.signatureMark.width}
              height={advisor.signatureMark.height}
              className="advisor-hero__signature"
              decoding="async"
            />
          ) : null}
        </div>

        <div className="advisor-hero__portrait-col">
          <AdvisorPortrait priority className="advisor-hero__portrait" />
        </div>

        <div className="advisor-hero__trust-mobile">
          <AdvisorTrustStrip />
        </div>
      </div>

      <div className="advisor-hero__trust-desktop">
        <AdvisorTrustStrip />
      </div>
    </section>
  );
}
