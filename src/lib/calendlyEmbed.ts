/**
 * Calendly official inline embed helpers.
 * Script: https://assets.calendly.com/assets/external/widget.js
 */

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_SCRIPT_ID = "ihl-calendly-widget-js";

export type CalendlyEmbedApi = {
  initInlineWidget: (options: {
    url: string;
    parentElement: HTMLElement;
    resize?: boolean;
  }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyEmbedApi;
  }
}

/** IHL-aligned Calendly URL params (cosmetic; does not change booking logic). */
export function buildAdvisorCalendlyEmbedUrl(schedulingUrl: string): string {
  const url = new URL(schedulingUrl);
  // Soft branding alignment with advisor site neutrals / navy / gold.
  if (!url.searchParams.has("background_color")) {
    url.searchParams.set("background_color", "ffffff");
  }
  if (!url.searchParams.has("text_color")) {
    url.searchParams.set("text_color", "0a192f");
  }
  if (!url.searchParams.has("primary_color")) {
    url.searchParams.set("primary_color", "c5a059");
  }
  if (!url.searchParams.has("hide_gdpr_banner")) {
    url.searchParams.set("hide_gdpr_banner", "1");
  }
  // Official embed params — reduce redundant host/event landing chrome when the
  // advisor context panel already introduces the conversation.
  if (!url.searchParams.has("hide_landing_page_details")) {
    url.searchParams.set("hide_landing_page_details", "1");
  }
  if (!url.searchParams.has("hide_event_type_details")) {
    url.searchParams.set("hide_event_type_details", "1");
  }
  return url.toString();
}

export function isCalendlyMessageEvent(event: MessageEvent): boolean {
  return (
    event.origin === "https://calendly.com" &&
    typeof event.data === "object" &&
    event.data !== null &&
    typeof (event.data as { event?: unknown }).event === "string" &&
    String((event.data as { event: string }).event).startsWith("calendly.")
  );
}

export function getCalendlyMessageEventName(event: MessageEvent): string | null {
  if (!isCalendlyMessageEvent(event)) return null;
  return (event.data as { event: string }).event;
}

let calendlyScriptPromise: Promise<CalendlyEmbedApi> | null = null;

export function loadCalendlyWidgetScript(): Promise<CalendlyEmbedApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Calendly requires a browser environment."));
  }

  if (window.Calendly?.initInlineWidget) {
    return Promise.resolve(window.Calendly);
  }

  if (calendlyScriptPromise) return calendlyScriptPromise;

  calendlyScriptPromise = new Promise<CalendlyEmbedApi>((resolve, reject) => {
    const existing = document.getElementById(CALENDLY_SCRIPT_ID) as HTMLScriptElement | null;

    const settle = () => {
      if (window.Calendly?.initInlineWidget) {
        resolve(window.Calendly);
        return;
      }
      reject(new Error("Calendly widget script loaded without API."));
    };

    if (existing) {
      if (window.Calendly?.initInlineWidget) {
        settle();
        return;
      }
      existing.addEventListener("load", settle, { once: true });
      existing.addEventListener(
        "error",
        () => {
          calendlyScriptPromise = null;
          reject(new Error("Failed to load Calendly widget script."));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = CALENDLY_SCRIPT_ID;
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.onload = settle;
    script.onerror = () => {
      calendlyScriptPromise = null;
      script.remove();
      reject(new Error("Failed to load Calendly widget script."));
    };
    document.body.appendChild(script);
  });

  return calendlyScriptPromise;
}
