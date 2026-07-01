import type { CampaignWeek as CampaignWeekType } from "../config/campaignConfig";
import { getCampaignWeekHeading } from "../config/campaignConfig";
import { CampaignDay } from "./CampaignDay";

type CampaignWeekProps = {
  week: CampaignWeekType;
};

export function CampaignWeek({ week }: CampaignWeekProps) {
  return (
    <section className="studio-week" aria-labelledby={`${week.id}-heading`}>
      <header className="studio-week__header">
        <p className="studio-week__eyebrow">Week {week.weekNumber}</p>
        <h1 id={`${week.id}-heading`} className="studio-week__title">
          {week.title}
        </h1>
      </header>

      <div className="studio-week__days">
        {week.posts.map((post) => (
          <CampaignDay key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
