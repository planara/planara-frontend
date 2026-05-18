// Core
import { type ChangeEvent, type SubmitEvent, useMemo, useState } from 'react';
// Routing
import { useNavigate } from 'react-router-dom';
// Icons
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  AttachRegular,
  DismissRegular,
  DocumentRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
// Components
import { AppShell, UiInput, UiButton, UiPageHero, UiIconBox, UiViewer } from '@/components';
// Hooks
import { useAlerts, useProjects, useLoading } from '@/hooks';
// Types
import {
  AlertPosition,
  AlertStatus,
  InputType,
  UiButtonSize,
  UiButtonVariant,
  UiIconBoxVariant,
} from '@/types';
// Shared
import { createFileDownloadUrl, uploadFile, routeNames } from '@/shared';

export const CreateProjectPage = () => {
  const navigate = useNavigate();

  const { addAlert } = useAlerts();
  const { startLoading, stopLoading } = useLoading();

  const { createProject } = useProjects();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && !isSubmitting;
  }, [name, isSubmitting]);

  const viewerSource = useMemo(() => {
    if (!projectFile) {
      return null;
    }

    return {
      type: 'file' as const,
      file: projectFile,
    };
  }, [projectFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProjectFile(file);

    event.target.value = '';
  };

  const clearFile = () => {
    setProjectFile(null);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const projectName = name.trim();
    const projectDescription = description.trim();

    if (!projectName) {
      addAlert('Введите название проекта', AlertStatus.Error, AlertPosition.TopRight);
      return;
    }

    if (isSubmitting) {
      return;
    }

    let uploadedFileId: string | null = null;

    try {
      setIsSubmitting(true);
      startLoading();

      let fileUrl: string | null = null;

      if (projectFile) {
        const uploadedFile = await uploadFile(projectFile);

        uploadedFileId = uploadedFile.id;
        fileUrl = createFileDownloadUrl(uploadedFile.id);
      }

      const createdProject = await createProject({
        name: projectName,
        description: projectDescription || null,
        fileUrl,
        isPrivate: true,
      });

      if (!createdProject) {
        addAlert(
          uploadedFileId
            ? 'Файл загружен, но проект создать не удалось'
            : 'Не удалось создать проект',
          AlertStatus.Error,
          AlertPosition.TopRight,
        );

        return;
      }

      addAlert('Проект создан', AlertStatus.Success, AlertPosition.TopRight);

      navigate(`/projects/${createdProject.id}/preview`);
    } catch (error) {
      console.error(error);

      addAlert(
        uploadedFileId
          ? 'Файл загружен, но проект создать не удалось'
          : 'Не удалось создать проект',
        AlertStatus.Error,
        AlertPosition.TopRight,
      );
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <AppShell>
      <main className="create-project-page">
        <section className="create-project-hero">
          <UiButton
            title="Назад"
            size={UiButtonSize.Medium}
            variant={UiButtonVariant.Light}
            onClick={() => navigate(routeNames.PROJECTS_PAGE)}
            icon={<ArrowLeftRegular />}
          >
            Проекты
          </UiButton>

          <UiPageHero
            badgeIcon={<SparkleRegular />}
            badge="Новый проект"
            title="Создайте рабочее пространство"
            subtitle="Добавьте название, описание и при необходимости выберите файл сцены."
          />
        </section>

        <section className="create-project-layout">
          <form className="create-project-form" onSubmit={handleSubmit}>
            <div className="create-project-form__header">
              <p className="create-project-section__eyebrow">Данные проекта</p>
              <h2 className="create-project-form__title">Основная информация</h2>
            </div>

            <div className="create-project-form__fields">
              <UiInput
                id="project-name"
                errorId="project-name-error"
                label="Название проекта"
                type={InputType.Text}
                value={name}
                disabled={isSubmitting}
                onChange={(event) => setName(event.target.value)}
                onClear={() => setName('')}
              />

              <label className="create-project-textarea">
                <span className="create-project-textarea__label">Описание</span>

                <textarea
                  value={description}
                  disabled={isSubmitting}
                  placeholder="Коротко опишите назначение проекта"
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
            </div>

            <div className="create-project-upload">
              <div className="create-project-upload__content">
                <div className="create-project-upload__icon">
                  <AttachRegular />
                </div>

                <div>
                  <h3>Файл проекта</h3>
                  <p>
                    Выберите готовую сцену сейчас или создайте пустой проект.
                  </p>
                </div>
              </div>

              {projectFile ? (
                <div className="create-project-file">
                  <UiIconBox icon={<DocumentRegular />} variant={UiIconBoxVariant.Dark} />

                  <div className="create-project-file__content">
                    <span>{projectFile.name}</span>
                    <small>{Math.ceil(projectFile.size / 1024)} KB</small>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={clearFile}
                    aria-label="Удалить файл"
                  >
                    <DismissRegular />
                  </button>
                </div>
              ) : (
                <label className="create-project-upload__button">
                  <input
                    type="file"
                    accept=".obj"
                    hidden
                    disabled={isSubmitting}
                    onChange={handleFileChange}
                  />

                  <span>Выбрать файл</span>
                </label>
              )}
            </div>

            <div className="create-project-form__actions">
              <button
                className="create-project-button create-project-button--light"
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate(routeNames.PROJECTS_PAGE)}
              >
                Отмена
              </button>

              <button
                className="create-project-button create-project-button--dark"
                type="submit"
                disabled={!canSubmit}
              >
                <span>Создать проект</span>
                <ArrowRightRegular />
              </button>
            </div>
          </form>

          <aside className="create-project-viewer">
            <UiViewer source={viewerSource} />
          </aside>
        </section>
      </main>
    </AppShell>
  );
};

export default CreateProjectPage;
