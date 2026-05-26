// Routing
import { Link } from 'react-router-dom';
// Shared
import { routeNames } from '@/shared';

const LandingHeader = () => {
  return (
    <header className="landing-header">
      <Link className="landing-header__brand" to={routeNames.LANDING_PAGE}>
        <span className="landing-header__logo">P</span>

        <span className="landing-header__brand-text">
          <span className="landing-header__brand-name">Planara</span>
          <span className="landing-header__brand-caption">3D workspace</span>
        </span>
      </Link>

      <nav className="landing-header__nav" aria-label="Главная навигация">
        <a href="#editor">Редактор</a>
        <a href="#geometry">Геометрия</a>
        <a href="#sdk">SDK</a>
      </nav>

      <div className="landing-header__actions">
        <Link className="landing-header__link" to={routeNames.LOGIN_PAGE}>
          Войти
        </Link>

        <Link className="landing-header__button" to={routeNames.REGISTER_PAGE}>
          Начать
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
