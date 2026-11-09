import type { ReactNode } from "react";
import { useAdvisor } from "../../context/AdvisorContext";

const APPLY_NOW_REL = "noopener noreferrer";

type AdvisorApplyNowLinkProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

/** Single source for advisor Apply Now URL + target behavior. */
export function AdvisorApplyNowLink({
  className = "",
  children,
  onClick,
}: AdvisorApplyNowLinkProps) {
  const { advisor } = useAdvisor();
  return (
    <a
      href={advisor.applyNowUrl}
      target="_blank"
      rel={APPLY_NOW_REL}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export { APPLY_NOW_REL };
