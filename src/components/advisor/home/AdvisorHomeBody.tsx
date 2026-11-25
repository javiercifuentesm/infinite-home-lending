import { AdvisorHomeGoalPathways } from "./AdvisorHomeGoalPathways";
import { AdvisorHomeLoanSpotlight } from "./AdvisorHomeLoanSpotlight";
import { AdvisorHomeFeaturedTool } from "./AdvisorHomeFeaturedTool";
import { AdvisorHomeMortgageInsight } from "./AdvisorHomeMortgageInsight";
import { AdvisorHomeAdvisoryJourney } from "./AdvisorHomeAdvisoryJourney";
import { AdvisorHomeTestimonials } from "./AdvisorHomeTestimonials";
import { AdvisorHomeTrustBridge } from "./AdvisorHomeTrustBridge";
import { AdvisorHomeClosingCta } from "./AdvisorHomeClosingCta";
import { AdvisorLoanProgramModalProvider } from "../loan-solutions/AdvisorLoanProgramModalContext";
import { AdvisorLoanProgramModal } from "../loan-solutions/AdvisorLoanProgramModal";

export function AdvisorHomeBody() {
  return (
    <AdvisorLoanProgramModalProvider>
      <AdvisorHomeGoalPathways />
      <AdvisorHomeLoanSpotlight />
      <AdvisorHomeFeaturedTool />
      <AdvisorHomeMortgageInsight />
      <AdvisorHomeAdvisoryJourney />
      {/* Future slot: renders only when homepage.testimonials has items */}
      <AdvisorHomeTestimonials />
      <AdvisorHomeTrustBridge />
      <AdvisorHomeClosingCta />
      <AdvisorLoanProgramModal />
    </AdvisorLoanProgramModalProvider>
  );
}
