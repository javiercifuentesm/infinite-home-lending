function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export type GateHeroProps = {
  onStartTour?: () => void;
};

export function GateHero({ onStartTour }: GateHeroProps) {
  return (
    <section className="gate-hero">
      <div className="gate-hero__left" style={{ opacity: 1, transform: "none" }}>
        <div className="gate-hero__layer gate-hero__noise" aria-hidden />
        <div className="gate-hero__line gate-hero__line--r15" aria-hidden />
        <div className="gate-hero__line gate-hero__line--r30" aria-hidden />

        <div className="gate-hero__content">
          <div className="gate-hero__eyebrow">
            <span className="gate-hero__eyebrow-line" />
            <span className="gate-hero__eyebrow-text">Exclusive · Partner Access · MD-DC-VA</span>
          </div>

          <h1>
            <span className="sub-word">Welcome to</span>
            <em className="accent">The Deal Desk</em>
          </h1>

          <p className="gate-hero__desc">
            Five deal-math tools built exclusively for real estate professionals in Maryland, DC, and Virginia. Model buydowns, qualify buyers, rescue stale
            listings — in real time, at the deal table.
          </p>

          <div className="gate-hero__actions">
            <button type="button" className="gate-hero__btn-primary" onClick={() => scrollToId("gate-access")}>
              Enter partner code →
            </button>
            <button type="button" className="gate-hero__btn-ghost" onClick={() => scrollToId("gate-tools")}>
              Explore the tools
            </button>
          </div>
          {onStartTour ? (
            <button type="button" className="gate-hero__tour-btn" onClick={onStartTour}>
              <svg className="gate-hero__tour-icon" width={10} height={10} viewBox="0 0 10 10" aria-hidden>
                <path d="M0 0 L10 5 L0 10 Z" fill="#C6A15B" />
              </svg>
              Take the guided tour — ask the Deal Desk Assistant anything
            </button>
          ) : null}
        </div>

        <div className="gate-hero__strip">
          <div className="gate-hero__stat">
            <span className="gate-hero__stat-num">5</span>
            <span className="gate-hero__stat-label">Live tools</span>
          </div>
          <div className="gate-hero__stat">
            <span className="gate-hero__stat-num">MD · DC · VA</span>
            <span className="gate-hero__stat-label">Built for this market</span>
          </div>
          <div className="gate-hero__stat">
            <span className="gate-hero__stat-num">Free</span>
            <span className="gate-hero__stat-label">For partner agents</span>
          </div>
        </div>
      </div>

      <div className="gate-hero__right">
        <img className="gate-hero__img" src="/images/deal-desk-hero.jpg" alt="" loading="eager" decoding="async" />
        <div className="gate-hero__img-overlay gate-hero__img-overlay--edge" aria-hidden />
      </div>
    </section>
  );
}
