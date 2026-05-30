// Core
import { useEffect, useMemo } from 'react';
// Routing
import { useNavigate } from 'react-router-dom';
// Icons
import { AddRegular, CalendarRegular, GaugeRegular, SparkleRegular } from '@fluentui/react-icons';
// Components
import { AppShell, BenchmarkRunCard, UiButton, UiIconBox, UiPageHero } from '@/components';
// Hooks
import { useAlerts, useBenchmarkRuns } from '@/hooks';
// Types
import { AlertPosition, AlertStatus, UiButtonVariant, UiIconBoxVariant } from '@/types';
// Shared
import { formatBenchmarkDateTime, routeNames } from '@/shared';

export const BenchmarkRunsPage = () => {
  const navigate = useNavigate();

  const { runs, totalCount, runsLoading, runsError, loadingMore, pageInfo, loadMoreBenchmarkRuns } =
    useBenchmarkRuns();

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

  return (
    <AppShell>
      <main className="benchmark-runs-page">
        <UiPageHero
          badgeIcon={<SparkleRegular />}
          badge="Бенчмарк"
          title="Запуски тестирования"
          subtitle="История запусков производительности редактора: тесты, длительность, статусы и сохранённые отчёты."
        />

        <section className="benchmark-runs-overview">
          <article className="benchmark-runs-stat benchmark-runs-stat--dark">
            <UiIconBox
              className="benchmark-runs-stat__icon"
              icon={<GaugeRegular />}
              variant={UiIconBoxVariant.Light}
            />

            <div>
              <p className="benchmark-runs-stat__label">Всего запусков</p>
              <p className="benchmark-runs-stat__value">{runsLoading ? '—' : totalCount}</p>
            </div>
          </article>

          <article className="benchmark-runs-stat">
            <UiIconBox
              className="benchmark-runs-stat__icon"
              icon={<CalendarRegular />}
              variant={UiIconBoxVariant.Dark}
            />

            <div>
              <p className="benchmark-runs-stat__label">Последний запуск</p>
              <p className="benchmark-runs-stat__date">
                {lastRun ? formatBenchmarkDateTime(lastRun.createdAt) : '—'}
              </p>
            </div>
          </article>

          <article className="benchmark-runs-stat">
            <UiIconBox
              className="benchmark-runs-stat__icon"
              icon={<SparkleRegular />}
              variant={UiIconBoxVariant.Dark}
            />

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

            <UiButton
              type="button"
              onClick={() => navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE)}
              icon={<AddRegular />}
            >
              Создать запуск
            </UiButton>
          </div>

          {runs.length > 0 ? (
            <>
              <div className="benchmark-runs-grid">
                {runs.map((run) => (
                  <BenchmarkRunCard run={run} key={run.id} />
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
              <UiIconBox icon={<GaugeRegular />} variant={UiIconBoxVariant.Dark} />

              <h3 className="benchmark-runs-empty__title">Запусков пока нет</h3>

              <p className="benchmark-runs-empty__text">
                Создайте первый запуск, чтобы проверить FPS, время кадра, память и геометрию сцены.
              </p>

              <UiButton
                type="button"
                variant={UiButtonVariant.Dark}
                onClick={() => navigate(routeNames.CREATE_BENCHMARK_RUN_PAGE)}
                icon={<AddRegular />}
              >
                Новый запуск
              </UiButton>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
};

export default BenchmarkRunsPage;
