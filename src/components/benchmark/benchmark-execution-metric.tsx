export type BenchmarkExecutionMetricProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export const BenchmarkExecutionMetric = ({
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

export default BenchmarkExecutionMetric;
