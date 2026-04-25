import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import LoanSimulator from "./pages/LoanSimulator";
import BuyVsWaitAnalyzer from "./pages/BuyVsWaitAnalyzer";
import RefinanceRealMath from "./pages/RefinanceRealMath";
import TrueCostOfWaiting from "./pages/tools/TrueCostOfWaiting";
import BuyVsRent from "./pages/tools/BuyVsRent";
import PrincipalAccelerator from "./pages/tools/PrincipalAccelerator";
import ReverseMortgagePlanner from "./pages/tools/ReverseMortgagePlanner";
import HelocPlanner from "./pages/tools/HelocPlanner";
import ConventionalVsFHA from "./pages/tools/ConventionalVsFHA";
import CreditScoreROI from "./pages/tools/CreditScoreROI";
import SelfEmployedQualifier from "./pages/tools/SelfEmployedQualifier";
import RateLockEngine from "./pages/tools/RateLockEngine";
import HomebuyingPowerMap from "./pages/tools/HomebuyingPowerMap";
import WealthTracker from "./pages/tools/WealthTracker";
import DealDeskEntry from "./DealDeskEntry";
import OfferOptimizer from "./pages/deal-desk/OfferOptimizer";
import ClientQualifier from "./pages/deal-desk/ClientQualifier";
import ListingBoost from "./pages/deal-desk/ListingBoost";
import AssumableCalculator from "./pages/deal-desk/AssumableCalculator";
import SellerNetSheet from "./pages/deal-desk/SellerNetSheet";
import DealDeskPlaybook from "./pages/deal-desk/DealDeskPlaybook";
import LoanMatchmaker from "./pages/deal-desk/LoanMatchmaker";
import NARScripts from "./pages/deal-desk/NARScripts";
import DealRescue from "./pages/deal-desk/DealRescue";
import SmartTools from "./pages/SmartTools";
import KnowledgeCenter from "./pages/KnowledgeCenter";
import { MortgageAgentProvider } from "./components/agent/MortgageAgentProvider";
import { AgentV2Provider } from "./context/AgentV2Provider";
import MortgageConcierge from "./components/MortgageConcierge";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MortgageConciergeWhenNotDealDesk = () => {
  const location = useLocation();
  const isDealDesk = location.pathname.startsWith("/deal-desk");
  return !isDealDesk ? <MortgageConcierge /> : null;
};

const FooterWhenNotAnalytics = () => {
  const { pathname } = useLocation();
  if (pathname === "/analytics") return null;
  return <Footer />;
};

export default function App() {
  return (
    <Router>
      <MortgageAgentProvider>
        <AgentV2Provider>
        <ScrollToTop />
        <MortgageConciergeWhenNotDealDesk />
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
          <Navbar />
          <main>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            {/* Both slugs render the page (nav + legacy bookmarks) */}
            <Route path="/how-we-work" element={<HowItWorks />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/smart-tools" element={<SmartTools />} />
            <Route path="/knowledge-center" element={<KnowledgeCenter />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/loan-structure-simulator" element={<LoanSimulator />} />
            <Route path="/buy-vs-wait" element={<BuyVsWaitAnalyzer />} />
            <Route path="/refinance-real-math" element={<RefinanceRealMath />} />
            <Route path="/tools/true-cost-of-waiting" element={<TrueCostOfWaiting />} />
            <Route path="/tools/buy-vs-rent" element={<BuyVsRent />} />
            <Route path="/tools/principal-accelerator" element={<PrincipalAccelerator />} />
            <Route path="/tools/reverse-mortgage-planner" element={<ReverseMortgagePlanner />} />
            <Route path="/tools/heloc-planner" element={<HelocPlanner />} />
            <Route path="/tools/conventional-vs-fha" element={<ConventionalVsFHA />} />
            <Route path="/tools/credit-score-roi" element={<CreditScoreROI />} />
            <Route path="/tools/self-employed-qualifier" element={<SelfEmployedQualifier />} />
            <Route path="/tools/rate-lock-engine" element={<RateLockEngine />} />
            <Route path="/tools/homebuying-power-map" element={<HomebuyingPowerMap />} />
            <Route path="/tools/wealth-tracker" element={<WealthTracker />} />
            <Route path="/deal-desk/playbook" element={<DealDeskPlaybook />} />
            <Route path="/deal-desk/offer-optimizer" element={<OfferOptimizer />} />
            <Route path="/deal-desk/client-qualifier" element={<ClientQualifier />} />
            <Route path="/deal-desk/listing-boost" element={<ListingBoost />} />
            <Route path="/deal-desk/assumable-calculator" element={<AssumableCalculator />} />
            <Route path="/deal-desk/net-sheet" element={<SellerNetSheet />} />
            <Route path="/deal-desk/loan-matchmaker" element={<LoanMatchmaker />} />
            <Route path="/deal-desk/nar-scripts" element={<NARScripts />} />
            <Route path="/deal-desk/deal-rescue" element={<DealRescue />} />
            {/* Hub route must come after more specific /deal-desk/* paths */}
            <Route path="/deal-desk" element={<DealDeskEntry />} />
            </Routes>
          </main>
          <FooterWhenNotAnalytics />
        </div>
        </AgentV2Provider>
      </MortgageAgentProvider>
    </Router>
  );
}
