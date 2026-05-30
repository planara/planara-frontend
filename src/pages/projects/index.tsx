// Core
import { useMemo } from 'react';
// Routing
import { useNavigate } from 'react-router-dom';
// Icons
import { AddRegular, CalendarRegular, FolderRegular, SparkleRegular } from '@fluentui/react-icons';
// Components
import { AppShell, UiLoadMore, UiLoader, UiPageHero, UiIconBox, ProjectCard } from '@/components';
// Hooks
import { useAlerts, useLoading, useProjects } from '@/hooks';
// Types
import { AlertPosition, AlertStatus, UiIconBoxVariant } from '@/types';
// Shared
import { routeNames, formatDate } from '@/shared';

export const ProjectsPage = () => {
  const navigate = useNavigate();

  const { addAlert } = useAlerts();

  const { startLoading, stopLoading } = useLoading();

  const {
    projects,
    totalCount,
    pageInfo,
    loading,
    error,
    loadingMore,
    loadMoreProjects,
    refetchProjects,
    deleteProject,
  } = useProjects();

  const lastUpdatedProject = useMemo(() => {
    return [...projects].sort((a, b) => {
      const firstDate = new Date(a.updatedAt ?? a.createdAt).getTime();
      const secondDate = new Date(b.updatedAt ?? b.createdAt).getTime();

      return secondDate - firstDate;
    })[0];
  }, [projects]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      startLoading();

      const response = await deleteProject({
        projectId: projectId,
      });

      if (!response?.success) {
        addAlert('Не удалось удалить проект', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      addAlert('Проект удалён', AlertStatus.Success, AlertPosition.TopRight);
      await refetchProjects();

      navigate(routeNames.PROJECTS_PAGE);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось удалить проект', AlertStatus.Error, AlertPosition.TopRight);
    } finally {
      stopLoading();
    }

    addAlert('Проект удалён', AlertStatus.Success, AlertPosition.TopRight);
  };

  const isInitialLoading = loading && projects.length === 0;

  return (
    <AppShell>
      <main className="projects-page">
        <UiPageHero
          badgeIcon={<SparkleRegular />}
          badge="Проекты"
          title="Ваши 3D-проекты"
          subtitle="Создавайте рабочие пространства, открывайте сохранённые сцены и управляйте проектами
              редактора."
        />

        <section className="projects-overview">
          <article className="projects-stat projects-stat--dark">
            <UiIconBox icon={<FolderRegular />} />

            <div>
              <p className="projects-stat__label">Всего загружено</p>
              <p className="projects-stat__value">{totalCount}</p>
            </div>
          </article>

          <article className="projects-stat">
            <UiIconBox icon={<CalendarRegular />} variant={UiIconBoxVariant.Light} />

            <div>
              <p className="projects-stat__label">Последнее обновление</p>

              <p className="projects-stat__date">
                {lastUpdatedProject
                  ? formatDate(lastUpdatedProject.updatedAt ?? lastUpdatedProject.createdAt)
                  : '—'}
              </p>
            </div>
          </article>
        </section>

        <section className="projects-panel">
          <div className="projects-panel__header">
            <div>
              <p className="projects-section__eyebrow">Список проектов</p>
              <h2 className="projects-panel__title">Рабочие пространства</h2>
            </div>

            <button
              className="projects-panel__create"
              type="button"
              onClick={() => navigate(routeNames.CREATE_PROJECT_PAGE)}
            >
              <AddRegular />
              <span>Новый проект</span>
            </button>
          </div>

          {isInitialLoading ? (
            <div className="projects-state">
              <UiLoader size="large" centered label="Загружаем проекты" />
            </div>
          ) : error ? (
            <div className="projects-empty">
              <div className="projects-empty__icon">
                <FolderRegular />
              </div>

              <h3 className="projects-empty__title">Не удалось загрузить проекты</h3>

              <p className="projects-empty__text">
                Проверьте подключение к интернету или попробуйте обновить страницу.
              </p>

              <button
                className="projects-button projects-button--dark"
                type="button"
                onClick={() => refetchProjects()}
              >
                <span>Повторить</span>
              </button>
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="projects-grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={() => navigate(`/projects/${project.id}/preview`)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ))}
              </div>

              <UiLoadMore
                hasNextPage={pageInfo?.hasNextPage}
                loading={loadingMore}
                onLoadMore={loadMoreProjects}
                label="Загрузить ещё"
                endLabel="Все проекты загружены"
              />
            </>
          ) : (
            <div className="projects-empty">
              <div className="projects-empty__icon">
                <FolderRegular />
              </div>

              <h3 className="projects-empty__title">Проектов пока нет</h3>

              <p className="projects-empty__text">
                Создайте первый проект, чтобы начать работу в редакторе Planara.
              </p>

              <button
                className="projects-button projects-button--dark"
                type="button"
                onClick={() => navigate(routeNames.CREATE_PROJECT_PAGE)}
              >
                <AddRegular />
                <span>Создать проект</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
};

export default ProjectsPage;
