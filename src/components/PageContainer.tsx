import type { ReactNode } from "react";
import { PAGE_CONTENT_TOP_CLASS } from "../constants/layout";

type PageContainerProps = {
  children: ReactNode;
  /** Additional classes (background, min-height, etc.) */
  className?: string;
};

/**
 * Wraps route-level page content with the site-standard top offset below the fixed navbar.
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={[PAGE_CONTENT_TOP_CLASS, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
