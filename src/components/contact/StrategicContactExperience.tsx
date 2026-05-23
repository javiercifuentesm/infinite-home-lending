import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiUrl } from "../../lib/apiBase";
import { ContactHeroEntry, CONTACT_HERO_PNG, CONTACT_HERO_WEBP } from "./ContactHeroEntry";
import {
  initialPurchaseData,
  PurchasePathStep,
  type PurchaseDataState,
  type PurchaseFlowStep,
} from "./PurchasePathFlow";
import {
  buildRefinanceContextPayload,
  getRefinanceStepScrollId,
  initialRefinanceData,
  RefinancePathStep,
  type RefinanceDataState,
  type RefinanceFlowStep,
} from "./RefinancePathFlow";
import {
  buildHelocContextPayload,
  getHelocStepScrollId,
  getNextHelocSubstep,
  HelocPathStep,
  initialHelocData,
  type HelocDataState,
  type HelocFlowStep,
} from "./HelocPathFlow";
import {
  buildReverseContextPayload,
  getReverseStepScrollId,
  getNextReverseSubstep,
  initialReverseData,
  ReversePathStep,
  type ReverseDataState,
  type ReverseFlowStep,
} from "./ReversePathFlow";
import { getOrCreateLeadClientId, MortgageStatementUpload } from "./MortgageStatementUpload";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { getKnowledgeRoutes, type KnowledgeRouteId } from "../../data/knowledgeCenterRoutes";
import { normalizeCountyForPayload } from "../../data/purchaseLocations";
import { useLanguage } from "../../i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

type ContactMethodId = "phone" | "email";

/**
 * Vertically center an element in the visible viewport below the fixed site header.
 * Centering in the full window places the card halfway under the navbar — this uses the
 * band below `.site-navbar` so the form is not clipped at the top.
 */
function scrollElementToViewportCenter(element: HTMLElement, behavior: ScrollBehavior = "smooth") {
  const rect = element.getBoundingClientRect();
  const absoluteElementTop = rect.top + window.pageYOffset;
  const elementHeight = rect.height;
  const viewportHeight = window.innerHeight;
  const headerEl = document.querySelector<HTMLElement>(".site-navbar");
  const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
  const visibleCenterY = headerHeight + (viewportHeight - headerHeight) / 2;
  const offset = absoluteElementTop + elementHeight / 2 - visibleCenterY;
  window.scrollTo({ top: Math.max(0, offset), behavior });
}

/**
 * HELOC `#contact-form`: center when the card fits below the nav; if taller than the viewport,
 * scroll so the bottom (Back / Continue) stays visible — pure centering clips the footer.
 */
function scrollHelocContactFormCard(element: HTMLElement, behavior: ScrollBehavior = "smooth") {
  const rect = element.getBoundingClientRect();
  const absoluteTop = rect.top + window.pageYOffset;
  const elementHeight = rect.height;
  const absoluteBottom = absoluteTop + elementHeight;
  const viewportHeight = window.innerHeight;
  const headerEl = document.querySelector<HTMLElement>(".site-navbar");
  const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
  const marginTop = 8;
  const marginBottom = 16;
  const availableHeight = viewportHeight - headerHeight - marginTop - marginBottom;

  if (elementHeight <= availableHeight) {
    scrollElementToViewportCenter(element, behavior);
    return;
  }
  const scrollTop = absoluteBottom - viewportHeight + marginBottom;
  window.scrollTo({ top: Math.max(0, scrollTop), behavior });
}

const SCROLL_AFTER_MS = 80;
/** AnimatePresence `mode="wait"` + form step motion ~0.35s — scroll after new step has real height */
const SCROLL_CARD_SETTLE_MS = 420;
/** “Your details” final step: let AnimatePresence + textarea layout settle before measuring */
const SCROLL_DETAILS_INITIAL_MS = 140;
const SCROLL_DETAILS_RETRY_MS = 80;
const SCROLL_DETAILS_MAX_ATTEMPTS = 5;

function scrollContactFormCardIntoView(behavior: ScrollBehavior) {
  const el = document.getElementById("contact-form");
  if (!el) return;
  el.scrollIntoView({ block: "center", inline: "nearest", behavior: behavior === "auto" ? "auto" : "smooth" });
}

/** “Start with clarity” only: center `#contact-form` in the viewport band below `.site-navbar` (same as flagship scroll). */
const FIRST_CONTACT_SCROLL_DELAY_MS = 120;

function scrollToFirstStep(stepId: string, behavior: ScrollBehavior = "smooth") {
  const attemptScroll = (attempt = 0): void => {
    const element = document.getElementById(stepId);
    if (!element) {
      if (attempt < 6) {
        window.setTimeout(() => attemptScroll(attempt + 1), 80);
      }
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollElementToViewportCenter(element, behavior);
      });
    });
  };
  requestAnimationFrame(() => attemptScroll());
}

/** Run after layout paint (post Framer enter) so measurements match the visible card. */
function runAfterNextPaint(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(fn);
    });
  });
}

/** Purchase / HELOC / Reverse sub-paths: allow React + AnimatePresence to commit before measuring. */
const CONTACT_SUBPATH_SCROLL_DELAY_MS = 180;

/**
 * Wait for inner `*-step-*` to mount, then center **`#contact-form`** (full card).
 * Second pass after motion settles so height is final.
 */
function scrollContactSubpathToStepId(stepId: string, behavior: ScrollBehavior, logLabel: string) {
  const attemptScroll = (attempt = 0): void => {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) {
      if (attempt < 6) {
        window.setTimeout(() => attemptScroll(attempt + 1), 80);
      } else {
        console.log(`${logLabel} step transition failed`, stepId);
      }
      return;
    }
    const cardEl = document.getElementById("contact-form");
    const target = cardEl ?? stepEl;
    const centerCard = (el: HTMLElement) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollHelocContactFormCard(el, behavior);
        });
      });
    };
    centerCard(target);
    const settleMs = behavior === "auto" ? 120 : SCROLL_CARD_SETTLE_MS;
    window.setTimeout(() => {
      const card = document.getElementById("contact-form");
      if (card) centerCard(card);
    }, settleMs);
  };
  requestAnimationFrame(() => attemptScroll());
}

function scrollHelocToStepId(stepId: string, behavior: ScrollBehavior = "smooth") {
  scrollContactSubpathToStepId(stepId, behavior, "HELOC");
}

function scrollReverseToStepId(stepId: string, behavior: ScrollBehavior = "smooth") {
  scrollContactSubpathToStepId(stepId, behavior, "Reverse");
}

/**
 * Scroll `#stepId` into the framed view below the navbar (non–contact-form targets).
 */
function scrollToStep(stepId: string, behavior: ScrollBehavior = "smooth") {
  const element = document.getElementById(stepId);
  if (!element) {
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollElementToViewportCenter(element, behavior);
    });
  });
}

function safeScroll(stepId: string, behavior: ScrollBehavior = "smooth") {
  scrollToStep(stepId, behavior);
}

/**
 * Final “Your details” block: retry if #id isn’t mounted yet; double rAF frame centers after layout stabilizes.
 * Uses header-aware centering (same as other form steps), not raw window half-height.
 */
function scrollDetailsStepWithRetry(stepId: string, behavior: ScrollBehavior, attempts = 0) {
  const element = document.getElementById(stepId);
  if (!element) {
    if (attempts < SCROLL_DETAILS_MAX_ATTEMPTS) {
      window.setTimeout(
        () => scrollDetailsStepWithRetry(stepId, behavior, attempts + 1),
        SCROLL_DETAILS_RETRY_MS,
      );
    }
    return;
  }
  requestAnimationFrame(() => {
    scrollElementToViewportCenter(element, behavior);
    requestAnimationFrame(() => {
      scrollElementToViewportCenter(element, behavior);
    });
  });
}

/** Values for <select name="phoneTime"> — matches display labels */
const PHONE_TIME_SELECT_VALUES = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
] as const;

export type UserIntent = "buy" | "refi" | "heloc" | "reverse" | "plan" | "explore" | null;

/** Maps contact reason tile → API / advisor routing path */
function mapReasonIdToLeadPath(reasonId: string | null): string {
  switch (reasonId) {
    case "buy":
      return "purchase";
    case "refi":
      return "refinance";
    case "heloc":
      return "heloc";
    case "reverse":
      return "reverse";
    case "possible":
      return "plan";
    case "guidance":
      return "explore";
    default:
      return "explore";
  }
}

function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 10);
  if (!cleaned) return "";
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return value;
  if (!match[2]) return `(${match[1]}`;
  return `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
}

/** Digits-only parse from formatted currency / raw input → null when empty. */
function parseCurrencyDigitsToNumber(raw: string): number | null {
  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function hasMortgageStatementUploadLane(reasonId: string | null): boolean {
  return reasonId === "refi" || reasonId === "heloc" || reasonId === "reverse";
}

function parseDownPaymentPayload(data: PurchaseDataState): { type: "dollar" | "percent"; value: number } | null {
  if (data.downPaymentType === "dollar") {
    const n = parseCurrencyDigitsToNumber(data.downPaymentStr);
    return n === null ? null : { type: "dollar", value: n };
  }
  const raw = data.downPaymentStr.replace(/%/g, "").trim();
  if (!raw) return null;
  const n = Number.parseFloat(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return null;
  return { type: "percent", value: Math.min(100, n) };
}

export function StrategicContactExperience() {
  const [searchParams] = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();
  const scrollBehavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
  const { t, lang } = useLanguage();

  const CONTACT_METHOD_OPTIONS: { id: ContactMethodId; label: string }[] = [
    { id: "phone", label: t("contact.step.method.phone") },
    { id: "email", label: t("contact.step.method.email") },
  ];

  const PHONE_DAY_OPTIONS = [
    { id: "mon", label: t("contact.step.day.mon") },
    { id: "tue", label: t("contact.step.day.tue") },
    { id: "wed", label: t("contact.step.day.wed") },
    { id: "thu", label: t("contact.step.day.thu") },
    { id: "fri", label: t("contact.step.day.fri") },
  ];

  const STEP1_OPTIONS = [
    { id: "buy", label: t("contact.step0.buy"), intent: "buy" as const },
    { id: "refi", label: t("contact.step0.refi"), intent: "refi" as const },
    { id: "heloc", label: t("contact.step0.heloc"), intent: "heloc" as const },
    { id: "reverse", label: t("contact.step0.reverse"), intent: "reverse" as const },
    { id: "possible", label: t("contact.step0.possible"), intent: "plan" as const },
    { id: "guidance", label: t("contact.step0.guidance"), intent: "explore" as const },
  ];

  const STEP2_OPTIONS = [
    { id: "exploring", label: t("contact.step.standing.exploring") },
    { id: "looking", label: t("contact.step.standing.looking") },
    { id: "process", label: t("contact.step.standing.process") },
    { id: "unsure", label: t("contact.step.standing.unsure") },
  ];

  const STEP3_OPTIONS = [
    { id: "payment", label: t("contact.step.priority.payment") },
    { id: "strategy", label: t("contact.step.priority.strategy") },
    { id: "approved", label: t("contact.step.priority.approved") },
    { id: "options", label: t("contact.step.priority.options") },
  ];

  const heroRef = useRef<HTMLElement | null>(null);

  /** Skip scroll on first paint; then scroll when step or intent sub-step advances. */
  const prevFlowScrollKeyRef = useRef<string | null>(null);
  const prevPurchaseHasPropertyRef = useRef<boolean | null | "__init__">("__init__");
  const prevPurchaseLocStateRef = useRef<string | "__init__">("__init__");
  const prevPurchaseCountyRef = useRef<string | "__init__">("__init__");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.82], reducedMotion ? [1, 1] : [1, 0.74]);
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -28]);
  const formLiftY = useTransform(scrollYProgress, [0, 0.52], reducedMotion ? [0, 0] : [56, 0]);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Hero scroll-parallax lifts the form; disable it when jumping to the form so centering isn't pulled upward mid-scroll. */
  const [suppressFormParallax, setSuppressFormParallax] = useState(false);

  const scheduleHelocScrollToStepId = useCallback(
    (stepId: string) => {
      window.setTimeout(() => {
        setSuppressFormParallax(true);
        scrollHelocToStepId(stepId, scrollBehavior);
      }, CONTACT_SUBPATH_SCROLL_DELAY_MS);
    },
    [scrollBehavior],
  );

  const scheduleReverseScrollToStepId = useCallback(
    (stepId: string) => {
      window.setTimeout(() => {
        setSuppressFormParallax(true);
        scrollReverseToStepId(stepId, scrollBehavior);
      }, CONTACT_SUBPATH_SCROLL_DELAY_MS);
    },
    [scrollBehavior],
  );

  const [reasonId, setReasonId] = useState<string | null>(null);
  const [standingId, setStandingId] = useState<string | null>(null);
  const [priorityId, setPriorityId] = useState<string | null>(null);
  const [contactMethod, setContactMethod] = useState<ContactMethodId | null>(null);
  const [phoneDay, setPhoneDay] = useState<string | null>(null);
  const [phoneTime, setPhoneTime] = useState("");
  const [notes, setNotes] = useState("");

  /** Purchase path — only when “I’m planning to buy a home” is selected. */
  const [purchaseFlowStep, setPurchaseFlowStep] = useState<PurchaseFlowStep>("inactive");
  const [purchaseData, setPurchaseData] = useState<PurchaseDataState>(() => initialPurchaseData());

  /** Refinance path — only when “I’m thinking about refinancing” is selected. */
  const [refinanceFlowStep, setRefinanceFlowStep] = useState<RefinanceFlowStep>("inactive");
  const [refinanceData, setRefinanceData] = useState<RefinanceDataState>(() => initialRefinanceData());
  const refinanceFlowStepRef = useRef<RefinanceFlowStep>(refinanceFlowStep);
  refinanceFlowStepRef.current = refinanceFlowStep;

  /** HELOC path — “I want to access my home equity”. */
  const [helocFlowStep, setHelocFlowStep] = useState<HelocFlowStep>("inactive");
  const [helocData, setHelocData] = useState<HelocDataState>(() => initialHelocData());
  const helocFlowStepRef = useRef<HelocFlowStep>(helocFlowStep);
  helocFlowStepRef.current = helocFlowStep;

  /** Reverse mortgage path — calm, optional sub-flow before shared contact steps. */
  const [reverseFlowStep, setReverseFlowStep] = useState<ReverseFlowStep>("inactive");
  const [reverseData, setReverseData] = useState<ReverseDataState>(() => initialReverseData());
  const reverseFlowStepRef = useRef<ReverseFlowStep>(reverseFlowStep);
  reverseFlowStepRef.current = reverseFlowStep;

  const [mortgageStatementFileKey, setMortgageStatementFileKey] = useState<string | null>(null);
  const [mortgageStatementUploading, setMortgageStatementUploading] = useState(false);
  const [leadClientId] = useState(() => getOrCreateLeadClientId());

  const [firstName, setFirstName] = useState(() => {
    const n = searchParams.get("name")?.trim();
    if (!n) return "";
    return n.split(/\s+/)[0] ?? "";
  });
  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const [phone, setPhone] = useState("");
  const [contextNote] = useState(() => {
    const topic = searchParams.get("topic");
    if (topic === "buy-vs-wait") {
      return "I'd like to review my Buy vs. Wait scenario with an advisor.";
    }
    if (topic === "refinance-real-math") {
      return "I'd like to review my refinance numbers and timeline with an advisor.";
    }
    if (topic === "advisory") {
      const path = searchParams.get("knowledgePath") as KnowledgeRouteId | null;
      const knowledgeRoutes = getKnowledgeRoutes(lang);
      if (path && path in knowledgeRoutes) {
        const label = knowledgeRoutes[path].label;
        return `I'm exploring the "${label}" topic in the Knowledge Center and would like to see how it applies to my situation.`;
      }
    }
    if (topic === "deal-desk-partner") {
      return "I'm interested in becoming a Deal Desk partner.";
    }
    return "";
  });

  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic === "buy-vs-wait") {
      setReasonId("buy");
    } else if (topic === "refinance-real-math") {
      setReasonId("refi");
    } else if (topic === "deal-desk-partner" || topic === "deal-desk-offer-optimizer" || topic === "deal-desk-client-qualifier") {
      setReasonId("guidance");
    } else if (topic === "advisory") {
      setReasonId("possible");
    }
  }, [searchParams]);

  useEffect(() => {
    if (contactMethod !== "phone") {
      setPhoneDay(null);
      setPhoneTime("");
    }
  }, [contactMethod]);

  useEffect(() => {
    if (reasonId !== "buy") {
      setPurchaseFlowStep("inactive");
      setPurchaseData(initialPurchaseData());
    }
  }, [reasonId]);

  useEffect(() => {
    if (reasonId !== "refi") {
      setRefinanceFlowStep("inactive");
      setRefinanceData(initialRefinanceData());
    }
  }, [reasonId]);

  useEffect(() => {
    if (reasonId !== "heloc") {
      setHelocFlowStep("inactive");
      setHelocData(initialHelocData());
    }
  }, [reasonId]);

  useEffect(() => {
    if (reasonId !== "reverse") {
      setReverseFlowStep("inactive");
      setReverseData(initialReverseData());
    }
  }, [reasonId]);

  useEffect(() => {
    if (!hasMortgageStatementUploadLane(reasonId)) {
      setMortgageStatementFileKey(null);
      setMortgageStatementUploading(false);
    }
  }, [reasonId]);

  /** If the HELOC card did not mount (missing id), log for debugging. */
  useEffect(() => {
    if (reasonId !== "heloc" || helocFlowStep === "inactive" || helocFlowStep === "complete") return;
    const id = getHelocStepScrollId(helocFlowStep);
    const t = window.setTimeout(() => {
      if (!document.getElementById(id)) {
        console.log("HELOC step transition failed", helocFlowStep);
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [reasonId, helocFlowStep]);

  /** If a reverse step anchor did not mount, log for debugging. */
  useEffect(() => {
    if (reasonId !== "reverse" || reverseFlowStep === "inactive" || reverseFlowStep === "complete") return;
    const id = getReverseStepScrollId(reverseFlowStep);
    const t = window.setTimeout(() => {
      if (!document.getElementById(id)) {
        console.log("Reverse step transition failed", reverseFlowStep);
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [reasonId, reverseFlowStep]);

  /** After choosing a weekday, center the time selector once it mounts. */
  useEffect(() => {
    const uInset = hasMortgageStatementUploadLane(reasonId) ? 1 : 0;
    const phoneStep = (1 + uInset) + 3;
    if (!phoneDay || step !== phoneStep || contactMethod !== "phone") return;
    const t = window.setTimeout(() => safeScroll("time-selection", scrollBehavior), SCROLL_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [phoneDay, step, contactMethod, scrollBehavior, reasonId]);

  /** Continue / purchase or refinance sub-step: center the next question. */
  useEffect(() => {
    const flowScrollKey = `${step}|${reasonId}|${purchaseFlowStep}|${refinanceFlowStep}|${helocFlowStep}|${reverseFlowStep}`;
    if (prevFlowScrollKeyRef.current === null) {
      prevFlowScrollKeyRef.current = flowScrollKey;
      return;
    }
    if (prevFlowScrollKeyRef.current === flowScrollKey) {
      return;
    }
    prevFlowScrollKeyRef.current = flowScrollKey;

    const uploadInset = hasMortgageStatementUploadLane(reasonId) ? 1 : 0;
    let targetId: string | null = null;
    if (step === 0 && reasonId === "buy" && purchaseFlowStep !== "inactive" && purchaseFlowStep !== "complete") {
      /* Full white card for credit (matches screenshot); inner steps use purchase-flow-* */
      targetId = purchaseFlowStep === "credit" ? "contact-form" : `purchase-flow-${purchaseFlowStep}`;
    } else if (step === 0 && reasonId === "refi" && refinanceFlowStep !== "inactive" && refinanceFlowStep !== "complete") {
      targetId = getRefinanceStepScrollId(refinanceFlowStep);
    } else if (step >= 1 && step <= 3 + uploadInset) {
      targetId = `contact-step-${step}`;
    } else if (step === 4 + uploadInset && contactMethod === "phone") {
      targetId = `contact-step-${step}-phone`;
    } else if ((step === 4 + uploadInset && contactMethod !== "phone") || step === 5 + uploadInset) {
      /* Inner details step (not whole card) — centered with retry */
      targetId = "contact-step-details";
    }

    if (!targetId) return;

    /* “Your details” final fields — delayed + retry so step mounts before measure */
    if (targetId === "contact-step-details") {
      const settleMs = reducedMotion ? SCROLL_AFTER_MS : SCROLL_DETAILS_INITIAL_MS;
      const t = window.setTimeout(() => {
        setSuppressFormParallax(true);
        scrollDetailsStepWithRetry("contact-step-details", scrollBehavior);
      }, settleMs);
      return () => window.clearTimeout(t);
    }

    /* Credit questionnaire: full card #contact-form */
    if (targetId === "contact-form") {
      const settleMs = reducedMotion ? SCROLL_AFTER_MS : SCROLL_CARD_SETTLE_MS;
      const t = window.setTimeout(() => {
        setSuppressFormParallax(true);
        runAfterNextPaint(() => scrollContactFormCardIntoView(scrollBehavior));
      }, settleMs);
      return () => window.clearTimeout(t);
    }

    /* Refinance `refi-step-*`: same settle delay as inner card height animates */
    if (targetId.startsWith("refi-step-")) {
      const settleMs = reducedMotion ? SCROLL_AFTER_MS : SCROLL_CARD_SETTLE_MS;
      const t = window.setTimeout(() => {
        setSuppressFormParallax(true);
        runAfterNextPaint(() => safeScroll(targetId, scrollBehavior));
      }, settleMs);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => safeScroll(targetId, scrollBehavior), SCROLL_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [step, purchaseFlowStep, refinanceFlowStep, helocFlowStep, reverseFlowStep, reasonId, contactMethod, scrollBehavior, reducedMotion]);

  /** Purchase property step: reveal address / location / MD county / city blocks. */
  useEffect(() => {
    if (reasonId !== "buy" || purchaseFlowStep !== "property") {
      prevPurchaseHasPropertyRef.current = "__init__";
      return;
    }
    const hp = purchaseData.hasProperty;
    if (prevPurchaseHasPropertyRef.current === "__init__") {
      prevPurchaseHasPropertyRef.current = hp;
      return;
    }
    if (prevPurchaseHasPropertyRef.current === hp) return;
    prevPurchaseHasPropertyRef.current = hp;
    if (hp === true) {
      const t = window.setTimeout(() => safeScroll("purchase-anchor-address", scrollBehavior), SCROLL_AFTER_MS);
      return () => window.clearTimeout(t);
    }
    if (hp === false) {
      const t = window.setTimeout(() => safeScroll("purchase-anchor-location", scrollBehavior), SCROLL_AFTER_MS);
      return () => window.clearTimeout(t);
    }
  }, [reasonId, purchaseFlowStep, purchaseData.hasProperty, scrollBehavior]);

  useEffect(() => {
    if (reasonId !== "buy" || purchaseFlowStep !== "property") {
      prevPurchaseLocStateRef.current = "__init__";
      return;
    }
    if (purchaseData.hasProperty !== false) return;
    const st = purchaseData.locationState;
    if (prevPurchaseLocStateRef.current === "__init__") {
      prevPurchaseLocStateRef.current = st;
      return;
    }
    if (st === "MD" && prevPurchaseLocStateRef.current !== "MD") {
      prevPurchaseLocStateRef.current = st;
      const t = window.setTimeout(() => safeScroll("purchase-anchor-county", scrollBehavior), SCROLL_AFTER_MS);
      return () => window.clearTimeout(t);
    }
    prevPurchaseLocStateRef.current = st;
  }, [reasonId, purchaseFlowStep, purchaseData.hasProperty, purchaseData.locationState, scrollBehavior]);

  useEffect(() => {
    if (reasonId !== "buy" || purchaseFlowStep !== "property") {
      prevPurchaseCountyRef.current = "__init__";
      return;
    }
    if (purchaseData.locationState !== "MD") return;
    const c = purchaseData.locationCounty;
    if (prevPurchaseCountyRef.current === "__init__") {
      prevPurchaseCountyRef.current = c;
      return;
    }
    if (c && c !== prevPurchaseCountyRef.current) {
      prevPurchaseCountyRef.current = c;
      const t = window.setTimeout(() => safeScroll("purchase-anchor-city", scrollBehavior), SCROLL_AFTER_MS);
      return () => window.clearTimeout(t);
    }
    prevPurchaseCountyRef.current = c;
  }, [reasonId, purchaseFlowStep, purchaseData.locationState, purchaseData.locationCounty, scrollBehavior]);

  const userIntent: UserIntent = useMemo(() => {
    if (!reasonId) return null;
    const found = STEP1_OPTIONS.find((o) => o.id === reasonId);
    return found?.intent ?? null;
  }, [reasonId, STEP1_OPTIONS]);

  const { totalSteps, stageLabels, uploadInset, standingStepIndex, phoneStepIndex } = useMemo(() => {
    const uInset = hasMortgageStatementUploadLane(reasonId) ? 1 : 0;
    const standing = 1 + uInset;
    const phonePathActive = contactMethod === "phone" && step >= 4 + uInset;
    const labels = [t("contact.stage.why")];
    if (hasMortgageStatementUploadLane(reasonId)) {
      labels.push(t("contact.stage.document"));
    }
    labels.push(t("contact.stage.standing"), t("contact.stage.matters"), t("contact.stage.reach"));
    if (phonePathActive) {
      return {
        totalSteps: 6 + uInset,
        stageLabels: [...labels, t("contact.stage.bestTime"), t("contact.stage.details")],
        uploadInset: uInset,
        standingStepIndex: standing,
        phoneStepIndex: standing + 3,
      };
    }
    return {
      totalSteps: 5 + uInset,
      stageLabels: [...labels, t("contact.stage.details")],
      uploadInset: uInset,
      standingStepIndex: standing,
      phoneStepIndex: standing + 3,
    };
  }, [contactMethod, step, reasonId, t]);

  const progressPct = useMemo(() => ((step + 1) / totalSteps) * 100, [step, totalSteps]);

  const purchaseContextPayload = useMemo(() => {
    if (reasonId !== "buy" || purchaseFlowStep !== "complete") return "";
    const locationData =
      purchaseData.locationState === "MD" && purchaseData.locationCounty.trim() && purchaseData.locationCity.trim()
        ? {
            state: "MD" as const,
            county: normalizeCountyForPayload(purchaseData.locationCounty),
            city: purchaseData.locationCity.trim(),
          }
        : null;
    const payload = {
      hasProperty: purchaseData.hasProperty === true,
      address: purchaseData.address.trim(),
      locationData,
      purchasePrice: parseCurrencyDigitsToNumber(purchaseData.purchasePriceStr),
      downPayment: parseDownPaymentPayload(purchaseData),
      creditRange: purchaseData.creditRange.trim() || null,
    };
    return JSON.stringify(payload);
  }, [reasonId, purchaseFlowStep, purchaseData]);

  const refinanceContextPayload = useMemo(() => {
    if (reasonId !== "refi" || refinanceFlowStep !== "complete") return "";
    return buildRefinanceContextPayload(refinanceData);
  }, [reasonId, refinanceFlowStep, refinanceData]);

  const helocContextPayload = useMemo(() => {
    if (reasonId !== "heloc" || helocFlowStep !== "complete") return "";
    return buildHelocContextPayload(helocData);
  }, [reasonId, helocFlowStep, helocData]);

  const reverseContextPayload = useMemo(() => {
    if (reasonId !== "reverse" || reverseFlowStep !== "complete") return "";
    return buildReverseContextPayload(reverseData);
  }, [reasonId, reverseFlowStep, reverseData]);

  const advanceHelocAfterTileAnswer = useCallback(() => {
    const s = helocFlowStepRef.current;
    let next: HelocFlowStep | null = null;
    if (s === "purpose") next = "value";
    else if (s === "amount") next = "credit";
    else if (s === "credit") next = "timeline";
    if (!next) return;
    setHelocFlowStep(next);
    scheduleHelocScrollToStepId(getHelocStepScrollId(next as Exclude<HelocFlowStep, "inactive" | "complete">));
  }, [scheduleHelocScrollToStepId]);

  const completeHelocFlow = useCallback(() => {
    setHelocFlowStep("complete");
    setStep(1);
    scheduleHelocScrollToStepId("contact-step-1");
  }, [scheduleHelocScrollToStepId]);

  const advanceReverseAfterTileAnswer = useCallback(() => {
    const s = reverseFlowStepRef.current;
    let next: ReverseFlowStep | null = null;
    if (s === "residence") next = "age";
    else if (s === "age") next = "goal";
    else if (s === "goal") next = "value";
    else if (s === "value") next = "balance";
    else if (s === "obligations") next = "timeline";
    if (!next) return;
    setReverseFlowStep(next);
    scheduleReverseScrollToStepId(getReverseStepScrollId(next as Exclude<ReverseFlowStep, "inactive" | "complete">));
  }, [scheduleReverseScrollToStepId]);

  const completeReverseFlow = useCallback(() => {
    setReverseFlowStep("complete");
    setStep(1);
    scheduleReverseScrollToStepId("contact-step-1");
  }, [scheduleReverseScrollToStepId]);

  /** Re-center current refinance card after tile/input interaction (80ms matches step transitions). */
  const scheduleRefinanceInteractionScroll = useCallback(() => {
    window.setTimeout(() => {
      const s = refinanceFlowStepRef.current;
      if (s === "inactive" || s === "complete") return;
      setSuppressFormParallax(true);
      runAfterNextPaint(() => safeScroll(getRefinanceStepScrollId(s), scrollBehavior));
    }, SCROLL_AFTER_MS);
  }, [scrollBehavior]);

  const scheduleHelocInteractionScroll = useCallback(() => {
    const s = helocFlowStepRef.current;
    if (s === "inactive" || s === "complete") return;
    scheduleHelocScrollToStepId(getHelocStepScrollId(s));
  }, [scheduleHelocScrollToStepId]);

  const scheduleReverseInteractionScroll = useCallback(() => {
    const s = reverseFlowStepRef.current;
    if (s === "inactive" || s === "complete") return;
    scheduleReverseScrollToStepId(getReverseStepScrollId(s));
  }, [scheduleReverseScrollToStepId]);

  const scheduleMortgageStatementInteractionScroll = useCallback(() => {
    window.setTimeout(() => {
      setSuppressFormParallax(true);
      runAfterNextPaint(() => safeScroll("contact-step-1", scrollBehavior));
    }, SCROLL_AFTER_MS);
  }, [scrollBehavior]);

  const canContinue = useCallback(() => {
    if (step === 0) {
      if (reasonId === "buy") {
        if (purchaseFlowStep === "inactive") return reasonId !== null;
        return true;
      }
      if (reasonId === "refi") {
        if (refinanceFlowStep === "inactive") return reasonId !== null;
        return true;
      }
      if (reasonId === "heloc") {
        if (helocFlowStep === "inactive") return reasonId !== null;
        return true;
      }
      if (reasonId === "reverse") {
        if (reverseFlowStep === "inactive") return reasonId !== null;
        return true;
      }
      return reasonId !== null;
    }
    if (uploadInset && step === 1) return !mortgageStatementUploading;
    if (step === standingStepIndex) return standingId !== null;
    if (step === standingStepIndex + 1) return priorityId !== null;
    if (step === standingStepIndex + 2) return contactMethod !== null;
    if (step === phoneStepIndex && contactMethod === "phone") return phoneDay !== null && phoneTime.trim() !== "";
    return false;
  }, [
    step,
    reasonId,
    purchaseFlowStep,
    refinanceFlowStep,
    helocFlowStep,
    reverseFlowStep,
    uploadInset,
    standingStepIndex,
    phoneStepIndex,
    mortgageStatementUploading,
    standingId,
    priorityId,
    contactMethod,
    phoneDay,
    phoneTime,
  ]);

  const canSubmit = firstName.trim().length > 0 && emailValid(email);

  const goNext = () => {
    if (step === 0 && reasonId === "reverse") {
      if (reverseFlowStep === "inactive") {
        setReverseFlowStep("residence");
        scheduleReverseScrollToStepId("reverse-step-residence");
        return;
      }
      if (reverseFlowStep === "residence") {
        setReverseFlowStep("age");
        scheduleReverseScrollToStepId("reverse-step-age");
        return;
      }
      if (reverseFlowStep === "age") {
        setReverseFlowStep("goal");
        scheduleReverseScrollToStepId("reverse-step-goal");
        return;
      }
      if (reverseFlowStep === "goal") {
        setReverseFlowStep("value");
        scheduleReverseScrollToStepId("reverse-step-value");
        return;
      }
      if (reverseFlowStep === "value") {
        setReverseFlowStep("balance");
        scheduleReverseScrollToStepId("reverse-step-balance");
        return;
      }
      if (reverseFlowStep === "balance") {
        setReverseFlowStep("obligations");
        scheduleReverseScrollToStepId("reverse-step-obligations");
        return;
      }
      if (reverseFlowStep === "obligations") {
        setReverseFlowStep("timeline");
        scheduleReverseScrollToStepId("reverse-step-timeline");
        return;
      }
      if (reverseFlowStep === "timeline") {
        setReverseFlowStep("complete");
        setStep(1);
        scheduleReverseScrollToStepId("contact-step-1");
        return;
      }
    }
    if (step === 0 && reasonId === "heloc") {
      if (helocFlowStep === "inactive") {
        setHelocFlowStep("purpose");
        scheduleHelocScrollToStepId("heloc-step-purpose");
        return;
      }
      if (helocFlowStep === "purpose") {
        setHelocFlowStep("value");
        scheduleHelocScrollToStepId("heloc-step-value");
        return;
      }
      if (helocFlowStep === "value") {
        setHelocFlowStep("balance");
        scheduleHelocScrollToStepId("heloc-step-balance");
        return;
      }
      if (helocFlowStep === "balance") {
        setHelocFlowStep("amount");
        scheduleHelocScrollToStepId("heloc-step-amount");
        return;
      }
      if (helocFlowStep === "amount") {
        setHelocFlowStep("credit");
        scheduleHelocScrollToStepId("heloc-step-credit");
        return;
      }
      if (helocFlowStep === "credit") {
        setHelocFlowStep("timeline");
        scheduleHelocScrollToStepId("heloc-step-timeline");
        return;
      }
      if (helocFlowStep === "timeline") {
        setHelocFlowStep("complete");
        setStep(1);
        scheduleHelocScrollToStepId("contact-step-1");
        return;
      }
    }
    if (step === 0 && reasonId === "refi") {
      if (refinanceFlowStep === "inactive") {
        setRefinanceFlowStep("intro");
        return;
      }
      if (refinanceFlowStep === "intro") {
        setRefinanceFlowStep("goal");
        return;
      }
      if (refinanceFlowStep === "goal") {
        setRefinanceFlowStep("address");
        return;
      }
      if (refinanceFlowStep === "address") {
        setRefinanceFlowStep("balance");
        return;
      }
      if (refinanceFlowStep === "balance") {
        setRefinanceFlowStep("rate");
        return;
      }
      if (refinanceFlowStep === "rate") {
        setRefinanceFlowStep("timeline");
        return;
      }
      if (refinanceFlowStep === "timeline") {
        setRefinanceFlowStep("value");
        return;
      }
      if (refinanceFlowStep === "value") {
        setRefinanceFlowStep("cashOut");
        return;
      }
      if (refinanceFlowStep === "cashOut") {
        setRefinanceFlowStep("debt");
        return;
      }
      if (refinanceFlowStep === "debt") {
        setRefinanceFlowStep("complete");
        setStep(1);
        return;
      }
    }
    if (step === 0 && reasonId === "buy") {
      if (purchaseFlowStep === "inactive") {
        setPurchaseFlowStep("intro");
        return;
      }
      if (purchaseFlowStep === "intro") {
        setPurchaseFlowStep("property");
        return;
      }
      if (purchaseFlowStep === "property") {
        setPurchaseFlowStep("price");
        return;
      }
      if (purchaseFlowStep === "price") {
        setPurchaseFlowStep("down");
        return;
      }
      if (purchaseFlowStep === "down") {
        setPurchaseFlowStep("credit");
        return;
      }
      if (purchaseFlowStep === "credit") {
        setPurchaseFlowStep("complete");
        setStep(1);
        return;
      }
    }
    if (!canContinue()) return;
    if (step < totalSteps - 1) setStep((s) => s + 1);
  };

  const skipPurchaseStep = useCallback(() => {
    const flow = purchaseFlowStep;
    if (flow === "property") {
      setPurchaseData((d) => ({
        ...d,
        hasProperty: null,
        address: "",
        locationState: "",
        locationCounty: "",
        locationCity: "",
      }));
    } else if (flow === "price") {
      setPurchaseData((d) => ({ ...d, purchasePriceStr: "" }));
    } else if (flow === "down") {
      setPurchaseData((d) => ({ ...d, downPaymentStr: "", downPaymentType: "dollar" }));
    } else if (flow === "credit") {
      setPurchaseData((d) => ({ ...d, creditRange: "" }));
    }
    if (flow === "intro") {
      setPurchaseFlowStep("property");
      return;
    }
    if (flow === "property") {
      setPurchaseFlowStep("price");
      return;
    }
    if (flow === "price") {
      setPurchaseFlowStep("down");
      return;
    }
    if (flow === "down") {
      setPurchaseFlowStep("credit");
      return;
    }
    if (flow === "credit") {
      setPurchaseFlowStep("complete");
      setStep(1);
    }
  }, [purchaseFlowStep]);

  const skipRefinanceStep = useCallback(() => {
    const flow = refinanceFlowStep;
    if (flow === "intro") {
      setRefinanceFlowStep("goal");
      return;
    }
    if (flow === "goal") {
      setRefinanceFlowStep("address");
      return;
    }
    if (flow === "address") {
      setRefinanceFlowStep("balance");
      return;
    }
    if (flow === "balance") {
      setRefinanceFlowStep("rate");
      return;
    }
    if (flow === "rate") {
      setRefinanceFlowStep("timeline");
      return;
    }
    if (flow === "timeline") {
      setRefinanceFlowStep("value");
      return;
    }
    if (flow === "value") {
      setRefinanceFlowStep("cashOut");
      return;
    }
    if (flow === "cashOut") {
      setRefinanceFlowStep("debt");
      return;
    }
    if (flow === "debt") {
      setRefinanceFlowStep("complete");
      setStep(1);
    }
  }, [refinanceFlowStep]);

  const skipHelocStep = useCallback(() => {
    const flow = helocFlowStep;
    if (flow === "inactive" || flow === "complete") return;

    const next = getNextHelocSubstep(flow);
    if (flow === "purpose") setHelocData((d) => ({ ...d, helocPurpose: "" }));
    if (flow === "value") setHelocData((d) => ({ ...d, propertyValueStr: "" }));
    if (flow === "balance") setHelocData((d) => ({ ...d, mortgageBalanceStr: "" }));
    if (flow === "amount") setHelocData((d) => ({ ...d, desiredAccess: "" }));
    if (flow === "credit") setHelocData((d) => ({ ...d, creditProfile: "" }));
    if (flow === "timeline") setHelocData((d) => ({ ...d, timeline: "" }));

    if (next === "complete") {
      setHelocFlowStep("complete");
      setStep(1);
      scheduleHelocScrollToStepId("contact-step-1");
      return;
    }
    setHelocFlowStep(next);
    scheduleHelocScrollToStepId(getHelocStepScrollId(next));
  }, [helocFlowStep, scheduleHelocScrollToStepId]);

  const skipReverseStep = useCallback(() => {
    const flow = reverseFlowStep;
    if (flow === "inactive" || flow === "complete") return;

    const next = getNextReverseSubstep(flow);
    if (flow === "residence") setReverseData((d) => ({ ...d, residence: "" }));
    if (flow === "age") setReverseData((d) => ({ ...d, ageRange: "" }));
    if (flow === "goal") setReverseData((d) => ({ ...d, goal: "" }));
    if (flow === "value") setReverseData((d) => ({ ...d, propertyValueStr: "", propertyValueUnsure: false }));
    if (flow === "balance") setReverseData((d) => ({ ...d, mortgageBalanceStr: "" }));
    if (flow === "obligations") setReverseData((d) => ({ ...d, obligations: "" }));
    if (flow === "timeline") setReverseData((d) => ({ ...d, timeline: "" }));

    if (next === "complete") {
      setReverseFlowStep("complete");
      setStep(1);
      scheduleReverseScrollToStepId("contact-step-1");
      return;
    }
    setReverseFlowStep(next);
    scheduleReverseScrollToStepId(getReverseStepScrollId(next));
  }, [reverseFlowStep, scheduleReverseScrollToStepId]);

  const goBack = () => {
    if (step === 0 && reasonId === "reverse" && reverseFlowStep !== "inactive") {
      if (reverseFlowStep === "residence") {
        setReverseFlowStep("inactive");
        return;
      }
      if (reverseFlowStep === "age") {
        setReverseFlowStep("residence");
        return;
      }
      if (reverseFlowStep === "goal") {
        setReverseFlowStep("age");
        return;
      }
      if (reverseFlowStep === "value") {
        setReverseFlowStep("goal");
        return;
      }
      if (reverseFlowStep === "balance") {
        setReverseFlowStep("value");
        return;
      }
      if (reverseFlowStep === "obligations") {
        setReverseFlowStep("balance");
        return;
      }
      if (reverseFlowStep === "timeline") {
        setReverseFlowStep("obligations");
        return;
      }
    }
    if (step === 0 && reasonId === "heloc" && helocFlowStep !== "inactive") {
      if (helocFlowStep === "purpose") {
        setHelocFlowStep("inactive");
        return;
      }
      if (helocFlowStep === "value") {
        setHelocFlowStep("purpose");
        return;
      }
      if (helocFlowStep === "balance") {
        setHelocFlowStep("value");
        return;
      }
      if (helocFlowStep === "amount") {
        setHelocFlowStep("balance");
        return;
      }
      if (helocFlowStep === "credit") {
        setHelocFlowStep("amount");
        return;
      }
      if (helocFlowStep === "timeline") {
        setHelocFlowStep("credit");
        return;
      }
    }
    if (step === 0 && reasonId === "refi" && refinanceFlowStep !== "inactive") {
      if (refinanceFlowStep === "intro") {
        setRefinanceFlowStep("inactive");
        return;
      }
      if (refinanceFlowStep === "goal") {
        setRefinanceFlowStep("intro");
        return;
      }
      if (refinanceFlowStep === "address") {
        setRefinanceFlowStep("goal");
        return;
      }
      if (refinanceFlowStep === "balance") {
        setRefinanceFlowStep("address");
        return;
      }
      if (refinanceFlowStep === "rate") {
        setRefinanceFlowStep("balance");
        return;
      }
      if (refinanceFlowStep === "timeline") {
        setRefinanceFlowStep("rate");
        return;
      }
      if (refinanceFlowStep === "value") {
        setRefinanceFlowStep("timeline");
        return;
      }
      if (refinanceFlowStep === "cashOut") {
        setRefinanceFlowStep("value");
        return;
      }
      if (refinanceFlowStep === "debt") {
        setRefinanceFlowStep("cashOut");
        return;
      }
    }
    if (step === 0 && reasonId === "buy" && purchaseFlowStep !== "inactive") {
      if (purchaseFlowStep === "intro") {
        setPurchaseFlowStep("inactive");
        return;
      }
      if (purchaseFlowStep === "property") {
        setPurchaseFlowStep("intro");
        return;
      }
      if (purchaseFlowStep === "price") {
        setPurchaseFlowStep("property");
        return;
      }
      if (purchaseFlowStep === "down") {
        setPurchaseFlowStep("price");
        return;
      }
      if (purchaseFlowStep === "credit") {
        setPurchaseFlowStep("down");
        return;
      }
    }
    if (step === 1 && reasonId === "buy" && purchaseFlowStep === "complete") {
      setMortgageStatementFileKey(null);
      setStep(0);
      setPurchaseFlowStep("credit");
      return;
    }
    if (step === 1 && reasonId === "refi" && refinanceFlowStep === "complete") {
      setMortgageStatementFileKey(null);
      setStep(0);
      setRefinanceFlowStep("debt");
      return;
    }
    if (step === 1 && reasonId === "heloc" && helocFlowStep === "complete") {
      setMortgageStatementFileKey(null);
      setStep(0);
      setHelocFlowStep("timeline");
      return;
    }
    if (step === 1 && reasonId === "reverse" && reverseFlowStep === "complete") {
      setMortgageStatementFileKey(null);
      setStep(0);
      setReverseFlowStep("timeline");
      return;
    }
    if (step === 0) return;
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitInProgress) return;
    setSubmitError(null);
    setSubmitInProgress(true);

    const answers: Record<string, string> = {};

    const STANDING_EN: Record<string, string> = {
      exploring: "Just starting to explore",
      looking: "Actively looking",
      process: "Already in the process",
      unsure: "Not sure yet",
    };
    const PRIORITY_EN: Record<string, string> = {
      payment: "Monthly payment clarity",
      strategy: "Long-term financial strategy",
      approved: "Getting approved with confidence",
      options: "Understanding all my options",
    };
    const METHOD_EN: Record<string, string> = {
      phone: "Phone call",
      email: "Email",
    };
    const DAY_EN: Record<string, string> = {
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
    };

    if (standingId && STANDING_EN[standingId]) answers["Where things stand"] = STANDING_EN[standingId];
    if (priorityId && PRIORITY_EN[priorityId]) answers["What matters most"] = PRIORITY_EN[priorityId];
    if (contactMethod && METHOD_EN[contactMethod]) answers["Preferred contact"] = METHOD_EN[contactMethod];
    if (contactMethod === "phone" && phoneDay && DAY_EN[phoneDay]) {
      answers["Best day to call"] = DAY_EN[phoneDay];
    }
    if (contactMethod === "phone" && phoneTime.trim()) {
      answers["Best time to call"] = phoneTime.trim();
    }
    if (notes.trim()) answers["Notes"] = notes.trim();
    if (contextNote) answers["Entry context"] = contextNote;
    if (purchaseContextPayload) answers["Purchase path (structured)"] = purchaseContextPayload;
    if (refinanceContextPayload) answers["Refinance path (structured)"] = refinanceContextPayload;
    if (helocContextPayload) answers["HELOC path (structured)"] = helocContextPayload;
    if (reverseContextPayload) answers["Reverse path (structured)"] = reverseContextPayload;

    const hasUploadedStatement = Boolean(mortgageStatementFileKey);

    try {
      const res = await fetch(apiUrl("/api/submit-lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          path: mapReasonIdToLeadPath(reasonId),
          answers,
          hasUploadedStatement,
          fileKey: mortgageStatementFileKey ?? undefined,
          clientId: leadClientId,
          submittedLang: lang,
        }),
      });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        setSubmitError(t("contact.error.generic"));
        return;
      }
      if (!res.ok) {
        setSubmitError(data.error ?? t("contact.error.generic"));
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(t("contact.error.network"));
    } finally {
      setSubmitInProgress(false);
    }
  };

  const onStartClarity = useCallback(() => {
    setSuppressFormParallax(true);
    window.setTimeout(() => {
      scrollToFirstStep("contact-form", scrollBehavior);
    }, FIRST_CONTACT_SCROLL_DELAY_MS);
  }, [scrollBehavior]);

  const stepMotion = useMemo(
    () =>
      reducedMotion
        ? {
            initial: false as const,
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 1, y: 0 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -12 },
            transition: { duration: 0.35, ease: EASE },
          },
    [reducedMotion],
  );

  /** Slightly slower, softer motion for the reverse mortgage path. */
  const stepMotionReverse = useMemo(
    () =>
      reducedMotion
        ? {
            initial: false as const,
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 1, y: 0 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.45, ease: EASE },
          },
    [reducedMotion],
  );

  const confirmItemMotion = useCallback(
    (i: number, extraDelay = 0) =>
      reducedMotion
        ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: EASE, delay: i * 0.08 + extraDelay },
          },
    [reducedMotion],
  );

  useLayoutEffect(() => {
    if (!submitted) return;
    const el = document.getElementById("response-section");
    if (!el) return;
    scrollElementToViewportCenter(el, reducedMotion ? "auto" : "smooth");
  }, [submitted, reducedMotion]);

  const intentDataAttr = userIntent ?? "";

  if (submitted) {
    return (
      <section
        id="response-section"
        className="contact-success-hero scroll-mt-[var(--site-header-height)]"
        aria-labelledby="contact-success-heading"
      >
        <div className="contact-success-hero__media" aria-hidden>
          <motion.div
            className="contact-success-hero__media-inner h-full w-full"
            initial={false}
            animate={reducedMotion ? { scale: 1 } : { scale: 1.03 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }
            }
          >
            <picture className="block h-full w-full">
              <source srcSet={CONTACT_HERO_WEBP} type="image/webp" />
              <img
                src={CONTACT_HERO_PNG}
                alt=""
                className="h-full w-full object-cover"
                width={1920}
                height={1080}
                decoding="async"
                loading="eager"
              />
            </picture>
          </motion.div>
        </div>
        <div className="contact-success-hero__overlay" aria-hidden />
        <div className="contact-success-hero__glow" aria-hidden />
        <div className="contact-success-hero__inner text-white">
          <motion.h2
            id="contact-success-heading"
            {...confirmItemMotion(0)}
            className="font-heading mb-4 text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-4xl"
          >
            {t("contact.success.heading")}
          </motion.h2>
          <motion.p {...confirmItemMotion(1)} className="mx-auto mb-5 max-w-[520px] font-sans text-[15px] leading-relaxed text-white/85">
            {t("contact.success.body1")}
          </motion.p>
          <motion.div {...confirmItemMotion(2)} className="mx-auto mb-7 max-w-[520px]">
            <p className="font-sans text-[14px] leading-relaxed text-white/90">
              {contactMethod === "phone" && phoneDay && phoneTime.trim() ? (
                <>
                  <span className="font-semibold text-[#C6A15B]">
                    {t("contact.success.scheduledPrefix")}
                    {PHONE_DAY_OPTIONS.find((o) => o.id === phoneDay)?.label}
                    {t("contact.success.scheduledAt")}
                    {phoneTime}
                  </span>
                  {t("contact.success.scheduledPost")}
                </>
              ) : (
                <>
                  <span className="font-semibold text-[#C6A15B]">{t("contact.success.body2pre")}</span>
                  {t("contact.success.body2post")}
                </>
              )}
            </p>
            <div className="response-message mt-5 font-sans font-medium text-white/95">
              <p className="mb-2">{t("contact.success.move1")}</p>
              <p className="font-normal">{t("contact.success.move2")}</p>
            </div>
            <p className="mt-5 font-sans text-[12px] leading-relaxed tracking-[0.04em] text-white/65">
              {t("contact.success.disclaimer")}
            </p>
          </motion.div>
          <motion.div {...confirmItemMotion(3)} className="contact-info-block mt-8 text-center">
            <p className="font-sans text-[14px] font-medium leading-relaxed text-white/95">7272 Wisconsin Avenue, 9th Floor</p>
            <p className="font-sans text-[14px] font-medium leading-relaxed text-white/95">Bethesda, MD 20814</p>
            <a
              href="mailto:Info@infinitehomelending.com"
              className="mt-4 inline-block font-sans text-[14px] font-medium text-white underline decoration-[#C6A15B]/50 underline-offset-2 transition-opacity hover:opacity-80"
            >
              Info@infinitehomelending.com
            </a>
          </motion.div>
          <motion.p {...confirmItemMotion(4, 0.08)} className="quote-final">
            {t("contact.success.quote")}
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <>
      <ContactHeroEntry
        ref={heroRef}
        onStartClarity={onStartClarity}
        heroOpacity={heroOpacity}
        imageParallaxY={imageParallaxY}
      />

      <section
        id="contact-advisory"
        className="contact-section contact-section-v2 contact-card-transition form-section"
        data-user-intent={intentDataAttr}
        aria-labelledby="strategic-contact-heading"
      >
        <motion.div
          className="contact-wrapper contact-v4"
          style={{ y: suppressFormParallax ? 0 : formLiftY }}
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="contact-container">
            <div
              id="contact-form"
              className="contact-form-engine form-card contact-card-transition min-w-0 rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_24px_64px_rgba(10,25,47,0.08)] backdrop-blur-sm"
            >
              <h1
                id="strategic-contact-heading"
                className="text-balance text-center font-heading text-[1.5rem] font-semibold tracking-[-0.03em] text-[#0B2A4A] sm:text-[1.65rem] lg:text-[1.85rem]"
              >
                {t("contact.form.title")}
              </h1>

              <div className="contact-progress mt-8" role="navigation" aria-label="Stages">
                <div className="progress-labels">
                  {stageLabels.map((label, i) => (
                    <span
                      key={`${label}-${i}`}
                      className={`progress-labels__item ${i === step ? "progress-labels__item--active" : ""} ${
                        i < step ? "progress-labels__item--done" : ""
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div
                  className="progress-bar mt-4"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  aria-valuenow={step + 1}
                  aria-valuetext={`${stageLabels[step] ?? ""}, stage ${step + 1} of ${totalSteps}`}
                >
                  <div className="progress-fill contact-card-transition" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-0" noValidate>
                {contextNote ? <input type="hidden" name="context" value={contextNote} readOnly /> : null}
                {contactMethod ? <input type="hidden" name="contactMethod" value={contactMethod} readOnly /> : null}
                {phoneDay ? <input type="hidden" name="phoneDay" value={phoneDay} readOnly /> : null}
                {phoneTime.trim() ? <input type="hidden" name="phoneTime" value={phoneTime} readOnly /> : null}
                {notes ? <input type="hidden" name="notes" value={notes} readOnly /> : null}
                {purchaseContextPayload ? (
                  <input type="hidden" name="purchaseContext" value={purchaseContextPayload} readOnly />
                ) : null}
                {refinanceContextPayload ? (
                  <input type="hidden" name="refinanceContext" value={refinanceContextPayload} readOnly />
                ) : null}
                {helocContextPayload ? <input type="hidden" name="helocContext" value={helocContextPayload} readOnly /> : null}
                {reverseContextPayload ? (
                  <input type="hidden" name="reverseContext" value={reverseContextPayload} readOnly />
                ) : null}
                <input type="hidden" name="leadClientId" value={leadClientId} readOnly />
                {mortgageStatementFileKey ? (
                  <input type="hidden" name="mortgageStatementFileKey" value={mortgageStatementFileKey} readOnly />
                ) : null}
                <AnimatePresence mode="wait">
                  {step === 0 &&
                    purchaseFlowStep === "inactive" &&
                    refinanceFlowStep === "inactive" &&
                    helocFlowStep === "inactive" &&
                    reverseFlowStep === "inactive" && (
                    <motion.div id="contact-step-0" key="s0-reason" className="form-step space-y-4" {...stepMotion}>
                      <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
                        {t("contact.step0.question")}
                      </h2>
                      <div className="option-group grid grid-cols-1 gap-3">
                        {STEP1_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setReasonId(opt.id)}
                            className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                              reasonId === opt.id ? "card-option--selected" : ""
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 0 && reasonId === "buy" && purchaseFlowStep !== "inactive" && purchaseFlowStep !== "complete" && (
                    <PurchasePathStep
                      key={purchaseFlowStep}
                      purchaseFlowStep={purchaseFlowStep}
                      purchaseData={purchaseData}
                      setPurchaseData={setPurchaseData}
                      stepMotion={stepMotion}
                      reducedMotion={reducedMotion}
                      onSkip={skipPurchaseStep}
                    />
                  )}

                  {step === 0 && reasonId === "refi" && refinanceFlowStep !== "inactive" && refinanceFlowStep !== "complete" && (
                    <RefinancePathStep
                      key={refinanceFlowStep}
                      refinanceFlowStep={refinanceFlowStep}
                      refinanceData={refinanceData}
                      setRefinanceData={setRefinanceData}
                      stepMotion={stepMotion}
                      onSkip={skipRefinanceStep}
                      onStepInteraction={scheduleRefinanceInteractionScroll}
                    />
                  )}

                  {step === 0 && reasonId === "heloc" && helocFlowStep !== "inactive" && helocFlowStep !== "complete" && (
                    <HelocPathStep
                      key={helocFlowStep}
                      helocFlowStep={helocFlowStep}
                      helocData={helocData}
                      setHelocData={setHelocData}
                      stepMotion={stepMotion}
                      onSkip={skipHelocStep}
                      onStepInteraction={scheduleHelocInteractionScroll}
                      onAdvanceAfterTileAnswer={advanceHelocAfterTileAnswer}
                      onCompleteFlow={completeHelocFlow}
                    />
                  )}

                  {step === 0 && reasonId === "reverse" && reverseFlowStep !== "inactive" && reverseFlowStep !== "complete" && (
                    <ReversePathStep
                      key={reverseFlowStep}
                      reverseFlowStep={reverseFlowStep}
                      reverseData={reverseData}
                      setReverseData={setReverseData}
                      stepMotion={stepMotionReverse}
                      onSkip={skipReverseStep}
                      onStepInteraction={scheduleReverseInteractionScroll}
                      onAdvanceAfterTileAnswer={advanceReverseAfterTileAnswer}
                      onCompleteFlow={completeReverseFlow}
                    />
                  )}

                  {step === 1 && uploadInset === 1 && (
                    <MortgageStatementUpload
                      key="mortgage-statement-upload"
                      contactStepId={`contact-step-${step}`}
                      stepMotion={stepMotion}
                      fileKey={mortgageStatementFileKey}
                      onFileKeyChange={setMortgageStatementFileKey}
                      isUploading={mortgageStatementUploading}
                      onUploadingChange={setMortgageStatementUploading}
                      onStepInteraction={scheduleMortgageStatementInteractionScroll}
                    />
                  )}

                  {step === standingStepIndex && (
                    <motion.div id={`contact-step-${step}`} key="s1-standing" className="form-step space-y-4" {...stepMotion}>
                      <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
                        {t("contact.step.standing.question")}
                      </h2>
                      <div className="option-group grid grid-cols-1 gap-3">
                        {STEP2_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setStandingId(opt.id)}
                            className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                              standingId === opt.id ? "card-option--selected" : ""
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === standingStepIndex + 1 && (
                    <motion.div id={`contact-step-${step}`} key="s2" className="form-step space-y-4" {...stepMotion}>
                      <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
                        {t("contact.step.priority.question")}
                      </h2>
                      <div className="option-group grid grid-cols-1 gap-3">
                        {STEP3_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPriorityId(opt.id)}
                            className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                              priorityId === opt.id ? "card-option--selected" : ""
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === standingStepIndex + 2 && (
                    <motion.div id={`contact-step-${step}`} key="s3" className="form-step space-y-4" {...stepMotion}>
                      <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
                        {t("contact.step.method.question")}
                      </h2>
                      <div className="option-group grid grid-cols-1 gap-3">
                        {CONTACT_METHOD_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setContactMethod(opt.id)}
                            className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                              contactMethod === opt.id ? "card-option--selected" : ""
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === phoneStepIndex && contactMethod === "phone" && (
                    <motion.div id={`contact-step-${step}-phone`} key="s4-phone" className="form-step space-y-8" {...stepMotion}>
                      <div id="contact-anchor-day" className="w-full space-y-4">
                        <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
                          {t("contact.step.day.question")}
                        </h2>
                        <div className="day-grid">
                          {PHONE_DAY_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setPhoneDay(opt.id)}
                              className={`card-option contact-card-transition py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A] ${
                                phoneDay === opt.id ? "card-option--selected" : ""
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <AnimatePresence mode="wait">
                        {phoneDay ? (
                          <motion.div
                            id="time-selection"
                            key="time-pick"
                            className="w-full space-y-4"
                            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                          >
                            <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
                              {t("contact.step.time.question")}
                            </h2>
                            <div className="option-group w-full">
                              <label htmlFor="sc-phone-time" className="sr-only">
                                {t("contact.step.time.placeholder")}
                              </label>
                              <select
                                id="sc-phone-time"
                                name="phoneTimeSelect"
                                value={phoneTime}
                                onChange={(e) => setPhoneTime(e.target.value)}
                                className="time-picker"
                                aria-label={t("contact.step.time.question")}
                              >
                                <option value="">{t("contact.step.time.placeholder")}</option>
                                {PHONE_TIME_SELECT_VALUES.map((timeLabel) => (
                                  <option key={timeLabel} value={timeLabel}>
                                    {timeLabel}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {((step === phoneStepIndex && contactMethod !== "phone") || step === phoneStepIndex + 1) && (
                    <motion.div
                      id="contact-step-details"
                      key={`final-${step}`}
                      className="form-step w-full space-y-5 text-left"
                      {...stepMotion}
                    >
                      <h2 className="text-balance text-center font-display text-[1.05rem] font-medium leading-snug tracking-[-0.02em] text-[#0B2A4A] sm:text-[1.125rem] lg:text-[1.3rem]">
                        {t("contact.step.details.title")}
                      </h2>
                      <div className="option-group mx-auto space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="sc-notes" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.notes.label")}
                          </label>
                          <textarea
                            id="sc-notes"
                            name="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t("contact.step.details.notes.placeholder")}
                            className="w-full resize-y rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="sc-first" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.name.label")}
                          </label>
                          <input
                            id="sc-first"
                            required
                            type="text"
                            autoComplete="name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25"
                            placeholder={t("contact.step.details.name.placeholder")}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="sc-email" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.email.label")}
                          </label>
                          <input
                            id="sc-email"
                            required
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={email.length > 0 && !emailValid(email)}
                            className={`w-full rounded-xl border bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:ring-2 focus:ring-[#C6A15B]/25 ${
                              email.length > 0 && !emailValid(email)
                                ? "border-red-400/80 focus:border-red-500"
                                : "border-[#E5E7EB] focus:border-[#C6A15B]"
                            }`}
                            placeholder={t("contact.step.details.email.placeholder")}
                          />
                          {email.length > 0 && !emailValid(email) ? (
                            <p className="font-sans text-[13px] text-red-600" role="alert">
                              {t("contact.step.details.email.error")}
                            </p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="sc-phone" className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {t("contact.step.details.phone.label")}{" "}
                            <span className="font-normal text-slate-400">{t("contact.step.details.phone.optional")}</span>
                          </label>
                          <input
                            id="sc-phone"
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 font-sans text-[15px] text-navy outline-none transition-colors focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25"
                            placeholder={t("contact.step.details.phone.placeholder")}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {submitError ? (
                  <p className="mt-6 text-center font-sans text-[13px] text-red-600" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <div
                  className={`contact-form-actions flex flex-col gap-4 sm:flex-row sm:items-center ${
                    step > 0 ||
                    (step === 0 && reasonId === "buy" && purchaseFlowStep !== "inactive") ||
                    (step === 0 && reasonId === "refi" && refinanceFlowStep !== "inactive") ||
                    (step === 0 && reasonId === "heloc" && helocFlowStep !== "inactive") ||
                    (step === 0 && reasonId === "reverse" && reverseFlowStep !== "inactive")
                      ? "sm:justify-between"
                      : "sm:justify-end"
                  }`}
                >
                  {step > 0 ||
                  (step === 0 && reasonId === "buy" && purchaseFlowStep !== "inactive") ||
                  (step === 0 && reasonId === "refi" && refinanceFlowStep !== "inactive") ||
                  (step === 0 && reasonId === "heloc" && helocFlowStep !== "inactive") ||
                  (step === 0 && reasonId === "reverse" && reverseFlowStep !== "inactive") ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 self-start font-sans text-[13px] font-semibold text-slate-500 underline-offset-4 transition-colors hover:text-[#0B2A4A]"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      {t("contact.btn.back")}
                    </button>
                  ) : null}

                  {step < totalSteps - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canContinue()}
                      className="continue-btn contact-flagship-cta btn-primary min-h-[52px] w-full max-w-[320px] sm:min-w-[280px]"
                    >
                      {t("contact.btn.continue")}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!canSubmit || submitInProgress}
                      className={`continue-btn contact-flagship-cta btn-primary min-h-[52px] w-full max-w-[320px] transition-[transform,box-shadow,filter] duration-300 sm:min-w-[280px] enabled:hover:scale-[1.02] enabled:hover:shadow-lg enabled:hover:brightness-[1.03] ${
                        canSubmit && !submitInProgress
                          ? `contact-flagship-cta--ready${reducedMotion ? "" : " contact-flagship-cta--pulse"}`
                          : ""
                      }`}
                    >
                      {submitInProgress ? t("contact.btn.sending") : t("contact.btn.connect")}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
