import { Fragment } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";

export function AdvisorAboutCredibility() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { credibility } = advisor.about;

  const items = [
    t(advisor.titleKey),
    `NMLS #${advisor.nmlsId}`,
    t(credibility.languagesKey),
    t(credibility.regionKey),
  ];

  return (
    <section
      className="advisor-about-credibility"
      aria-label={t("advisor.about.credibility.ariaLabel")}
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-about-credibility__inner`}>
        <ul className="advisor-about-credibility__list">
          {items.map((label, index) => (
            <Fragment key={label}>
              {index > 0 ? (
                <li className="advisor-about-credibility__sep hidden sm:block" aria-hidden />
              ) : null}
              <li className="advisor-about-credibility__item">{label}</li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
