import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { KnowledgeRouteId } from "../../../data/knowledgeCenterRoutes";

type AdvisorResourceModalContextValue = {
  openResourceId: KnowledgeRouteId | null;
  returnFocusEl: HTMLElement | null;
  openModal: (resourceId: KnowledgeRouteId, returnFocusEl: HTMLElement | null) => void;
  closeModal: () => void;
};

const AdvisorResourceModalContext = createContext<AdvisorResourceModalContextValue | null>(null);

export function AdvisorResourceModalProvider({ children }: { children: ReactNode }) {
  const [openResourceId, setOpenResourceId] = useState<KnowledgeRouteId | null>(null);
  const [returnFocusEl, setReturnFocusEl] = useState<HTMLElement | null>(null);

  const openModal = useCallback((resourceId: KnowledgeRouteId, focusEl: HTMLElement | null) => {
    setReturnFocusEl(focusEl);
    setOpenResourceId(resourceId);
  }, []);

  const closeModal = useCallback(() => {
    setOpenResourceId(null);
  }, []);

  const value = useMemo(
    () => ({ openResourceId, returnFocusEl, openModal, closeModal }),
    [openResourceId, returnFocusEl, openModal, closeModal],
  );

  return (
    <AdvisorResourceModalContext.Provider value={value}>{children}</AdvisorResourceModalContext.Provider>
  );
}

export function useAdvisorResourceModal(): AdvisorResourceModalContextValue {
  const ctx = useContext(AdvisorResourceModalContext);
  if (!ctx) {
    throw new Error("useAdvisorResourceModal must be used within AdvisorResourceModalProvider");
  }
  return ctx;
}

export function useAdvisorResourceModalOptional(): AdvisorResourceModalContextValue | null {
  return useContext(AdvisorResourceModalContext);
}
