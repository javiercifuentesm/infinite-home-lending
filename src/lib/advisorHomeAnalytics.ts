import { trackEvent } from "./analytics";

type AdvisorHomeBaseParams = {
  advisorSlug: string;
  language: string;
};

export function trackAdvisorHomeGoalClick(
  params: AdvisorHomeBaseParams & { goalId: string },
): void {
  trackEvent("advisor_home_goal_click", {
    advisor_slug: params.advisorSlug,
    language: params.language,
    goal_id: params.goalId,
  });
}

export function trackAdvisorHomeLoanSpotlightClick(
  params: AdvisorHomeBaseParams & { programId: string },
): void {
  trackEvent("advisor_home_loan_spotlight_click", {
    advisor_slug: params.advisorSlug,
    language: params.language,
    program_id: params.programId,
  });
}

export function trackAdvisorHomeFeaturedToolClick(
  params: AdvisorHomeBaseParams & { toolId: string; ctaId: string },
): void {
  trackEvent("advisor_home_featured_tool_click", {
    advisor_slug: params.advisorSlug,
    language: params.language,
    tool_id: params.toolId,
    cta_id: params.ctaId,
  });
}

export function trackAdvisorHomeInsightClick(
  params: AdvisorHomeBaseParams & { insightId: string },
): void {
  trackEvent("advisor_home_insight_click", {
    advisor_slug: params.advisorSlug,
    language: params.language,
    insight_id: params.insightId,
  });
}

export function trackAdvisorHomeCtaClick(
  params: AdvisorHomeBaseParams & { ctaId: string },
): void {
  trackEvent("advisor_home_cta_click", {
    advisor_slug: params.advisorSlug,
    language: params.language,
    cta_id: params.ctaId,
  });
}
