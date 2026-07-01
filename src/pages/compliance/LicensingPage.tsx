import {
  ComplianceLegalLayout,
  ComplianceMloCard,
  ComplianceList,
  ComplianceParagraph,
  ComplianceSection,
} from "../../components/compliance/ComplianceLegalLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";

const NMLS_COMPANY_URL =
  "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/2831765";
const NMLS_JAVIER_URL =
  "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/210090";
const NMLS_ALMA_URL =
  "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1376746";

export default function LicensingPage() {
  const { t } = useLanguage();

  usePageMetadata({
    title: t("compliance.licensing.meta.title"),
    description: t("compliance.licensing.meta.description"),
  });

  return (
    <ComplianceLegalLayout
      titleKey="compliance.licensing.title"
      lastUpdatedKey="compliance.licensing.lastUpdated"
    >
      <ComplianceSection titleKey="compliance.licensing.company.title">
        <ComplianceParagraph textKey="compliance.licensing.company.p1" />
        <p className="compliance-contact-line">
          {t("compliance.licensing.company.nmlsLabel")}{" "}
          <a href={NMLS_COMPANY_URL} target="_blank" rel="noopener noreferrer" className="compliance-inline-link">
            2831765
          </a>
        </p>
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.licensing.states.title">
        <ComplianceList
          itemKeys={[
            "compliance.licensing.states.item1",
            "compliance.licensing.states.item2",
            "compliance.licensing.states.item3",
          ]}
        />
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.licensing.mlo.title">
        <ComplianceParagraph textKey="compliance.licensing.mlo.p1" />
        <div className="compliance-mlo-grid mt-5">
          <ComplianceMloCard
            nameKey="compliance.licensing.mlo.javier.name"
            roleKey="compliance.licensing.mlo.javier.role"
            nmlsId="210090"
            nmlsUrl={NMLS_JAVIER_URL}
          />
          <ComplianceMloCard
            nameKey="compliance.licensing.mlo.alma.name"
            roleKey="compliance.licensing.mlo.alma.role"
            nmlsId="1376746"
            nmlsUrl={NMLS_ALMA_URL}
          />
        </div>
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.licensing.consumerAccess.title">
        <ComplianceParagraph textKey="compliance.licensing.consumerAccess.p1" />
        <p className="compliance-contact-line">
          <a
            href="https://www.nmlsconsumeraccess.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="compliance-inline-link"
          >
            {t("compliance.licensing.consumerAccess.link")}
          </a>
        </p>
      </ComplianceSection>

      <ComplianceSection titleKey="compliance.licensing.equalHousing.title">
        <ComplianceParagraph textKey="compliance.licensing.equalHousing.p1" />
      </ComplianceSection>
    </ComplianceLegalLayout>
  );
}
