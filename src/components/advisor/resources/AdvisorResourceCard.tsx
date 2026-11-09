import type { AdvisorResourceResolved } from "../../../data/advisorResourcesCatalog";
import { useLanguage } from "../../../i18n/LanguageContext";
import { AdvisorResourceExploreControl } from "./AdvisorResourceExploreControl";

type FeaturedPrimaryProps = {
  resource: AdvisorResourceResolved;
  chapter: string;
};

export function AdvisorResourceFeaturedPrimary({ resource, chapter }: FeaturedPrimaryProps) {
  const { t } = useLanguage();

  return (
    <article className="advisor-resource-featured-primary">
      <p className="advisor-resource-chapter" aria-hidden>
        {chapter}
      </p>
      <p className="advisor-resource-kicker">{t(resource.pathTitleKey)}</p>
      <h3 className="advisor-resource-featured-primary__title">{resource.title}</h3>
      <p className="advisor-resource-featured-primary__desc">{resource.description}</p>
      <AdvisorResourceExploreControl
        resource={resource}
        className="advisor-resource-cta advisor-resource-cta--primary"
        arrowSize={16}
      />
    </article>
  );
}

type FeaturedRowProps = {
  resource: AdvisorResourceResolved;
  chapter: string;
};

export function AdvisorResourceFeaturedRow({ resource, chapter }: FeaturedRowProps) {
  const { t } = useLanguage();

  return (
    <article className="advisor-resource-featured-row">
      <div className="advisor-resource-featured-row__meta">
        <p className="advisor-resource-chapter advisor-resource-chapter--sm" aria-hidden>
          {chapter}
        </p>
        <p className="advisor-resource-kicker">{t(resource.pathTitleKey)}</p>
      </div>
      <div className="advisor-resource-featured-row__copy">
        <h3 className="advisor-resource-featured-row__title">{resource.title}</h3>
        <p className="advisor-resource-featured-row__desc">{resource.description}</p>
      </div>
      <AdvisorResourceExploreControl resource={resource} arrowSize={15} />
    </article>
  );
}

type JourneyStepProps = {
  resource: AdvisorResourceResolved;
  step: number;
  showConnector?: boolean;
};

export function AdvisorResourceJourneyStep({
  resource,
  step,
  showConnector = false,
}: JourneyStepProps) {
  const chapter = String(step).padStart(2, "0");

  return (
    <li className="advisor-resources-journey__item">
      <article className="advisor-resources-journey__step">
        <p className="advisor-resource-chapter" aria-hidden>
          {chapter}
        </p>
        <h3 className="advisor-resources-journey__title">{resource.title}</h3>
        <p className="advisor-resources-journey__desc">{resource.description}</p>
        <AdvisorResourceExploreControl resource={resource} arrowSize={14} />
      </article>
      {showConnector ? <div className="advisor-resources-journey__connector" aria-hidden /> : null}
    </li>
  );
}

type ChapterRowProps = {
  resource: AdvisorResourceResolved;
  chapter: string;
  tone?: "light" | "warm";
};

export function AdvisorResourceChapterRow({
  resource,
  chapter,
  tone = "light",
}: ChapterRowProps) {
  const { t } = useLanguage();

  return (
    <article className={`advisor-resource-chapter-row advisor-resource-chapter-row--${tone}`}>
      <div className="advisor-resource-chapter-row__left">
        <p className="advisor-resource-chapter" aria-hidden>
          {chapter}
        </p>
        <p className="advisor-resource-kicker">{t(resource.pathTitleKey)}</p>
      </div>
      <div className="advisor-resource-chapter-row__center">
        <h3 className="advisor-resource-chapter-row__title">{resource.title}</h3>
        <p className="advisor-resource-chapter-row__desc">{resource.description}</p>
      </div>
      <div className="advisor-resource-chapter-row__right">
        <AdvisorResourceExploreControl resource={resource} arrowSize={15} />
      </div>
    </article>
  );
}
