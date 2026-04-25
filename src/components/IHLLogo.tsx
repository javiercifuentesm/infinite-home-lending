/**
 * Official IHL raster lockup — processed from the uploaded source with checkerboard removed.
 * Regenerate: `.venv/bin/python scripts/process-ihl-logo.py` (see scripts/process-ihl-logo.py).
 */
import type { CSSProperties } from "react";

type IHLLogoProps = {
  className?: string;
  alt?: string;
  style?: CSSProperties;
  /** Defaults to transparent PNG lockup; override for alternate brand assets (e.g. Deal Desk cream tile). */
  src?: string;
  /** Hint for LCP / above-the-fold lockups (e.g. gate nav). */
  fetchPriority?: "high" | "low" | "auto";
};

export function IHLLogo({
  className = "",
  alt = "Infinite Home Lending",
  style,
  src = "/ihl-logo.png",
  fetchPriority,
}: IHLLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
      draggable={false}
      loading="eager"
      fetchPriority={fetchPriority}
      style={{ backgroundColor: "transparent", ...style }}
    />
  );
}
