import { trackEvent } from "./analytics";

type AdvisorContactBaseParams = {
  advisorSlug: string;
  language: string;
};

export function trackAdvisorContactView(params: AdvisorContactBaseParams): void {
  trackEvent("advisor_contact_view", {
    advisor_slug: params.advisorSlug,
    language: params.language,
  });
}

export function trackAdvisorContactSchedulerLoaded(
  params: AdvisorContactBaseParams,
): void {
  trackEvent("advisor_contact_scheduler_loaded", {
    advisor_slug: params.advisorSlug,
    language: params.language,
  });
}

export function trackAdvisorContactSchedulerEventSelected(
  params: AdvisorContactBaseParams,
): void {
  trackEvent("advisor_contact_scheduler_event_selected", {
    advisor_slug: params.advisorSlug,
    language: params.language,
  });
}

export function trackAdvisorContactSchedulerScheduled(
  params: AdvisorContactBaseParams,
): void {
  trackEvent("advisor_contact_scheduler_scheduled", {
    advisor_slug: params.advisorSlug,
    language: params.language,
  });
}

export function trackAdvisorContactSchedulerFallbackClick(
  params: AdvisorContactBaseParams,
): void {
  trackEvent("advisor_contact_scheduler_fallback_click", {
    advisor_slug: params.advisorSlug,
    language: params.language,
  });
}
