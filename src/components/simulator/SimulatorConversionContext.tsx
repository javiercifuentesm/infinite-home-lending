import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { SimulatorLeadPayload, SimulatorPurchaseTimeline } from "../../lib/simulatorLeadPayload";
import { submitSimulatorLead } from "../../lib/simulatorLeadPayload";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export const DEFER_STORAGE_KEY = "ihl_sim_review_deferred";

type SimulatorConversionContextValue = {
  payload: SimulatorLeadPayload;
  explorationReady: boolean;
  open: boolean;
  deferred: boolean;
  sent: boolean;
  loading: boolean;
  error: string | null;
  firstName: string;
  setFirstName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  timeline: SimulatorPurchaseTimeline;
  setTimeline: (v: SimulatorPurchaseTimeline) => void;
  openReview: () => void;
  closeReview: () => void;
  saveForLater: () => void;
  resumeReview: () => void;
  submit: (e: FormEvent) => Promise<void>;
  continueExploring: () => void;
  reducedMotion: boolean;
};

const SimulatorConversionContext = createContext<SimulatorConversionContextValue | null>(null);

export function useSimulatorConversion(): SimulatorConversionContextValue {
  const ctx = useContext(SimulatorConversionContext);
  if (!ctx) {
    throw new Error("useSimulatorConversion must be used within SimulatorConversionProvider");
  }
  return ctx;
}

type ProviderProps = {
  children: ReactNode;
  payload: SimulatorLeadPayload;
  /** User has explored (session + interaction). */
  explorationReady: boolean;
};

export function SimulatorConversionProvider({ children, payload, explorationReady }: ProviderProps) {
  const reduced = usePrefersReducedMotion();
  const [deferred, setDeferred] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeline, setTimeline] = useState<SimulatorPurchaseTimeline>("exploring");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DEFER_STORAGE_KEY) === "1") setDeferred(true);
    } catch {
      /* */
    }
  }, []);

  const resetFormFields = useCallback(() => {
    setFirstName("");
    setEmail("");
    setPhone("");
    setTimeline("exploring");
  }, []);

  const closeReview = useCallback(() => {
    setOpen(false);
    setSent(false);
    setError(null);
    setLoading(false);
    resetFormFields();
  }, [resetFormFields]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) closeReview();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, closeReview]);

  const openReview = useCallback(() => {
    setOpen(true);
    setSent(false);
    setError(null);
  }, []);

  const saveForLater = useCallback(() => {
    try {
      sessionStorage.setItem(DEFER_STORAGE_KEY, "1");
    } catch {
      /* */
    }
    setDeferred(true);
  }, []);

  const resumeReview = useCallback(() => {
    try {
      sessionStorage.removeItem(DEFER_STORAGE_KEY);
    } catch {
      /* */
    }
    setDeferred(false);
    setOpen(true);
    setSent(false);
    setError(null);
  }, []);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedEmail = email.trim();
      const trimmedFirst = firstName.trim();
      if (!trimmedFirst) {
        setError("Please enter your first name.");
        return;
      }
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setError("Please enter a valid email.");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        await submitSimulatorLead({
          firstName: trimmedFirst,
          email: trimmedEmail,
          phone: phone.trim() || undefined,
          timeline,
          payload: { ...payload, capturedAt: new Date().toISOString() },
        });
        setSent(true);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, firstName, phone, timeline, payload]
  );

  const continueExploring = useCallback(() => {
    closeReview();
    const el = document.getElementById("sim-scenario-inputs");
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [closeReview, reduced]);

  const value = useMemo(
    () => ({
      payload,
      explorationReady,
      open,
      deferred,
      sent,
      loading,
      error,
      firstName,
      setFirstName,
      email,
      setEmail,
      phone,
      setPhone,
      timeline,
      setTimeline,
      openReview,
      closeReview,
      saveForLater,
      resumeReview,
      submit,
      continueExploring,
      reducedMotion: reduced,
    }),
    [
      payload,
      explorationReady,
      open,
      deferred,
      sent,
      loading,
      error,
      firstName,
      email,
      phone,
      timeline,
      openReview,
      closeReview,
      saveForLater,
      resumeReview,
      submit,
      continueExploring,
      reduced,
    ]
  );

  return (
    <SimulatorConversionContext.Provider value={value}>{children}</SimulatorConversionContext.Provider>
  );
}
