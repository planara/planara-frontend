// Shared
import { features } from '@/shared';
// Components
import { UiIconBox } from '@/components';
// Types
import { UiIconBoxVariant } from '@/types';

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
            <UiIconBox icon={feature.icon} variant={UiIconBoxVariant.Dark} />

            <h3 className="landing-feature-card__title">{feature.title}</h3>

            <p className="landing-feature-card__description">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;
