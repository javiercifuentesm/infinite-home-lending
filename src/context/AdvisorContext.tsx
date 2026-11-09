import { createContext, useContext, type ReactNode } from "react";
import type { AdvisorProfile } from "../config/advisors";

type AdvisorContextValue = {
  advisor: AdvisorProfile;
  basePath: string;
};

const AdvisorContext = createContext<AdvisorContextValue | null>(null);

export function AdvisorProvider({
  advisor,
  children,
}: {
  advisor: AdvisorProfile;
  children: ReactNode;
}) {
  const basePath = `/${advisor.slug}`;
  return (
    <AdvisorContext.Provider value={{ advisor, basePath }}>{children}</AdvisorContext.Provider>
  );
}

export function useAdvisor(): AdvisorContextValue {
  const ctx = useContext(AdvisorContext);
  if (!ctx) {
    throw new Error("useAdvisor must be used within AdvisorProvider");
  }
  return ctx;
}

/** Safe hook for components that may render outside advisor layout. */
export function useAdvisorOptional(): AdvisorContextValue | null {
  return useContext(AdvisorContext);
}
