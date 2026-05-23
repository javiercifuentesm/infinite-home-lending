import { PageContainer } from "../components/PageContainer";
import { StrategicContactExperience } from "../components/contact/StrategicContactExperience";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

/**
 * Contact — hero-integrated V4 flagship: compressed hero, scroll handoff, 3-step discovery, authority panel.
 */
const Contact = () => {
  const { t } = useLanguage();
  usePageMetadata({
    title: t("contact.meta.title"),
    description: t("contact.meta.description"),
    canonical: "https://www.infinitehomelending.com/contact",
  });

  return (
    <PageContainer className="!pb-0">
      <StrategicContactExperience />
    </PageContainer>
  );
};

export default Contact;
