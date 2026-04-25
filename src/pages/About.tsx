import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, MessageCircle, Shield, Sparkles } from "lucide-react";
import { IHLLogo } from "../components/IHLLogo";
import { PageContainer } from "../components/PageContainer";

/** Hero: Mid-Atlantic suburban aerial — brick and siding, streets and driveways (watermark trimmed). */
const IMG_HERO_RESIDENTIAL = "/about/about-hero-aerial.png";

/** Mid section: seasonal neighborhood aerial — winter snow, same regional housing character. */
const IMG_NARRATIVE_ARCH = "/about/about-neighborhood-winter.png";

/** Supporting: single-family suburban home — natural daylight, brick and siding context (watermark trimmed). */
const IMG_APPROACH_HOME = "/about/about-single-family.png";

const FOUNDER_PUBLIC_SRC = "/founder-portrait.jpg";
const COFOUNDER_PUBLIC_SRC = "/alma-portrait.jpg";

const MORTGAGE_WANTS_GRID = [
  {
    title: "Straight answers",
    body: "Plain language and honest context—not a wall of jargon when the stakes are high.",
    Icon: MessageCircle,
  },
  {
    title: "Room to explore",
    body: "Real options to compare so you can move forward with confidence, not guesswork.",
    Icon: Compass,
  },
  {
    title: "Guidance that fits",
    body: "Advice shaped to your situation—not a one-size script that ignores the nuances.",
    Icon: Sparkles,
  },
  {
    title: "A plan you can trust",
    body: "A structure that still makes sense years from now—whether it&apos;s your first home or your next chapter.",
    Icon: Shield,
  },
] as const;

const CORE_VALUES = [
  {
    title: "Strategic Thinking",
    body: "We approach every mortgage as a financial decision — aligning structure with your long-term direction.",
  },
  {
    title: "Clear Communication",
    body: "We keep you informed at every step, so you always know where things stand and what comes next.",
  },
  {
    title: "Disciplined Execution",
    body: "We manage every loan with precision, structure, and attention to detail from start to finish.",
  },
] as const;

function LeadershipPortrait(props: {
  src: string;
  alt: string;
  placeholderInitials: string;
  placeholderFilename: string;
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const { src, alt, placeholderInitials, placeholderFilename } = props;
  return (
    <figure className="w-full max-w-[min(100%,28rem)] shrink-0 mx-auto lg:mx-0">
      <div className="relative overflow-hidden rounded-none border border-slate-200/50 bg-white shadow-[0_24px_56px_-18px_rgba(10,25,47,0.18)]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-none">
          {!showPlaceholder ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover object-center"
              loading="lazy"
              onError={() => setShowPlaceholder(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 px-5 py-10 bg-gradient-to-b from-surface to-white"
              aria-hidden
            >
              <span className="font-heading text-2xl text-navy/[0.1] tracking-tight">{placeholderInitials}</span>
              <p className="type-caption text-slate-400 max-w-[10.5rem] text-center leading-relaxed">
                Add <span className="font-mono text-[11px] text-slate-500">{placeholderFilename}</span>
              </p>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 rounded-none bg-gradient-to-t from-navy/[0.1] via-transparent to-white/10"
            aria-hidden
          />
        </div>
      </div>
    </figure>
  );
}

export default function About() {
  return (
    <PageContainer>
      <section className="relative pt-[100px] lg:pt-[120px] pb-12 lg:pb-16 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <div className="lg:col-span-7 relative">
              <div className="absolute -inset-10 bg-white/40 backdrop-blur-[2px] rounded-full blur-3xl -z-10 opacity-60" aria-hidden />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="type-eyebrow inline-block px-5 py-2 bg-surface text-gold rounded-[4px] mb-7 border border-slate-100">
                  About Infinite Home Lending
                </span>
                <h1 className="type-display mb-7 max-w-[22ch] text-[2.65rem] sm:text-5xl md:text-6xl lg:text-[4.1rem] xl:text-[4.35rem] leading-[1.05]">
                  A more thoughtful way to approach home financing
                </h1>
                <p className="type-body-lg mb-10 max-w-2xl">
                  Most mortgage decisions are made around numbers alone. We believe they should be built around your
                  life.
                </p>
                <div className="flex flex-col sm:flex-row gap-8">
                  <Link
                    to="/contact?topic=loan-strategy"
                    className="btn-primary flex items-center justify-center gap-3 group"
                  >
                    Start with strategy
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.05, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block relative"
            >
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[0_80px_120px_-20px_rgba(10,25,47,0.3)] group">
                <img
                  src={IMG_HERO_RESIDENTIAL}
                  alt="Aerial view of a Mid-Atlantic suburban neighborhood with brick and siding homes, streets, and driveways"
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-60" aria-hidden />
                <div className="absolute inset-0 bg-navy/10 mix-blend-multiply" aria-hidden />
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-transparent opacity-40 mix-blend-screen"
                  aria-hidden
                />
                <div
                  className="absolute -top-1/4 -right-1/4 w-full h-full bg-gold/5 rounded-full blur-[140px] pointer-events-none opacity-40"
                  aria-hidden
                />
              </div>
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gold/10 -z-10 rounded-full blur-[100px] opacity-40" aria-hidden />
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface -z-10 skew-x-12 translate-x-1/4 opacity-50" aria-hidden />
      </section>

      {/* Narrative: copy + image with quote overlapped (editorial composition) */}
      <section className="section-y border-b border-slate-100 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="max-w-xl lg:py-4">
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch]">
                A more intentional path forward
              </h2>
              <div className="space-y-5">
                <p className="type-body text-slate-600">
                  Most home financing today feels transactional — built for speed, not fit.
                </p>
                <p className="type-body text-slate-600">
                  For something as important as a home, that falls short. We believe the work should be built around your
                  goals, timeline, and where you&apos;re headed — not just the next approval.
                </p>
              </div>
            </div>

            <div className="relative min-w-0 pb-6 lg:pb-8">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-[0_80px_120px_-28px_rgba(10,25,47,0.25)]">
                <img
                  src={IMG_NARRATIVE_ARCH}
                  alt="Snow-covered Mid-Atlantic suburban neighborhood with brick and siding homes along a cleared street"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent pointer-events-none" aria-hidden />
              </div>
              <article className="card-home-elevated relative z-10 mx-4 -mt-10 sm:mx-6 lg:mx-0 lg:ml-auto lg:mr-0 lg:w-[94%] max-w-xl overflow-hidden rounded-[4px] border border-slate-200/90 bg-white p-8 lg:p-10 shadow-[0_12px_40px_rgba(10,25,47,0.07)] transition-shadow duration-500 hover:shadow-[0_22px_56px_rgba(10,25,47,0.1)] group">
                <div
                  className="pointer-events-none absolute inset-0 rounded-[4px] bg-gradient-to-br from-gold/[0.06] via-transparent to-transparent opacity-100"
                  aria-hidden
                />
                <blockquote className="type-editorial-pullquote mb-0 m-0 border-l-2 border-gold/40 pl-5 relative z-10">
                  <p className="m-0">
                    A home loan should fit the life you&apos;re building — not just the numbers on a page.
                  </p>
                </blockquote>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="our-approach" className="section-y bg-surface border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="order-1 min-w-0">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[0_80px_120px_-20px_rgba(10,25,47,0.3)]">
                <img
                  src={IMG_APPROACH_HOME}
                  alt="Single-family suburban home with siding, manicured lawn, and driveway in natural daylight"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="order-2 max-w-xl min-w-0">
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch]">
                We don&apos;t just find loans. We structure decisions.
              </h2>
              <div className="space-y-5">
                <p className="type-body text-slate-600">
                  We start by understanding your full financial picture — not just what you qualify for, but what actually
                  makes sense.
                </p>
                <p className="type-body text-slate-600">
                  From there, we structure financing options that align with your priorities — so you see not only what
                  you can do, but what you should do.
                </p>
                <p className="type-body text-navy text-[15px] lg:text-base font-medium">
                  The right structure doesn&apos;t just get you approved — it sets you up for what comes next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="loan-structure" className="section-y border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center border-l-[3px] border-l-gold/35 pl-6 sm:pl-8 py-2">
            <div className="mx-auto mb-8 h-px w-12 bg-gold/45" aria-hidden />
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch] mx-auto">
              Not all loans are created equal
            </h2>
            <div className="space-y-5 text-left">
              <p className="type-body text-slate-600">
                Two borrowers can qualify for the same loan — and still make very different decisions. The difference is
                structure: term, payment flexibility, and how the pieces fit your plans.
              </p>
              <p className="type-body text-slate-600">
                That&apos;s where we spend our time — before you commit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-b border-slate-100 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 lg:items-center">
            <div className="max-w-xl min-w-0">
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch]">
                The cost of getting it wrong
              </h2>
              <div className="space-y-5">
                <p className="type-body text-slate-600">
                  The full weight of a mortgage rarely hits on closing day. It shows up later — in flexibility, opportunity,
                  and whether your financing still fits as life changes.
                </p>
                <p className="type-body text-slate-600">
                  We&apos;d rather surface that tradeoff before you sign than help you unwind it years down the road.
                </p>
              </div>
            </div>
            <aside className="flex min-w-0 w-full lg:min-h-[min(100%,26rem)] items-stretch">
              <div className="relative flex w-full flex-col justify-center min-h-[280px] lg:min-h-[min(100%,26rem)] overflow-hidden rounded-sm border border-white/[0.08] border-l-[3px] border-l-gold/70 bg-navy px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16 shadow-[0_28px_72px_-12px_rgba(10,25,47,0.45)]">
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.07] via-transparent to-navy opacity-90"
                  aria-hidden
                />
                <div className="relative z-10 mx-auto max-w-[min(100%,22rem)] text-center flex flex-col justify-center my-auto">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-6">
                    Reality most people miss
                  </p>
                  <p className="font-heading text-[1.75rem] sm:text-[2.125rem] lg:text-[2.35rem] text-white font-semibold leading-[1.2] tracking-[-0.03em]">
                    The impact of a mortgage decision
                  </p>
                  <p className="font-heading text-[1.35rem] sm:text-[1.65rem] lg:text-[1.85rem] text-white/72 italic leading-[1.5] tracking-[-0.02em] mt-3">
                    is often felt later — not upfront.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="leadership" className="section-y border-b border-slate-200/90 bg-surface scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <header className="max-w-3xl mb-12 lg:mb-16">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-4 leading-[1.08] text-navy">
              Our Leadership
            </h2>
            <p className="type-body text-slate-600 text-[17px] leading-[1.7] max-w-2xl">
              Experience, perspective, and a shared commitment to doing things differently.
            </p>
          </header>

          <article
            id="founder-message"
            className="pb-16 lg:pb-20 mb-16 lg:mb-24 border-b border-slate-200/50"
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/40 mb-6">
              Founder
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start">
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start mb-8 lg:mb-0">
                <LeadershipPortrait
                  src={FOUNDER_PUBLIC_SRC}
                  alt="Javier Cifuentes, Founder and Managing Member of Infinite Home Lending"
                  placeholderInitials="JC"
                  placeholderFilename="founder-portrait.jpg"
                />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 min-w-0 text-left py-2 px-0 sm:px-2 lg:px-8 lg:py-10">
                <p className="text-[17px] leading-[1.7] text-slate-600 font-sans mb-8 max-w-[42rem]">
                  When we started Infinite Home Lending, it came from a simple observation.
                </p>
                <div className="space-y-5 text-[17px] leading-[1.7] text-slate-600 font-sans text-pretty [overflow-wrap:break-word] [word-break:normal] max-w-[42rem]">
                  <p>
                    After more than two decades in the mortgage industry—leading teams, navigating different market
                    cycles, and working through thousands of real client scenarios—we saw a consistent pattern. Too many
                    people were making one of the most important financial decisions of their lives without clarity,
                    without enough options, and without a real strategy behind it. It wasn&apos;t that people weren&apos;t
                    asking the right questions; it&apos;s that the process itself wasn&apos;t built to support them. Too
                    often, the incentives in the broader mortgage ecosystem still reward speed and volume over fit, which
                    can leave borrowers moving forward without the full picture they deserve.
                  </p>
                  <p>
                    Most mortgage experiences are designed to close loans, not to guide decisions. And that difference
                    matters more than most people realize when the stakes are this high: a mortgage is not a one-time
                    product. It is a lever that affects how you build equity, how you absorb financial shocks, and how
                    much flexibility you retain when life changes.
                  </p>
                  <blockquote className="font-heading text-[1.15rem] sm:text-[1.2rem] italic text-navy/90 leading-[1.65] border-l-[3px] border-gold/35 pl-5 pr-2 my-6 py-1 mx-0">
                    <p className="mb-0">
                      Because you&apos;re not just choosing a loan. You&apos;re choosing how your life moves forward—how
                      flexible your future is, how confident you feel in your decisions, and how prepared you are when life
                      inevitably changes.
                    </p>
                  </blockquote>
                  <p>
                    Over the years, we&apos;ve seen how the structure of a loan can either support someone&apos;s
                    long-term plans—or quietly limit them. And in many cases, that impact isn&apos;t fully understood until
                    much later, when it is harder to adjust.
                  </p>
                  <p>
                    That&apos;s why we built Infinite Home Lending differently. We focus on structure before product,
                    understanding before commitment, and guidance that actually reflects your goals—not just what fits into a
                    system. As an independent brokerage, we are positioned to align with the borrower, not with a single
                    lender&apos;s menu, so we can be direct about tradeoffs and about what holds up over time.
                  </p>
                  <p>
                    Our role is simple: to help you understand your options, think through your decisions, and move forward
                    with confidence.
                  </p>
                  <p>
                    That&apos;s the standard we hold ourselves to, and that&apos;s the experience we aim to deliver to every
                    client we work with.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200/70 text-left">
                  <p className="font-heading text-lg text-navy font-medium tracking-[-0.02em]">— Javier Cifuentes</p>
                  <p className="type-body-sm text-slate-500 mt-2 font-normal">Founder &amp; Managing Member</p>
                </div>
              </div>
            </div>
          </article>

          <article id="cofounder-message">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/40 mb-6">
              Co-Founder
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start">
              <div className="lg:col-span-7 order-1 lg:order-1 min-w-0 text-left py-2 px-0 sm:px-2 lg:px-8 lg:py-10">
                <p className="text-[17px] leading-[1.7] text-slate-600 font-sans mb-8 max-w-[42rem]">
                  In every loan I&apos;ve worked on, there&apos;s a point where the numbers stop being just numbers and the
                  decision becomes real.
                </p>
                <div className="space-y-5 text-[17px] leading-[1.7] text-slate-600 font-sans text-pretty [overflow-wrap:break-word] [word-break:normal] max-w-[42rem]">
                  <p>
                    It&apos;s a family preparing for a new chapter, a client trying to make the right choice with
                    incomplete information, or someone whose financial situation doesn&apos;t fit neatly into a standard
                    process and requires a deeper level of understanding.
                  </p>
                  <p>That&apos;s where our role truly begins.</p>
                  <p>
                    Over the past 20+ years, I&apos;ve worked with a wide range of borrowers, including self-employed
                    clients, layered credit profiles, and scenarios that require patience, precision, and thoughtful
                    structuring rather than a rushed outcome.
                  </p>
                  <p>
                    What I&apos;ve seen consistently is that when people feel heard and fully understand their options,
                    they make better decisions—not necessarily faster, but with greater clarity and confidence.
                  </p>
                  <p>The difference is in how the process is approached.</p>
                  <p>
                    It&apos;s reflected in the conversations that happen early, the details that are carefully evaluated,
                    and the ability to structure a loan in a way that aligns with how someone actually lives—not just what
                    guidelines allow on paper.
                  </p>
                  <p>That&apos;s the standard I bring to every client interaction.</p>
                  <p>
                    At Infinite Home Lending, we don&apos;t approach this process as a checklist. We approach it as a
                    responsibility—to guide, to simplify, and to ensure that every decision is made with full context,
                    both for today and for what comes next.
                  </p>
                  <p>
                    When that level of clarity is present, clients feel more confident, and the outcome becomes something
                    they can truly stand behind.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200/70 text-left">
                  <p className="font-heading text-lg text-navy font-medium tracking-[-0.02em]">— Alma Jaramillo</p>
                  <p className="type-body-sm text-slate-500 mt-2 font-normal">Co-Founder</p>
                </div>
              </div>
              <div className="lg:col-span-5 order-2 lg:order-2 flex justify-center lg:justify-end mb-8 lg:mb-0">
                <LeadershipPortrait
                  src={COFOUNDER_PUBLIC_SRC}
                  alt="Alma Jaramillo, Co-Founder of Infinite Home Lending"
                  placeholderInitials="AJ"
                  placeholderFilename="alma-portrait.jpg"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="mortgage-experience" className="section-y border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto w-full max-w-[72rem] flex flex-col items-center text-center">
            <div
              className="w-full max-w-3xl mx-auto pt-2 pb-4 lg:pt-4 lg:pb-6 mb-12 lg:mb-16 px-2"
              aria-labelledby="clarity-manifesto-heading"
            >
              <div className="mx-auto mb-8 lg:mb-10 h-px w-14 bg-gold/40" aria-hidden />
              <p
                id="clarity-manifesto-heading"
                className="font-heading font-semibold text-[1.85rem] sm:text-[2.25rem] lg:text-[2.65rem] xl:text-[2.85rem] text-navy leading-[1.12] tracking-[-0.035em] mb-8 lg:mb-10 text-balance"
              >
                Clarity changes everything.
              </p>
              <p className="text-[1.0625rem] sm:text-[1.125rem] lg:text-[1.1875rem] leading-[1.65] text-slate-600 font-sans max-w-2xl mx-auto text-pretty">
                When you understand your options, everything else becomes easier—the decisions, the timing, the confidence
                to move forward.
              </p>
            </div>

            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-5 lg:mb-6 leading-[1.08] max-w-[24ch] text-navy mx-auto">
              What people really want from a mortgage experience
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-600 font-sans max-w-[42rem] mx-auto mb-12 lg:mb-14 text-pretty">
              Most people aren&apos;t looking for more noise.
              <span className="block mt-3">
                They&apos;re looking for clarity, confidence, and someone who actually understands their situation.
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 w-full max-w-[52rem] mx-auto text-left">
              {MORTGAGE_WANTS_GRID.map(({ title, body, Icon }) => (
                <div
                  key={title}
                  className="flex h-full flex-col gap-4 rounded-[4px] border border-slate-200/90 bg-white p-6 lg:p-8 shadow-[0_8px_28px_rgba(10,25,47,0.04)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(10,25,47,0.1)] motion-reduce:hover:translate-y-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-gold/20 bg-gold/[0.06] text-gold shrink-0">
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg sm:text-xl text-navy tracking-[-0.02em] leading-snug mb-2">
                      {title}
                    </h3>
                    <p className="text-[15px] lg:text-[16px] leading-[1.7] text-slate-600 font-sans">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <blockquote className="mt-16 lg:mt-20 pt-12 border-t border-slate-200/90 max-w-[min(100%,36rem)] mx-auto px-3">
              <p className="font-heading text-[1.125rem] sm:text-[1.2rem] lg:text-[1.3rem] italic text-navy/[0.88] leading-[1.6] tracking-[-0.02em] text-center text-pretty">
                <span className="text-gold/45 not-italic select-none text-[1.35em] leading-none align-top" aria-hidden>
                  &ldquo;
                </span>
                That&apos;s the bar we believe every borrower deserves.
                <span className="text-gold/45 not-italic select-none text-[1.35em] leading-none align-top" aria-hidden>
                  &rdquo;
                </span>
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Understanding → access (single narrative unit) */}
      <section className="section-y bg-surface border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center pb-8 lg:pb-10">
            <h2 className="type-section-title-lg text-[2rem] sm:text-[2.35rem] lg:text-[2.65rem] max-w-[24ch] mx-auto leading-[1.18] tracking-[-0.03em] text-navy">
              More options. Deeper understanding.
            </h2>
          </div>
          <div className="flex flex-col items-center gap-8 pt-2">
            <div className="flex w-full max-w-md items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300/80" aria-hidden />
              <IHLLogo className="h-14 sm:h-16 w-auto max-w-[200px] opacity-[0.96] mx-auto" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300/80" aria-hidden />
            </div>
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="type-body text-slate-600">Most lenders can only offer what they have.</p>
              <p className="type-body text-navy text-[15px] lg:text-base font-medium">We&apos;re built differently.</p>
              <p className="type-body text-slate-600">
                As an independent brokerage, we work across a broad network of lending partners — so we can structure
                financing around your situation instead of forcing it into a narrow menu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {CORE_VALUES.map((item) => (
              <div
                key={item.title}
                className="relative p-10 lg:p-12 rounded-[4px] bg-white border border-slate-200/90 shadow-[0_14px_40px_rgba(10,25,47,0.05)]"
              >
                <h3 className="mb-5 font-heading font-semibold text-navy text-xl sm:text-2xl tracking-[-0.02em] leading-snug">
                  {item.title}
                </h3>
                <p className="type-body text-slate-600 text-[15px] lg:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-navy relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(197,160,89,0.07),transparent_52%)]"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="type-section-title-lg text-white mb-6 text-[2rem] sm:text-4xl lg:text-[3rem] leading-[1.15] tracking-[-0.03em]">
              Ready for a mortgage experience built around your life?
            </h2>
            <p className="font-sans text-lg sm:text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-[1.65]">
              No pressure. Just a clear, structured path forward.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 sm:gap-7">
              <Link
                to="/contact"
                className="btn-gold inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-300 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Start Your Pre-Approval</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
              <Link
                to="/contact?topic=loan-strategy"
                className="text-center text-sm font-semibold text-white/85 border-b border-white/25 pb-0.5 hover:text-white hover:border-white/50 transition-colors duration-300 sm:py-[1.125rem]"
              >
                Prefer to talk strategy first?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
