// Icons
import { ArrowRightRegular, DeleteRegular } from '@fluentui/react-icons';
// Types
import { AlertPosition, AlertStatus, type BenchmarkRunListItemResponse } from '@/types';
// Shared
import { formatBenchmarkDateTime, formatBenchmarkMetric, formatBenchmarkStatus } from '@/shared';
import { useAlerts, useBenchmarkRuns } from '@/hooks';
import { useNavigate } from 'react-router-dom';

const getBenchmarkRunPath = (runId: string) => {
  return `/benchmark/${runId}`;
};

export const BenchmarkRunCard = (props: { run: BenchmarkRunListItemResponse }) => {
  const { run } = props;

  const { deleteBenchmarkRun } = useBenchmarkRuns();
  const { addAlert } = useAlerts();

  const navigate = useNavigate();

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
              {run.testsCount} тестов · {formatBenchmarkMetric(run.durationMs, ' мс', 0)}
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
  );
};

export default BenchmarkRunCard;
