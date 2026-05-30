// Core
import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Icons
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  CalendarRegular,
  DeleteRegular,
  EditRegular,
  SaveRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
// Components
import {
  AppShell,
  ProjectPreviewField,
  UiButton,
  UiInput,
  UiPageHero,
  UiViewer,
} from '@/components';
// Hooks
import { useAlerts, useLoading, useProjects } from '@/hooks';
// Types
import {
  AlertPosition,
  AlertStatus,
  InputType,
  UiButtonSize,
  UiButtonVariant,
  type ProjectResponse,
} from '@/types';
// Shared
import { formatDate, routeNames } from '@/shared';

type ProjectForm = {
  name: string;
  description: string;
};

type ProjectFieldKey = keyof ProjectForm;

const PROJECT_FIELDS: ProjectFieldKey[] = ['name', 'description'];

const EMPTY_PROJECT_FORM_CHANGES: Partial<ProjectForm> = {};

const projectToForm = (project?: ProjectResponse | null): ProjectForm => {
  return {
    name: project?.name ?? '',
    description: project?.description ?? '',
  };
};

export const ProjectPreviewPage = () => {
  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();

  const {
    project,
    projectLoading,
    projectError,
    updateProject,
    deleteProject,
    updateProjectLoading,
    deleteProjectLoading,
    refetchProject,
  } = useProjects(projectId);

  const { addAlert } = useAlerts();
  const { startLoading, stopLoading } = useLoading();

  const startLoadingRef = useRef(startLoading);
  const stopLoadingRef = useRef(stopLoading);

  const [draft, setDraft] = useState<{
    projectId?: string;
    changes: Partial<ProjectForm>;
  }>({
    changes: EMPTY_PROJECT_FORM_CHANGES,
  });

  useEffect(() => {
    startLoadingRef.current = startLoading;
    stopLoadingRef.current = stopLoading;
  }, [startLoading, stopLoading]);

  const initialForm = useMemo(() => {
    return projectToForm(project);
  }, [project]);

  const formChanges = draft.projectId === project?.id ? draft.changes : EMPTY_PROJECT_FORM_CHANGES;

  const form = useMemo(() => {
    return {
      ...initialForm,
      ...formChanges,
    };
  }, [initialForm, formChanges]);

  const dirtyFields = useMemo(() => {
    return PROJECT_FIELDS.reduce(
      (acc, field) => {
        acc[field] = form[field] !== initialForm[field];
        return acc;
      },
      {} as Record<ProjectFieldKey, boolean>,
    );
  }, [form, initialForm]);

  const dirtyCount = PROJECT_FIELDS.filter((field) => dirtyFields[field]).length;
  const hasChanges = dirtyCount > 0;

  const isInitialLoading = projectLoading && !project;
  const isBusy = updateProjectLoading || deleteProjectLoading;

  const projectFileUrl = project?.fileUrl ?? null;
  const projectName = project?.name ?? '';

  const viewerSource = useMemo(() => {
    if (!projectFileUrl) {
      return null;
    }

    return {
      type: 'url' as const,
      url: projectFileUrl,
      filename: projectName,
    };
  }, [projectFileUrl, projectName]);

  useEffect(() => {
    if (isInitialLoading) {
      startLoadingRef.current();

      return () => {
        stopLoadingRef.current();
      };
    }

    stopLoadingRef.current();

    return () => {
      stopLoadingRef.current();
    };
  }, [isInitialLoading]);

  useEffect(() => {
    if (!projectError) {
      return;
    }

    addAlert('Не удалось загрузить проект', AlertStatus.Error, AlertPosition.TopRight);
  }, [projectError, addAlert]);

  const updateField = (field: ProjectFieldKey, value: string) => {
    setDraft((prev) => ({
      projectId: project?.id,
      changes: {
        ...(prev.projectId === project?.id ? prev.changes : EMPTY_PROJECT_FORM_CHANGES),
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setDraft({
      projectId: project?.id,
      changes: EMPTY_PROJECT_FORM_CHANGES,
    });
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!project || !hasChanges || isBusy) {
      return;
    }

    const projectName = form.name.trim();
    const projectDescription = form.description.trim();

    if (!projectName) {
      addAlert('Введите название проекта', AlertStatus.Error, AlertPosition.TopRight);
      return;
    }

    try {
      startLoading();

      const updatedProject = await updateProject({
        projectId: project.id,
        name: dirtyFields.name ? projectName : undefined,
        description: dirtyFields.description ? projectDescription || null : undefined,
      });

      if (!updatedProject) {
        addAlert('Не удалось обновить проект', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      await refetchProject();

      resetForm();

      addAlert('Проект обновлён', AlertStatus.Success, AlertPosition.TopRight);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось обновить проект', AlertStatus.Error, AlertPosition.TopRight);
    } finally {
      stopLoading();
    }
  };

  const handleDeleteProject = async () => {
    if (!project || isBusy) {
      return;
    }

    try {
      startLoading();

      const response = await deleteProject({
        projectId: project.id,
      });

      if (!response?.success) {
        addAlert('Не удалось удалить проект', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      addAlert('Проект удалён', AlertStatus.Success, AlertPosition.TopRight);

      navigate(routeNames.PROJECTS_PAGE);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось удалить проект', AlertStatus.Error, AlertPosition.TopRight);
    } finally {
      stopLoading();
    }
  };

  return (
    <AppShell>
      <main className="project-preview-page">
        <section className="project-preview-hero">
          <UiButton
            title="Назад"
            size={UiButtonSize.Medium}
            variant={UiButtonVariant.Light}
            icon={<ArrowLeftRegular />}
            onClick={() => navigate(routeNames.PROJECTS_PAGE)}
          >
            Проекты
          </UiButton>

          <UiPageHero
            badgeIcon={<SparkleRegular />}
            badge="Предпросмотр проекта"
            title={project?.name || 'Проект'}
            subtitle="Просмотрите сцену во viewer, измените основную информацию или перейдите к редактированию проекта."
          />
        </section>

        {!isInitialLoading && !projectError && project && (
          <section className="project-preview-layout">
            <div className="project-preview-left">
              <form className="project-preview-card" onSubmit={handleSubmit}>
                <div className="project-preview-card__header">
                  <div>
                    <p className="project-preview-section__eyebrow">Метаданные</p>
                    <h2 className="project-preview-card__title">Информация о проекте</h2>
                  </div>

                  {hasChanges && (
                    <span className="project-preview-changes-count">{dirtyCount} измен.</span>
                  )}
                </div>

                <div className="project-preview-fields">
                  <ProjectPreviewField
                    title="Название"
                    description="Основное имя проекта"
                    dirty={dirtyFields.name}
                    icon={<EditRegular />}
                  >
                    <UiInput
                      id="project-preview-name"
                      errorId="project-preview-name-error"
                      label="Название проекта"
                      type={InputType.Text}
                      value={form.name}
                      disabled={isBusy}
                      onChange={(event) => updateField('name', event.target.value)}
                      onClear={() => updateField('name', '')}
                    />
                  </ProjectPreviewField>

                  <ProjectPreviewField
                    title="Описание"
                    description="Краткое описание проекта"
                    dirty={dirtyFields.description}
                    icon={<EditRegular />}
                  >
                    <label className="project-preview-textarea">
                      <textarea
                        value={form.description}
                        disabled={isBusy}
                        placeholder="Описание проекта пока не добавлено"
                        onChange={(event) => updateField('description', event.target.value)}
                      />
                    </label>
                  </ProjectPreviewField>
                </div>

                <div className="project-preview-meta">
                  <div className="project-preview-meta__item">
                    <CalendarRegular />

                    <div>
                      <span>Создан</span>
                      <strong>{formatDate(project.createdAt)}</strong>
                    </div>
                  </div>

                  <div className="project-preview-meta__item">
                    <CalendarRegular />

                    <div>
                      <span>Обновлён</span>
                      <strong>{formatDate(project.updatedAt)}</strong>
                    </div>
                  </div>
                </div>

                <div className="project-preview-actions">
                  <button
                    className="project-preview-button project-preview-button--light"
                    type="button"
                    disabled={!hasChanges || isBusy}
                    onClick={resetForm}
                  >
                    Сбросить
                  </button>

                  <button
                    className="project-preview-button project-preview-button--dark"
                    type="submit"
                    disabled={!hasChanges || isBusy}
                  >
                    <SaveRegular />
                    <span>Сохранить</span>
                  </button>

                  <button
                    className="project-preview-button project-preview-button--dark"
                    type="button"
                    disabled={isBusy}
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                  >
                    <span>Открыть редактор</span>
                    <ArrowRightRegular />
                  </button>
                </div>
              </form>

              <section className="project-preview-danger-card">
                <div>
                  <p className="project-preview-section__eyebrow">Проект</p>
                  <h2 className="project-preview-danger-card__title">Удаление</h2>

                  <p className="project-preview-danger-card__text">
                    Удаление проекта необратимо. После подтверждения проект будет удалён из списка
                    ваших рабочих пространств.
                  </p>
                </div>

                <button
                  className="project-preview-button project-preview-button--danger"
                  type="button"
                  disabled={isBusy}
                  onClick={handleDeleteProject}
                >
                  <DeleteRegular />
                  <span>Удалить проект</span>
                </button>
              </section>
            </div>

            <aside className="project-preview-viewer">
              <UiViewer source={viewerSource} />
            </aside>
          </section>
        )}
      </main>
    </AppShell>
  );
};

export default ProjectPreviewPage;
