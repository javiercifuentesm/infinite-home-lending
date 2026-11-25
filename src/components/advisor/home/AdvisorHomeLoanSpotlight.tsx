import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { getLoanProductById } from "../../../data/loanProducts";
import { hasAdvisorLoanProgramModalData } from "../../../lib/advisorLoanProgramModal";
import { useAdvisorLoanProgramModal } from "../loan-solutions/AdvisorLoanProgramModalContext";
import { trackAdvisorHomeLoanSpotlightClick } from "../../../lib/advisorHomeAnalytics";

export function AdvisorHomeLoanSpotlight() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const loanModal = useAdvisorLoanProgramModal();
  const { loanSpotlight } = advisor.homepage;

  const openProgram = (programId: string, el: HTMLElement) => {
    trackAdvisorHomeLoanSpotlightClick({
      advisorSlug: advisor.slug,
      language: lang,
      programId,
    });
    loanModal.openModal(programId, el);
  };

  return (
    <section className="advisor-home-spotlight" aria-labelledby="advisor-home-spotlight-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-spotlight__inner`}>
        <div className="advisor-home-spotlight__intro-col">
          <h2 id="advisor-home-spotlight-heading" className="advisor-home-spotlight__headline">
            {t(loanSpotlight.headlineKey)}
          </h2>
          <p className="advisor-home-spotlight__intro">{t(loanSpotlight.introKey)}</p>
          <Link
            to={advisorPath(advisor.slug, "loan-solutions")}
            className="advisor-home-spotlight__view-all"
            onClick={() =>
              trackAdvisorHomeLoanSpotlightClick({
                advisorSlug: advisor.slug,
                language: lang,
                programId: "view-all",
              })
            }
          >
            {t(loanSpotlight.viewAllKey)}
            <ChevronRight className="advisor-home-spotlight__view-all-icon" aria-hidden="true" />
          </Link>
        </div>

        <ul className="advisor-home-spotlight__list">
          {loanSpotlight.items.map(({ programId, labelKey }) => {
            const product = getLoanProductById(programId, lang);
            if (!product) return null;
            const canModal = hasAdvisorLoanProgramModalData(product);

            return (
              <li key={programId} className="advisor-home-spotlight__item">
                <div className="advisor-home-spotlight__item-copy">
                  <p className="advisor-home-spotlight__item-label">{t(labelKey)}</p>
                  <p className="advisor-home-spotlight__item-title">{product.title}</p>
                </div>
                {canModal ? (
                  <button
                    type="button"
                    className="advisor-home-spotlight__explore"
                    onClick={(e) => openProgram(programId, e.currentTarget)}
                  >
                    {t("advisor.home.cta.exploreSolution")}
                  </button>
                ) : (
                  <Link
                    to={advisorPath(advisor.slug, "loan-solutions")}
                    className="advisor-home-spotlight__explore advisor-home-spotlight__explore--link"
                  >
                    {t("advisor.home.cta.exploreSolution")}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
