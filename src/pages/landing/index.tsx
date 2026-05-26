// Routing
import { Link } from 'react-router-dom';
// Icons
import { ArrowRightRegular } from '@fluentui/react-icons';
// Shared
import { routeNames } from '@/shared';
// Components
import { SiteShell } from '@/components';
import {
  LandingHeader,
  LandingHero,
  LandingShowcase,
  LandingFeatures,
  LandingEditingFeatures,
  LandingWorkflow,
  LandingSdk,
} from '@/components/landing';

export const LandingPage = () => {
  return (
    <SiteShell>
      <main className="landing-page">
        <LandingHeader />

        <LandingHero />

        <LandingShowcase />

        <LandingFeatures />

        <LandingEditingFeatures />

        <LandingWorkflow />

        <LandingSdk />

        <section className="landing-cta">
          <div>
            <p className="landing-section__eyebrow">Начать работу</p>
            <h2 className="landing-cta__title">Создайте первый проект</h2>
          </div>

          <Link className="landing-button landing-button--light" to={routeNames.REGISTER_PAGE}>
            <span>Перейти в приложение</span>
            <ArrowRightRegular />
          </Link>
        </section>
      </main>
    </SiteShell>
  );
};

export default LandingPage;
