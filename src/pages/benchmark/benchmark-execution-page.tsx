// Core
import { useEffect, useMemo, useRef } from 'react';
// Routing
import { useNavigate, useSearchParams } from 'react-router-dom';
// Icons
import { ChartMultipleRegular } from '@fluentui/react-icons';
// Benchmark
import { BenchmarkCanvas, BenchmarkProvider, useBenchmarkHub } from '@planara/react';
// Types
import { type BenchmarkConfig, type RendererConfigInput } from '@planara/types';
import { AlertPosition, AlertStatus, type BenchmarkMetricHistoryPoint } from '@/types';
// Hooks
import { useAlerts, useBenchmarkLiveMetrics, useBenchmarkRuns } from '@/hooks';
// Shared
import {
  createSaveBenchmarkRunRequest,
  formatBenchmarkMetric,
  formatBenchmarkNumber,
  parseBenchmarkTests,
  routeNames,
} from '@/shared';
// Components
import { BenchmarkExecutionChart, BenchmarkExecutionMetric } from '@/components';

const rendererConfig: RendererConfigInput = {
  background: {
    transparent: true,
  },
};

const HISTORY_LIMIT = 240;

const getBenchmarkRunPath = (runId: string) => {
  return `/benchmark/${runId}`;
};

const BenchmarkExecutionPageContent = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const hub = useBenchmarkHub();

  const { addAlert } = useAlerts();
  const { saveBenchmarkRun } = useBenchmarkRuns();
  const { metrics, history, clearMetrics } = useBenchmarkLiveMetrics();

  const hasStartedRef = useRef(false);
  const mountedRef = useRef(true);
  const isCollectingMetricsRef = useRef(false);
  const runStartedAtRef = useRef(0);
  const historyForSaveRef = useRef<BenchmarkMetricHistoryPoint[]>([]);

  const testsParam = searchParams.get('tests');
  const durationMsParam = searchParams.get('durationMs');

  const tests = useMemo(() => {
    return parseBenchmarkTests(testsParam);
  }, [testsParam]);

  const durationMs = useMemo(() => {
    return Number(durationMsParam ?? 5000);
  }, [durationMsParam]);

  const fpsValues = useMemo(() => history.map((item) => item.averageFps), [history]);

  const frameTimeValues = useMemo(() => {
    return history.map((item) => item.averageFrameTime);
  }, [history]);

  const memoryValues = useMemo(() => {
    return history.map((item) => item.memoryUsedMb ?? 0).filter((item) => item > 0);
  }, [history]);

  const drawCallsValues = useMemo(() => {
    return history.map((item) => item.drawCalls);
  }, [history]);

  const trianglesValues = useMemo(() => {
    return history.map((item) => item.triangles);
  }, [history]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      isCollectingMetricsRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hub) {
      return;
    }

    return hub.subscribeMetrics((nextMetrics) => {
      if (!nextMetrics || !isCollectingMetricsRef.current) {
        return;
      }

      const timeMs = performance.now() - runStartedAtRef.current;

      const nextPoint: BenchmarkMetricHistoryPoint = {
        timeMs,
        averageFps: nextMetrics.averageFps ?? 0,
        minFps: nextMetrics.minFps ?? 0,
        averageFrameTime: nextMetrics.averageFrameTime ?? 0,
        maxFrameTime: nextMetrics.maxFrameTime ?? 0,
        memoryUsedMb: nextMetrics.memoryUsedMb ?? null,
        drawCalls: nextMetrics.drawCalls ?? 0,
        triangles: nextMetrics.triangles ?? 0,
        objectsCount: nextMetrics.objectsCount ?? 0,
      };

      historyForSaveRef.current = [...historyForSaveRef.current, nextPoint].slice(-HISTORY_LIMIT);
    });
  }, [hub]);

  useEffect(() => {
    if (!hub || hasStartedRef.current) {
      return;
    }

    if (tests.length === 0) {
      addAlert('Не выбраны тесты для запуска', AlertStatus.Error, AlertPosition.TopRight);
      navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE);
      return;
    }

    if (!durationMs || durationMs < 1000) {
      addAlert('Некорректная длительность теста', AlertStatus.Error, AlertPosition.TopRight);
      navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE);
      return;
    }

    hasStartedRef.current = true;

    const run = async () => {
      const config: BenchmarkConfig = {
        tests,
        durationMs,
      };

      try {
        clearMetrics();

        runStartedAtRef.current = performance.now();
        historyForSaveRef.current = [];
        isCollectingMetricsRef.current = true;

        await hub.run(config);

        isCollectingMetricsRef.current = false;

        if (!mountedRef.current) {
          return;
        }

        const nextReport = hub.getReport();

        if (!nextReport) {
          addAlert(
            'Бенчмарк завершён, но отчёт не был сформирован',
            AlertStatus.Error,
            AlertPosition.TopRight,
          );
          return;
        }

        const request = createSaveBenchmarkRunRequest(
          nextReport,
          historyForSaveRef.current,
          durationMs,
        );

        if (request.tests.length === 0) {
          addAlert(
            'Бенчмарк завершён, но результаты тестов не были собраны',
            AlertStatus.Error,
            AlertPosition.TopRight,
          );
          return;
        }

        const savedRun = await saveBenchmarkRun(request);

        if (!savedRun) {
          addAlert(
            'Бенчмарк выполнен, но отчёт не удалось сохранить',
            AlertStatus.Error,
            AlertPosition.TopRight,
          );
          return;
        }

        addAlert('Бенчмарк завершён', AlertStatus.Success, AlertPosition.TopRight);

        navigate(getBenchmarkRunPath(savedRun.id));
      } catch (error) {
        console.error(error);

        isCollectingMetricsRef.current = false;

        addAlert('Не удалось выполнить бенчмарк', AlertStatus.Error, AlertPosition.TopRight);
      } finally {
        isCollectingMetricsRef.current = false;
      }
    };

    void run();
  }, [hub, tests, durationMs, navigate, addAlert, clearMetrics, saveBenchmarkRun]);

  return (
    <main className="benchmark-execution-page">
      <section className="benchmark-execution-layout">
        <section className="benchmark-execution-viewport">
          <BenchmarkCanvas
            className="benchmark-execution-viewport__canvas"
            config={rendererConfig}
          />
        </section>

        <aside className="benchmark-execution-panel">
          <section className="benchmark-execution-card benchmark-execution-card--dark">
            <div className="benchmark-execution-card__header">
              <div>
                <p className="benchmark-execution-section__eyebrow">Live-метрики</p>
                <h2 className="benchmark-execution-card__title">Показатели</h2>
              </div>

              <div className="benchmark-execution-card__icon">
                <ChartMultipleRegular />
              </div>
            </div>

            <div className="benchmark-execution-metrics-grid">
              <BenchmarkExecutionMetric
                label="Средний FPS"
                value={formatBenchmarkMetric(metrics?.averageFps, '', 2)}
                accent
              />

              <BenchmarkExecutionMetric
                label="Минимальный FPS"
                value={formatBenchmarkMetric(metrics?.minFps, '', 2)}
              />

              <BenchmarkExecutionMetric
                label="Среднее время кадра"
                value={formatBenchmarkMetric(metrics?.averageFrameTime, ' мс', 2)}
              />

              <BenchmarkExecutionMetric
                label="Максимальное время кадра"
                value={formatBenchmarkMetric(metrics?.maxFrameTime, ' мс', 2)}
              />

              <BenchmarkExecutionMetric
                label="Кадры"
                value={formatBenchmarkNumber(metrics?.frames, 0)}
              />

              <BenchmarkExecutionMetric
                label="Объекты"
                value={formatBenchmarkNumber(metrics?.objectsCount, 0)}
              />

              <BenchmarkExecutionMetric
                label="Draw calls"
                value={formatBenchmarkNumber(metrics?.drawCalls, 0)}
              />

              <BenchmarkExecutionMetric
                label="Треугольники"
                value={formatBenchmarkNumber(metrics?.triangles, 0)}
              />

              <BenchmarkExecutionMetric
                label="Память"
                value={formatBenchmarkMetric(metrics?.memoryUsedMb, ' МБ', 2)}
              />
            </div>
          </section>

          <section className="benchmark-execution-card">
            <div className="benchmark-execution-card__header">
              <div>
                <p className="benchmark-execution-section__eyebrow">Графики</p>
                <h2 className="benchmark-execution-card__title">Динамика</h2>
              </div>
            </div>

            <div className="benchmark-execution-charts">
              <BenchmarkExecutionChart
                title="Средний FPS"
                value={formatBenchmarkMetric(metrics?.averageFps, '', 2)}
                values={fpsValues}
              />

              <BenchmarkExecutionChart
                title="Время кадра"
                value={formatBenchmarkMetric(metrics?.averageFrameTime, ' мс', 2)}
                values={frameTimeValues}
              />

              <BenchmarkExecutionChart
                title="Память"
                value={formatBenchmarkMetric(metrics?.memoryUsedMb, ' МБ', 2)}
                values={memoryValues}
              />

              <BenchmarkExecutionChart
                title="Draw calls"
                value={formatBenchmarkNumber(metrics?.drawCalls, 0)}
                values={drawCallsValues}
              />

              <BenchmarkExecutionChart
                title="Треугольники"
                value={formatBenchmarkNumber(metrics?.triangles, 0)}
                values={trianglesValues}
              />
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
};

export const BenchmarkExecutionPage = () => {
  return (
    <BenchmarkProvider>
      <BenchmarkExecutionPageContent />
    </BenchmarkProvider>
  );
};

export default BenchmarkExecutionPage;
