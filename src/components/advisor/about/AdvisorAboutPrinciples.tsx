import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorAboutSectionHeader } from "./AdvisorAboutSectionHeader";

export function AdvisorAboutPrinciples() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { principles } = advisor.about;

  return (
    <section className="advisor-about-principles" aria-labelledby="advisor-about-principles-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-about-principles__inner`}>
        <AdvisorAboutSectionHeader
          align="center"
          eyebrow={t(principles.headingKey)}
          id="advisor-about-principles-heading"
        />

        <ol className="advisor-about-principles__timeline">
          {principles.items.map((item, index) => (
            <li key={item.titleKey} className="advisor-about-principles__item">
              <span className="advisor-about-principles__num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="advisor-about-principles__title">{t(item.titleKey)}</h3>
              <p className="type-body advisor-about-principles__body">{t(item.bodyKey)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
