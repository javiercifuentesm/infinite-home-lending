import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";

export function AdvisorContactReassurance() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { reassurance } = advisor.contact;

  return (
    <section
      className="advisor-contact-reassurance"
      aria-labelledby="advisor-contact-reassurance-heading"
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-contact-reassurance__inner`}>
        <div className="advisor-contact-reassurance__rule" aria-hidden="true" />
        <h2 id="advisor-contact-reassurance-heading" className="advisor-contact-reassurance__headline">
          {t(reassurance.headlineKey)}
        </h2>
        <p className="advisor-contact-reassurance__body">{t(reassurance.bodyKey)}</p>
      </div>
    </section>
  );
}
