// Icons
import { ChartMultipleRegular } from '@fluentui/react-icons';

const BenchmarkAboutMetrics = () => {
  return (
    <section className="benchmark-create-card benchmark-create-card--dark">
      <div className="benchmark-create-card__header">
        <div>
          <p className="benchmark-create-section__eyebrow">Что будет измерено</p>
          <h2 className="benchmark-create-card__title">Метрики</h2>
        </div>

        <div className="benchmark-create-card__icon">
          <ChartMultipleRegular />
        </div>
      </div>

      <div className="benchmark-create-metrics-list">
        <span>Средний и минимальный FPS</span>
        <span>Среднее и максимальное время кадра</span>
        <span>Количество объектов, draw calls и треугольников</span>
        <span>Геометрии, текстуры и память браузера</span>
      </div>
    </section>
  );
};

export default BenchmarkAboutMetrics;
