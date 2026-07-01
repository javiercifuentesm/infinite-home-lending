import { Link } from "react-router-dom";
import {
  ComplianceLegalLayout,
  ComplianceList,
  ComplianceParagraph,
  ComplianceSection,
} from "../../components/compliance/ComplianceLegalLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";

const SMS_MESSAGE_TYPES = [
  "compliance.sms.messages.item1",
  "compliance.sms.messages.item2",
  "compliance.sms.messages.item3",
  "compliance.sms.messages.item4",
] as const;

export default function SmsTermsPage() {
  const { t } = useLanguage();

  usePageMetadata({
    title: t("compliance.sms.meta.title"),
    description: t("compliance.sms.meta.description"),
  });

  return (
    <ComplianceLegalLayout
      titleKey="compliance.sms.title"
      lastUpdatedKey="compliance.sms.lastUpdated"
    >
      <ComplianceSection titleKey="compliance.sms.program.title">
        <ComplianceParagraph textKey="compliance.sms.program.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.sms.messages.title">
        <ComplianceParagraph textKey="compliance.sms.messages.p1" />
        <ComplianceList itemKeys={SMS_MESSAGE_TYPES} />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.sms.frequency.title">
        <ComplianceParagraph textKey="compliance.sms.frequency.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.sms.rates.title">
        <ComplianceParagraph textKey="compliance.sms.rates.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.sms.stop.title">
        <ComplianceParagraph textKey="compliance.sms.stop.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.sms.help.title">
        <ComplianceParagraph textKey="compliance.sms.help.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.sms.privacy.title">
        <p className="compliance-paragraph type-body text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
          {t("compliance.sms.privacy.p1")}{" "}
          <Link to="/privacy-policy" className="compliance-inline-link">
            {t("compliance.sms.privacy.link")}
          </Link>
          .
        </p>
      </ComplianceSection>
    </ComplianceLegalLayout>
  );
}
