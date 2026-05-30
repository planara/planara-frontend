import { useEffect, useMemo, useRef } from 'react';

import { useViewerHub, ViewerCanvas, ViewerProvider } from '@planara/react';

import { FigureType, type RendererConfigInput } from '@planara/types';

import { useAlerts, useLoading } from '@/hooks';

import { AlertPosition, AlertStatus } from '@/types';

import { restClient } from '@/shared/api';

type UiViewerLoadMode = 'auto' | 'figure' | 'scene';

type UiViewerSource =
  | {
      type: 'file';
      file: File;
    }
  | {
      type: 'url';
      url: string;
      filename?: string;
    }
  | {
      type: 'content';
      content: string;
      filename?: string;
    };

type UiViewerProps = {
  source?: UiViewerSource | null;
  loadMode?: UiViewerLoadMode;
  defaultFigure?: FigureType | null;
  showDefaultFigure?: boolean;
  className?: string;
};

type UiViewerContentProps = UiViewerProps & {
  sourceKey: string;
};

const rendererConfig: RendererConfigInput = {
  background: {
    transparent: true,
  },
};

const getSourceKey = (source?: UiViewerSource | null) => {
  if (!source) {
    return 'empty';
  }

  if (source.type === 'file') {
    return `${source.file.name}-${source.file.size}-${source.file.lastModified}`;
  }

  if (source.type === 'url') {
    return source.url;
  }

  return `${source.filename ?? 'content'}-${source.content.length}`;
};

const getSourceFilename = (source?: UiViewerSource | null) => {
  if (!source) {
    return '';
  }

  if (source.type === 'file') {
    return source.file.name;
  }

  if (source.type === 'url') {
    return source.filename ?? source.url;
  }

  return source.filename ?? '';
};

const resolveLoadMode = (source: UiViewerSource, loadMode: UiViewerLoadMode) => {
  if (loadMode !== 'auto') {
    return loadMode;
  }

  const filename = getSourceFilename(source).toLowerCase();

  if (filename.endsWith('.obj')) {
    return 'figure';
  }

  return 'scene';
};

const readSourceContent = async (source: UiViewerSource) => {
  if (source.type === 'file') {
    return source.file.text();
  }

  if (source.type === 'content') {
    return source.content;
  }

  const response = await restClient.get<string>(source.url, {
    responseType: 'text',
    transformResponse: (data) => data,
  });

  return response.data;
};

const UiViewerContent = ({
  source,
  sourceKey,
  loadMode = 'auto',
  defaultFigure = null,
  showDefaultFigure = false,
}: UiViewerContentProps) => {
  const hub = useViewerHub();

  const { startLoading, stopLoading } = useLoading();
  const { addAlert } = useAlerts();

  const startLoadingRef = useRef(startLoading);
  const stopLoadingRef = useRef(stopLoading);
  const addAlertRef = useRef(addAlert);

  const loadedKeyRef = useRef<string | null>(null);
  const loadingKeyRef = useRef<string | null>(null);

  useEffect(() => {
    startLoadingRef.current = startLoading;
    stopLoadingRef.current = stopLoading;
    addAlertRef.current = addAlert;
  }, [startLoading, stopLoading, addAlert]);

  useEffect(() => {
    if (!hub) {
      return;
    }

    let firstFrameId = 0;
    let secondFrameId = 0;

    firstFrameId = requestAnimationFrame(() => {
      hub.resizeRenderer();

      secondFrameId = requestAnimationFrame(() => {
        hub.resizeRenderer();
      });
    });

    return () => {
      cancelAnimationFrame(firstFrameId);
      cancelAnimationFrame(secondFrameId);
    };
  }, [hub]);

  useEffect(() => {
    if (!hub) {
      return;
    }

    const loadKey = source ? sourceKey : `default-${String(defaultFigure)}`;

    if (loadedKeyRef.current === loadKey || loadingKeyRef.current === loadKey) {
      return;
    }

    if (!source && (!showDefaultFigure || !defaultFigure)) {
      return;
    }

    let cancelled = false;
    let loadingStarted = false;
    let resizeFrameId = 0;

    const resizeViewer = () => {
      hub.resizeRenderer();

      resizeFrameId = requestAnimationFrame(() => {
        hub.resizeRenderer();
      });
    };

    const loadViewer = async () => {
      try {
        loadingKeyRef.current = loadKey;

        if (!source) {
          const response = hub.addFigure(defaultFigure ?? FigureType.Cube);

          resizeViewer();

          loadedKeyRef.current = loadKey;

          console.log('viewer default figure response:', response);

          return;
        }

        loadingStarted = true;
        startLoadingRef.current();

        const content = await readSourceContent(source);

        if (cancelled) {
          return;
        }

        const mode = resolveLoadMode(source, loadMode);

        const response = mode === 'figure' ? hub.loadFigure(content) : hub.loadScene(content);

        resizeViewer();

        loadedKeyRef.current = loadKey;

        console.log('viewer response:', response);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          addAlertRef.current(
            'Не удалось загрузить файл во viewer',
            AlertStatus.Error,
            AlertPosition.TopRight,
          );
        }
      } finally {
        if (loadingKeyRef.current === loadKey) {
          loadingKeyRef.current = null;
        }

        if (!cancelled && loadingStarted) {
          stopLoadingRef.current();
        }
      }
    };

    void loadViewer();

    return () => {
      cancelled = true;
      cancelAnimationFrame(resizeFrameId);

      if (loadingKeyRef.current === loadKey) {
        loadingKeyRef.current = null;
      }

      if (loadingStarted) {
        stopLoadingRef.current();
      }
    };
  }, [hub, source, sourceKey, loadMode, defaultFigure, showDefaultFigure]);

  return (
    <div className="ui-viewer">
      <div className="ui-viewer__grid" />

      <ViewerCanvas className="ui-viewer__canvas" config={rendererConfig} />
    </div>
  );
};

export const UiViewer = (props: UiViewerProps) => {
  const sourceKey = useMemo(() => getSourceKey(props.source), [props.source]);

  return (
    <div className={['ui-viewer-shell', props.className ?? ''].join(' ')}>
      <ViewerProvider>
        <UiViewerContent {...props} sourceKey={sourceKey} />
      </ViewerProvider>
    </div>
  );
};

export default UiViewer;
