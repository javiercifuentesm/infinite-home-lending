import { useEffect } from "react";

const MANAGED_ATTR = "data-ihl-structured-data";

export function useStructuredData(data: Record<string, unknown> | null): void {
  const serialized = data ? JSON.stringify(data) : null;

  useEffect(() => {
    if (!serialized) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED_ATTR, "true");
    script.textContent = serialized;
    document.head.appendChild(script);

    return () => {
      document.querySelectorAll(`script[${MANAGED_ATTR}="true"]`).forEach((el) => el.remove());
    };
  }, [serialized]);
}

export function buildAdvisorPersonSchema(params: {
  name: string;
  jobTitle: string;
  nmlsId: string;
  url: string;
  image?: string;
  languages: string[];
  email?: string;
  linkedin?: string;
}): Record<string, unknown> {
  const sameAs = [params.linkedin].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    jobTitle: params.jobTitle,
    url: params.url,
    ...(params.image ? { image: params.image } : {}),
    ...(params.email ? { email: params.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    knowsLanguage: params.languages,
    identifier: {
      "@type": "PropertyValue",
      name: "NMLS ID",
      value: params.nmlsId,
    },
    worksFor: {
      "@type": "Organization",
      name: "Infinite Home Lending, L.L.C.",
      url: "https://www.infinitehomelending.com",
      identifier: {
        "@type": "PropertyValue",
        name: "NMLS ID",
        value: "2831765",
      },
    },
  };
}
