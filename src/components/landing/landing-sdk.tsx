// Routing
import { Link } from 'react-router-dom';
// Icons
import { ArrowRightRegular } from '@fluentui/react-icons';

export const LandingSdk = () => {
  return (
    <section id="sdk" className="landing-sdk">
      <div className="landing-sdk__content">
        <p className="landing-section__eyebrow">SDK</p>

        <h2 className="landing-sdk__title">Пакеты для интеграции редактора</h2>

        <p className="landing-sdk__text">
          Planara можно использовать не только как готовое приложение, но и как набор SDK-пакетов
          для подключения редактора, сцены и React-компонентов в собственный интерфейс.
        </p>

        <div className="landing-sdk__stats">
          <div className="landing-sdk__stat">
            <span>Total downloads</span>
            <strong>{new Intl.NumberFormat('ru-RU').format(4400)}</strong>
          </div>

          <div className="landing-sdk__stat">
            <span>Packages</span>
            <strong>4</strong>
          </div>
        </div>

        <Link className="landing-sdk__link" to="/sdk">
          <span>Перейти к SDK</span>
          <ArrowRightRegular />
        </Link>
      </div>

      <div className="landing-sdk__preview">
        <div className="landing-sdk__preview-grid" />

        <div className="landing-sdk__preview-card landing-sdk__preview-card--main">
          <span>React adapter</span>
          <strong>EditorProvider</strong>
        </div>

        <div className="landing-sdk__preview-card landing-sdk__preview-card--second">
          <span>Core logic</span>
          <strong>Scene state</strong>
        </div>

        <div className="landing-sdk__preview-card landing-sdk__preview-card--third">
          <span>Three layer</span>
          <strong>Renderer</strong>
        </div>
      </div>
    </section>
  );
};

export default LandingSdk;
