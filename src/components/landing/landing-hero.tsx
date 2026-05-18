// Components
import { UiBadge } from '@/components';
// Icons
import { ArrowRightRegular, DocumentRegular, SparkleRegular } from '@fluentui/react-icons';
// Routing
import { Link } from 'react-router-dom';
// Shared
import { routeNames } from '@/shared';

const LandingHero = () => {
  return (
    <section className="landing-hero">
      <div className="landing-hero__content">
        <UiBadge icon={<SparkleRegular />} className="landing-hero__badge">
          Planara editor
        </UiBadge>

        <h1 className="landing-hero__title">Веб-редактор для работы с 3D-сценами</h1>

        <p className="landing-hero__subtitle">
          Planara объединяет личный кабинет, проекты, браузерный 3D-редактор и SDK-пакеты для
          интеграции редактора в React-приложения.
        </p>

        <div className="landing-hero__actions">
          <Link className="landing-button landing-button--dark" to={routeNames.REGISTER_PAGE}>
            <span>Создать аккаунт</span>
            <ArrowRightRegular />
          </Link>

          <Link className="landing-button landing-button--light" to="/sdk">
            <DocumentRegular />
            <span>Смотреть SDK</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
