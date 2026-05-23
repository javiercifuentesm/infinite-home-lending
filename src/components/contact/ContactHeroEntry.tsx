import { forwardRef, useEffect } from "react";
import { motion, type MotionValue } from "motion/react";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export const CONTACT_HERO_WEBP = "/images/contact/hero-entry.webp";
export const CONTACT_HERO_PNG = "/images/contact/hero-entry.png";

type Props = {
  onStartClarity: () => void;
  heroOpacity: MotionValue<number>;
  imageParallaxY: MotionValue<number>;
};

/**
 * 60vh cinematic hero — bottom gradient, bottom-left copy, scroll-driven parallax on image.
 */
export const ContactHeroEntry = forwardRef<HTMLElement, Props>(function ContactHeroEntry(
  { onStartClarity, heroOpacity, imageParallaxY },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const { t } = useLanguage();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = CONTACT_HERO_WEBP;
    link.type = "image/webp";
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <motion.section
      ref={ref}
      className="hero-entry"
      style={{ opacity: heroOpacity }}
      aria-label="Introduction"
    >
      <div className="hero-entry__media">
        <motion.div className="hero-entry__parallax h-full w-full" style={{ y: imageParallaxY }}>
          <div className="hero-entry__still h-full w-full">
            <picture>
              <source srcSet={CONTACT_HERO_WEBP} type="image/webp" />
              <img
                src={CONTACT_HERO_PNG}
                alt=""
                className="hero-entry__img"
                width={1920}
                height={1080}
                decoding="async"
                fetchPriority="high"
                loading="eager"
              />
            </picture>
          </div>
        </motion.div>
      </div>
      <div className="hero-overlay" aria-hidden />
      <div className="hero-entry-content">
        <motion.div
          className="hero-entry-content-inner"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 0.55, delay: 0.3, ease }}
        >
          <h2 className="hero-entry-headline font-heading text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.35rem] lg:text-[2.75rem]">
            {t("contact.hero.headline")}
          </h2>
          <p className="hero-entry-subline mt-4 max-w-xl font-sans text-[16px] leading-relaxed text-white/90 sm:text-[1.0625rem]">
            {t("contact.hero.subline")}
          </p>
        </motion.div>
        <motion.button
          type="button"
          onClick={onStartClarity}
          className="hero-entry-cta mt-10 inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-white/85 bg-white/[0.08] px-8 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-[2px] transition-[background-color,border-color] duration-300 hover:border-white hover:bg-white/12"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.45, delay: 0.38, ease }}
        >
          {t("contact.hero.cta")}
        </motion.button>
      </div>
    </motion.section>
  );
});
