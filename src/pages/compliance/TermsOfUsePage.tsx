import {
  ComplianceLegalLayout,
  ComplianceParagraph,
  ComplianceSection,
} from "../../components/compliance/ComplianceLegalLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";

export default function TermsOfUsePage() {
  const { t } = useLanguage();

  usePageMetadata({
    title: t("compliance.terms.meta.title"),
    description: t("compliance.terms.meta.description"),
  });

  return (
    <ComplianceLegalLayout
      titleKey="compliance.terms.title"
      lastUpdatedKey="compliance.terms.lastUpdated"
    >
      <ComplianceSection titleKey="compliance.terms.acceptance.title">
        <ComplianceParagraph textKey="compliance.terms.acceptance.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.educational.title">
        <ComplianceParagraph textKey="compliance.terms.educational.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.noCommitment.title">
        <ComplianceParagraph textKey="compliance.terms.noCommitment.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.sarah.title">
        <ComplianceParagraph textKey="compliance.terms.sarah.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.ip.title">
        <ComplianceParagraph textKey="compliance.terms.ip.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.thirdParty.title">
        <ComplianceParagraph textKey="compliance.terms.thirdParty.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.liability.title">
        <ComplianceParagraph textKey="compliance.terms.liability.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.terms.contact.title">
        <ComplianceParagraph textKey="compliance.terms.contact.p1" />
      </ComplianceSection>
    </ComplianceLegalLayout>
  );
}
