import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";

export function AdvisorHomeAdvisoryJourney() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { advisoryJourney } = advisor.homepage;

  return (
    <section className="advisor-home-journey" aria-labelledby="advisor-home-journey-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-journey__inner`}>
        <h2 id="advisor-home-journey-heading" className="advisor-home-journey__headline">
          {t(advisoryJourney.headlineKey)}
        </h2>

        <ol className="advisor-home-journey__steps">
          {advisoryJourney.steps.map((step, index) => (
            <li key={step.titleKey} className="advisor-home-journey__step">
              <span className="advisor-home-journey__step-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="advisor-home-journey__step-copy">
                <h3 className="advisor-home-journey__step-title">{t(step.titleKey)}</h3>
                <p className="advisor-home-journey__step-body">{t(step.bodyKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
