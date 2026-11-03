import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { useAdvisorOptional } from "../../context/AdvisorContext";
import { getAdvisorExternalDestination } from "../../lib/advisorExternalNavigation";
import { useAdvisorExternalNavigation } from "./AdvisorExternalNavigationProvider";

type AdvisorSafeLinkProps = Omit<LinkProps, "to"> & {
  to: string;
  children: ReactNode;
};

/**
 * React Router link that intercepts destinations outside the current advisor namespace.
 * Outside advisor layout, behaves like a normal Link.
 */
export const AdvisorSafeLink = forwardRef<HTMLAnchorElement, AdvisorSafeLinkProps>(
  function AdvisorSafeLink({ to, onClick, children, ...rest }, ref) {
    const advisorCtx = useAdvisorOptional();
    const guard = useAdvisorExternalNavigation();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (!advisorCtx || !guard) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const intercepted = guard.requestExternalNavigation(to, event.currentTarget);
      if (intercepted) {
        event.preventDefault();
      }
    };

    if (!advisorCtx || !guard) {
      return (
        <Link ref={ref} to={to} onClick={onClick} {...rest}>
          {children}
        </Link>
      );
    }

    const external = getAdvisorExternalDestination(
      to,
      advisorCtx.advisor.slug,
      typeof window !== "undefined" ? window.location.origin : "",
    );

    if (!external) {
      return (
        <Link ref={ref} to={to} onClick={onClick} {...rest}>
          {children}
        </Link>
      );
    }

    return (
      <Link ref={ref} to={to} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  },
);

type AdvisorSafeAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/** Native anchor with the same advisor external-navigation guard. */
export const AdvisorSafeAnchor = forwardRef<HTMLAnchorElement, AdvisorSafeAnchorProps>(
  function AdvisorSafeAnchor({ href, onClick, children, ...rest }, ref) {
    const advisorCtx = useAdvisorOptional();
    const guard = useAdvisorExternalNavigation();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (!advisorCtx || !guard) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (rest.target === "_blank") return;

      const intercepted = guard.requestExternalNavigation(href, event.currentTarget);
      if (intercepted) {
        event.preventDefault();
      }
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  },
);
