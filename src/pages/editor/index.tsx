// Core
import { useCallback, useEffect, useRef, useState } from 'react';
// Routing
import { useNavigate, useParams } from 'react-router-dom';
// Components
import { EditorToolbar, FigureStats } from '@/components';
// Icons
import { DesktopRegular, ArrowLeftRegular } from '@fluentui/react-icons';
// Editor
import { EditorCanvas, EditorProvider, useEditorHub } from '@planara/react';
// Hooks
import { useAlerts, useLoading, useProjects } from '@/hooks';
// Shared
import { routeNames } from '@/shared';
import { restClient } from '@/shared/api';
import {
  createFileDownloadUrl,
  getFileIdFromDownloadUrl,
  updateFile,
  uploadFile,
} from '@/shared/services';
// Types
import { AlertPosition, AlertStatus } from '@/types';
import type { ProjectResponse, UpdateProjectRequest } from '@/types';
import type { RendererConfigInput } from '@planara/types';

const editorConfig: RendererConfigInput = {
  background: {
    color: '#111111',
  },
};

const PROJECT_SCENE_MIME_TYPE = 'text/plain';

const AUTO_SAVE_INTERVAL_MS = 2 * 60 * 1000;
const SAVE_BEFORE_LEAVE_THRESHOLD_MS = 60 * 1000;

type EditorWorkspaceProps = {
  project?: ProjectResponse | null;
  updateProject: (request: UpdateProjectRequest) => Promise<ProjectResponse | null | undefined>;
  refetchProject?: () => Promise<unknown>;
};

const readSceneFile = async (fileUrl: string) => {
  const response = await restClient.get<string>(fileUrl, {
    responseType: 'text',
    transformResponse: (data) => data,
  });

  return response.data;
};

const EditorSceneLoader = ({ fileUrl }: { fileUrl?: string | null }) => {
  const hub = useEditorHub();

  const { startLoading, stopLoading } = useLoading();
  const { addAlert } = useAlerts();

  const loadedFileUrlRef = useRef<string | null>(null);
  const loadingFileUrlRef = useRef<string | null>(null);

  const startLoadingRef = useRef(startLoading);
  const stopLoadingRef = useRef(stopLoading);
  const addAlertRef = useRef(addAlert);

  useEffect(() => {
    startLoadingRef.current = startLoading;
    stopLoadingRef.current = stopLoading;
    addAlertRef.current = addAlert;
  }, [startLoading, stopLoading, addAlert]);

  useEffect(() => {
    if (!hub || !fileUrl) {
      return;
    }

    if (loadedFileUrlRef.current === fileUrl || loadingFileUrlRef.current === fileUrl) {
      return;
    }

    let cancelled = false;
    let loadingStarted = false;

    const loadScene = async () => {
      try {
        loadingFileUrlRef.current = fileUrl;
        loadingStarted = true;

        startLoadingRef.current();

        const content = await readSceneFile(fileUrl);

        if (cancelled) {
          return;
        }

        const response = hub.loadScene(content);

        console.log('load project scene response:', response);

        loadedFileUrlRef.current = fileUrl;

        addAlertRef.current('Сцена проекта загружена', AlertStatus.Success, AlertPosition.TopRight);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          addAlertRef.current(
            'Не удалось загрузить сцену проекта',
            AlertStatus.Error,
            AlertPosition.TopRight,
          );
        }
      } finally {
        if (loadingFileUrlRef.current === fileUrl) {
          loadingFileUrlRef.current = null;
        }

        if (loadingStarted) {
          stopLoadingRef.current();
        }
      }
    };

    void loadScene();

    return () => {
      cancelled = true;

      if (loadingStarted) {
        stopLoadingRef.current();
      }

      if (loadingFileUrlRef.current === fileUrl) {
        loadingFileUrlRef.current = null;
      }
    };
  }, [hub, fileUrl]);

  return null;
};

const getSceneFileName = (projectId: string) => {
  return `project-${projectId}.obj`;
};

const EditorWorkspace = ({ project, updateProject, refetchProject }: EditorWorkspaceProps) => {
  const navigate = useNavigate();

  const hub = useEditorHub();

  const { addAlert } = useAlerts();
  const { startLoading, stopLoading } = useLoading();

  const [statsOpen, setStatsOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const savingPromiseRef = useRef<Promise<void> | null>(null);
  const lastSavedAtRef = useRef<number | null>(null);
  const currentFileUrlRef = useRef<string | null>(project?.fileUrl ?? null);

  const initialFileUrlInitializedRef = useRef(false);
  const [initialFileUrl, setInitialFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!project || initialFileUrlInitializedRef.current) {
      return;
    }

    initialFileUrlInitializedRef.current = true;

    const fileUrl = project.fileUrl ?? null;

    currentFileUrlRef.current = fileUrl;
    setInitialFileUrl(fileUrl);
  }, [project]);

  useEffect(() => {
    if (!project?.fileUrl) {
      return;
    }

    currentFileUrlRef.current = project.fileUrl;
  }, [project?.fileUrl]);

  const toggleStats = () => {
    setStatsOpen((prev) => !prev);
  };

  const createSceneFile = useCallback((content: string, projectId: string) => {
    return new File([content], getSceneFileName(projectId), {
      type: PROJECT_SCENE_MIME_TYPE,
    });
  }, []);

  const saveProject = useCallback(
    async (silent = false) => {
      if (!hub || !project) {
        return;
      }

      if (savingPromiseRef.current) {
        return savingPromiseRef.current;
      }

      const promise = (async () => {
        try {
          setSaveStatus('saving');

          const exportResponse = hub.exportScene();

          console.log('save project export response:', exportResponse);

          if (!exportResponse?.result) {
            throw new Error(exportResponse?.response?.message ?? 'Scene export failed');
          }

          const { result } = exportResponse;

          const file = createSceneFile(result.content, project.id);
          const currentFileUrl = currentFileUrlRef.current ?? project.fileUrl;
          const existingFileId = getFileIdFromDownloadUrl(currentFileUrl);

          if (existingFileId) {
            await updateFile(existingFileId, file);
          } else {
            const uploadedFile = await uploadFile(file);
            const nextFileUrl = createFileDownloadUrl(uploadedFile.id);

            await updateProject({
              projectId: project.id,
              name: project.name,
              description: project.description,
              fileUrl: nextFileUrl,
            });

            currentFileUrlRef.current = nextFileUrl;

            await refetchProject?.();
          }

          const savedAt = Date.now();

          lastSavedAtRef.current = savedAt;
          setLastSavedAt(savedAt);
          setSaveStatus('saved');

          if (!silent) {
            addAlert('Проект сохранён', AlertStatus.Success, AlertPosition.TopRight);
          }
        } catch (error) {
          console.error(error);

          setSaveStatus('error');

          if (!silent) {
            addAlert('Не удалось сохранить проект', AlertStatus.Error, AlertPosition.TopRight);
          }
        } finally {
          savingPromiseRef.current = null;
        }
      })();

      savingPromiseRef.current = promise;

      return promise;
    },
    [hub, project, createSceneFile, updateProject, refetchProject, addAlert],
  );

  const handleSaveProject = async () => {
    await saveProject(false);
  };

  const handleLeaveEditor = async () => {
    const lastSavedAtValue = lastSavedAtRef.current;

    const shouldSaveBeforeLeave =
      !lastSavedAtValue || Date.now() - lastSavedAtValue > SAVE_BEFORE_LEAVE_THRESHOLD_MS;

    if (shouldSaveBeforeLeave) {
      try {
        startLoading();

        await saveProject(true);
      } finally {
        stopLoading();
      }
    }

    navigate(routeNames.PROJECTS_PAGE);
  };

  useEffect(() => {
    if (!hub || !project) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void saveProject(true);
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hub, project, saveProject]);

  return (
    <section className="editor-workspace">
      <EditorToolbar
        statsOpen={statsOpen}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onToggleStats={toggleStats}
        onSaveProject={handleSaveProject}
        onLeaveEditor={handleLeaveEditor}
      />

      <section className="editor-page__body">
        <div className="editor-renderer">
          <EditorCanvas className="editor-renderer__canvas" config={editorConfig} />

          <EditorSceneLoader fileUrl={initialFileUrl} />

          <FigureStats open={statsOpen} onClose={toggleStats} />
        </div>
      </section>
    </section>
  );
};

export const EditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { project, projectError, updateProject, refetchProject } = useProjects(projectId);

  const { addAlert } = useAlerts();

  useEffect(() => {
    if (!projectError) {
      return;
    }

    addAlert('Не удалось загрузить проект', AlertStatus.Error, AlertPosition.TopRight);
  }, [projectError, addAlert]);

  return (
    <EditorProvider>
      <main className="editor-page">
        <section className="editor-desktop-only">
          <div className="editor-desktop-only__card">
            <div className="editor-desktop-only__visual">
              <div className="editor-desktop-only__grid" />

              <div className="editor-desktop-only__icon">
                <DesktopRegular />
              </div>
            </div>

            <div className="editor-desktop-only__content">
              <p className="editor-desktop-only__eyebrow">Planara Editor</p>

              <h1 className="editor-desktop-only__title">Редактор доступен только на десктопе</h1>

              <p className="editor-desktop-only__text">
                Для работы с 3D-сценой, инструментами трансформации и выделением откройте редактор
                на устройстве с большим экраном.
              </p>

              <a className="editor-desktop-only__button" href={routeNames.PROJECTS_PAGE}>
                <ArrowLeftRegular />
                <span>Вернуться к проектам</span>
              </a>
            </div>
          </div>
        </section>

        <EditorWorkspace
          project={project}
          updateProject={updateProject}
          refetchProject={refetchProject}
        />
      </main>
    </EditorProvider>
  );
};

export default EditorPage;
