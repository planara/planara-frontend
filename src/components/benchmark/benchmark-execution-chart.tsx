// Shared
import { getChartPoints } from '@/shared';

export type BenchmarkChartProps = {
  title: string;
  value: string;
  values: number[];
};

export const BenchmarkExecutionChart = ({ title, value, values }: BenchmarkChartProps) => {
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

export default BenchmarkExecutionChart;
