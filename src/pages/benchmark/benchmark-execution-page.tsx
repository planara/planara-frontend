import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  ArrowLeftRegular,
  BeakerRegular,
  ChartMultipleRegular,
  SparkleRegular,
} from '@fluentui/react-icons';

import { BenchmarkCanvas, BenchmarkProvider, useBenchmarkHub } from '@planara/react';

import {
  type BenchmarkConfig,
  type BenchmarkReport,
  type BenchmarkRunResult,
  type RendererConfigInput,
} from '@planara/types';

import { useAlerts, useBenchmarkLiveMetrics, useBenchmarkRuns } from '@/hooks';

import { AlertPosition, AlertStatus, type BenchmarkMetricHistoryPoint } from '@/types';

import {
  createSaveBenchmarkRunRequest,
  formatBenchmarkMetric,
  formatBenchmarkNumber,
  formatBenchmarkStatus,
  getBenchmarkTestTitle,
  parseBenchmarkTests,
  routeNames,
} from '@/shared';

const rendererConfig: RendererConfigInput = {
  background: {
    transparent: true,
  },
};

const HISTORY_LIMIT = 240;

const getBenchmarkRunPath = (runId: string) => {
  return `/benchmark/${runId}`;
};

type BenchmarkChartProps = {
  title: string;
  value: string;
  values: number[];
};

type BenchmarkExecutionMetricProps = {
  label: string;
  value: string;
  accent?: boolean;
};

const getChartPoints = (values: number[], width: number, height: number) => {
  if (values.length === 0) {
    return '';
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;

      return `${x},${y}`;
    })
    .join(' ');
};

const BenchmarkExecutionChart = ({ title, value, values }: BenchmarkChartProps) => {
  const width = 320;
  const height = 92;

  const points = getChartPoints(values, width, height);

  return (
    <article className="benchmark-execution-chart">
      <div className="benchmark-execution-chart__header">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      {values.length > 0 ? (
        <svg
          className="benchmark-execution-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline points={points} fill="none" />
        </svg>
      ) : (
        <div className="benchmark-execution-chart__empty">Недостаточно данных</div>
      )}
    </article>
  );
};

const BenchmarkExecutionMetric = ({
  label,
  value,
  accent = false,
}: BenchmarkExecutionMetricProps) => {
  return (
    <article
      className={[
        'benchmark-execution-metric',
        accent ? 'benchmark-execution-metric--accent' : '',
      ].join(' ')}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
};

const BenchmarkExecutionPageContent = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const hub = useBenchmarkHub();

  const { addAlert } = useAlerts();
  const { saveBenchmarkRun } = useBenchmarkRuns();
  const { metrics, history, clearMetrics } = useBenchmarkLiveMetrics();

  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<BenchmarkRunResult | null>(null);
  const [report, setReport] = useState<BenchmarkReport | null>(null);

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
        setIsRunning(true);
        setRunResult(null);
        setReport(null);

        clearMetrics();

        runStartedAtRef.current = performance.now();
        historyForSaveRef.current = [];
        isCollectingMetricsRef.current = true;

        const result = await hub.run(config);

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

        setRunResult(result);
        setReport(nextReport);

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

        if (mountedRef.current) {
          setIsRunning(false);
        }
      }
    };

    void run();
  }, [hub, tests, durationMs, navigate, addAlert, clearMetrics, saveBenchmarkRun]);

  return (
    <main className="benchmark-execution-page">
      <header className="benchmark-execution-toolbar">
        <div className="benchmark-execution-toolbar__left">
          <button
            className="benchmark-execution-toolbar__back"
            type="button"
            onClick={() => navigate(routeNames.BENCHMARK_RUNS_PAGE)}
          >
            <ArrowLeftRegular />
          </button>

          <div className="benchmark-execution-toolbar__brand">
            <div className="benchmark-execution-toolbar__logo">
              <BeakerRegular />
            </div>

            <div>
              <p className="benchmark-execution-toolbar__name">Запуск бенчмарка</p>
              <p className="benchmark-execution-toolbar__caption">
                Live-измерение производительности
              </p>
            </div>
          </div>
        </div>

        <div className="benchmark-execution-toolbar__badge">
          <SparkleRegular />
          <span>{isRunning ? 'Тест выполняется' : 'Сохранение отчёта'}</span>
        </div>

        <button
          className="benchmark-execution-toolbar__button"
          type="button"
          disabled={isRunning}
          onClick={() => navigate(routeNames.BENCHMARK_RUNS_PAGE)}
        >
          К списку запусков
        </button>
      </header>

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

          <section className="benchmark-execution-card">
            <div className="benchmark-execution-card__header">
              <div>
                <p className="benchmark-execution-section__eyebrow">Итог</p>
                <h2 className="benchmark-execution-card__title">Результаты</h2>
              </div>
            </div>

            {runResult ? (
              <div className="benchmark-execution-result-list">
                {runResult.tests.map((test) => (
                  <div key={test.type} className="benchmark-execution-result">
                    <span>{getBenchmarkTestTitle(test.type)}</span>
                    <strong>{formatBenchmarkStatus(String(test.status))}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="benchmark-execution-empty">Тесты выполняются или ещё не запускались.</p>
            )}

            {report && (
              <p className="benchmark-execution-empty">
                Отчёт сохранён и будет открыт автоматически.
              </p>
            )}
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
