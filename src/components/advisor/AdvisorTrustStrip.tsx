import { Fragment } from "react";
import { useAdvisor } from "../../context/AdvisorContext";
import { useLanguage } from "../../i18n/LanguageContext";

export function AdvisorTrustStrip({ className = "" }: { className?: string }) {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();

  const items = [
    t("advisor.trustStrip.company"),
    t("advisor.trustStrip.brokerage"),
    t("advisor.trustStrip.languages"),
    `${t(advisor.nameKey)} NMLS #${advisor.nmlsId}`,
  ];

  return (
    <div
      className={`advisor-trust-strip w-full bg-[#1B2A4A] border-t border-[#C9A84C]/35 ${className}`.trim()}
      role="region"
      aria-label={t("advisor.trustStrip.ariaLabel")}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center px-4 py-3 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-y-2">
          {items.map((label, index) => (
            <Fragment key={label}>
              {index > 0 ? (
                <li
                  className="mx-2.5 hidden h-4 w-px shrink-0 bg-[#C9A84C]/45 sm:mx-3 sm:block"
                  aria-hidden="true"
                />
              ) : null}
              <li className="flex items-center px-1 sm:px-0">
                <span className="text-center text-[12px] font-medium tracking-wide text-white/95 sm:text-[13px]">
                  {label}
                </span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
