// Shared
import { getChartPoints } from '@/shared';

export type BenchmarkReportChartProps = {
  title: string;
  value: string;
  values: Array<number | null>;
};

export const BenchmarkReportChart = ({ title, value, values }: BenchmarkReportChartProps) => {
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

export default BenchmarkReportChart;
