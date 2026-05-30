export type BenchmarkReportMetricProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export const BenchmarkReportMetric = ({
  label,
  value,
  accent = false,
}: BenchmarkReportMetricProps) => {
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

export default BenchmarkReportMetric;
