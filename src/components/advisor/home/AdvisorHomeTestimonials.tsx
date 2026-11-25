import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";

/**
 * Future testimonials slot — renders only when homepage.testimonials
 * contains at least one item. Alma currently leaves this undefined.
 */
export function AdvisorHomeTestimonials() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const testimonials = advisor.homepage.testimonials;

  if (!testimonials?.items?.length) {
    return null;
  }

  return (
    <section className="advisor-home-testimonials" aria-labelledby="advisor-home-testimonials-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-testimonials__inner`}>
        <h2 id="advisor-home-testimonials-heading" className="advisor-home-testimonials__headline">
          {t(testimonials.headlineKey)}
        </h2>
        <ul className="advisor-home-testimonials__list">
          {testimonials.items.map((item) => (
            <li key={item.id} className="advisor-home-testimonials__item">
              <blockquote className="advisor-home-testimonials__quote">{t(item.quoteKey)}</blockquote>
              <p className="advisor-home-testimonials__attribution">{t(item.attributionKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
