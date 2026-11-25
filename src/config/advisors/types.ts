export type AdvisorLanguage = "en" | "es";

export type AdvisorHeadshot = {
  jpgSrc: string;
  webpSrc: string;
  webpSrc640?: string;
  altKey: string;
  width: number;
  height: number;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
};

/** Optional personal signature artwork (e.g. Hero finishing mark) */
export type AdvisorSignatureMark = {
  src: string;
  width: number;
  height: number;
};

export type AdvisorHeroCopy = {
  eyebrowKey: string;
  headlineKey: string;
  bodyKey: string;
  bodyMobileKey: string;
  reassuranceKey: string;
};

export type AdvisorSeo = {
  titleKey: string;
  descriptionKey: string;
  canonicalPath: string;
  ogImage?: string;
};

export type AdvisorSocial = {
  linkedin?: string;
  instagram?: string;
};

export type AdvisorAboutImage = {
  jpgSrc: string;
  webpSrc?: string;
  webpSrc640?: string;
  altKey: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type AdvisorAboutPrinciple = {
  titleKey: string;
  bodyKey: string;
};

export type AdvisorAboutAudience = {
  titleKey: string;
  bodyKey: string;
};

export type AdvisorAboutSeo = {
  titleKey: string;
  descriptionKey: string;
  canonicalPath: string;
};

export type AdvisorPageIntro = {
  eyebrowKey: string;
  headlineKey: string;
  introKey: string;
};

export type AdvisorClosingCta = {
  eyebrowKey: string;
  headlineKey: string;
  bodyKey: string;
};

export type AdvisorLoanSolutionsConfig = {
  intro: AdvisorPageIntro;
  closingCta: AdvisorClosingCta;
  seo: AdvisorAboutSeo;
};

export type AdvisorSmartToolsConfig = {
  intro: AdvisorPageIntro;
  closingCta: AdvisorClosingCta;
  seo: AdvisorAboutSeo;
};

export type AdvisorResourcesConfig = {
  intro: AdvisorPageIntro;
  closingCta: AdvisorClosingCta;
  seo: AdvisorAboutSeo;
};

/** Goal pathway icon ids — mapped to Lucide icons in homepage UI */
export type AdvisorHomepageGoalIcon = "home" | "refresh" | "wallet" | "building" | "compass";

export type AdvisorHomepageGoalAction =
  | { type: "segment"; segment: string }
  | { type: "loan-modal"; programId: string };

export type AdvisorHomepageGoalPathway = {
  id: string;
  titleKey: string;
  bodyKey: string;
  icon: AdvisorHomepageGoalIcon;
  action: AdvisorHomepageGoalAction;
  /** Softer bridge pathway (e.g. "I'm not sure yet") */
  isBridge?: boolean;
};

export type AdvisorHomepageLoanSpotlightItem = {
  programId: string;
  labelKey: string;
};

export type AdvisorHomepageJourneyStep = {
  titleKey: string;
  bodyKey: string;
};

/**
 * Future testimonials slot — optional.
 * When omitted or empty, no testimonials UI is rendered.
 */
export type AdvisorHomepageTestimonial = {
  id: string;
  quoteKey: string;
  attributionKey: string;
};

export type AdvisorHomepageTestimonialsConfig = {
  headlineKey: string;
  items: readonly AdvisorHomepageTestimonial[];
};

export type AdvisorHomepageConfig = {
  goals: {
    headlineKey: string;
    introKey: string;
    pathways: readonly AdvisorHomepageGoalPathway[];
  };
  loanSpotlight: {
    headlineKey: string;
    introKey: string;
    items: readonly AdvisorHomepageLoanSpotlightItem[];
    viewAllKey: string;
  };
  featuredTool: {
    toolId: string;
    headlineKey: string;
    framingKey: string;
    supportingKey: string;
    tryToolKey: string;
    exploreAllKey: string;
  };
  mortgageInsight: {
    id: string;
    eyebrowKey: string;
    headlineKey: string;
    bodyKey: string;
    disclaimerKey: string;
    ctaKey: string;
    ctaSegment: string;
  };
  advisoryJourney: {
    headlineKey: string;
    steps: readonly AdvisorHomepageJourneyStep[];
  };
  /**
   * Optional future testimonials band (between journey and trust).
   * Leave undefined until approved canonical testimonials exist.
   */
  testimonials?: AdvisorHomepageTestimonialsConfig;
  trustBridge: {
    headlineKey: string;
    bodyKey: string;
  };
  closingCta: {
    headlineKey: string;
    bodyKey: string;
    reassuranceKey: string;
    talkWithKey: string;
  };
};

export type AdvisorAboutConfig = {
  intro: {
    eyebrowKey: string;
    headlineKey: string;
    introKey: string;
  };
  meet: {
    labelKey: string;
    headlineKey: string;
    biographyParagraphKeys: readonly string[];
    image: AdvisorAboutImage;
  };
  whyIhl: {
    eyebrowKey: string;
    headlineKey: string;
    introKey: string;
    items: readonly AdvisorAboutPrinciple[];
  };
  principles: {
    headingKey: string;
    items: readonly AdvisorAboutPrinciple[];
  };
  credibility: {
    languagesKey: string;
    regionKey: string;
  };
  audiences: {
    headingKey: string;
    introKey: string;
    items: readonly AdvisorAboutAudience[];
  };
  closingCta: {
    headlineKey: string;
    bodyKey: string;
  };
  seo: AdvisorAboutSeo;
};

export type AdvisorContactJourneyStep = {
  titleKey: string;
  bodyKey: string;
};

export type AdvisorContactConfig = {
  intro: {
    headlineKey: string;
    introKey: string;
  };
  studio: {
    eyebrowKey: string;
    headingKey: string;
    supportingKey: string;
  };
  journey: {
    headlineKey: string;
    supportingKey: string;
    steps: readonly AdvisorContactJourneyStep[];
  };
  reassurance: {
    headlineKey: string;
    bodyKey: string;
  };
  seo: AdvisorAboutSeo;
};

export type AdvisorProfile = {
  /** URL slug, e.g. "alma-jaramillo" */
  slug: string;
  /** Stable identifier for i18n prefixes and analytics */
  id: string;

  nameKey: string;
  titleKey: string;

  nmlsId: string;
  nmlsUrl: string;
  languages: AdvisorLanguage[];

  email?: string;
  phone?: { display: string; tel: string };

  applyNowUrl: string;
  /**
   * Optional Calendly (or equivalent) scheduling URL for the advisor Contact page.
   * When omitted, Contact renders a graceful non-widget fallback.
   */
  schedulingUrl?: string;
  social?: AdvisorSocial;

  headshot: AdvisorHeadshot;
  /** Optional personal signature artwork (e.g. Hero finishing mark) */
  signatureMark?: AdvisorSignatureMark;
  hero: AdvisorHeroCopy;
  seo: AdvisorSeo;

  showSarah: boolean;
  showMobileCtaBar: boolean;

  about: AdvisorAboutConfig;
  loanSolutions: AdvisorLoanSolutionsConfig;
  smartTools: AdvisorSmartToolsConfig;
  resources: AdvisorResourcesConfig;
  contact: AdvisorContactConfig;
  homepage: AdvisorHomepageConfig;
};
