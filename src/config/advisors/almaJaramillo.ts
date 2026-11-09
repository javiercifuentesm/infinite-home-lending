import type { AdvisorProfile } from "./types";

export const almaJaramillo: AdvisorProfile = {
  slug: "alma-jaramillo",
  id: "alma",

  nameKey: "about.founders.alma.name",
  titleKey: "advisor.alma.title",

  nmlsId: "1376746",
  nmlsUrl: "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1376746",
  languages: ["en", "es"],

  email: "Alma.Jaramillo@infinitehomelending.com",
  phone: { display: "(301) 507-7579", tel: "+13015077579" },
  applyNowUrl: "https://infinitehomelendingllc.my1003app.com/1376746/register",
  schedulingUrl: "https://calendly.com/alma-jaramillo-infinitehomelending",

  social: {
    linkedin: "https://www.linkedin.com/in/alma-jaramillo-99843632/",
    instagram: "https://www.instagram.com/alma.c.jaramillo/",
  },

  headshot: {
    jpgSrc: "/about/alma-jaramillo-advisor-portrait.jpg",
    webpSrc: "/about/alma-jaramillo-advisor-portrait.webp",
    webpSrc640: "/about/alma-jaramillo-advisor-portrait-640.webp",
    altKey: "about.founders.alma.imageAlt",
    width: 1024,
    height: 1024,
    objectPositionDesktop: "center center",
    objectPositionMobile: "center center",
  },

  signatureMark: {
    src: "/about/alma-jaramillo-signature-mark.png",
    width: 694,
    height: 512,
  },

  hero: {
    eyebrowKey: "advisor.alma.hero.eyebrow",
    headlineKey: "advisor.alma.hero.headline",
    bodyKey: "advisor.alma.hero.body",
    bodyMobileKey: "advisor.alma.hero.bodyMobile",
    reassuranceKey: "advisor.alma.hero.reassurance",
  },

  seo: {
    titleKey: "advisor.alma.seo.title",
    descriptionKey: "advisor.alma.seo.description",
    canonicalPath: "/alma-jaramillo",
    ogImage: "/about/alma-jaramillo-advisor-portrait.jpg",
  },

  showSarah: false,
  showMobileCtaBar: true,

  about: {
    intro: {
      eyebrowKey: "advisor.about.intro.eyebrow",
      headlineKey: "advisor.alma.about.intro.headline",
      introKey: "advisor.alma.about.intro.body",
    },
    meet: {
      labelKey: "advisor.alma.about.meet.label",
      headlineKey: "advisor.alma.about.meet.headline",
      biographyParagraphKeys: [
        "advisor.alma.about.meet.p1",
        "advisor.alma.about.meet.p2",
        "advisor.alma.about.meet.p3",
        "advisor.alma.about.meet.p4",
      ],
      image: {
        jpgSrc: "/about/Alma_About_Homeowners.png",
        altKey: "advisor.alma.about.meet.imageAlt",
        width: 766,
        height: 1024,
        objectPosition: "center 38%",
      },
    },
    whyIhl: {
      eyebrowKey: "advisor.alma.about.whyIhl.eyebrow",
      headlineKey: "advisor.alma.about.whyIhl.headline",
      introKey: "advisor.alma.about.whyIhl.intro",
      items: [
        {
          titleKey: "advisor.alma.about.whyIhl.1.title",
          bodyKey: "advisor.alma.about.whyIhl.1.body",
        },
        {
          titleKey: "advisor.alma.about.whyIhl.2.title",
          bodyKey: "advisor.alma.about.whyIhl.2.body",
        },
        {
          titleKey: "advisor.alma.about.whyIhl.3.title",
          bodyKey: "advisor.alma.about.whyIhl.3.body",
        },
      ],
    },
    principles: {
      headingKey: "advisor.alma.about.principles.heading",
      items: [
        {
          titleKey: "advisor.alma.about.principles.1.title",
          bodyKey: "advisor.alma.about.principles.1.body",
        },
        {
          titleKey: "advisor.alma.about.principles.2.title",
          bodyKey: "advisor.alma.about.principles.2.body",
        },
        {
          titleKey: "advisor.alma.about.principles.3.title",
          bodyKey: "advisor.alma.about.principles.3.body",
        },
      ],
    },
    credibility: {
      languagesKey: "advisor.alma.about.credibility.languages",
      regionKey: "advisor.alma.about.credibility.region",
    },
    audiences: {
      headingKey: "advisor.alma.about.audiences.heading",
      introKey: "advisor.alma.about.audiences.intro",
      items: [
        {
          titleKey: "advisor.alma.about.audiences.1.title",
          bodyKey: "advisor.alma.about.audiences.1.body",
        },
        {
          titleKey: "advisor.alma.about.audiences.2.title",
          bodyKey: "advisor.alma.about.audiences.2.body",
        },
        {
          titleKey: "advisor.alma.about.audiences.3.title",
          bodyKey: "advisor.alma.about.audiences.3.body",
        },
        {
          titleKey: "advisor.alma.about.audiences.4.title",
          bodyKey: "advisor.alma.about.audiences.4.body",
        },
      ],
    },
    closingCta: {
      headlineKey: "advisor.alma.about.closing.headline",
      bodyKey: "advisor.alma.about.closing.body",
    },
    seo: {
      titleKey: "advisor.alma.about.seo.title",
      descriptionKey: "advisor.alma.about.seo.description",
      canonicalPath: "/alma-jaramillo/about",
    },
  },

  loanSolutions: {
    intro: {
      eyebrowKey: "advisor.loanSolutions.eyebrow",
      headlineKey: "advisor.alma.loanSolutions.intro.headline",
      introKey: "advisor.alma.loanSolutions.intro.body",
    },
    closingCta: {
      eyebrowKey: "advisor.loanSolutions.closing.eyebrow",
      headlineKey: "advisor.alma.loanSolutions.closing.headline",
      bodyKey: "advisor.alma.loanSolutions.closing.body",
    },
    seo: {
      titleKey: "advisor.alma.loanSolutions.seo.title",
      descriptionKey: "advisor.alma.loanSolutions.seo.description",
      canonicalPath: "/alma-jaramillo/loan-solutions",
    },
  },

  smartTools: {
    intro: {
      eyebrowKey: "advisor.smartTools.eyebrow",
      headlineKey: "advisor.alma.smartTools.intro.headline",
      introKey: "advisor.alma.smartTools.intro.body",
    },
    closingCta: {
      eyebrowKey: "advisor.smartTools.closing.eyebrow",
      headlineKey: "advisor.alma.smartTools.closing.headline",
      bodyKey: "advisor.alma.smartTools.closing.body",
    },
    seo: {
      titleKey: "advisor.alma.smartTools.seo.title",
      descriptionKey: "advisor.alma.smartTools.seo.description",
      canonicalPath: "/alma-jaramillo/tools",
    },
  },

  resources: {
    intro: {
      eyebrowKey: "advisor.resources.eyebrow",
      headlineKey: "advisor.alma.resources.intro.headline",
      introKey: "advisor.alma.resources.intro.body",
    },
    closingCta: {
      eyebrowKey: "advisor.resources.closing.eyebrow",
      headlineKey: "advisor.alma.resources.closing.headline",
      bodyKey: "advisor.alma.resources.closing.body",
    },
    seo: {
      titleKey: "advisor.alma.resources.seo.title",
      descriptionKey: "advisor.alma.resources.seo.description",
      canonicalPath: "/alma-jaramillo/resources",
    },
  },

  contact: {
    intro: {
      headlineKey: "advisor.alma.contact.intro.headline",
      introKey: "advisor.alma.contact.intro.body",
    },
    studio: {
      eyebrowKey: "advisor.alma.contact.studio.eyebrow",
      headingKey: "advisor.alma.contact.studio.heading",
      supportingKey: "advisor.alma.contact.studio.supporting",
    },
    journey: {
      headlineKey: "advisor.alma.contact.journey.headline",
      supportingKey: "advisor.alma.contact.journey.supporting",
      steps: [
        {
          titleKey: "advisor.alma.contact.journey.step1.title",
          bodyKey: "advisor.alma.contact.journey.step1.body",
        },
        {
          titleKey: "advisor.alma.contact.journey.step2.title",
          bodyKey: "advisor.alma.contact.journey.step2.body",
        },
        {
          titleKey: "advisor.alma.contact.journey.step3.title",
          bodyKey: "advisor.alma.contact.journey.step3.body",
        },
      ],
    },
    reassurance: {
      headlineKey: "advisor.alma.contact.reassurance.headline",
      bodyKey: "advisor.alma.contact.reassurance.body",
    },
    seo: {
      titleKey: "advisor.alma.contact.seo.title",
      descriptionKey: "advisor.alma.contact.seo.description",
      canonicalPath: "/alma-jaramillo/contact",
    },
  },

  homepage: {
    goals: {
      headlineKey: "advisor.alma.home.goals.headline",
      introKey: "advisor.alma.home.goals.intro",
      pathways: [
        {
          id: "buy-a-home",
          titleKey: "advisor.alma.home.goals.buy.title",
          bodyKey: "advisor.alma.home.goals.buy.body",
          icon: "home",
          action: { type: "segment", segment: "loan-solutions" },
        },
        {
          id: "refinance",
          titleKey: "advisor.alma.home.goals.refinance.title",
          bodyKey: "advisor.alma.home.goals.refinance.body",
          icon: "refresh",
          action: { type: "loan-modal", programId: "refinance" },
        },
        {
          id: "use-equity",
          titleKey: "advisor.alma.home.goals.equity.title",
          bodyKey: "advisor.alma.home.goals.equity.body",
          icon: "wallet",
          action: { type: "loan-modal", programId: "heloc" },
        },
        {
          id: "invest",
          titleKey: "advisor.alma.home.goals.invest.title",
          bodyKey: "advisor.alma.home.goals.invest.body",
          icon: "building",
          action: { type: "loan-modal", programId: "dscr" },
        },
        {
          id: "not-sure",
          titleKey: "advisor.alma.home.goals.unsure.title",
          bodyKey: "advisor.alma.home.goals.unsure.body",
          icon: "compass",
          action: { type: "segment", segment: "contact" },
          isBridge: true,
        },
      ],
    },
    loanSpotlight: {
      headlineKey: "advisor.alma.home.spotlight.headline",
      introKey: "advisor.alma.home.spotlight.intro",
      items: [
        { programId: "fha", labelKey: "advisor.alma.home.spotlight.fha.label" },
        { programId: "bank-statement", labelKey: "advisor.alma.home.spotlight.selfEmployed.label" },
        { programId: "dscr", labelKey: "advisor.alma.home.spotlight.investor.label" },
        { programId: "heloc", labelKey: "advisor.alma.home.spotlight.equity.label" },
      ],
      viewAllKey: "advisor.home.cta.viewAllLoanSolutions",
    },
    featuredTool: {
      toolId: "true-cost-of-waiting",
      headlineKey: "advisor.alma.home.featuredTool.headline",
      framingKey: "advisor.alma.home.featuredTool.framing",
      supportingKey: "advisor.alma.home.featuredTool.supporting",
      tryToolKey: "advisor.home.cta.tryTool",
      exploreAllKey: "advisor.home.cta.exploreAllTools",
    },
    mortgageInsight: {
      id: "down-payment-clarity",
      eyebrowKey: "advisor.alma.home.insight.eyebrow",
      headlineKey: "advisor.alma.home.insight.headline",
      bodyKey: "advisor.alma.home.insight.body",
      disclaimerKey: "advisor.alma.home.insight.disclaimer",
      ctaKey: "advisor.home.cta.understandOptions",
      ctaSegment: "loan-solutions",
    },
    advisoryJourney: {
      headlineKey: "advisor.alma.home.journey.headline",
      steps: [
        {
          titleKey: "advisor.alma.home.journey.step1.title",
          bodyKey: "advisor.alma.home.journey.step1.body",
        },
        {
          titleKey: "advisor.alma.home.journey.step2.title",
          bodyKey: "advisor.alma.home.journey.step2.body",
        },
        {
          titleKey: "advisor.alma.home.journey.step3.title",
          bodyKey: "advisor.alma.home.journey.step3.body",
        },
        {
          titleKey: "advisor.alma.home.journey.step4.title",
          bodyKey: "advisor.alma.home.journey.step4.body",
        },
      ],
    },
    trustBridge: {
      headlineKey: "advisor.alma.home.trust.headline",
      bodyKey: "advisor.alma.home.trust.body",
    },
    closingCta: {
      headlineKey: "advisor.alma.home.closing.headline",
      bodyKey: "advisor.alma.home.closing.body",
      reassuranceKey: "advisor.alma.home.closing.reassurance",
      talkWithKey: "advisor.home.cta.talkWithAlma",
    },
  },
};
