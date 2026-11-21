import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdvisorLoanProgramModalContextValue = {
  openProgramId: string | null;
  returnFocusEl: HTMLElement | null;
  openModal: (programId: string, returnFocusEl: HTMLElement | null) => void;
  closeModal: () => void;
};

const AdvisorLoanProgramModalContext = createContext<AdvisorLoanProgramModalContextValue | null>(
  null,
);

export function AdvisorLoanProgramModalProvider({ children }: { children: ReactNode }) {
  const [openProgramId, setOpenProgramId] = useState<string | null>(null);
  const [returnFocusEl, setReturnFocusEl] = useState<HTMLElement | null>(null);

  const openModal = useCallback((programId: string, focusEl: HTMLElement | null) => {
    setReturnFocusEl(focusEl);
    setOpenProgramId(programId);
  }, []);

  const closeModal = useCallback(() => {
    setOpenProgramId(null);
  }, []);

  const value = useMemo(
    () => ({ openProgramId, returnFocusEl, openModal, closeModal }),
    [openProgramId, returnFocusEl, openModal, closeModal],
  );

  return (
    <AdvisorLoanProgramModalContext.Provider value={value}>
      {children}
    </AdvisorLoanProgramModalContext.Provider>
  );
}

export function useAdvisorLoanProgramModal(): AdvisorLoanProgramModalContextValue {
  const ctx = useContext(AdvisorLoanProgramModalContext);
  if (!ctx) {
    throw new Error("useAdvisorLoanProgramModal must be used within AdvisorLoanProgramModalProvider");
  }
  return ctx;
}

export function useAdvisorLoanProgramModalOptional(): AdvisorLoanProgramModalContextValue | null {
  return useContext(AdvisorLoanProgramModalContext);
}
