// Components
import {
  BoxRegular,
  FolderRegular,
  HomeRegular,
  PersonRegular,
  SettingsRegular,
} from '@fluentui/react-icons';
// Routing
import { NavLink, useNavigate } from 'react-router-dom';
import { routeNames } from '@/shared/constants/host-names';

const navItems = [
  {
    title: 'Главная',
    path: routeNames.HOME_PAGE,
    icon: <HomeRegular />,
  },
  {
    title: 'Проекты',
    path: routeNames.PROJECTS_PAGE,
    icon: <FolderRegular />,
  },
  {
    title: 'Настройки',
    path: routeNames.SETTINGS_PAGE,
    icon: <SettingsRegular />,
  },
];

export const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <button
          className="app-header__brand"
          type="button"
          onClick={() => navigate(routeNames.HOME_PAGE)}
        >
          <span className="app-header__logo">
            <BoxRegular />
          </span>

          <span className="app-header__brand-text">
            <span className="app-header__brand-name">Planara</span>
            <span className="app-header__brand-caption">3D workspace</span>
          </span>
        </button>

        <nav className="app-header__nav" aria-label="Главная навигация">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === routeNames.HOME_PAGE}
              className={({ isActive }) =>
                ['app-header__nav-link', isActive ? 'app-header__nav-link--active' : ''].join(' ')
              }
            >
              <span className="app-header__nav-icon">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="app-header__profile"
          type="button"
          onClick={() => navigate(routeNames.SETTINGS_PAGE)}
          aria-label="Открыть профиль"
        >
          <PersonRegular />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
