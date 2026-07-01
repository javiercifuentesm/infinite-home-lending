import {
  ComplianceLegalLayout,
  ComplianceList,
  ComplianceParagraph,
  ComplianceSection,
} from "../../components/compliance/ComplianceLegalLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";

const PROTECTED_CLASSES = [
  "compliance.equalHousing.classes.item1",
  "compliance.equalHousing.classes.item2",
  "compliance.equalHousing.classes.item3",
  "compliance.equalHousing.classes.item4",
  "compliance.equalHousing.classes.item5",
  "compliance.equalHousing.classes.item6",
  "compliance.equalHousing.classes.item7",
] as const;

export default function EqualHousingPage() {
  const { t } = useLanguage();

  usePageMetadata({
    title: t("compliance.equalHousing.meta.title"),
    description: t("compliance.equalHousing.meta.description"),
  });

  return (
    <ComplianceLegalLayout
      titleKey="compliance.equalHousing.title"
      lastUpdatedKey="compliance.equalHousing.lastUpdated"
    >
      <ComplianceSection titleKey="compliance.equalHousing.statement.title">
        <ComplianceParagraph textKey="compliance.equalHousing.statement.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.equalHousing.classes.title">
        <ComplianceParagraph textKey="compliance.equalHousing.classes.p1" />
        <ComplianceList itemKeys={PROTECTED_CLASSES} />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.equalHousing.commitment.title">
        <ComplianceParagraph textKey="compliance.equalHousing.commitment.p1" />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.equalHousing.hud.title">
        <ComplianceParagraph textKey="compliance.equalHousing.hud.p1" />
        <p className="compliance-contact-line">
          <a
            href="https://www.hud.gov/program_offices/fair_housing_equal_opp"
            target="_blank"
            rel="noopener noreferrer"
            className="compliance-inline-link"
          >
            {t("compliance.equalHousing.hud.link")}
          </a>
        </p>
      </ComplianceSection>
    </ComplianceLegalLayout>
  );
}
