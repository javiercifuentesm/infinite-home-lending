import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { MouseEvent, ReactNode } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { AdvisorResourceResolved } from "../../../data/advisorResourcesCatalog";
import { hasResourceModalSummary } from "../../../data/resourceModalSummaries";
import { useAdvisorResourceModalOptional } from "./AdvisorResourceModalContext";

type Props = {
  resource: AdvisorResourceResolved;
  className?: string;
  arrowSize?: number;
  children?: ReactNode;
};

/**
 * Explore control — opens native educational modal when a shared summary exists;
 * otherwise navigates to the Knowledge Center path (external-nav guard applies).
 */
export function AdvisorResourceExploreControl({
  resource,
  className = "advisor-resource-cta",
  arrowSize = 15,
  children,
}: Props) {
  const { t } = useLanguage();
  const modal = useAdvisorResourceModalOptional();
  const label = children ?? t("advisor.resources.explore");
  const opensModal = hasResourceModalSummary(resource.routeId) && Boolean(modal);

  if (opensModal && modal) {
    return (
      <button
        type="button"
        className={className}
        data-advisor-resource-id={resource.routeId}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          modal.openModal(resource.routeId, event.currentTarget);
        }}
      >
        <span>{label}</span>
        <ArrowRight size={arrowSize} strokeWidth={2} aria-hidden />
      </button>
    );
  }

  return (
    <Link to={resource.path} className={className} data-advisor-resource-id={resource.routeId}>
      <span>{label}</span>
      <ArrowRight size={arrowSize} strokeWidth={2} aria-hidden />
    </Link>
  );
}
