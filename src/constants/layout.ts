/**
 * Fixed navbar clearance for main content — single source of truth for page rhythm.
 * Applied via `PageContainer` on standard routes.
 *
 * Tool-dense routes (e.g. Loan Structure Simulator) may use a larger `calc(...)` offset instead;
 * keep those aligned visually with this baseline where possible.
 */
/** Matches `--site-header-height` (see `index.css` :root). */
export const PAGE_CONTENT_TOP_CLASS = "pt-site-header" as const;

/**
 * Standard horizontal content rail — matches How It Works, Loan Solutions, About.
 */
export const PAGE_CONTENT_RAIL_CLASS = "max-w-7xl mx-auto px-6" as const;

/**
 * First section vertical rhythm below PageContainer — matches How It Works hero band.
 */
export const PAGE_SECTION_HERO_PAD_CLASS =
  "pt-[100px] lg:pt-[120px] pb-12 lg:pb-16" as const;
