// Core
import { useMemo, useState } from 'react';
// Routing
import { useNavigate } from 'react-router-dom';
// Icons
import {
  AddRegular,
  ArrowRightRegular,
  CalendarRegular,
  DeleteRegular,
  FolderRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
// Components
import { AppShell, UiModal, CreateProjectModal, UiLoadMore, UiLoader } from '@/components';
// Hooks
import { useAlerts, useProjects } from '@/hooks';
// Types
import { AlertPosition, AlertStatus } from '@/types';

type CreateProjectData = {
  name: string;
  description: string;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Не обновлялся';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const ProjectsPage = () => {
  const navigate = useNavigate();

  const { addAlert } = useAlerts();

  const { projects, pageInfo, loading, error, loadingMore, loadMoreProjects, refetchProjects } =
    useProjects();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const lastUpdatedProject = useMemo(() => {
    return [...projects].sort((a, b) => {
      const firstDate = new Date(a.updatedAt ?? a.createdAt).getTime();
      const secondDate = new Date(b.updatedAt ?? b.createdAt).getTime();

      return secondDate - firstDate;
    })[0];
  }, [projects]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateProject = async (data: CreateProjectData) => {
    if (!data.name.trim()) {
      addAlert('Введите название проекта', AlertStatus.Error, AlertPosition.TopRight);
      return;
    }

    /**
     * TODO:
     * Здесь лучше вызвать createProject mutation.
     *
     * await createProject({
     *   name: data.name.trim(),
     *   description: data.description.trim() || null,
     * });
     */

    closeCreateModal();

    await refetchProjects();

    addAlert('Проект создан', AlertStatus.Success, AlertPosition.TopRight);
  };

  const handleDeleteProject = async (projectId: string) => {
    /**
     * TODO:
     * Здесь лучше вызвать deleteProject mutation.
     *
     * await deleteProject(projectId);
     */

    console.log('delete project:', projectId);

    await refetchProjects();

    addAlert('Проект удалён', AlertStatus.Success, AlertPosition.TopRight);
  };

  const isInitialLoading = loading && projects.length === 0;

  return (
    <AppShell>
      <main className="projects-page">
        <section className="projects-hero">
          <div className="projects-hero__content">
            <div className="projects-hero__badge">
              <SparkleRegular />
              <span>Проекты Planara</span>
            </div>

            <h1 className="projects-hero__title">Ваши 3D-проекты</h1>

            <p className="projects-hero__subtitle">
              Создавайте рабочие пространства, открывайте сохранённые сцены и управляйте проектами
              редактора.
            </p>
          </div>

          <div className="projects-hero__actions">
            <button
              className="projects-button projects-button--dark"
              type="button"
              onClick={openCreateModal}
            >
              <AddRegular />
              <span>Создать проект</span>
            </button>
          </div>
        </section>

        <section className="projects-overview">
          <article className="projects-stat projects-stat--dark">
            <div className="projects-stat__icon">
              <FolderRegular />
            </div>

            <div>
              <p className="projects-stat__label">Всего загружено</p>
              <p className="projects-stat__value">{projects.length}</p>
            </div>
          </article>

          <article className="projects-stat">
            <div className="projects-stat__icon">
              <CalendarRegular />
            </div>

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

            <button className="projects-panel__create" type="button" onClick={openCreateModal}>
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
                Проверьте подключение к серверу или попробуйте обновить страницу.
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
                  <article key={project.id} className="project-card">
                    <div className="project-card__preview">
                      <div className="project-card__grid" />

                      <div className="project-card__object">
                        <div className="project-card__ring" />
                        <div className="project-card__sphere" />
                      </div>
                    </div>

                    <div className="project-card__body">
                      <div className="project-card__top">
                        <div className="project-card__content">
                          <h3 className="project-card__title">{project.name}</h3>

                          <p className="project-card__description">
                            {project.description || 'Описание проекта пока не добавлено.'}
                          </p>
                        </div>

                        <button
                          className="project-card__delete"
                          type="button"
                          aria-label="Удалить проект"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <DeleteRegular />
                        </button>
                      </div>

                      <div className="project-card__meta">
                        <span>
                          <CalendarRegular />
                          Создан: {formatDate(project.createdAt)}
                        </span>
                      </div>

                      <div className="project-card__footer">
                        <span className="project-card__updated">
                          Обновлен: {formatDate(project.updatedAt)}
                        </span>

                        <button
                          className="project-card__open"
                          type="button"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <span>Открыть</span>
                          <ArrowRightRegular />
                        </button>
                      </div>
                    </div>
                  </article>
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
                onClick={openCreateModal}
              >
                <AddRegular />
                <span>Создать проект</span>
              </button>
            </div>
          )}
        </section>
      </main>

      <UiModal open={isCreateModalOpen} onClose={closeCreateModal}>
        <CreateProjectModal onClose={closeCreateModal} onCreate={handleCreateProject} />
      </UiModal>
    </AppShell>
  );
};

export default ProjectsPage;
