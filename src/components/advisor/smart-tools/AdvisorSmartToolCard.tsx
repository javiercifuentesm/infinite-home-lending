import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { SmartToolCatalogEntry } from "../../../data/smartToolsCatalog";

export type AdvisorSmartToolCardVariant = "default" | "primary" | "secondary";

type Props = {
  tool: SmartToolCatalogEntry;
  variant?: AdvisorSmartToolCardVariant;
};

export function AdvisorSmartToolCard({ tool, variant = "default" }: Props) {
  const { t } = useLanguage();
  const Icon = tool.icon;
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const showBadge = isPrimary || isSecondary;

  return (
    <article
      className={`advisor-smart-tool-card advisor-smart-tool-card--${variant}`}
    >
      <div className="advisor-smart-tool-card__top">
        <div className="advisor-smart-tool-card__icon" aria-hidden>
          <Icon className="advisor-smart-tool-card__icon-svg" strokeWidth={1.5} />
        </div>
        {showBadge ? (
          <p className="advisor-smart-tool-card__badge">
            {isPrimary
              ? t("advisor.smartTools.featuredBadge")
              : t("advisor.smartTools.secondaryBadge")}
          </p>
        ) : null}
      </div>
      <div className="advisor-smart-tool-card__body">
        <h3 className="advisor-smart-tool-card__title">{t(tool.nameKey)}</h3>
        <p className="advisor-smart-tool-card__desc">{t(tool.descKey)}</p>
      </div>
      <Link to={tool.path} className="advisor-smart-tool-card__cta">
        <span>{t("advisor.smartTools.launch")}</span>
        <ArrowRight size={isPrimary ? 17 : 15} strokeWidth={2} aria-hidden />
      </Link>
    </article>
  );
}
