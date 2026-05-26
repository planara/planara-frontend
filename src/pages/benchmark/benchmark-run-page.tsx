import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeftRegular,
  CalendarRegular,
  ChartMultipleRegular,
  DeleteRegular,
  GaugeRegular,
  SparkleRegular,
} from '@fluentui/react-icons';

import { AppShell, UiPageHero } from '@/components';

import { useAlerts, useBenchmarkRuns } from '@/hooks';

import {
  AlertPosition,
  AlertStatus,
  type BenchmarkRunResponse,
  type BenchmarkTestResultResponse,
} from '@/types';

import {
  formatBenchmarkDateTime,
  formatBenchmarkMetric,
  formatBenchmarkNumber,
  formatBenchmarkStatus,
  getBenchmarkTestTitle,
  routeNames,
} from '@/shared';

type BenchmarkReportSummary = {
  averageFps: number;
  minFps: number;
  averageFrameTime: number;
  maxFrameTime: number;
  objectsCount: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryUsedMb: number | null;
};

type BenchmarkReportMetricProps = {
  label: string;
  value: string;
  accent?: boolean;
};

type BenchmarkReportChartProps = {
  title: string;
  value: string;
  values: Array<number | null>;
};

const getBenchmarkRunSummary = (run: BenchmarkRunResponse): BenchmarkReportSummary | null => {
  if (run.tests.length === 0) {
    return null;
  }

  const tests = run.tests;

  const averageFps = tests.reduce((sum, test) => sum + test.averageFps, 0) / tests.length;
  const averageFrameTime =
    tests.reduce((sum, test) => sum + test.averageFrameTime, 0) / tests.length;

  const memoryValues = tests
    .map((test) => test.memoryUsedMb)
    .filter((value): value is number => value !== null && value !== undefined);

  return {
    averageFps,
    minFps: Math.min(...tests.map((test) => test.minFps)),
    averageFrameTime,
    maxFrameTime: Math.max(...tests.map((test) => test.maxFrameTime)),
    objectsCount: Math.max(...tests.map((test) => test.objectsCount)),
    drawCalls: Math.max(...tests.map((test) => test.drawCalls)),
    triangles: Math.max(...tests.map((test) => test.triangles)),
    geometries: Math.max(...tests.map((test) => test.geometries)),
    textures: Math.max(...tests.map((test) => test.textures)),
    memoryUsedMb: memoryValues.length > 0 ? Math.max(...memoryValues) : null,
  };
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

const BenchmarkReportMetric = ({ label, value, accent = false }: BenchmarkReportMetricProps) => {
  return (
    <article
      className={['benchmark-report-metric', accent ? 'benchmark-report-metric--accent' : ''].join(
        ' ',
      )}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
};

const BenchmarkReportChart = ({ title, value, values }: BenchmarkReportChartProps) => {
  const width = 420;
  const height = 120;

  const normalizedValues = values.filter(
    (item): item is number => item !== null && item !== undefined && !Number.isNaN(item),
  );

  const points = getChartPoints(normalizedValues, width, height);

  return (
    <article className="benchmark-report-chart">
      <div className="benchmark-report-chart__header">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      {normalizedValues.length > 0 ? (
        <svg
          className="benchmark-report-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline points={points} fill="none" />
        </svg>
      ) : (
        <div className="benchmark-report-chart__empty">Недостаточно данных</div>
      )}
    </article>
  );
};

export const BenchmarkRunPage = () => {
  const navigate = useNavigate();

  const { runId } = useParams<{ runId: string }>();

  const { run, runLoading, runError, deleteBenchmarkRun } = useBenchmarkRuns(runId, 1);

  const { addAlert } = useAlerts();

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const selectedTest: BenchmarkTestResultResponse | null = useMemo(() => {
    if (!run?.tests.length) {
      return null;
    }

    return run.tests.find((test) => test.id === selectedTestId) ?? run.tests[0];
  }, [run, selectedTestId]);

  const summary = useMemo(() => {
    if (!run) {
      return null;
    }

    return getBenchmarkRunSummary(run);
  }, [run]);

  const handleDeleteRun = async () => {
    if (!run) {
      return;
    }

    try {
      const response = await deleteBenchmarkRun({
        runId: run.id,
      });

      if (!response?.success) {
        addAlert('Не удалось удалить запуск', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      addAlert('Запуск удалён', AlertStatus.Success, AlertPosition.TopRight);
      navigate(routeNames.BENCHMARK_RUNS_PAGE);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось удалить запуск', AlertStatus.Error, AlertPosition.TopRight);
    }
  };

  return (
    <AppShell>
      <main className="benchmark-report-page">
        <section className="benchmark-report-hero">
          <button
            className="benchmark-report-back"
            type="button"
            onClick={() => navigate(routeNames.BENCHMARK_RUNS_PAGE)}
          >
            <ArrowLeftRegular />
            <span>Запуски</span>
          </button>

          <UiPageHero
            badgeIcon={<SparkleRegular />}
            badge="Отчёт"
            title={run ? `Запуск от ${formatBenchmarkDateTime(run.createdAt)}` : 'Отчёт запуска'}
            subtitle="Детальный результат бенчмарка: метрики по каждому тесту, история значений и графики."
          />
        </section>

        {!runLoading && !runError && run && summary && (
          <section className="benchmark-report-layout">
            <div className="benchmark-report-left">
              <section className="benchmark-report-card benchmark-report-card--dark">
                <div className="benchmark-report-card__header">
                  <div>
                    <p className="benchmark-report-section__eyebrow">Сводка</p>
                    <h2 className="benchmark-report-card__title">Итоги запуска</h2>
                  </div>

                  <div className="benchmark-report-card__icon">
                    <GaugeRegular />
                  </div>
                </div>

                <div className="benchmark-report-metrics-grid">
                  <BenchmarkReportMetric
                    label="Средний FPS"
                    value={formatBenchmarkMetric(summary.averageFps, '', 2)}
                    accent
                  />
                  <BenchmarkReportMetric
                    label="Минимальный FPS"
                    value={formatBenchmarkMetric(summary.minFps, '', 2)}
                  />
                  <BenchmarkReportMetric
                    label="Среднее время кадра"
                    value={formatBenchmarkMetric(summary.averageFrameTime, ' мс', 2)}
                  />
                  <BenchmarkReportMetric
                    label="Максимальное время кадра"
                    value={formatBenchmarkMetric(summary.maxFrameTime, ' мс', 2)}
                  />
                  <BenchmarkReportMetric
                    label="Объекты"
                    value={formatBenchmarkNumber(summary.objectsCount, 0)}
                  />
                  <BenchmarkReportMetric
                    label="Draw calls"
                    value={formatBenchmarkNumber(summary.drawCalls, 0)}
                  />
                  <BenchmarkReportMetric
                    label="Треугольники"
                    value={formatBenchmarkNumber(summary.triangles, 0)}
                  />
                  <BenchmarkReportMetric
                    label="Память"
                    value={formatBenchmarkMetric(summary.memoryUsedMb, ' МБ', 2)}
                  />
                </div>
              </section>

              <section className="benchmark-report-card">
                <div className="benchmark-report-card__header">
                  <div>
                    <p className="benchmark-report-section__eyebrow">Метаданные</p>
                    <h2 className="benchmark-report-card__title">Информация</h2>
                  </div>
                </div>

                <div className="benchmark-report-meta">
                  <div className="benchmark-report-meta__item">
                    <CalendarRegular />
                    <div>
                      <span>Создан</span>
                      <strong>{formatBenchmarkDateTime(run.createdAt)}</strong>
                    </div>
                  </div>

                  <div className="benchmark-report-meta__item">
                    <CalendarRegular />
                    <div>
                      <span>Завершён</span>
                      <strong>{formatBenchmarkDateTime(run.completedAt)}</strong>
                    </div>
                  </div>

                  <div className="benchmark-report-meta__item">
                    <GaugeRegular />
                    <div>
                      <span>Статус</span>
                      <strong>{formatBenchmarkStatus(String(run.status))}</strong>
                    </div>
                  </div>

                  <div className="benchmark-report-meta__item">
                    <GaugeRegular />
                    <div>
                      <span>Длительность</span>
                      <strong>{formatBenchmarkMetric(run.durationMs, ' мс', 0)}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="benchmark-report-danger-card">
                <div>
                  <p className="benchmark-report-section__eyebrow">Запуск</p>
                  <h2 className="benchmark-report-danger-card__title">Удаление</h2>

                  <p className="benchmark-report-danger-card__text">
                    Удаление отчёта необратимо. После удаления запуск пропадёт из истории
                    бенчмарков.
                  </p>
                </div>

                <button
                  className="benchmark-report-button benchmark-report-button--danger"
                  type="button"
                  onClick={handleDeleteRun}
                >
                  <DeleteRegular />
                  <span>Удалить отчёт</span>
                </button>
              </section>
            </div>

            <div className="benchmark-report-right">
              <section className="benchmark-report-card">
                <div className="benchmark-report-card__header">
                  <div>
                    <p className="benchmark-report-section__eyebrow">Тесты</p>
                    <h2 className="benchmark-report-card__title">Результаты</h2>
                  </div>
                </div>

                <div className="benchmark-report-tests">
                  {run.tests.map((test) => {
                    const selected = selectedTest?.id === test.id;

                    return (
                      <button
                        key={test.id}
                        className={[
                          'benchmark-report-test',
                          selected ? 'benchmark-report-test--selected' : '',
                        ].join(' ')}
                        type="button"
                        onClick={() => setSelectedTestId(test.id)}
                      >
                        <span>
                          <strong>{getBenchmarkTestTitle(test.type)}</strong>
                          <small>{formatBenchmarkStatus(String(test.status))}</small>
                        </span>

                        <b>{formatBenchmarkMetric(test.averageFps, ' FPS', 1)}</b>
                      </button>
                    );
                  })}
                </div>
              </section>

              {selectedTest && (
                <>
                  <section className="benchmark-report-card benchmark-report-card--dark">
                    <div className="benchmark-report-card__header">
                      <div>
                        <p className="benchmark-report-section__eyebrow">Выбранный тест</p>
                        <h2 className="benchmark-report-card__title">
                          {getBenchmarkTestTitle(selectedTest.type)}
                        </h2>
                      </div>

                      <div className="benchmark-report-card__icon">
                        <ChartMultipleRegular />
                      </div>
                    </div>

                    <div className="benchmark-report-metrics-grid">
                      <BenchmarkReportMetric
                        label="Средний FPS"
                        value={formatBenchmarkMetric(selectedTest.averageFps, '', 2)}
                        accent
                      />
                      <BenchmarkReportMetric
                        label="Минимальный FPS"
                        value={formatBenchmarkMetric(selectedTest.minFps, '', 2)}
                      />
                      <BenchmarkReportMetric
                        label="Среднее время кадра"
                        value={formatBenchmarkMetric(selectedTest.averageFrameTime, ' мс', 2)}
                      />
                      <BenchmarkReportMetric
                        label="Максимальное время кадра"
                        value={formatBenchmarkMetric(selectedTest.maxFrameTime, ' мс', 2)}
                      />
                      <BenchmarkReportMetric
                        label="Кадры"
                        value={formatBenchmarkNumber(selectedTest.frames, 0)}
                      />
                      <BenchmarkReportMetric
                        label="Объекты"
                        value={formatBenchmarkNumber(selectedTest.objectsCount, 0)}
                      />
                      <BenchmarkReportMetric
                        label="Draw calls"
                        value={formatBenchmarkNumber(selectedTest.drawCalls, 0)}
                      />
                      <BenchmarkReportMetric
                        label="Треугольники"
                        value={formatBenchmarkNumber(selectedTest.triangles, 0)}
                      />
                      <BenchmarkReportMetric
                        label="Память"
                        value={formatBenchmarkMetric(selectedTest.memoryUsedMb, ' МБ', 2)}
                      />
                    </div>
                  </section>

                  <section className="benchmark-report-card">
                    <div className="benchmark-report-card__header">
                      <div>
                        <p className="benchmark-report-section__eyebrow">Графики</p>
                        <h2 className="benchmark-report-card__title">Динамика теста</h2>
                      </div>
                    </div>

                    <div className="benchmark-report-charts">
                      <BenchmarkReportChart
                        title="Средний FPS"
                        value={formatBenchmarkMetric(selectedTest.averageFps, '', 2)}
                        values={selectedTest.history.averageFps}
                      />

                      <BenchmarkReportChart
                        title="Минимальный FPS"
                        value={formatBenchmarkMetric(selectedTest.minFps, '', 2)}
                        values={selectedTest.history.minFps}
                      />

                      <BenchmarkReportChart
                        title="Время кадра"
                        value={formatBenchmarkMetric(selectedTest.averageFrameTime, ' мс', 2)}
                        values={selectedTest.history.averageFrameTime}
                      />

                      <BenchmarkReportChart
                        title="Макс. время кадра"
                        value={formatBenchmarkMetric(selectedTest.maxFrameTime, ' мс', 2)}
                        values={selectedTest.history.maxFrameTime}
                      />

                      <BenchmarkReportChart
                        title="Память"
                        value={formatBenchmarkMetric(selectedTest.memoryUsedMb, ' МБ', 2)}
                        values={selectedTest.history.memoryUsedMb}
                      />

                      <BenchmarkReportChart
                        title="Draw calls"
                        value={formatBenchmarkNumber(selectedTest.drawCalls, 0)}
                        values={selectedTest.history.drawCalls}
                      />

                      <BenchmarkReportChart
                        title="Треугольники"
                        value={formatBenchmarkNumber(selectedTest.triangles, 0)}
                        values={selectedTest.history.triangles}
                      />

                      <BenchmarkReportChart
                        title="Объекты"
                        value={formatBenchmarkNumber(selectedTest.objectsCount, 0)}
                        values={selectedTest.history.objectsCount}
                      />
                    </div>
                  </section>
                </>
              )}
            </div>
          </section>
        )}
      </main>
    </AppShell>
  );
};

export default BenchmarkRunPage;
