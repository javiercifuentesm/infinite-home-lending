type Props = {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  id?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  headlineClassName?: string;
};

export function AdvisorAboutSectionHeader({
  eyebrow,
  headline,
  intro,
  id,
  align = "center",
  as: HeadingTag = "h2",
  headlineClassName = "type-editorial-section-title text-navy advisor-about-section-header__headline",
}: Props) {
  return (
    <header
      className={`advisor-about-section-header advisor-about-section-header--${align}`.trim()}
    >
      {eyebrow ? (
        <p className="type-eyebrow text-gold advisor-about-section-header__eyebrow">{eyebrow}</p>
      ) : null}
      {headline ? (
        <HeadingTag id={id} className={headlineClassName}>
          {headline}
        </HeadingTag>
      ) : id ? (
        <span id={id} className="sr-only">
          {eyebrow}
        </span>
      ) : null}
      <div className="advisor-about-section-header__rule" aria-hidden />
      {intro ? (
        <p className="type-body-lg text-slate-600 advisor-about-section-header__intro">{intro}</p>
      ) : null}
    </header>
  );
}
