import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getAdvisorBySlug } from "../config/advisors";
import { AdvisorProvider } from "../context/AdvisorContext";
import { AdvisorNavbar } from "../components/advisor/AdvisorNavbar";
import { AdvisorFooter } from "../components/advisor/AdvisorFooter";
import { AdvisorMobileCtaBar } from "../components/advisor/AdvisorMobileCtaBar";
import { AdvisorExternalNavigationProvider } from "../components/advisor/AdvisorExternalNavigationProvider";
import "../components/advisor/advisorSite.css";

export function AdvisorSiteLayout() {
  const { advisorSlug } = useParams<{ advisorSlug: string }>();
  const advisor = advisorSlug ? getAdvisorBySlug(advisorSlug) : undefined;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("ihl-advisor-site");
    return () => {
      document.body.classList.remove("ihl-advisor-site");
    };
  }, []);

  if (!advisor) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdvisorProvider advisor={advisor}>
      <AdvisorExternalNavigationProvider>
        <AdvisorNavbar onMenuOpenChange={setMobileNavOpen} />
        <div className="advisor-main">
          <Outlet />
        </div>
        <AdvisorFooter />
        <AdvisorMobileCtaBar hidden={mobileNavOpen} />
      </AdvisorExternalNavigationProvider>
    </AdvisorProvider>
  );
}
