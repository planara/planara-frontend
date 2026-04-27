import {
  AddRegular,
  ArrowRightRegular,
  BoxRegular,
  FolderOpenRegular,
  FolderRegular,
  SettingsRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { routeNames } from '@/shared/constants/host-names.ts';

const mockProjects = [
  {
    id: '1',
    name: 'Demo workspace',
    description: 'Тестовый проект для проверки интерфейса редактора',
    updatedAt: 'Сегодня',
  },
  {
    id: '2',
    name: 'Product scene',
    description: 'Черновик сцены с объектами и материалами',
    updatedAt: 'Вчера',
  },
  {
    id: '3',
    name: 'Landing preview',
    description: 'Визуальная сцена для промо-страницы',
    updatedAt: '3 дня назад',
  },
];

export const HomePage = () => {
  const navigate = useNavigate();

  const projectsCount = mockProjects.length;
  const lastProject = mockProjects[0];

  return (
    <AppShell>
      <main className="home-page">
        <section className="home-hero">
          <div className="home-hero__content">
            <div className="home-hero__badge">
              <SparkleRegular />
              <span>Planara workspace</span>
            </div>

            <h1 className="home-hero__title">
              Управляйте 3D-проектами в одном чистом пространстве
            </h1>

            <p className="home-hero__subtitle">
              Создавайте проекты, возвращайтесь к последним сценам и переходите в редактор без
              лишних действий.
            </p>

            <div className="home-hero__actions">
              <button className="home-button home-button--dark" type="button">
                <AddRegular />
                <span>Создать проект</span>
              </button>

              <button
                className="home-button home-button--light"
                type="button"
                onClick={() => navigate(routeNames.PROJECTS_PAGE)}
              >
                <span>Открыть проекты</span>
                <ArrowRightRegular />
              </button>
            </div>

            <div className="home-hero__stats">
              <div className="home-stat">
                <span className="home-stat__value">{projectsCount}</span>
                <span className="home-stat__label">Всего проектов</span>
              </div>

              <div className="home-stat">
                <span className="home-stat__value">{lastProject?.updatedAt || '—'}</span>
                <span className="home-stat__label">Последнее обновление</span>
              </div>
            </div>
          </div>

          <div className="home-hero__visual" aria-label="Превью редактора">
            <div className="home-editor">
              <div className="home-editor__topbar">
                <div className="home-editor__dots">
                  <span />
                  <span />
                  <span />
                </div>

                <span className="home-editor__title">Scene preview</span>
              </div>

              <div className="home-editor__viewport">
                <div className="home-editor__grid" />

                <div className="home-editor__panel home-editor__panel--left">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="home-editor__panel home-editor__panel--right">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="home-editor__object">
                  <div className="home-editor__ring" />
                  <div className="home-editor__sphere" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section__header">
            <div>
              <p className="home-section__eyebrow">Обзор</p>
              <h2 className="home-section__title">Рабочее пространство</h2>
            </div>

            <button
              className="home-section__link"
              type="button"
              onClick={() => navigate(routeNames.PROJECTS_PAGE)}
            >
              Все проекты
              <ArrowRightRegular />
            </button>
          </div>

          <div className="home-overview">
            <article className="home-overview-card home-overview-card--dark">
              <div className="home-overview-card__icon">
                <FolderRegular />
              </div>

              <div>
                <p className="home-overview-card__label">Всего проектов</p>
                <p className="home-overview-card__value">{projectsCount}</p>
              </div>
            </article>

            <article className="home-overview-card">
              <div className="home-overview-card__icon">
                <FolderOpenRegular />
              </div>

              <div>
                <p className="home-overview-card__label">Последний проект</p>
                <p className="home-overview-card__title">{lastProject?.name || 'Нет проектов'}</p>
                <p className="home-overview-card__text">
                  {lastProject?.updatedAt || 'Создайте первый проект'}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="home-dashboard">
          <div className="home-projects">
            <div className="home-card-header">
              <div>
                <p className="home-section__eyebrow">Проекты</p>
                <h2 className="home-card-header__title">Недавние сцены</h2>
              </div>
            </div>

            <div className="home-projects__list">
              {mockProjects.map((project) => (
                <button key={project.id} className="home-project" type="button">
                  <span className="home-project__icon">
                    <FolderRegular />
                  </span>

                  <span className="home-project__content">
                    <span className="home-project__name">{project.name}</span>
                    <span className="home-project__description">{project.description}</span>
                  </span>

                  <span className="home-project__date">{project.updatedAt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="home-actions">
            <div className="home-card-header">
              <div>
                <p className="home-section__eyebrow">Действия</p>
                <h2 className="home-card-header__title">Быстрый старт</h2>
              </div>
            </div>

            <div className="home-actions__grid">
              <button className="home-action" type="button">
                <span className="home-action__icon">
                  <AddRegular />
                </span>

                <span>
                  <span className="home-action__title">Создать проект</span>
                  <span className="home-action__text">Открыть новое рабочее пространство.</span>
                </span>
              </button>

              <button
                className="home-action"
                type="button"
                onClick={() => navigate(routeNames.PROJECTS_PAGE)}
              >
                <span className="home-action__icon">
                  <FolderOpenRegular />
                </span>

                <span>
                  <span className="home-action__title">Все проекты</span>
                  <span className="home-action__text">Перейти к сохраненным сценам.</span>
                </span>
              </button>

              <button
                className="home-action"
                type="button"
                onClick={() => navigate(routeNames.SETTINGS_PAGE)}
              >
                <span className="home-action__icon">
                  <SettingsRegular />
                </span>

                <span>
                  <span className="home-action__title">Профиль</span>
                  <span className="home-action__text">Настроить имя, username и аватар.</span>
                </span>
              </button>

              <button className="home-action" type="button">
                <span className="home-action__icon">
                  <BoxRegular />
                </span>

                <span>
                  <span className="home-action__title">Редактор</span>
                  <span className="home-action__text">Вернуться к работе со сценой.</span>
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
};

export default HomePage;
