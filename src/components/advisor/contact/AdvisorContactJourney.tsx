import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";

export function AdvisorContactJourney() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { journey } = advisor.contact;

  return (
    <section
      className="advisor-contact-journey"
      aria-labelledby="advisor-contact-journey-heading"
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-contact-journey__inner`}>
        <header className="advisor-contact-journey__header">
          <h2 id="advisor-contact-journey-heading" className="advisor-contact-journey__headline">
            {t(journey.headlineKey)}
          </h2>
          <p className="advisor-contact-journey__supporting">{t(journey.supportingKey)}</p>
        </header>

        <ol className="advisor-contact-journey__steps">
          {journey.steps.map((step, index) => (
            <li key={step.titleKey} className="advisor-contact-journey__step">
              <span className="advisor-contact-journey__step-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="advisor-contact-journey__step-copy">
                <h3 className="advisor-contact-journey__step-title">{t(step.titleKey)}</h3>
                <p className="advisor-contact-journey__step-body">{t(step.bodyKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
