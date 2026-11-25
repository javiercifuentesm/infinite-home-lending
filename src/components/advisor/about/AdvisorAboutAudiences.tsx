import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorAboutSectionHeader } from "./AdvisorAboutSectionHeader";

export function AdvisorAboutAudiences() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { audiences } = advisor.about;

  return (
    <section className="advisor-about-audiences" aria-labelledby="advisor-about-audiences-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-about-audiences__inner`}>
        <AdvisorAboutSectionHeader
          align="center"
          eyebrow={t(audiences.headingKey)}
          intro={t(audiences.introKey)}
          id="advisor-about-audiences-heading"
        />

        <ul className="advisor-about-audiences__grid">
          {audiences.items.map((item, index) => (
            <li key={item.titleKey} className="advisor-about-audiences__tile">
              <span className="advisor-about-audiences__index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="advisor-about-audiences__title">{t(item.titleKey)}</h3>
              <p className="type-body advisor-about-audiences__body">{t(item.bodyKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
