import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDealDeskAuth } from "../../../hooks/useDealDeskAuth";
import "./dealDeskGate.css";
import { GateAccess } from "./GateAccess";
import { GateDiff } from "./GateDiff";
import { GateFooter } from "./GateFooter";
import { GateHero } from "./GateHero";
import { GateNav } from "./GateNav";
import { GateTimeline } from "./GateTimeline";
import { GateToolsGrid } from "./GateToolsGrid";
import { GateTour } from "./GateTour";
import { GateWhy } from "./GateWhy";

/** Partner code gate — route: /deal-desk/partner-access */
export function DealDeskGate() {
  const { isAuthenticated } = useDealDeskAuth();
  const authed = isAuthenticated();
  const rootRef = useRef<HTMLDivElement>(null);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    if (authed) return;
    const el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !el;
    const prevContent = el?.getAttribute("content") ?? null;
    let meta = el;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    const prevTitle = document.title;
    document.title = "The Deal Desk — Partner Access | Infinite Home Lending";

    return () => {
      if (created && meta?.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta && !created) {
        if (prevContent !== null) meta.setAttribute("content", prevContent);
        else meta.removeAttribute("content");
      }
      document.title = prevTitle;
    };
  }, [authed]);

  useEffect(() => {
    if (authed) return;
    document.body.classList.add("deal-desk-gate-active");
    return () => {
      document.body.classList.remove("deal-desk-gate-active");
    };
  }, [authed]);

  useEffect(() => {
    if (authed) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("gate-in");
        });
      },
      { threshold: 0 },
    );

    root.querySelectorAll(".gate-fade").forEach((el) => observer.observe(el));

    const t = window.setTimeout(() => {
      root.querySelectorAll(".gate-fade").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("gate-in");
      });
    }, 50);

    const fallbackTimer = window.setTimeout(() => {
      document.querySelectorAll(".gate-fade").forEach((el) => {
        el.classList.add("gate-in");
      });
    }, 300);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [authed]);

  if (authed) {
    return <Navigate to="/deal-desk" replace />;
  }

  return (
    <div ref={rootRef} className="deal-desk-gate min-h-screen bg-white">
      <GateNav />
      <main>
        <div id="gate-hero">
          <GateHero onStartTour={() => setTourActive(true)} />
        </div>
        <div id="gate-tools">
          <GateToolsGrid />
        </div>
        <div id="gate-why">
          <GateWhy />
        </div>
        <div id="gate-timeline">
          <GateTimeline />
        </div>
        <div id="gate-diff">
          <GateDiff />
        </div>
        <div id="gate-access">
          <GateAccess />
        </div>
      </main>
      <GateTour isActive={tourActive} onClose={() => setTourActive(false)} />
      <GateFooter />
    </div>
  );
}
