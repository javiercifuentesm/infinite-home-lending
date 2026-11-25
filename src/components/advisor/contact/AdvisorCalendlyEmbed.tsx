import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import {
  buildAdvisorCalendlyEmbedUrl,
  getCalendlyMessageEventName,
  loadCalendlyWidgetScript,
} from "../../../lib/calendlyEmbed";
import {
  trackAdvisorContactSchedulerEventSelected,
  trackAdvisorContactSchedulerFallbackClick,
  trackAdvisorContactSchedulerLoaded,
  trackAdvisorContactSchedulerScheduled,
} from "../../../lib/advisorContactAnalytics";

type EmbedStatus = "loading" | "ready" | "error";

const LOAD_TIMEOUT_MS = 14000;

type AdvisorCalendlyEmbedProps = {
  schedulingUrl: string;
};

export function AdvisorCalendlyEmbed({ schedulingUrl }: AdvisorCalendlyEmbedProps) {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const loadedTrackedRef = useRef(false);
  const [status, setStatus] = useState<EmbedStatus>("loading");
  const titleId = useId();

  const embedUrl = buildAdvisorCalendlyEmbedUrl(schedulingUrl);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;
    initializedRef.current = false;
    loadedTrackedRef.current = false;
    setStatus("loading");

    const parent = containerRef.current;
    if (!parent) return;

    // Clear any previous iframe Calendly injected.
    parent.innerHTML = "";

    const markReady = () => {
      if (cancelled || loadedTrackedRef.current) return;
      loadedTrackedRef.current = true;
      setStatus("ready");
      trackAdvisorContactSchedulerLoaded({
        advisorSlug: advisor.slug,
        language: lang,
      });
    };

    const markError = () => {
      if (cancelled) return;
      setStatus("error");
    };

    timeoutId = window.setTimeout(() => {
      if (!loadedTrackedRef.current) markError();
    }, LOAD_TIMEOUT_MS);

    loadCalendlyWidgetScript()
      .then((calendly) => {
        if (cancelled || !containerRef.current) return;
        if (initializedRef.current) return;
        initializedRef.current = true;

        calendly.initInlineWidget({
          url: embedUrl,
          parentElement: containerRef.current,
          resize: true,
        });

        // Calendly injects an iframe; treat iframe load as a soft ready signal.
        window.setTimeout(() => {
          const iframe = containerRef.current?.querySelector("iframe");
          if (!iframe) {
            markError();
            return;
          }
          iframe.addEventListener("load", markReady, { once: true });
          // Some embeds fire events before iframe load listeners attach.
          window.setTimeout(() => {
            if (!loadedTrackedRef.current && containerRef.current?.querySelector("iframe")) {
              markReady();
            }
          }, 2500);
        }, 50);
      })
      .catch(() => {
        markError();
      });

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (containerRef.current) containerRef.current.innerHTML = "";
      initializedRef.current = false;
    };
  }, [advisor.slug, embedUrl, lang]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const name = getCalendlyMessageEventName(event);
      if (!name) return;

      if (
        name === "calendly.event_type_viewed" ||
        name === "calendly.profile_page_viewed"
      ) {
        if (!loadedTrackedRef.current) {
          loadedTrackedRef.current = true;
          setStatus("ready");
          trackAdvisorContactSchedulerLoaded({
            advisorSlug: advisor.slug,
            language: lang,
          });
        }
      }

      if (name === "calendly.date_and_time_selected") {
        trackAdvisorContactSchedulerEventSelected({
          advisorSlug: advisor.slug,
          language: lang,
        });
      }

      if (name === "calendly.event_scheduled") {
        trackAdvisorContactSchedulerScheduled({
          advisorSlug: advisor.slug,
          language: lang,
        });
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [advisor.slug, lang]);

  return (
    <div className="advisor-contact-scheduler" aria-labelledby={titleId}>
      <p id={titleId} className="sr-only">
        {t("advisor.contact.scheduler.ariaLabel")}
      </p>

      {status === "loading" ? (
        <div className="advisor-contact-scheduler__loading" aria-live="polite">
          <div className="advisor-contact-scheduler__skeleton" aria-hidden="true">
            <div className="advisor-contact-scheduler__skeleton-bar" />
            <div className="advisor-contact-scheduler__skeleton-panel" />
            <div className="advisor-contact-scheduler__skeleton-row" />
            <div className="advisor-contact-scheduler__skeleton-row advisor-contact-scheduler__skeleton-row--short" />
          </div>
          <p className="advisor-contact-scheduler__loading-text">
            {t("advisor.contact.scheduler.loading")}
          </p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="advisor-contact-scheduler__fallback" role="status">
          <p className="advisor-contact-scheduler__fallback-title">
            {t("advisor.contact.scheduler.fallbackTitle")}
          </p>
          <p className="advisor-contact-scheduler__fallback-body">
            {t("advisor.contact.scheduler.fallbackBody")}
          </p>
          <a
            href={schedulingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-advisor-nav-exempt="true"
            className="advisor-contact-scheduler__fallback-cta"
            onClick={() =>
              trackAdvisorContactSchedulerFallbackClick({
                advisorSlug: advisor.slug,
                language: lang,
              })
            }
          >
            {t("advisor.contact.scheduler.fallbackCta")}
          </a>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={`advisor-contact-scheduler__embed${
          status === "ready" ? " is-ready" : ""
        }${status === "error" ? " is-hidden" : ""}`}
      />
    </div>
  );
}
