// Shared
import { features } from '@/shared';

const LandingFeatures = () => {
  return (
    <section id="features" className="landing-section">
      <div className="landing-section__header">
        <div>
          <p className="landing-section__eyebrow">Возможности</p>
          <h2 className="landing-section__title">База для работы со сценами</h2>
        </div>
      </div>

      <div className="landing-features">
        {features.map((feature) => (
          <article key={feature.title} className="landing-feature-card">
            <div className="landing-feature-card__icon">{feature.icon}</div>

            <h3 className="landing-feature-card__title">{feature.title}</h3>

            <p className="landing-feature-card__description">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;
