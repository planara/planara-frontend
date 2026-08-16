// Routing
import { Link } from 'react-router-dom';
// Shared
import { routeNames } from '@/shared';
// Icons
import { GithubIcon } from '@/assets/icons';

export const AppFooter = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div>
          <p className="app-footer__brand">Planara</p>
          <p className="app-footer__text">Веб-пространство для создания и управления 3D-сценами.</p>
        </div>

        <div className="app-footer__right">
          <nav className="app-footer__links" aria-label="Правовая информация">
            <Link to={routeNames.TERMS_PAGE}>Правила пользования</Link>
            <Link to={routeNames.PRIVACY_POLICY_PAGE}>Конфиденциальность</Link>
          </nav>

          <div className="app-footer__meta">
            <span>© {new Date().getFullYear()} Planara</span>
            <span>React · Three.js · TypeScript</span>

            <a
              className="app-footer__github"
              href="https://github.com/planara"
              target="_blank"
              rel="noreferrer"
              aria-label="Открыть GitHub"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
