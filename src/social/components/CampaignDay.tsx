import { useState } from "react";
import type { CampaignPost } from "../config/campaignConfig";
import {
  PLATFORM_LABELS,
  getCampaignPostLabel,
  type PlatformKey,
} from "../config/campaignConfig";
import { CaptionSection } from "./CaptionSection";
import { HashtagSection } from "./HashtagSection";
import { PlatformExports } from "./PlatformExports";
import { ProductionStatusBar } from "./ProductionStatusBar";
import { PublishingNotesSection } from "./PublishingNotesSection";

const PLATFORM_ORDER: PlatformKey[] = ["facebook", "instagram", "linkedin"];

type CampaignDayProps = {
  post: CampaignPost;
};

export function CampaignDay({ post }: CampaignDayProps) {
  const [expanded, setExpanded] = useState(post.defaultExpanded);
  const isDraft = post.productionStatus === "draft" && !post.design;

  return (
    <article
      className={`studio-day${expanded ? " studio-day--expanded" : " studio-day--collapsed"}${
        isDraft ? " studio-day--draft" : ""
      }`}
    >
      <button
        type="button"
        className="studio-day__toggle"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        <span className="studio-day__chevron" aria-hidden="true">
          {expanded ? "▼" : "▶"}
        </span>
        <span className="studio-day__title">{getCampaignPostLabel(post)}</span>
        {!expanded && isDraft ? (
          <span className="studio-day__pill studio-day__pill--grey">Not started</span>
        ) : null}
      </button>

      {expanded ? (
        <div className="studio-day__body">
          <section className="studio-panel">
            <header className="studio-panel__header">
              <h3 className="studio-panel__title">Designs</h3>
            </header>
            <PlatformExports design={post.design} />
          </section>

          <section className="studio-panel">
            <header className="studio-panel__header">
              <h3 className="studio-panel__title">Content</h3>
            </header>
            <div className="studio-panel__stack">
              {PLATFORM_ORDER.map((platform) => (
                <CaptionSection
                  key={platform}
                  platform={PLATFORM_LABELS[platform]}
                  caption={post.copy[platform].caption}
                />
              ))}
            </div>
          </section>

          <section className="studio-panel">
            <header className="studio-panel__header">
              <h3 className="studio-panel__title">Hashtags</h3>
            </header>
            <div className="studio-panel__stack studio-panel__stack--tight">
              {PLATFORM_ORDER.map((platform) => (
                <HashtagSection
                  key={platform}
                  platform={PLATFORM_LABELS[platform]}
                  hashtags={post.copy[platform].hashtags}
                />
              ))}
            </div>
          </section>

          <section className="studio-panel">
            <header className="studio-panel__header">
              <h3 className="studio-panel__title">Publishing Notes</h3>
            </header>
            <PublishingNotesSection notes={post.publishingNotes} />
          </section>

          <section className="studio-panel studio-panel--status">
            <header className="studio-panel__header">
              <h3 className="studio-panel__title">Status</h3>
            </header>
            <ProductionStatusBar activeStatus={post.productionStatus} />
          </section>
        </div>
      ) : null}
    </article>
  );
}
