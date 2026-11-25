import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";

export function AdvisorHomeTrustBridge() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { trustBridge } = advisor.homepage;

  const credentials = [
    t("advisor.trustStrip.brokerage"),
    t("advisor.trustStrip.languages"),
    `${t(advisor.nameKey)} NMLS #${advisor.nmlsId}`,
    t("footer.complianceEqualHousing"),
  ];

  return (
    <section className="advisor-home-trust" aria-labelledby="advisor-home-trust-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-trust__inner`}>
        <h2 id="advisor-home-trust-heading" className="advisor-home-trust__headline">
          {t(trustBridge.headlineKey)}
        </h2>
        <p className="advisor-home-trust__body">{t(trustBridge.bodyKey)}</p>
        <div className="advisor-home-trust__rule" aria-hidden="true" />
        <ul className="advisor-home-trust__credentials">
          {credentials.map((label) => (
            <li key={label} className="advisor-home-trust__credential">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
