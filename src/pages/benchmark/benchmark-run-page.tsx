// Core
import { useMemo, useState } from 'react';
// Routing
import { useNavigate, useParams } from 'react-router-dom';
// Icons
import {
  ArrowLeftRegular,
  CalendarRegular,
  ChartMultipleRegular,
  DeleteRegular,
  GaugeRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
// Components
import {
  AppShell,
  BenchmarkReportChart,
  BenchmarkReportMetric,
  UiButton,
  UiPageHero,
} from '@/components';
// Hooks
import { useAlerts, useBenchmarkRuns } from '@/hooks';
// Types
import {
  AlertPosition,
  AlertStatus,
  type BenchmarkReportSummary,
  type BenchmarkRunResponse,
  type BenchmarkTestResultResponse,
  UiButtonSize,
  UiButtonVariant,
} from '@/types';
// Shared
import {
  formatBenchmarkDateTime,
  formatBenchmarkMetric,
  formatBenchmarkNumber,
  formatBenchmarkStatus,
  getBenchmarkTestTitle,
  routeNames,
} from '@/shared';

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
          <UiButton
            title="Запуски"
            size={UiButtonSize.Medium}
            variant={UiButtonVariant.Light}
            icon={<ArrowLeftRegular />}
            onClick={() => navigate(routeNames.BENCHMARK_RUNS_PAGE)}
          >
            Запуски
          </UiButton>

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
