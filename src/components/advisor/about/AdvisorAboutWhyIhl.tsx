import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorAboutSectionHeader } from "./AdvisorAboutSectionHeader";

export function AdvisorAboutWhyIhl() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { whyIhl } = advisor.about;

  return (
    <section className="advisor-about-why-ihl" aria-labelledby="advisor-about-why-ihl-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-about-why-ihl__inner`}>
        <AdvisorAboutSectionHeader
          align="center"
          eyebrow={t(whyIhl.eyebrowKey)}
          headline={t(whyIhl.headlineKey)}
          intro={t(whyIhl.introKey)}
          id="advisor-about-why-ihl-heading"
        />

        <ul className="advisor-about-why-ihl__manifesto">
          {whyIhl.items.map((item, index) => (
            <li key={item.titleKey} className="advisor-about-why-ihl__item">
              <span className="advisor-about-why-ihl__index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="advisor-about-why-ihl__title">{t(item.titleKey)}</h3>
              <p className="type-body advisor-about-why-ihl__body">{t(item.bodyKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
