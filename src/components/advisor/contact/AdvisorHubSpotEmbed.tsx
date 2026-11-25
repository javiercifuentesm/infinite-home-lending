import { useEffect, useState } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { trackAdvisorContactSchedulerFallbackClick } from "../../../lib/advisorContactAnalytics";

export function AdvisorHubSpotEmbed({ schedulingUrl }: { schedulingUrl: string }) {
  const { advisor } = useAdvisor();
  const { lang, t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const embedUrl = new URL(schedulingUrl);
  embedUrl.searchParams.set("embed", "true");
  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    const timeout = window.setTimeout(() => setTimedOut(true), 14000);
    return () => window.clearTimeout(timeout);
  }, [schedulingUrl]);

  return (
    <div className="advisor-contact-scheduler">
      {!loaded && !timedOut && <p role="status">{t("advisor.contact.scheduler.loading")}</p>}
      {timedOut && !loaded && <p role="status">{t("advisor.contact.scheduler.fallbackBody")}</p>}
      <iframe
        src={embedUrl.toString()}
        title={t("advisor.contact.scheduler.ariaLabel")}
        className="advisor-contact-hubspot-frame"
        onLoad={() => setLoaded(true)}
      />
      <a
        href={schedulingUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-advisor-nav-exempt="true"
        className="advisor-contact-scheduler__fallback-cta"
        onClick={() => trackAdvisorContactSchedulerFallbackClick({ advisorSlug: advisor.slug, language: lang })}
      >
        {lang === "es" ? "Abrir calendario en una nueva pestaña" : "Open calendar in a new tab"}
      </a>
    </div>
  );
}
