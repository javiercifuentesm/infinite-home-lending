import { LAUNCH_CAMPAIGN_WEEKS } from "../config/campaignConfig";
import { CampaignWeek } from "../components/CampaignWeek";
import "./preview.css";

export function SocialPreviewPage() {
  return (
    <div className="social-preview-root">
      <header className="social-preview-control-bar">
        <div className="social-preview-control-bar__info">
          <p className="social-preview-control-bar__title">Infinite Home Lending · Social Studio</p>
          <p className="social-preview-control-bar__meta">
            Internal content production · 30-Day Launch Campaign
          </p>
        </div>
      </header>

      <main className="studio-dashboard">
        {LAUNCH_CAMPAIGN_WEEKS.map((week) => (
          <CampaignWeek key={week.id} week={week} />
        ))}
      </main>
    </div>
  );
}
