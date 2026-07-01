import { FounderEditorialPostV3 } from "../templates/FounderEditorialPostV3";
import { FounderEditorialPostV3Instagram } from "../templates/FounderEditorialPostV3Instagram";
import { ConversationEditorialPost } from "../templates/ConversationEditorialPost";
import { ConversationEditorialPostInstagram } from "../templates/ConversationEditorialPostInstagram";
import { FoundersFeaturePost } from "../templates/FoundersFeaturePost";
import { FoundersFeaturePostInstagram } from "../templates/FoundersFeaturePostInstagram";
import { PeopleEditorialPost } from "../templates/PeopleEditorialPost";
import { PeopleEditorialPostInstagram } from "../templates/PeopleEditorialPostInstagram";
import type { CampaignPostDesign } from "../config/campaignConfig";
import { getLayoutProfileKeyForPlatform } from "../config/platformLayoutProfiles";
import { SOCIAL_PLATFORM_FORMATS } from "../config/platformFormats";
import type { SocialPlatformTemplate } from "../config/platformFormats";
import type {
  ConversationEditorialPostProps,
  FounderFeatureCard,
  FounderEditorialPostV3Props,
  FoundersFeaturePostProps,
  PeopleEditorialPostProps,
} from "../types";
import { PlatformPreviewCard } from "../preview/PlatformPreviewCard";

type PlatformExportsProps = {
  design?: CampaignPostDesign;
};

const EXPORTABLE_TEMPLATES = new Set([
  "founder-letter-v3",
  "conversation-v1",
  "founders-feature-v1",
  "people-editorial-v1",
]);

function founderPropsFromDesign(
  design?: CampaignPostDesign,
): Pick<FounderEditorialPostV3Props, "headline" | "supportingText"> | undefined {
  if (!design?.headline && !design?.supportingText) return undefined;
  return {
    headline: design.headline,
    supportingText: design.supportingText,
  };
}

function conversationPropsFromDesign(
  design?: CampaignPostDesign,
  platformId?: string,
): Pick<
  ConversationEditorialPostProps,
  "headline" | "supportingText" | "heroImageSrc" | "heroImageAlt" | "layoutProfileKey"
> | undefined {
  if (
    !design?.headline &&
    !design?.supportingText &&
    !design?.heroImageSrc &&
    !design?.heroImageAlt
  ) {
    return undefined;
  }
  return {
    headline: design.headline,
    supportingText: design.supportingText,
    heroImageSrc: design.heroImageSrc,
    heroImageAlt: design.heroImageAlt,
    layoutProfileKey: platformId
      ? getLayoutProfileKeyForPlatform(platformId)
      : "facebookSquare",
  };
}

function foundersFeaturePropsFromDesign(
  design?: CampaignPostDesign,
): Pick<
  FoundersFeaturePostProps,
  "headline" | "supportingText" | "founderCards"
> | undefined {
  if (!design?.headline && !design?.supportingText && !design?.founderCards) {
    return undefined;
  }

  const founderCards: [FounderFeatureCard, FounderFeatureCard] | undefined =
    design?.founderCards
      ? [
          {
            name: design.founderCards[0].name,
            mission: design.founderCards[0].mission,
            portrait: {
              src: design.founderCards[0].portraitSrc,
              alt: design.founderCards[0].portraitAlt,
              fallbackInitials: design.founderCards[0].fallbackInitials,
            },
          },
          {
            name: design.founderCards[1].name,
            mission: design.founderCards[1].mission,
            portrait: {
              src: design.founderCards[1].portraitSrc,
              alt: design.founderCards[1].portraitAlt,
              fallbackInitials: design.founderCards[1].fallbackInitials,
            },
          },
        ]
      : undefined;

  return {
    headline: design?.headline,
    supportingText: design?.supportingText,
    founderCards,
  };
}

function peopleEditorialPropsFromDesign(
  design?: CampaignPostDesign,
): Pick<
  PeopleEditorialPostProps,
  "editorialQuote" | "headline" | "supportingText" | "heroImageSrc" | "heroImageAlt"
> | undefined {
  if (
    !design?.editorialQuote &&
    !design?.headline &&
    !design?.supportingText &&
    !design?.heroImageSrc &&
    !design?.heroImageAlt
  ) {
    return undefined;
  }
  return {
    editorialQuote: design?.editorialQuote,
    headline: design?.headline,
    supportingText: design?.supportingText,
    heroImageSrc: design?.heroImageSrc,
    heroImageAlt: design?.heroImageAlt,
  };
}

function canvasSelectorForDesign(
  design: CampaignPostDesign,
  platformTemplate: SocialPlatformTemplate,
): string {
  if (design.template === "conversation-v1") {
    return platformTemplate === "instagram-portrait" ? ".fe-conv-ig" : ".fe-conv";
  }
  if (design.template === "founders-feature-v1") {
    return platformTemplate === "instagram-portrait" ? ".fe-founders-ig" : ".fe-founders";
  }
  if (design.template === "people-editorial-v1") {
    return platformTemplate === "instagram-portrait" ? ".fe-people-ig" : ".fe-people";
  }
  return platformTemplate === "instagram-portrait" ? ".fe-v3-ig" : ".fe-v3";
}

function renderPlatformTemplate(
  platformTemplate: SocialPlatformTemplate,
  platformId: string,
  design?: CampaignPostDesign,
) {
  if (design?.template === "conversation-v1") {
    const props = conversationPropsFromDesign(design, platformId);
    switch (platformTemplate) {
      case "instagram-portrait":
        return <ConversationEditorialPostInstagram {...props} />;
      case "square-v3":
      default:
        return <ConversationEditorialPost {...props} />;
    }
  }

  if (design?.template === "founders-feature-v1") {
    const props = foundersFeaturePropsFromDesign(design);
    switch (platformTemplate) {
      case "instagram-portrait":
        return <FoundersFeaturePostInstagram {...props} />;
      case "square-v3":
      default:
        return <FoundersFeaturePost {...props} />;
    }
  }

  if (design?.template === "people-editorial-v1") {
    const props = peopleEditorialPropsFromDesign(design);
    const extendedCopyClass =
      design.layoutVariant === "extended-copy" ? "fe-people-ig--extended-copy" : "";
    switch (platformTemplate) {
      case "instagram-portrait":
        return (
          <PeopleEditorialPostInstagram
            {...props}
            className={extendedCopyClass}
          />
        );
      case "square-v3":
      default:
        return <PeopleEditorialPost {...props} />;
    }
  }

  const props = founderPropsFromDesign(design);
  switch (platformTemplate) {
    case "instagram-portrait":
      return <FounderEditorialPostV3Instagram {...props} />;
    case "square-v3":
    default:
      return <FounderEditorialPostV3 {...props} />;
  }
}

export function PlatformExports({ design }: PlatformExportsProps) {
  const exportsEnabled = design?.template ? EXPORTABLE_TEMPLATES.has(design.template) : false;
  const postId = design?.postId ?? "001";

  return (
    <div className="studio-platform-exports">
      {SOCIAL_PLATFORM_FORMATS.map((platform) => (
        <div key={platform.id} className="studio-platform-exports__item">
          {exportsEnabled && design ? (
            <PlatformPreviewCard
              platform={platform}
              postId={postId}
              canvasSelector={canvasSelectorForDesign(design, platform.template)}
            >
              {renderPlatformTemplate(platform.template, platform.id, design)}
            </PlatformPreviewCard>
          ) : (
            <article className="social-platform-card social-platform-card--skeleton">
              <header className="social-platform-card__header">
                <div>
                  <h3 className="social-platform-card__title">{platform.label}</h3>
                  <p className="social-platform-card__dimensions">
                    {platform.width} × {platform.height} px
                  </p>
                </div>
                <button type="button" className="social-preview-export-btn" disabled>
                  Coming soon
                </button>
              </header>
              <div className="social-platform-card__frame social-platform-card__frame--empty">
                <p className="social-platform-card__placeholder">Design pending</p>
              </div>
            </article>
          )}
        </div>
      ))}
    </div>
  );
}
