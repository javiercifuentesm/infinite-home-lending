import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { EASE_PREMIUM, MOTION } from "../lib/motionConfig";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay for sequenced sections */
  delay?: number;
  /** Slightly smaller motion for dense layouts */
  subtle?: boolean;
};

/**
 * Subtle fade + slide on scroll; no motion when user prefers reduced motion.
 */
export function SectionReveal({
  children,
  className = "",
  delay = 0,
  subtle = false,
}: SectionRevealProps) {
  const reduced = usePrefersReducedMotion();
  const y = subtle ? 10 : 18;

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{
        duration: reduced ? 0 : MOTION.section.duration,
        delay: reduced ? 0 : delay,
        ease: EASE_PREMIUM,
      }}
    >
      {children}
    </motion.div>
  );
}
