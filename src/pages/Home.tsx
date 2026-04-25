import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SectionReveal } from "../components/SectionReveal";
import { SectionChapterDivider } from "../components/SectionChapterDivider";
import { StaggerReveal, StaggerItem } from "../components/StaggerReveal";
import { InfiniteProcessRail } from "../components/InfiniteProcessRail";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users, 
  Target, 
  FileText, 
  Clock, 
  MessageSquare,
  TrendingUp,
  Award,
  ChevronRight,
  Quote
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import { PageContainer } from "../components/PageContainer";
import { HeroSection } from "../components/HeroSection";

/** Normalized scroll [0,1] — milestone thresholds are on this scale (deterministic, not end-of-section). */
const PROCESS_STEP_THRESHOLDS = [0.08, 0.28, 0.48, 0.66, 0.82] as const;
const CLOSING_HELD_THRESHOLD = PROCESS_STEP_THRESHOLDS[4];
/** Map raw section scroll into ~[0,1] before raw max would otherwise fall short. */
const PROCESS_SCROLL_NORMALIZER = 0.88;

const Home = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const processRef = useRef<HTMLElement>(null);

  return (
    <>
      <HeroSection />

      <PageContainer className="!pt-0">
      <SectionChapterDivider label="Guidance" className="max-w-7xl mx-auto px-6" />

      {/* 2. Positioning Strip (Flagship Philosophy) */}
      <section className="section-y-compact relative overflow-hidden border-b border-slate-100/90 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Emotional Positioning Line */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center mb-16 lg:mb-20"
          >
            <h2 className="type-section-title text-[1.65rem] sm:text-3xl lg:text-[2.125rem] leading-[1.35]">
              <span className="block mb-2 text-navy/90">Anyone can quote a rate.</span>
              <span className="block">
                We <span className="text-gold">structure the loan</span> that actually works for you.
              </span>
            </h2>
          </motion.div>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {[
              { 
                icon: <FileText size={44} strokeWidth={1.5} />, 
                title1: "CLARITY",
                title2: "BEFORE COMMITMENT",
                desc: "See the numbers clearly before you make a move.",
                bullets: [
                  "Detailed cost breakdowns",
                  "Scenario comparisons",
                  "No-obligation consultations"
                ]
              },
              { 
                icon: <Target size={44} strokeWidth={1.5} />, 
                title1: "STRATEGY",
                title2: "BEFORE RATE SHOPPING",
                desc: "Choose the structure that fits your life, not just a headline rate.",
                bullets: [
                  "Debt-to-income optimization",
                  "Long-term wealth planning",
                  "Custom loan structuring"
                ]
              },
              { 
                icon: <Users size={44} strokeWidth={1.5} />, 
                title1: "DIRECT ADVISORY.",
                title2: "NO CALL CENTERS.",
                desc: "Work with a real mortgage professional from start to finish.",
                bullets: [
                  "Single point of contact",
                  "Expert local knowledge",
                  "Proactive communication"
                ]
              },
              { 
                icon: <ShieldCheck size={44} strokeWidth={1.5} />, 
                title1: "CONFIDENCE",
                title2: "AT EVERY STEP",
                desc: "Move forward with a process designed to reduce stress and uncertainty.",
                bullets: [
                  "Real-time milestone updates",
                  "Transparent closing process",
                  "Post-closing support"
                ]
              },
            ].map((item, idx) => {
              const isExpanded = expandedIdx === idx;
              const isAnyExpanded = expandedIdx !== null;
              
              return (
                <StaggerItem 
                  key={idx}
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className={`
                    rounded-[4px] border lg:min-h-[380px]
                    flex flex-col items-center lg:items-start text-center lg:text-left 
                    group transition-all duration-500 relative overflow-hidden cursor-pointer
                    ${isExpanded 
                      ? 'shadow-[0_40px_80px_rgba(10,25,47,0.12)] bg-white z-20 scale-[1.02] border-gold/28 lg:min-h-[440px]' 
                      : 'z-10 border-gold/12 bg-gold/[0.03] hover:bg-white hover:-translate-y-1.5 hover:shadow-[0_22px_48px_rgba(10,25,47,0.08)] hover:border-gold/35'
                    }
                    ${isAnyExpanded && !isExpanded ? 'opacity-40 scale-[0.98] grayscale-[0.5]' : 'opacity-100'}
                  `}
                >
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 h-[3px] bg-gold transition-all duration-500 ${isExpanded ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>

                  <div className="p-8 lg:p-9 flex flex-col h-full w-full relative z-10">
                    {/* ICON */}
                    <div className={`mb-5 text-gold transition-all duration-500 ${isExpanded ? 'scale-[1.06]' : 'group-hover:scale-[1.06] group-hover:opacity-100 opacity-90'}`}>
                      {item.icon}
                    </div>
                    
                    {/* TITLE */}
                    <h3 className="mb-3 space-y-1">
                      <span className="block font-heading font-semibold text-navy uppercase tracking-[0.08em] text-[0.9375rem] lg:text-[1rem] leading-tight">
                        {item.title1}
                      </span>
                      <span className="block font-heading font-semibold text-navy/90 uppercase tracking-[0.06em] text-[0.9375rem] lg:text-[1rem] leading-tight">
                        {item.title2}
                      </span>
                    </h3>
                    
                    {/* DESCRIPTION - Fixed Height for alignment */}
                    <div className="min-h-[60px] mb-4">
                      <p className="type-body text-slate-600 max-w-[240px] text-[15px] leading-[1.6]">
                        {item.desc}
                      </p>
                    </div>

                    {/* EXPANDABLE CONTENT */}
                    <div className="mt-auto flex flex-col">
                      <div className={`${isExpanded ? 'min-h-[120px]' : 'min-h-0'} flex flex-col justify-start transition-all duration-300`}>
                        <AnimatePresence mode="wait">
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="mb-4 pt-6 border-t border-slate-100"
                            >
                              <ul className="space-y-4">
                                {item.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="type-caption flex items-center gap-3 text-[14px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Interaction Hint */}
                      {!isExpanded && (
                        <div className="type-label text-gold/55 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to expand
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subtle hover accent line (bottom) */}
                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-700 group-hover:w-full"></div>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerReveal>

          {/* SINGLE PRIMARY CTA BELOW CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 lg:mt-20 text-center"
          >
            <Link
              to="/contact"
              className="inline-flex flex-col items-center group"
            >
              <div className="bg-navy text-white px-10 py-5 rounded-[4px] font-sans font-bold uppercase tracking-[0.14em] text-xs shadow-[0_20px_40px_rgba(10,25,47,0.15)] hover:shadow-[0_30px_60px_rgba(10,25,47,0.25)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                {/* Subtle gold top border for premium feel */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/50"></div>
                
                <div className="flex items-center gap-3">
                  Start Your Pre-Approval
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
              <p className="mt-5 type-caption text-slate-500 italic">
                “No pressure. Just clear guidance.”
              </p>
              <p className="cta-trust-line mt-3 !text-[11px] !text-slate-500/90">
                No obligation — just clarity · Takes less than 2 minutes
              </p>
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionChapterDivider label="Trust" className="max-w-7xl mx-auto px-6" />

      {/* 3. Trust & Credibility Section */}
      <section className="section-y-compact overflow-hidden border-b border-slate-100/80 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header (Authority Statement) */}
          <div className="text-center mb-14 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="type-section-title text-[1.85rem] sm:text-3xl lg:text-[2.375rem] mb-6 max-w-[22ch] mx-auto leading-[1.2]">
                Trusted guidance, built on real experience
              </h2>
              <p className="type-body-lg max-w-2xl mx-auto leading-[1.7]">
                We help clients make confident mortgage decisions by focusing on structure, not just rates.
              </p>
            </motion.div>
          </div>

          {/* Trust Metrics (Proof Layer) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-10 mb-16 lg:mb-20 border-y border-slate-100 py-12 lg:py-14">
            {[
              { value: "$100M+", label: "Loans Structured" },
              { value: "10+", label: "Years Experience" },
              { value: "Hundreds", label: "Homeowners Guided" },
              { value: "Licensed", label: "& Compliant" },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="text-center flex flex-col items-center justify-start"
              >
                <div className="type-stat-value mb-2.5">
                  {metric.value}
                </div>
                <div className="type-stat-label max-w-[12rem]">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials (Human Trust) */}
          <StaggerReveal className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8 mb-14">
            {[
              {
                quote: "Javier didn’t just give us a rate — he helped us understand what we were actually choosing. That made all the difference.",
                author: "Michael R.",
                location: "Homebuyer in Maryland"
              },
              {
                quote: "The strategic approach to our loan structure saved us thousands over the long term. Highly professional and transparent.",
                author: "Sarah L.",
                location: "Refinance Client"
              },
              {
                quote: "Finally, a lender that treats you like a partner, not a transaction. The clarity provided at every step was invaluable.",
                author: "David K.",
                location: "First-time Buyer"
              }
            ].map((testimonial, idx) => (
              <StaggerItem
                key={idx}
                className="card-home-muted p-8 lg:p-9 shadow-[0_8px_28px_rgba(10,25,47,0.04)] hover:shadow-[0_20px_50px_rgba(10,25,47,0.08)] hover:-translate-y-0.5 group motion-reduce:hover:translate-y-0"
              >
                <div className="mb-5 text-gold/45 group-hover:text-gold/90 transition-colors duration-500">
                  <Quote size={28} strokeWidth={1.5} className="opacity-90" />
                </div>
                <p className="type-quote mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="pt-6 border-t border-gold/10">
                  <div className="font-sans font-semibold text-navy text-[15px] leading-snug tracking-tight">
                    {testimonial.author}
                  </div>
                  <div className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
                    {testimonial.location}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-14 lg:mt-16 flex flex-col items-center gap-8 text-center"
          >
            <Link
              to="/contact"
              className="btn-primary group inline-flex items-center justify-center gap-2.5 !px-10 !py-[1.05rem] shadow-[0_12px_40px_rgba(10,25,47,0.14)]"
            >
              Start Your Pre-Approval
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <p className="cta-trust-line !text-slate-500/95">
              No impact to your credit for pre-qualification · No obligation
            </p>
            <p className="type-caption text-slate-500 max-w-2xl mx-auto mt-6">
              We&apos;re here to help you understand your options —{" "}
              <span className="text-navy/65">not pressure you into a decision.</span>
            </p>
          </motion.div>
        </div>
      </section>

      <SectionChapterDivider label="Approach" className="max-w-7xl mx-auto px-6" />

      {/* 3. “A More Thoughtful Approach” Section */}
      <section className="section-y border-b border-slate-100/80 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.1] max-w-[22ch]">
                A more thoughtful approach to home lending.
              </h2>
              <p className="type-lead mb-9 leading-[1.65]">
                Most lenders focus on the transaction. We focus on the transition.
              </p>
              <div className="space-y-7">
                {[
                  "Strategic planning, not just loan placement",
                  "Financing aligned with long-term financial goals",
                  "A structured, transparent process from start to finish",
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <p className="type-body text-slate-600">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <article className="card-home-elevated relative overflow-hidden rounded-[4px] border border-slate-200/90 bg-white p-10 lg:p-12 shadow-[0_12px_40px_rgba(10,25,47,0.07)] transition-shadow duration-500 hover:shadow-[0_22px_56px_rgba(10,25,47,0.1)] group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <blockquote className="type-editorial-pullquote mb-10 m-0 border-l-2 border-gold/40 pl-5">
                  <p className="m-0">
                    Lending is a service, not a product. Our goal is to bring clarity and structure to one of life’s most important financial decisions.
                  </p>
                </blockquote>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-gold shadow-md transition-transform duration-500 group-hover:scale-[1.03]">
                    <Award size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="type-label mb-1 text-navy">Founder</p>
                    <p className="type-body text-[15px] text-slate-600">Infinite Home Lending</p>
                  </div>
                </div>
              </motion.div>
            </article>
          </div>
        </div>
      </section>

      <SectionChapterDivider label="Pillars" className="max-w-7xl mx-auto px-6" />

      {/* 4. Core Pillars (Premium & Interactive) */}
      <section className="section-y-spacious overflow-hidden border-b border-slate-100/60 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="type-section-title-lg mb-6 text-[2rem] sm:text-[2.35rem] lg:text-[2.65rem]">
                Our Core Pillars
              </h2>
              <p className="type-body-lg">
                The foundation of our advisory-driven platform, built on clarity and strategic precision.
              </p>
            </motion.div>
          </div>
          
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {[
              {
                title: "Clarity First",
                desc: "We simplify complex decisions so you always understand your options with total transparency.",
                icon: <Zap size={40} />,
              },
              {
                title: "Strategic Lending",
                desc: "Every loan is evaluated within your broader financial picture to ensure long-term stability.",
                icon: <ShieldCheck size={40} />,
              },
              {
                title: "High-Touch Service",
                desc: "You work directly with a senior advisor — not a call center or an automated system.",
                icon: <Users size={40} />,
              },
            ].map((pillar, idx) => (
              <StaggerItem
                key={idx}
                whileHover={
                  reducedMotion
                    ? {}
                    : {
                        y: -6,
                        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                className={`relative p-10 lg:p-12 rounded-[4px] bg-white border transition-all duration-500 group ${
                  idx === 1 
                    ? "md:scale-[1.04] z-10 border-gold/20 shadow-[0_28px_64px_rgba(197,160,89,0.1)]" 
                    : "border-slate-200/90 shadow-[0_14px_40px_rgba(10,25,47,0.05)]"
                } hover:border-gold/40 hover:shadow-[0_28px_70px_rgba(197,160,89,0.12)]`}
              >
                {/* Animated Gold Border Accent */}
                <div className="absolute inset-0 border-2 border-gold/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[4px] pointer-events-none scale-[1.01] group-hover:scale-100"></div>
                
                <div className="mb-8 text-gold transition-all duration-500 group-hover:scale-[1.05] group-hover:rotate-3 inline-block [&>svg]:w-10 [&>svg]:h-10">
                  {pillar.icon}
                </div>
                
                <h3 className="mb-5 font-heading font-semibold text-navy text-xl sm:text-2xl tracking-[-0.02em] leading-snug">
                  {pillar.title}
                </h3>
                
                <p className="type-body text-slate-600 text-[15px] lg:text-base">
                  {pillar.desc}
                </p>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <SectionChapterDivider label="Process" className="max-w-7xl mx-auto px-6" />

      {/* 5. Infinite Process — editorial rail, discrete active step */}
      <InfiniteProcessRail ref={processRef} reducedMotion={reducedMotion} />

      {/* 6. Why Clients Choose Us (Structure Fix) */}
      <section className="section-y border-b border-slate-100/80 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <div>
              <h2 className="type-section-title text-[1.85rem] sm:text-3xl lg:text-[2.25rem] mb-8 leading-[1.22]">
                Why clients choose Infinite Home Lending
              </h2>
              <p className="type-body-lg mb-10 leading-[1.7]">
                A mortgage is more than a rate — it’s a financial decision that impacts your future. We bring structure, clarity, and consistency to every step.
              </p>
              <div className="space-y-5">
                {[
                  { label: "No pressure", text: "No sales tactics. Ever." },
                  { label: "Direct access", text: "Work with decision-makers." },
                  { label: "Proactive", text: "Consistent communication." },
                  { label: "Transparent", text: "Clear fee structures." },
                  { label: "Ongoing", text: "Support beyond closing." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 size={20} strokeWidth={1.75} className="text-gold shrink-0 mt-0.5" />
                    <p className="type-body text-navy text-[15px]">
                      <span className="font-semibold">{item.label}.</span> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-home p-10 lg:p-12 shadow-[0_14px_44px_rgba(10,25,47,0.07)] hover:shadow-[0_22px_56px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 bg-surface border-slate-200/80 relative overflow-hidden group transition-all duration-300 motion-reduce:hover:translate-y-0"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 -translate-y-24 translate-x-24 rounded-full transition-transform duration-700 group-hover:scale-110"></div>
              <h3 className="font-heading font-semibold text-2xl sm:text-[1.65rem] mb-5 text-navy tracking-[-0.02em] leading-snug">
                Ready for a different experience?
              </h3>
              <p className="type-body text-slate-600 mb-8 text-[15px] lg:text-base">
                Discover how our advisory-driven approach can simplify your home financing journey.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <Link
                    to="/contact"
                    className="btn-primary inline-flex items-center justify-center gap-2.5 group shrink-0"
                  >
                    Start Your Pre-Approval
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/about"
                    className="type-body text-navy font-semibold text-[15px] border-b border-navy/20 pb-0.5 hover:border-gold/60 transition-colors duration-300 self-start sm:self-center"
                  >
                    Learn how we&apos;re different
                  </Link>
                </div>
                <p className="cta-trust-line !mt-0 !mx-0 !text-left text-[11px] text-slate-500/95">
                  Takes less than 2 minutes · No obligation
                </p>
                <p className="mt-5 text-left text-[12px] leading-relaxed text-slate-600">
                  Modeling credit before you apply?{" "}
                  <Link
                    to="/tools/credit-score-roi"
                    className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                  >
                    Credit Score ROI Calculator
                  </Link>{" "}
                  — dollar-per-point savings and a ranked action plan.
                </p>
                <p className="mt-3 text-left text-[12px] leading-relaxed text-slate-600">
                  Are you self-employed?{" "}
                  <Link
                    to="/tools/self-employed-qualifier"
                    className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                  >
                    Self-Employed Mortgage Qualifier
                  </Link>{" "}
                  — Schedule C add-backs, bank statement income, and write-off vs. buying-power tradeoffs side by side.
                </p>
                <p className="mt-3 text-left text-[12px] leading-relaxed text-slate-600">
                  Under contract and deciding whether to lock?{" "}
                  <Link
                    to="/tools/rate-lock-engine"
                    className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                  >
                    Rate Lock Decision Engine
                  </Link>{" "}
                  — quantify float risk, extension fees, and float-down options in your dollars.
                </p>
                <p className="mt-3 text-left text-[12px] leading-relaxed text-slate-600">
                  Still building toward your first purchase?{" "}
                  <Link
                    to="/tools/homebuying-power-map"
                    className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                  >
                    Homebuying Power Map
                  </Link>{" "}
                  — see buying power over 90 days, 6 and 12 months against real neighborhood medians.
                </p>
                <p className="mt-3 text-left text-[12px] leading-relaxed text-slate-600">
                  Comparing rent vs. own wealth over 30 years?{" "}
                  <Link
                    to="/tools/wealth-tracker"
                    className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                  >
                    Mortgage Wealth Tracker
                  </Link>{" "}
                  — six wealth streams, milestones at 5/10/20/30 years, and the opportunity cost most calculators hide.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionChapterDivider label="Next step" className="max-w-7xl mx-auto px-6" />

      {/* 7. Final CTA Section (High Priority) */}
      <section className="section-y-spacious relative overflow-hidden bg-navy">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="type-section-title-lg text-white mb-8 text-[2.15rem] sm:text-4xl lg:text-[3.15rem] max-w-[18ch] mx-auto leading-[1.15]">
              Start with clarity. <br />Move forward with confidence.
            </h2>
            <p className="font-sans text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-normal leading-[1.65]">
              No pressure. Just a clear, structured path forward to your next home.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-7">
              <Link
                to="/contact"
                className="btn-gold !px-12 !py-[1.35rem] inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-500 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Start Pre-Approval</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  strokeWidth={2}
                />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 blur-md" />
              </Link>
              <Link
                to="/contact?topic=loan-strategy"
                className="text-sm font-semibold text-white/85 border-b border-white/25 pb-0.5 hover:text-white hover:border-white/45 transition-colors duration-300 self-center"
              >
                Talk through your goals first
              </Link>
            </div>
            <p className="mt-8 text-[11px] sm:text-xs font-normal text-white/45 leading-relaxed max-w-lg mx-auto">
              No obligation — initial consultation does not affect your credit score.
            </p>
          </motion.div>
        </div>
      </section>
      </PageContainer>
    </>
  );
};

export default Home;
