import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { EASE_PREMIUM, MOTION } from "../lib/motionConfig";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Parent for staggered children — use with `StaggerItem` children.
 */
export function StaggerReveal({ children, className = "" }: StaggerRevealProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : MOTION.stagger,
            delayChildren: reduced ? 0 : 0.04,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof motion.div>, "children" | "className" | "variants">;

export function StaggerItem({ children, className = "", ...rest }: StaggerItemProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: MOTION.card.duration, ease: EASE_PREMIUM },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
