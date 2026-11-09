import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorAboutSectionHeader } from "../about/AdvisorAboutSectionHeader";

export function AdvisorSmartToolsIntro() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { intro } = advisor.smartTools;

  return (
    <section className="advisor-page-intro" aria-labelledby="advisor-smart-tools-intro-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-page-intro__inner`}>
        <AdvisorAboutSectionHeader
          as="h1"
          align="center"
          headline={t(intro.headlineKey)}
          id="advisor-smart-tools-intro-heading"
          headlineClassName="advisor-page-intro__headline text-navy"
        />
        <p className="type-body-lg advisor-page-intro__body">{t(intro.introKey)}</p>
      </div>
    </section>
  );
}
