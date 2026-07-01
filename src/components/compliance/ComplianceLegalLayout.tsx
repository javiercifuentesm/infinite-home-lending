import type { ReactNode } from "react";
import { PageContainer } from "../PageContainer";
import { useLanguage } from "../../i18n/LanguageContext";
import "./complianceLegal.css";

type ComplianceLegalLayoutProps = {
  titleKey: string;
  lastUpdatedKey?: string;
  children: ReactNode;
};

export function ComplianceLegalLayout({
  titleKey,
  lastUpdatedKey,
  children,
}: ComplianceLegalLayoutProps) {
  const { t } = useLanguage();

  return (
    <PageContainer className="compliance-page bg-[#F7F7F5] pb-16 sm:pb-20">
      <div className="compliance-page-inner mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
        <header className="compliance-page-header">
          <p className="compliance-page-eyebrow font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
            {t("compliance.eyebrow")}
          </p>
          <h1 className="compliance-page-title mt-4 font-heading text-[2rem] font-semibold leading-tight tracking-[-0.025em] text-navy sm:text-[2.375rem]">
            {t(titleKey)}
          </h1>
          <div className="compliance-page-divider mt-5 h-px w-12 bg-gold/70" aria-hidden />
          {lastUpdatedKey ? (
            <p className="compliance-page-updated mt-5 font-sans text-[13px] text-slate-500">
              {t(lastUpdatedKey)}
            </p>
          ) : null}
        </header>

        <div className="compliance-page-body mt-10 sm:mt-12">
          {children}
          <ComplianceContactFooter />
        </div>
      </div>
    </PageContainer>
  );
}

export function ComplianceSection({
  titleKey,
  children,
}: {
  titleKey: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <section className="compliance-section">
      <h2 className="compliance-section-title font-heading text-[1.25rem] font-semibold tracking-[-0.02em] text-navy sm:text-[1.375rem]">
        {t(titleKey)}
      </h2>
      <div className="compliance-section-body mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function ComplianceParagraph({ textKey }: { textKey: string }) {
  const { t } = useLanguage();
  return <p className="compliance-paragraph type-body text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">{t(textKey)}</p>;
}

export function ComplianceList({ itemKeys }: { itemKeys: readonly string[] }) {
  const { t } = useLanguage();
  return (
    <ul className="compliance-list mt-1 space-y-2.5 pl-0">
      {itemKeys.map((key) => (
        <li key={key} className="compliance-list-item flex gap-3 text-[15px] leading-[1.7] text-slate-600 sm:text-[16px]">
          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/75" aria-hidden />
          <span>{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}

export function ComplianceMloCard({
  nameKey,
  roleKey,
  nmlsId,
  nmlsUrl,
}: {
  nameKey: string;
  roleKey: string;
  nmlsId: string;
  nmlsUrl: string;
}) {
  const { t } = useLanguage();

  return (
    <article className="compliance-mlo-card rounded-[4px] border border-slate-200/90 bg-white p-5 shadow-[0_2px_12px_rgba(10,25,47,0.04)]">
      <h3 className="font-heading text-[1.0625rem] font-semibold tracking-[-0.02em] text-navy">
        {t(nameKey)}
      </h3>
      <p className="mt-1 font-sans text-[13px] font-medium text-gold">{t(roleKey)}</p>
      <p className="compliance-mlo-nmls mt-3 font-sans text-[14px] text-slate-600">
        NMLS ID:{" "}
        <a href={nmlsUrl} target="_blank" rel="noopener noreferrer" className="compliance-inline-link">
          {nmlsId}
        </a>
      </p>
    </article>
  );
}

export function ComplianceContactFooter() {
  const { t } = useLanguage();

  return (
    <section className="compliance-contact-footer" aria-labelledby="compliance-contact-footer-title">
      <div className="compliance-contact-footer-divider h-px w-full bg-gold/40" aria-hidden />
      <h2
        id="compliance-contact-footer-title"
        className="compliance-contact-footer-title mt-8 font-heading text-[1.25rem] font-semibold tracking-[-0.02em] text-navy sm:text-[1.375rem]"
      >
        {t("compliance.footer.title")}
      </h2>
      <p className="compliance-paragraph mt-4 type-body text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
        {t("compliance.footer.body")}
      </p>
      <p className="compliance-contact-line mt-5">
        <a href="mailto:Info@infinitehomelending.com">Info@infinitehomelending.com</a>
        <br />
        <a href="tel:+13015077609">(301) 507-7609</a>
      </p>
    </section>
  );
}
