import { ChevronRight, type LucideIcon } from "lucide-react";
import { Fragment, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { useAdvisorLoanProgramModal } from "../loan-solutions/AdvisorLoanProgramModalContext";
import { trackAdvisorHomeGoalClick } from "../../../lib/advisorHomeAnalytics";
import type { AdvisorHomepageGoalPathway } from "../../../config/advisors/types";
import { ADVISOR_HOME_GOAL_ICONS } from "./advisorHomeIcons";

function GoalPathwayCard({
  pathway,
  Icon,
}: {
  pathway: AdvisorHomepageGoalPathway;
  Icon: LucideIcon;
}) {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const loanModal = useAdvisorLoanProgramModal();

  const handleNavigate = (event: MouseEvent<HTMLElement>) => {
    trackAdvisorHomeGoalClick({
      advisorSlug: advisor.slug,
      language: lang,
      goalId: pathway.id,
    });

    if (pathway.action.type === "loan-modal") {
      event.preventDefault();
      loanModal.openModal(pathway.action.programId, event.currentTarget);
    }
  };

  const href =
    pathway.action.type === "segment"
      ? advisorPath(advisor.slug, pathway.action.segment)
      : "#";

  const inner = (
    <>
      <span className="advisor-home-goals__icon-wrap" aria-hidden="true">
        <Icon className="advisor-home-goals__icon" strokeWidth={1.5} />
      </span>
      <span className="advisor-home-goals__pathway-copy">
        <span className="advisor-home-goals__pathway-title">{t(pathway.titleKey)}</span>
        <span className="advisor-home-goals__pathway-body">{t(pathway.bodyKey)}</span>
      </span>
      <ChevronRight className="advisor-home-goals__affordance" aria-hidden="true" strokeWidth={1.75} />
    </>
  );

  if (pathway.action.type === "loan-modal") {
    return (
      <button type="button" className="advisor-home-goals__pathway" onClick={handleNavigate}>
        {inner}
      </button>
    );
  }

  return (
    <Link to={href} className="advisor-home-goals__pathway" onClick={handleNavigate}>
      {inner}
    </Link>
  );
}

function GoalBridgePathway({
  pathway,
  Icon,
}: {
  pathway: AdvisorHomepageGoalPathway;
  Icon: LucideIcon;
}) {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const advisorFirstName = t(advisor.nameKey).split(" ")[0] || t(advisor.nameKey);
  const contactHref = advisorPath(advisor.slug, "contact");
  const ctaLabel = t("advisor.loanSolutions.modal.talkWithAdvisor").replace(
    "{name}",
    advisorFirstName,
  );

  const handleClick = () => {
    trackAdvisorHomeGoalClick({
      advisorSlug: advisor.slug,
      language: lang,
      goalId: pathway.id,
    });
  };

  return (
    <div className="advisor-home-goals__bridge-wrap">
      <div className="advisor-home-goals__bridge-sep" aria-hidden="true" />
      <Link
        to={contactHref}
        className="advisor-home-goals__bridge"
        onClick={handleClick}
        aria-label={`${t(pathway.titleKey)}. ${ctaLabel}`}
      >
        <span className="advisor-home-goals__bridge-icon-wrap" aria-hidden="true">
          <Icon className="advisor-home-goals__bridge-icon" strokeWidth={1.5} />
        </span>
        <p className="type-eyebrow text-gold advisor-home-goals__bridge-eyebrow">
          {t("advisor.home.goals.unsure.eyebrow")}
        </p>
        <span className="advisor-home-goals__bridge-title">{t(pathway.titleKey)}</span>
        <span className="advisor-home-goals__bridge-body">{t(pathway.bodyKey)}</span>
        <span className="advisor-home-goals__bridge-cta">{ctaLabel}</span>
      </Link>
    </div>
  );
}

export function AdvisorHomeGoalPathways() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { goals } = advisor.homepage;

  const primary = goals.pathways.filter((p) => !p.isBridge);
  const bridge = goals.pathways.find((p) => p.isBridge);

  return (
    <section className="advisor-home-goals" aria-labelledby="advisor-home-goals-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-goals__inner`}>
        <header className="advisor-home-goals__header">
          <h2 id="advisor-home-goals-heading" className="advisor-home-goals__headline">
            {t(goals.headlineKey)}
          </h2>
          <p className="advisor-home-goals__intro">{t(goals.introKey)}</p>
        </header>

        <div className="advisor-home-goals__grid">
          {primary.map((pathway) => (
            // Key on Fragment: React 19 types keep `key` off component props;
            // host/Fragment keys match the pattern used by SolutionsPageBody lists.
            <Fragment key={pathway.id}>
              <GoalPathwayCard
                pathway={pathway}
                Icon={ADVISOR_HOME_GOAL_ICONS[pathway.icon]}
              />
            </Fragment>
          ))}
        </div>

        {bridge ? (
          <GoalBridgePathway pathway={bridge} Icon={ADVISOR_HOME_GOAL_ICONS[bridge.icon]} />
        ) : null}
      </div>
    </section>
  );
}
