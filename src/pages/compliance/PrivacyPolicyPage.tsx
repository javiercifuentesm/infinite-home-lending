import {
  ComplianceLegalLayout,
  ComplianceList,
  ComplianceParagraph,
  ComplianceSection,
} from "../../components/compliance/ComplianceLegalLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  usePageMetadata({
    title: t("compliance.privacy.meta.title"),
    description: t("compliance.privacy.meta.description"),
  });

  return (
    <ComplianceLegalLayout
      titleKey="compliance.privacy.title"
      lastUpdatedKey="compliance.privacy.lastUpdated"
    >
      <ComplianceSection titleKey="compliance.privacy.intro.title">
        <ComplianceParagraph textKey="compliance.privacy.intro.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.privacy.collect.title">
        <ComplianceParagraph textKey="compliance.privacy.collect.p1" />
        <ComplianceParagraph textKey="compliance.privacy.collect.p2" />
        <ComplianceList
          itemKeys={[
            "compliance.privacy.collect.item1",
            "compliance.privacy.collect.item2",
            "compliance.privacy.collect.item3",
            "compliance.privacy.collect.item4",
            "compliance.privacy.collect.item5",
          ]}
        />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.privacy.use.title">
        <ComplianceParagraph textKey="compliance.privacy.use.p1" />
        <ComplianceList
          itemKeys={[
            "compliance.privacy.use.item1",
            "compliance.privacy.use.item2",
            "compliance.privacy.use.item3",
            "compliance.privacy.use.item4",
          ]}
        />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.privacy.sms.title">
        <ComplianceParagraph textKey="compliance.privacy.sms.p1" />
        <ComplianceParagraph textKey="compliance.privacy.sms.p2" />
        <ComplianceParagraph textKey="compliance.privacy.sms.p3" />
      </ComplianceSection>
    </ComplianceLegalLayout>
  );
}
