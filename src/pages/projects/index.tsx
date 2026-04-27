import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddRegular,
  ArrowRightRegular,
  CalendarRegular,
  DeleteRegular,
  FolderRegular,
  SparkleRegular,
} from '@fluentui/react-icons';

import { AppShell } from '@/components/layout/app-shell';
import UiModal from '@/components/modal/ui-modal';
import CreateProjectModal from '@/components/modal/project/create-project-modal';

import { useAlerts } from '@/hooks/layout/use-alerts';

import { AlertPosition } from '@/types/layout/alert/alert-position';
import { AlertStatus } from '@/types/layout/alert/alert-status';

type ProjectResponse = {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string;
  createdAt: string;
  updatedAt: string | null;
};

type CreateProjectData = {
  name: string;
  description: string;
};

const mockProjects: ProjectResponse[] = [
  {
    id: '6a88c519-d442-42a4-8b6e-4f991ea04601',
    name: 'Demo workspace',
    description: 'Тестовый проект для проверки интерфейса редактора и базовых инструментов сцены.',
    fileUrl: '/api/projects/6a88c519-d442-42a4-8b6e-4f991ea04601/file',
    createdAt: '2026-04-18T12:30:00Z',
    updatedAt: '2026-04-27T10:15:00Z',
  },
  {
    id: '01a8c3ef-0f08-4c1d-9889-75b89f5d8a17',
    name: 'Product scene',
    description: 'Черновик сцены с материалами, освещением и несколькими объектами.',
    fileUrl: '/api/projects/01a8c3ef-0f08-4c1d-9889-75b89f5d8a17/file',
    createdAt: '2026-04-12T08:45:00Z',
    updatedAt: '2026-04-26T18:20:00Z',
  },
  {
    id: '32732d3b-c860-4a66-8144-69751b315b1a',
    name: 'Landing preview',
    description: 'Визуальная сцена для промо-страницы и презентации возможностей редактора.',
    fileUrl: '/api/projects/32732d3b-c860-4a66-8144-69751b315b1a/file',
    createdAt: '2026-04-03T16:10:00Z',
    updatedAt: '2026-04-23T11:40:00Z',
  },
];

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

const createProjectId = () => {
  if ('crypto' in window && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }

  return String(Date.now());
};

export const ProjectsPage = () => {
  const navigate = useNavigate();

  const { addAlert } = useAlerts();

  const [projects, setProjects] = useState<ProjectResponse[]>(mockProjects);
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

  const handleCreateProject = (data: CreateProjectData) => {
    if (!data.name) {
      addAlert('Введите название проекта', AlertStatus.Error, AlertPosition.TopRight);
      return;
    }

    const id = createProjectId();
    const now = new Date().toISOString();

    const nextProject: ProjectResponse = {
      id,
      name: data.name,
      description: data.description || null,
      fileUrl: `/api/projects/${id}/file`,
      createdAt: now,
      updatedAt: now,
    };

    setProjects((prev) => [nextProject, ...prev]);
    closeCreateModal();

    addAlert('Проект создан', AlertStatus.Success, AlertPosition.TopRight);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));

    addAlert('Проект удалён', AlertStatus.Success, AlertPosition.TopRight);
  };

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
              <p className="projects-stat__label">Всего проектов</p>
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

          {projects.length > 0 ? (
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
