/**
 * Lightweight GA4 helpers for advisor microsite events.
 * No-ops when gtag is absent (preview / local without measurement ID).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetOrEventName: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

/** Fire a custom GA4 event when analytics is available. */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
