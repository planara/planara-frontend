// Routing
import { useNavigate } from 'react-router-dom';
// Icons
import {
  AddRegular,
  ArrowRightRegular,
  BeakerRegular,
  BoxRegular,
  FolderOpenRegular,
  FolderRegular,
  SettingsRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
// Components
import { AppShell, UiPageHero } from '@/components';
// Hooks
import { useProjects } from '@/hooks';
// Shared
import { formatDate, routeNames } from '@/shared';

const RECENT_PROJECTS_COUNT = 3;

export const HomePage = () => {
  const navigate = useNavigate();

  const { projects, totalCount, projectsLoading } = useProjects(undefined, RECENT_PROJECTS_COUNT);

  const lastProject = projects[0];

  const openCreateProjectPage = () => {
    navigate(routeNames.CREATE_PROJECT_PAGE);
  };

  const openLastProject = () => {
    if (!lastProject) {
      navigate(routeNames.PROJECTS_PAGE);
      return;
    }

    navigate(`/projects/${lastProject.id}/preview`);
  };

  return (
    <AppShell>
      <main className="home-page">
        <UiPageHero
          badgeIcon={<SparkleRegular />}
          badge="Planara workspace"
          title="Управляйте 3D-проектами в одном чистом пространстве"
          subtitle="Создавайте проекты, возвращайтесь к последним сценам и переходите в редактор без
              лишних действий."
        />

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
                <p className="home-overview-card__value">{projectsLoading ? '—' : totalCount}</p>
              </div>
            </article>

            <article className="home-overview-card">
              <div className="home-overview-card__icon">
                <FolderOpenRegular />
              </div>

              <div>
                <p className="home-overview-card__label">Последний проект</p>
                <p className="home-overview-card__title">
                  {projectsLoading ? 'Загрузка...' : lastProject?.name || 'Нет проектов'}
                </p>
                <p className="home-overview-card__text">
                  {projectsLoading
                    ? 'Получаем список проектов'
                    : lastProject
                      ? formatDate(lastProject.updatedAt ?? lastProject.createdAt)
                      : 'Создайте первый проект'}
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
              {projectsLoading ? (
                <div className="home-project home-project--empty">
                  <span className="home-project__icon">
                    <FolderRegular />
                  </span>

                  <span className="home-project__content">
                    <span className="home-project__name">Загрузка проектов</span>
                    <span className="home-project__description">Получаем последние сцены.</span>
                  </span>
                </div>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    className="home-project"
                    type="button"
                    onClick={() => navigate(`/projects/${project.id}/preview`)}
                  >
                    <span className="home-project__icon">
                      <FolderRegular />
                    </span>

                    <span className="home-project__content">
                      <span className="home-project__name">{project.name}</span>
                      <span className="home-project__description">
                        {project.description || 'Описание проекта пока не добавлено.'}
                      </span>
                    </span>

                    <span className="home-project__date">
                      {formatDate(project.updatedAt ?? project.createdAt)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="home-project home-project--empty">
                  <span className="home-project__icon">
                    <FolderRegular />
                  </span>

                  <span className="home-project__content">
                    <span className="home-project__name">Проектов пока нет</span>
                    <span className="home-project__description">
                      Создайте первый проект, чтобы начать работу.
                    </span>
                  </span>
                </div>
              )}
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
              <button className="home-action" type="button" onClick={openCreateProjectPage}>
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

              <button className="home-action" type="button" onClick={openLastProject}>
                <span className="home-action__icon">
                  <BoxRegular />
                </span>

                <span>
                  <span className="home-action__title">Редактор</span>
                  <span className="home-action__text">
                    {lastProject ? 'Вернуться к последней сцене.' : 'Сначала создайте проект.'}
                  </span>
                </span>
              </button>

              <button
                className="home-action"
                type="button"
                onClick={() => navigate(routeNames.BENCHMARK_RUNS_PAGE)}
              >
                <span className="home-action__icon">
                  <BeakerRegular />
                </span>

                <span>
                  <span className="home-action__title">Бенчмарк</span>
                  <span className="home-action__text">
                    Запустить тест производительности редактора.
                  </span>
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
