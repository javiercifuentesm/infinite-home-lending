/** Premium easing — smooth, not bouncy (matches existing simulator). */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export const MOTION = {
  /** Section / block entrance */
  section: { duration: 0.48, ease: EASE_PREMIUM },
  /** Cards in a grid */
  card: { duration: 0.42, ease: EASE_PREMIUM },
  /** Micro-interactions */
  micro: { duration: 0.28, ease: EASE_PREMIUM },
  /** Stagger between sibling cards */
  stagger: 0.07,
} as const;
