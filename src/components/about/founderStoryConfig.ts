export type FounderId = "javier" | "alma";
export type FounderStoryType = "letter" | "bio";

export type FounderStorySelection = {
  founder: FounderId;
  type: FounderStoryType;
};

type FounderStoryDefinition = {
  titleKey: string;
  paragraphKeys: readonly string[];
  pullquoteKey?: string;
  showSignature: boolean;
};

export const FOUNDER_STORY_DEFINITIONS: Record<
  `${FounderId}-${FounderStoryType}`,
  FounderStoryDefinition
> = {
  "javier-letter": {
    titleKey: "about.founders.javier.letter.title",
    paragraphKeys: [
      "about.founders.javier.letter.lead",
      "about.founders.javier.letter.p1",
      "about.founders.javier.letter.p2",
      "about.founders.javier.letter.p3",
      "about.founders.javier.letter.p4",
      "about.founders.javier.letter.p5",
      "about.founders.javier.letter.p6",
    ],
    pullquoteKey: "about.founders.javier.letter.pullquote",
    showSignature: true,
  },
  "javier-bio": {
    titleKey: "about.founders.javier.bio.title",
    paragraphKeys: [
      "about.founders.javier.bio.p1",
      "about.founders.javier.bio.p2",
      "about.founders.javier.bio.p3",
      "about.founders.javier.bio.p4",
      "about.founders.javier.bio.p5",
      "about.founders.javier.bio.p6",
      "about.founders.javier.bio.p7",
    ],
    showSignature: false,
  },
  "alma-letter": {
    titleKey: "about.founders.alma.letter.title",
    paragraphKeys: [
      "about.founders.alma.letter.lead",
      "about.founders.alma.letter.p1",
      "about.founders.alma.letter.p2",
      "about.founders.alma.letter.p3",
      "about.founders.alma.letter.p4",
      "about.founders.alma.letter.p5",
      "about.founders.alma.letter.p6",
      "about.founders.alma.letter.p7",
      "about.founders.alma.letter.p8",
      "about.founders.alma.letter.p9",
    ],
    showSignature: true,
  },
  "alma-bio": {
    titleKey: "about.founders.alma.bio.title",
    paragraphKeys: [
      "about.founders.alma.bio.p1",
      "about.founders.alma.bio.p2",
      "about.founders.alma.bio.p3",
      "about.founders.alma.bio.p4",
      "about.founders.alma.bio.p5",
    ],
    showSignature: false,
  },
};

export function getFounderStoryDefinition(selection: FounderStorySelection) {
  return FOUNDER_STORY_DEFINITIONS[`${selection.founder}-${selection.type}`];
}

export const FOUNDER_LINKEDIN_URLS: Record<FounderId, string> = {
  javier: "https://www.linkedin.com/in/javiercifuentes1/",
  alma: "https://www.linkedin.com/in/alma-jaramillo-99843632/",
};
