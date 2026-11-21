import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { AdvisorCalendlyEmbed } from "./AdvisorCalendlyEmbed";

export function AdvisorContactSchedulingStudio() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { studio } = advisor.contact;
  const schedulingUrl = advisor.schedulingUrl?.trim();
  const advisorName = t(advisor.nameKey);
  const advisorTitle = t(advisor.titleKey);

  return (
    <section
      className="advisor-contact-studio"
      aria-labelledby="advisor-contact-studio-heading"
    >
      <div className="advisor-contact-studio__rail">
        <div className="advisor-contact-studio__frame">
          <aside className="advisor-contact-studio__panel" aria-label={t(studio.eyebrowKey)}>
            <p className="advisor-contact-studio__eyebrow">{t(studio.eyebrowKey)}</p>
            <div className="advisor-contact-studio__rule" aria-hidden="true" />
            <h2 id="advisor-contact-studio-heading" className="advisor-contact-studio__heading">
              {t(studio.headingKey)}
            </h2>
            <p className="advisor-contact-studio__supporting">{t(studio.supportingKey)}</p>

            <div className="advisor-contact-studio__identity">
              <p className="advisor-contact-studio__name">{advisorName}</p>
              <p className="advisor-contact-studio__title">{advisorTitle}</p>
              <p className="advisor-contact-studio__nmls">NMLS #{advisor.nmlsId}</p>
            </div>

            {advisor.signatureMark ? (
              <img
                src={advisor.signatureMark.src}
                alt=""
                width={advisor.signatureMark.width}
                height={advisor.signatureMark.height}
                className="advisor-contact-studio__signature"
                decoding="async"
              />
            ) : null}
          </aside>

          <div className="advisor-contact-studio__scheduler">
            {schedulingUrl ? (
              <AdvisorCalendlyEmbed schedulingUrl={schedulingUrl} />
            ) : (
              <div className="advisor-contact-scheduler__fallback" role="status">
                <p className="advisor-contact-scheduler__fallback-title">
                  {t("advisor.contact.scheduler.unavailableTitle")}
                </p>
                <p className="advisor-contact-scheduler__fallback-body">
                  {t("advisor.contact.scheduler.unavailableBody")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
