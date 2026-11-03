import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorAboutImage } from "./AdvisorAboutImage";
import { AdvisorAboutSectionHeader } from "./AdvisorAboutSectionHeader";

export function AdvisorAboutMeet() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { meet } = advisor.about;

  return (
    <section className="advisor-about-meet" aria-labelledby="advisor-about-meet-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-about-meet__inner`}>
        <div className="advisor-about-meet__layout">
          <AdvisorAboutSectionHeader
            align="left"
            eyebrow={t(meet.labelKey)}
            headline={t(meet.headlineKey)}
            id="advisor-about-meet-heading"
            headlineClassName="type-editorial-section-title text-navy advisor-about-section-header__headline advisor-about-section-header__headline--meet"
          />

          <AdvisorAboutImage
            image={meet.image}
            variant="editorial"
            className="advisor-about-meet__figure"
          />

          <div className="advisor-about-meet__bio">
            {meet.biographyParagraphKeys.map((key) => (
              <p key={key} className="type-body text-slate-600">
                {t(key)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
