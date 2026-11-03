import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAdvisor } from "../../context/AdvisorContext";
import {
  getAdvisorExternalDestination,
  shouldExemptAdvisorNavAnchor,
} from "../../lib/advisorExternalNavigation";
import { AdvisorExternalNavigationModal } from "./AdvisorExternalNavigationModal";

type AdvisorExternalNavContextValue = {
  /** Request the handoff modal for a destination outside the advisor site. */
  requestExternalNavigation: (href: string, returnFocusEl?: HTMLElement | null) => boolean;
};

const AdvisorExternalNavContext = createContext<AdvisorExternalNavContextValue | null>(null);

export function useAdvisorExternalNavigation(): AdvisorExternalNavContextValue | null {
  return useContext(AdvisorExternalNavContext);
}

export function AdvisorExternalNavigationProvider({ children }: { children: ReactNode }) {
  const { advisor } = useAdvisor();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [destinationHref, setDestinationHref] = useState<string | null>(null);
  const [returnFocusEl, setReturnFocusEl] = useState<HTMLElement | null>(null);

  const closeStay = useCallback(() => {
    setOpen(false);
    setDestinationHref(null);
  }, []);

  const requestExternalNavigation = useCallback(
    (href: string, returnFocus: HTMLElement | null = null) => {
      const destination = getAdvisorExternalDestination(href, advisor.slug, window.location.origin);
      if (!destination) return false;
      setReturnFocusEl(returnFocus);
      setDestinationHref(destination);
      setOpen(true);
      return true;
    },
    [advisor.slug],
  );

  const onOpenResource = useCallback(() => {
    if (!destinationHref) return;
    window.open(destinationHref, "_blank", "noopener,noreferrer");
    setOpen(false);
    setDestinationHref(null);
  }, [destinationHref]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (!root.contains(anchor)) return;
      if (shouldExemptAdvisorNavAnchor(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const destination = getAdvisorExternalDestination(href, advisor.slug, window.location.origin);
      if (!destination) return;

      event.preventDefault();
      event.stopPropagation();
      setReturnFocusEl(anchor);
      setDestinationHref(destination);
      setOpen(true);
    };

    root.addEventListener("click", onClickCapture, true);
    return () => root.removeEventListener("click", onClickCapture, true);
  }, [advisor.slug]);

  const value = useMemo(
    () => ({ requestExternalNavigation }),
    [requestExternalNavigation],
  );

  return (
    <AdvisorExternalNavContext.Provider value={value}>
      <div ref={rootRef} className="advisor-external-nav-root">
        {children}
        <AdvisorExternalNavigationModal
          open={open}
          destinationHref={destinationHref}
          returnFocusEl={returnFocusEl}
          onStay={closeStay}
          onOpenResource={onOpenResource}
        />
      </div>
    </AdvisorExternalNavContext.Provider>
  );
}
