import type { ReactNode } from "react";
import { CareersNav } from "../components/careers/CareersNav";
import { CareersReveal } from "../components/careers/CareersReveal";
import { FounderPresencePanel } from "../components/careers/FounderPresencePanel";
import { PlatformScreenshot } from "../components/careers/PlatformScreenshot";
import { CareersContactForm } from "../components/careers/CareersContactForm";
import {
  careersColors,
  careersFonts,
  careersSectionPad,
} from "../components/careers/careersTheme";
import "../components/careers/careersInteractions.css";
import { usePageMetadata } from "../hooks/usePageMetadata";

type SectionTone = "light" | "dark";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-px w-9" style={{ background: careersColors.gold }} />
      <span
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{
          fontFamily: careersFonts.body,
          color: careersColors.gold,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function SectionHeading({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone: SectionTone;
  className?: string;
}) {
  return (
    <h2
      className={`text-[26px] font-semibold leading-[1.2] sm:text-[30px] md:text-[36px] ${className}`}
      style={{
        fontFamily: careersFonts.heading,
        color: tone === "light" ? careersColors.navy : "#ffffff",
      }}
    >
      {children}
    </h2>
  );
}

function CareersSection({
  id,
  tone,
  children,
  className = "",
  fullHeight,
}: {
  id?: string;
  tone: SectionTone;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}) {
  const bg = tone === "light" ? careersColors.ivory : careersColors.navy;
  return (
    <section
      id={id}
      className={fullHeight ? undefined : careersSectionPad}
      style={{
        background: bg,
        width: "100%",
        ...(fullHeight
          ? {
              display: "flex",
              flexDirection: "column",
            }
          : {}),
      }}
    >
      {fullHeight ? children : <div className={`mx-auto max-w-6xl ${className}`}>{children}</div>}
    </section>
  );
}

const STEP_INTO_CARDS = [
  {
    num: "01",
    title: "Advisor Intelligence Platform",
    body: "Access to Sarah, the Income Analyzer, and the MA Command Center — proprietary systems designed to support better decisions, stronger client experiences, and more consistent execution.",
  },
  {
    num: "02",
    title: "Direct Access To Leadership",
    body: "Work directly with the founders and decision makers of the firm. No unnecessary layers, committees, or bureaucracy.",
  },
  {
    num: "03",
    title: "Build A Practice, Not A Pipeline",
    body: "We provide infrastructure, brand support, systems, and guidance so you can focus on building long-term client relationships.",
  },
] as const;

const IHL_FOUNDATIONS = [
  "Broker Independence",
  "Advisor Intelligence",
  "Institutional Infrastructure",
  "Client-First Advisory",
  "Washington, DC Focus",
  "Founder-Led Firm",
] as const;

const INSTITUTIONAL_METRICS = [
  { label: "Advisor Model", value: "Broker Independence" },
  { label: "Technology", value: "AI-Powered Infrastructure" },
  { label: "Market", value: "Washington, DC Focused" },
] as const;

const FOUNDER_LETTER = [
  "When we founded Infinite Home Lending, we were not trying to build another mortgage company.",
  "We were trying to build the kind of advisory practice we wished existed throughout our careers — one where clients come before transactions, where systems support great work, and where advisors are treated as professionals rather than production units.",
  "Too often, the industry rewards volume at the expense of advice. We believe the opposite approach creates better outcomes for everyone.",
  "That is why we are investing heavily in technology, infrastructure, education, and client experience from the very beginning.",
  "If you believe mortgage advice should be thoughtful, strategic, and deeply client-centered, you may find yourself at home here.",
] as const;

const VALUES = [
  { name: "Disciplined Execution", desc: "We do what we say, when we say it." },
  { name: "Clear Communication", desc: "With clients, with partners, with each other." },
  { name: "Transparency", desc: "No hidden fees, no surprises, no politics." },
  {
    name: "Client-Centered",
    desc: 'Every decision runs through: "Is this right for the client?"',
  },
  { name: "Professionalism", desc: "In every interaction, every document, every email." },
] as const;

const LOOKING_FOR = [
  {
    title: "You think in systems, not transactions.",
    detail:
      "You see the full client picture — income, assets, timeline, and goals — before you recommend a structure.",
  },
  {
    title: "You expect tools that match your standard of work.",
    detail:
      "Spreadsheets and fragmented workflows are not a platform. You want infrastructure that supports serious analysis.",
  },
  {
    title: "You take compliance seriously.",
    detail:
      "Not as a checkbox, but as the foundation of a practice that compounds over time.",
  },
  {
    title: "You are building a practice, not chasing a quota.",
    detail: "Pipeline, reputation, and referral quality matter more than monthly volume for its own sake.",
  },
  {
    title: "You prefer depth in one market over breadth without focus.",
    detail:
      "Washington, DC is where we are planted. Our tools, intelligence, and energy are built for this market.",
  },
] as const;

const PLATFORM_BLOCKS = [
  {
    eyebrow: "Client-Facing Intelligence",
    title: "Sarah",
    body: "Sarah helps borrowers explore mortgage concepts, compare options, and prepare for conversations with an advisor. Available anytime. Built to educate, not replace human advice.",
  },
  {
    eyebrow: "Income Intelligence",
    title: "Income Analyzer",
    body: "Upload borrower income documentation and receive structured analysis designed to help advisors review income with more clarity, consistency, and speed.",
  },
  {
    eyebrow: "Advisor Operating System",
    title: "MA Command Center",
    body: "Pipeline visibility, workflow management, borrower intelligence, guideline updates, and operational support in a single environment designed specifically for mortgage advisors.",
  },
] as const;

const ADVISOR_CAPABILITIES = [
  {
    title: "Homeownership Solutions",
    items: [
      "Conventional Financing",
      "FHA Financing",
      "VA Financing",
      "Jumbo Financing",
    ],
  },
  {
    title: "Self-Employed & Complex Income",
    items: [
      "Bank Statement Programs",
      "Asset Utilization",
      "Alternative Documentation",
      "Self-Employed Borrower Solutions",
    ],
  },
  {
    title: "Investor Solutions",
    items: [
      "DSCR Financing",
      "Investment Property Loans",
      "Portfolio Expansion Strategies",
      "Cash-Out Opportunities",
    ],
  },
  {
    title: "Specialty Lending Solutions",
    items: [
      "Renovation Financing",
      "New Construction Financing",
      "HELOC & Equity Solutions",
      "Bridge Financing",
    ],
  },
] as const;

const CLIENT_IMPACT_SCENARIOS = [
  {
    title: "First-Time Homebuyers",
    description:
      "Guide new buyers through their first purchase with clarity on affordability, timing, and the long-term implications of each decision.",
  },
  {
    title: "Veterans & Military Families",
    description:
      "Support those who served with thoughtful guidance aligned to their service history, housing goals, and family priorities.",
  },
  {
    title: "Self-Employed Professionals",
    description:
      "Help borrowers with non-traditional income profiles find a path to ownership based on how they actually earn and plan ahead.",
  },
  {
    title: "Real Estate Investors",
    description:
      "Advise clients building or expanding property holdings with strategies grounded in cash flow, growth, and portfolio objectives.",
  },
  {
    title: "Move-Up Buyers",
    description:
      "Navigate equity transitions, timing, and financing decisions for families preparing for their next chapter in homeownership.",
  },
  {
    title: "High-Net-Worth Borrowers",
    description:
      "Deliver discreet, strategic counsel for clients with complex financial profiles and transactions that require careful planning.",
  },
  {
    title: "Renovation Projects",
    description:
      "Support homeowners financing improvements that enhance livability, property value, and long-term equity in the home they already own.",
  },
  {
    title: "New Construction Buyers",
    description:
      "Guide clients through build timelines, milestone planning, and the distinct considerations that come with purchasing a newly built home.",
  },
] as const;

const SUCCESS_LOOKS_LIKE = [
  "Build meaningful relationships throughout the Washington market",
  "Develop mastery of IHL systems and advisory process",
  "Become a trusted resource for borrowers, agents, and referral partners",
  "Contribute to a culture focused on excellence rather than volume",
] as const;

const CAREER_PATHS = [
  {
    title: "For Experienced Mortgage Professionals",
    body: "Take your career to the next level with access to advanced technology, broader financing capabilities, and a platform designed to help you serve more clients with confidence. Build on the foundation you've already created while expanding the impact you can make.",
  },
  {
    title: "For New Mortgage Professionals",
    body: "Build your foundation alongside experienced professionals, proven systems, and a platform designed to support long-term growth. Learn the business the right way while developing the habits, discipline, and advisory mindset required for lasting success.",
  },
] as const;

const SHARED_STANDARDS = [
  "Professionalism",
  "Discipline",
  "Curiosity",
  "Client-First Thinking",
  "Continuous Growth",
] as const;

const lightBody = { color: "rgba(46,46,46,0.72)" };
const darkBody = { color: "rgba(255,255,255,0.62)" };

export default function CareersPage() {
  usePageMetadata({
    title: "Careers | Infinite Home Lending",
    description:
      "Join Infinite Home Lending as a Mortgage Advisor in Washington, DC. An institutional platform for advisors who approach lending as strategic counsel.",
    canonical: "https://www.infinitehomelending.com/careers",
  });

  const scrollToPlatform = () => {
    document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="overflow-x-hidden"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: careersFonts.body,
        color: careersColors.charcoal,
      }}
    >
      {/* Hero — Ivory */}
      <CareersSection tone="light" fullHeight>
        <div className="flex min-h-0 flex-1 flex-col md:min-h-screen">
          <CareersNav />
          <div
            className="flex flex-1 items-center px-6 py-10 md:px-16 md:py-0 lg:px-24"
            style={{ minHeight: 0 }}
          >
            <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
              <div>
                <Eyebrow>Mortgage Advisory</Eyebrow>
                <h1
                  className="text-balance text-[30px] font-bold leading-[1.15] sm:text-[34px] md:text-[44px]"
                  style={{
                    fontFamily: careersFonts.heading,
                    color: careersColors.navy,
                    margin: "0 0 20px",
                  }}
                >
                  A Practice Built on
                  <br />
                  Infrastructure, Not Volume.
                </h1>
                <p
                  className="max-w-md text-[15px] leading-[1.75]"
                  style={{ ...lightBody, margin: "0 0 32px" }}
                >
                  Infinite Home Lending is a Washington, DC mortgage brokerage for advisors who
                  approach lending as strategic counsel — with institutional tools, broker
                  independence, and a culture of disciplined execution.
                </p>
                <button
                  type="button"
                  onClick={scrollToPlatform}
                  className="careers-hero-cta w-full min-h-[44px] sm:w-auto"
                  style={{
                    fontFamily: careersFonts.body,
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    background: careersColors.navy,
                    color: "#ffffff",
                    padding: "14px 28px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Discover the Platform
                </button>
              </div>

              <div
                className="flex flex-col justify-center border-t pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
                style={{ borderColor: "rgba(198,161,91,0.35)" }}
              >
                <p
                  className="text-[18px] italic leading-[1.65] sm:text-[20px] md:text-[22px]"
                  style={{
                    fontFamily: careersFonts.heading,
                    color: careersColors.navy,
                    margin: "0 0 16px",
                  }}
                >
                  &ldquo;The best mortgage advisors are financial strategists. They deserve a
                  platform built to that standard.&rdquo;
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: "rgba(46,46,46,0.45)" }}
                >
                  — Infinite Home Lending
                </p>
                <div
                  className="mt-10 rounded-sm p-6"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    border: "0.5px solid rgba(11,42,74,0.08)",
                  }}
                >
                  <p
                    className="mb-5 text-[10px] uppercase tracking-[0.16em]"
                    style={{ color: careersColors.gold, fontWeight: 500 }}
                  >
                    IHL Foundations
                  </p>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
                    {IHL_FOUNDATIONS.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <span
                          className="mt-[7px] h-px w-3 shrink-0"
                          style={{ background: careersColors.gold }}
                          aria-hidden
                        />
                        <p
                          className="text-[13px] leading-snug"
                          style={{ color: careersColors.charcoal }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CareersSection>

      {/* Institutional metrics — Ivory */}
      <section
        style={{
          background: careersColors.ivory,
          borderTop: "0.5px solid rgba(11,42,74,0.06)",
          borderBottom: "0.5px solid rgba(11,42,74,0.06)",
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[rgba(11,42,74,0.08)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {INSTITUTIONAL_METRICS.map((item) => (
            <div key={item.label} className="px-6 py-10 md:px-10 md:py-12">
              <p
                className="text-[10px] uppercase tracking-[0.14em]"
                style={{ color: "rgba(46,46,46,0.45)", marginBottom: "8px" }}
              >
                {item.label}
              </p>
              <p
                className="text-[15px]"
                style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What You Step Into — Navy */}
      <CareersSection tone="dark">
        <CareersReveal>
          <Eyebrow>Day One</Eyebrow>
          <SectionHeading tone="dark" className="mb-12">
            What You Step Into
          </SectionHeading>
        </CareersReveal>
        <div className="grid gap-6 md:grid-cols-3">
          {STEP_INTO_CARDS.map((card, i) => (
            <div key={card.num}>
            <CareersReveal delay={i * 0.08}>
            <article
              className="careers-card-dark h-full p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                className="text-xs tracking-[0.1em]"
                style={{ color: careersColors.gold }}
              >
                {card.num}
              </span>
              <h3
                className="mt-4 text-[20px]"
                style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
              >
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={darkBody}>
                {card.body}
              </p>
            </article>
            </CareersReveal>
            </div>
          ))}
        </div>
      </CareersSection>

      {/* A Message From The Founders — Ivory */}
      <CareersSection tone="light">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <CareersReveal className="lg:col-span-7">
            <Eyebrow>Our Why</Eyebrow>
            <SectionHeading tone="light" className="mb-10 max-w-2xl">
              Building The Kind Of Firm We Always Wanted To Join.
            </SectionHeading>
            <div className="space-y-6">
              {FOUNDER_LETTER.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-[15px] leading-[1.85]"
                  style={lightBody}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div
              className="mt-14 border-t pt-10"
              style={{ borderColor: "rgba(11,42,74,0.1)" }}
            >
              <p
                className="text-[17px]"
                style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
              >
                Javier Cifuentes &amp; Alma Jaramillo
              </p>
              <p
                className="mt-2 text-[11px] uppercase tracking-[0.12em]"
                style={{ color: "rgba(46,46,46,0.5)" }}
              >
                Co-Founders
              </p>
              <p className="mt-1 text-sm" style={lightBody}>
                Infinite Home Lending
              </p>
            </div>
          </CareersReveal>
          <CareersReveal className="lg:col-span-5" delay={0.1}>
            <FounderPresencePanel />
          </CareersReveal>
        </div>
      </CareersSection>

      {/* Our Philosophy — Ivory */}
      <CareersSection tone="light">
        <CareersReveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Our Philosophy</Eyebrow>
          <blockquote
            className="text-balance text-[22px] font-normal italic leading-[1.35] sm:text-[28px] md:text-[40px]"
            style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
          >
            &ldquo;We believe the best mortgage advisors are financial strategists — and they
            deserve a platform built to that standard.&rdquo;
          </blockquote>
          <div
            className="mx-auto my-10 h-px w-14"
            style={{ background: careersColors.gold }}
          />
          <div className="grid gap-6 text-left sm:grid-cols-2">
            {VALUES.map((v) => (
              <div
                key={v.name}
                className="border-l pl-4"
                style={{ borderColor: "rgba(198,161,91,0.4)" }}
              >
                <p
                  className="text-xs uppercase tracking-[0.1em]"
                  style={{ color: careersColors.navy }}
                >
                  {v.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={lightBody}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </CareersReveal>
      </CareersSection>

      {/* Who We're Looking For — Navy */}
      <CareersSection tone="dark">
        <CareersReveal>
        <Eyebrow>Who We&apos;re Looking For</Eyebrow>
        <SectionHeading tone="dark">A Specific Standard of Advisor</SectionHeading>
        <p className="mb-12 mt-4 max-w-xl text-[15px] leading-relaxed" style={darkBody}>
          We are building deliberately. That requires advisors who share our discipline, judgment,
          and long-term view of the practice.
        </p>
        </CareersReveal>
        <div>
          {LOOKING_FOR.map((item, i) => (
            <div key={item.title}>
            <CareersReveal delay={i * 0.05}>
            <div
              className="flex flex-col gap-4 border-t py-6 sm:flex-row sm:items-start sm:gap-8"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span
                className="shrink-0 text-xs tracking-[0.1em]"
                style={{ color: careersColors.gold }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p
                  className="text-lg font-semibold md:text-xl"
                  style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
                >
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={darkBody}>
                  {item.detail}
                </p>
              </div>
            </div>
            </CareersReveal>
            </div>
          ))}
        </div>
      </CareersSection>

      {/* Platform narrative: Technology → Capabilities → Client Impact */}
      <div className="careers-platform-narrative">
      <CareersSection id="platform" tone="light">
        <CareersReveal>
          <Eyebrow>Platform In Action</Eyebrow>
          <SectionHeading tone="light" className="mb-12">
            The Infrastructure You Will Use
          </SectionHeading>
        </CareersReveal>
        <div className="grid gap-8 md:grid-cols-3">
          {PLATFORM_BLOCKS.map((block, i) => (
            <div key={block.title}>
            <CareersReveal delay={i * 0.08}>
            <article
              className="careers-card-light careers-platform-card h-full border p-8"
              style={{
                borderColor: "rgba(11,42,74,0.1)",
                background: "#ffffff",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.12em]"
                style={{ color: "rgba(46,46,46,0.45)" }}
              >
                {block.eyebrow}
              </p>
              <h3
                className="mt-2 text-xl"
                style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
              >
                {block.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed" style={lightBody}>
                {block.body}
              </p>
              <PlatformScreenshot platform={block.title} />
            </article>
            </CareersReveal>
            </div>
          ))}
        </div>
        <div className="careers-narrative-connector careers-narrative-connector--to-dark" aria-hidden />
      </CareersSection>

      <CareersSection tone="dark">
        <CareersReveal>
          <Eyebrow>Advisor Capabilities</Eyebrow>
          <SectionHeading tone="dark" className="mb-6">
            More Options Create Better Outcomes.
          </SectionHeading>
          <p className="mb-12 max-w-3xl text-[15px] leading-[1.75]" style={darkBody}>
            At Infinite Home Lending, advisors are not limited to a single lender&apos;s guidelines,
            products, or overlays. Our platform provides access to a broad range of financing
            solutions designed to help you serve a wider variety of borrowers with confidence,
            flexibility, and strategic guidance.
          </p>
        </CareersReveal>
        <div className="grid gap-6 md:grid-cols-2">
          {ADVISOR_CAPABILITIES.map((card, i) => (
            <div key={card.title}>
              <CareersReveal delay={i * 0.06}>
                <article
                  className="careers-card-dark h-full p-8"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3
                    className="text-[18px] font-semibold md:text-[20px]"
                    style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
                  >
                    {card.title}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed"
                        style={darkBody}
                      >
                        <span
                          className="mt-[9px] h-px w-2.5 shrink-0"
                          style={{ background: careersColors.gold }}
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </CareersReveal>
            </div>
          ))}
        </div>
        <CareersReveal
          className="mt-16 border-t border-[rgba(255,255,255,0.08)] pt-12"
          delay={0.1}
        >
          <h3
            className="text-[22px] font-semibold md:text-[24px]"
            style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
          >
            Strategic Flexibility Matters
          </h3>
          <p className="mt-5 max-w-3xl text-[15px] leading-[1.75]" style={darkBody}>
            The ability to serve a broader range of borrower scenarios creates better opportunities
            for both advisors and clients. At Infinite Home Lending, our goal is simple: provide the
            flexibility, infrastructure, and support needed to help advisors deliver thoughtful
            solutions with confidence.
          </p>
        </CareersReveal>
        <div className="careers-narrative-connector careers-narrative-connector--to-light" aria-hidden />
      </CareersSection>

      <CareersSection tone="light">
        <CareersReveal>
          <Eyebrow>Client Impact</Eyebrow>
          <SectionHeading tone="light" className="mb-6">
            More Ways To Help Your Clients.
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-[15px] leading-[1.75]" style={lightBody}>
            The strength of an advisory platform is not measured by the number of products it
            offers. It&apos;s measured by the number of client scenarios it can help solve.
          </p>
          <p className="mb-12 max-w-3xl text-[15px] leading-[1.75]" style={lightBody}>
            At Infinite Home Lending, advisors have access to a broad range of financing capabilities
            designed to support borrowers across different life stages, financial profiles, and real
            estate goals.
          </p>
        </CareersReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLIENT_IMPACT_SCENARIOS.map((card, i) => (
            <div key={card.title}>
              <CareersReveal delay={i * 0.04}>
                <article
                  className="careers-card-light h-full border p-8"
                  style={{
                    borderColor: "rgba(11,42,74,0.1)",
                    background: "#ffffff",
                  }}
                >
                  <h3
                    className="text-[16px] font-semibold leading-snug md:text-[17px]"
                    style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={lightBody}>
                    {card.description}
                  </p>
                </article>
              </CareersReveal>
            </div>
          ))}
        </div>
        <CareersReveal
          className="mt-16 border-t border-[rgba(11,42,74,0.1)] pt-12"
          delay={0.1}
        >
          <h3
            className="text-[22px] font-semibold md:text-[24px]"
            style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
          >
            Built Around Possibility
          </h3>
          <p className="mt-5 max-w-3xl text-[15px] leading-[1.75]" style={lightBody}>
            Every borrower arrives with a unique story, goal, and financial situation. Our
            philosophy is simple: the more capabilities available through the Infinite Home Lending
            platform, the more opportunities advisors have to create thoughtful solutions and better
            outcomes.
          </p>
        </CareersReveal>
      </CareersSection>
      </div>

      {/* Current Opportunity — Ivory */}
      <CareersSection tone="light">
        <CareersReveal>
        <Eyebrow>Current Opportunity</Eyebrow>
        <SectionHeading tone="light" className="mb-12">
          Mortgage Advisor
        </SectionHeading>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="space-y-4 text-sm leading-relaxed" style={lightBody}>
              <li>Location: Washington, DC (in-person or hybrid)</li>
              <li>License required: Active NMLS license, DC jurisdiction preferred</li>
              <li>Experience: 2+ years originating residential mortgages</li>
              <li>Languages: English required; Spanish a strong plus</li>
              <li>Start: As soon as the right person is found</li>
            </ul>
          </div>
          <div
            className="border-t pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            style={{ borderColor: "rgba(198,161,91,0.35)" }}
          >
            <p
              className="text-xs uppercase tracking-[0.1em]"
              style={{ color: careersColors.navy }}
            >
              Compensation Philosophy
            </p>
            <p className="mt-4 text-sm leading-[1.75]" style={lightBody}>
              We do not believe in capping what a strong advisor can earn. Compensation is tied to
              the value you create — for clients and for the firm. Specifics are discussed directly,
              with transparency and without recruitment theatrics.
            </p>
          </div>
        </div>
        <div
          className="mt-16 border-t pt-12"
          style={{ borderColor: "rgba(11,42,74,0.1)" }}
        >
          <h3
            className="text-[22px] font-semibold"
            style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
          >
            What Success Looks Like
          </h3>
          <ul className="mt-6 space-y-4">
            {SUCCESS_LOOKS_LIKE.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed"
                style={lightBody}
              >
                <span style={{ color: careersColors.gold }} aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        </CareersReveal>
      </CareersSection>

      <div className="careers-paths-to-form">
      {/* Career Paths — Navy */}
      <CareersSection tone="dark">
        <CareersReveal>
          <Eyebrow>Career Paths</Eyebrow>
          <SectionHeading tone="dark" className="mb-6">
            Two Paths. One Standard.
          </SectionHeading>
          <div className="mb-12 max-w-3xl space-y-5 text-[15px] leading-[1.75]" style={darkBody}>
            <p>
              At Infinite Home Lending, we believe great advisors can come from different stages of
              the journey.
            </p>
            <p>
              Some arrive with years of experience and an established practice. Others arrive with
              ambition, discipline, and a desire to build something meaningful from the ground up.
            </p>
            <p>What matters most is not where you start. It&apos;s how you approach the work.</p>
          </div>
        </CareersReveal>
        <div className="grid gap-6 md:grid-cols-2">
          {CAREER_PATHS.map((path, i) => (
            <div key={path.title}>
              <CareersReveal delay={i * 0.06}>
                <article
                  className="careers-card-dark h-full p-8"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3
                    className="text-[18px] font-semibold leading-snug md:text-[20px]"
                    style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
                  >
                    {path.title}
                  </h3>
                  <p className="mt-4 text-sm leading-[1.75]" style={darkBody}>
                    {path.body}
                  </p>
                </article>
              </CareersReveal>
            </div>
          ))}
        </div>
        <CareersReveal
          className="mt-16 border-t border-[rgba(255,255,255,0.08)] pt-12"
          delay={0.1}
        >
          <h3
            className="text-[22px] font-semibold md:text-[24px]"
            style={{ fontFamily: careersFonts.heading, color: "#ffffff" }}
          >
            One Standard For Everyone.
          </h3>
          <p className="mt-5 max-w-3xl text-[15px] leading-[1.75]" style={darkBody}>
            Whether you&apos;re an experienced advisor looking to expand your practice or someone
            beginning your journey in mortgage lending, our expectations remain the same:
          </p>
          <ul className="mt-6 space-y-3">
            {SHARED_STANDARDS.map((standard) => (
              <li
                key={standard}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={darkBody}
              >
                <span
                  className="mt-[9px] h-px w-2.5 shrink-0"
                  style={{ background: careersColors.gold }}
                  aria-hidden
                />
                <span>{standard}</span>
              </li>
            ))}
          </ul>
          <p
            className="mt-10 max-w-3xl text-[15px] leading-[1.75] italic"
            style={{ fontFamily: careersFonts.heading, color: "rgba(255,255,255,0.82)" }}
          >
            We are not focused on building a team of loan officers. We are focused on building the
            next generation of mortgage advisors.
          </p>
        </CareersReveal>
      </CareersSection>

      {/* Start the Conversation — Navy */}
      <CareersSection id="careers-form" tone="dark">
        <CareersReveal className="mx-auto max-w-xl">
          <Eyebrow>Start the Conversation</Eyebrow>
          <SectionHeading tone="dark">Start A Conversation</SectionHeading>
          <p className="mb-10 mt-4 text-[15px] leading-relaxed" style={darkBody}>
            We are not building a high-volume recruiting machine. We are looking for a small number
            of professionals who share our standards, values, and long-term vision. Tell us about
            yourself and what you hope to build.
          </p>

          <CareersContactForm />

          <p className="mt-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Prefer email?{" "}
            <a
              href="mailto:Info@infinitehomelending.com"
              className="underline"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Info@infinitehomelending.com
            </a>
          </p>
        </CareersReveal>
      </CareersSection>
      </div>
    </div>
  );
}
