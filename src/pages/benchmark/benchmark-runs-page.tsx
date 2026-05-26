import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddRegular,
  ArrowRightRegular,
  CalendarRegular,
  DeleteRegular,
  GaugeRegular,
  SparkleRegular,
} from '@fluentui/react-icons';

import { AppShell, UiPageHero } from '@/components';

import { useAlerts, useBenchmarkRuns } from '@/hooks';

import { AlertPosition, AlertStatus } from '@/types';

import {
  formatBenchmarkDateTime,
  formatBenchmarkMetric,
  formatBenchmarkStatus,
  routeNames,
} from '@/shared';

const getBenchmarkRunPath = (runId: string) => {
  return `/benchmark/${runId}`;
};

export const BenchmarkRunsPage = () => {
  const navigate = useNavigate();

  const {
    runs,
    totalCount,
    runsLoading,
    runsError,
    loadingMore,
    pageInfo,
    deleteBenchmarkRun,
    loadMoreBenchmarkRuns,
  } = useBenchmarkRuns();

  const { addAlert } = useAlerts();

  useEffect(() => {
    if (!runsError) {
      return;
    }

    addAlert('Не удалось загрузить запуски бенчмарка', AlertStatus.Error, AlertPosition.TopRight);
  }, [runsError, addAlert]);

  const lastRun = runs[0];

  const completedRunsCount = useMemo(() => {
    return runs.filter((run) => String(run.status).toUpperCase() === 'COMPLETED').length;
  }, [runs]);

  const handleDeleteRun = async (runId: string) => {
    try {
      const response = await deleteBenchmarkRun({
        runId,
      });

      if (!response?.success) {
        addAlert('Не удалось удалить запуск', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      addAlert('Запуск удалён', AlertStatus.Success, AlertPosition.TopRight);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось удалить запуск', AlertStatus.Error, AlertPosition.TopRight);
    }
  };

  return (
    <AppShell>
      <main className="benchmark-runs-page">
        <section className="benchmark-runs-hero">
          <UiPageHero
            badgeIcon={<SparkleRegular />}
            badge="Бенчмарк"
            title="Запуски тестирования"
            subtitle="История запусков производительности редактора: тесты, длительность, статусы и сохранённые отчёты."
          />

          <button
            className="benchmark-runs-button benchmark-runs-button--dark"
            type="button"
            onClick={() => navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE)}
          >
            <AddRegular />
            <span>Новый запуск</span>
          </button>
        </section>

        <section className="benchmark-runs-overview">
          <article className="benchmark-runs-stat benchmark-runs-stat--dark">
            <div className="benchmark-runs-stat__icon">
              <GaugeRegular />
            </div>

            <div>
              <p className="benchmark-runs-stat__label">Всего запусков</p>
              <p className="benchmark-runs-stat__value">{runsLoading ? '—' : totalCount}</p>
            </div>
          </article>

          <article className="benchmark-runs-stat">
            <div className="benchmark-runs-stat__icon">
              <CalendarRegular />
            </div>

            <div>
              <p className="benchmark-runs-stat__label">Последний запуск</p>
              <p className="benchmark-runs-stat__date">
                {lastRun ? formatBenchmarkDateTime(lastRun.createdAt) : '—'}
              </p>
            </div>
          </article>

          <article className="benchmark-runs-stat">
            <div className="benchmark-runs-stat__icon">
              <SparkleRegular />
            </div>

            <div>
              <p className="benchmark-runs-stat__label">Успешных на странице</p>
              <p className="benchmark-runs-stat__value">{runsLoading ? '—' : completedRunsCount}</p>
            </div>
          </article>
        </section>

        <section className="benchmark-runs-panel">
          <div className="benchmark-runs-panel__header">
            <div>
              <p className="benchmark-runs-section__eyebrow">История</p>
              <h2 className="benchmark-runs-panel__title">Сохранённые отчёты</h2>
            </div>

            <button
              className="benchmark-runs-panel__create"
              type="button"
              onClick={() => navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE)}
            >
              <AddRegular />
              <span>Создать запуск</span>
            </button>
          </div>

          {runs.length > 0 ? (
            <>
              <div className="benchmark-runs-grid">
                {runs.map((run) => (
                  <article key={run.id} className="benchmark-run-card">
                    <div className="benchmark-run-card__preview">
                      <div className="benchmark-run-card__grid" />

                      <div className="benchmark-run-card__pulse">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="benchmark-run-card__body">
                      <div className="benchmark-run-card__top">
                        <div>
                          <h3 className="benchmark-run-card__title">
                            Запуск от {formatBenchmarkDateTime(run.createdAt)}
                          </h3>

                          <p className="benchmark-run-card__description">
                            {run.testsCount} тестов ·{' '}
                            {formatBenchmarkMetric(run.durationMs, ' мс', 0)}
                          </p>
                        </div>

                        <button
                          className="benchmark-run-card__delete"
                          type="button"
                          aria-label="Удалить запуск"
                          onClick={() => handleDeleteRun(run.id)}
                        >
                          <DeleteRegular />
                        </button>
                      </div>

                      <div className="benchmark-run-card__meta">
                        <span>{formatBenchmarkStatus(String(run.status))}</span>
                        <span>DPR: {formatBenchmarkMetric(run.devicePixelRatio, '', 2)}</span>
                      </div>

                      <div className="benchmark-run-card__footer">
                        <span className="benchmark-run-card__updated">
                          Завершён: {formatBenchmarkDateTime(run.completedAt)}
                        </span>

                        <button
                          className="benchmark-run-card__open"
                          type="button"
                          onClick={() => navigate(getBenchmarkRunPath(run.id))}
                        >
                          <span>Открыть</span>
                          <ArrowRightRegular />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {pageInfo?.hasNextPage && (
                <button
                  className="benchmark-runs-load-more"
                  type="button"
                  disabled={loadingMore}
                  onClick={loadMoreBenchmarkRuns}
                >
                  {loadingMore ? 'Загрузка...' : 'Показать ещё'}
                </button>
              )}
            </>
          ) : (
            <div className="benchmark-runs-empty">
              <div className="benchmark-runs-empty__icon">
                <GaugeRegular />
              </div>

              <h3 className="benchmark-runs-empty__title">Запусков пока нет</h3>

              <p className="benchmark-runs-empty__text">
                Создайте первый запуск, чтобы проверить FPS, время кадра, память и геометрию сцены.
              </p>

              <button
                className="benchmark-runs-button benchmark-runs-button--dark"
                type="button"
                onClick={() => navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE)}
              >
                <AddRegular />
                <span>Новый запуск</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
};

export default BenchmarkRunsPage;
