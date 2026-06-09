import { createPortal } from "react-dom";
import { SARAH_KEYFRAMES_CSS } from "./sarahIdentity";

/** Injects shared Sarah animation keyframes into document head (reliable across mount trees). */
export function SarahKeyframes() {
  if (typeof document === "undefined") return null;
  return createPortal(<style data-sarah-keyframes="">{SARAH_KEYFRAMES_CSS}</style>, document.head);
}
