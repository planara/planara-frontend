// Routing
import { Link } from 'react-router-dom';
// Icons
import { ArrowRightRegular, EditRegular } from '@fluentui/react-icons';
// Shared
import { geometryBlocks, workflowSteps, routeNames } from '@/shared';
// Components
import { SiteShell } from '@/components';
import { LandingHeader, LandingHero, LandingShowcase, LandingFeatures } from '@/components/landing';

const totalSdkDownloads = 4400;

export const LandingPage = () => {
  return (
    <SiteShell>
      <main className="landing-page">
        <LandingHeader />

        <LandingHero />

        <LandingShowcase />

        <LandingFeatures />

        <section id="geometry" className="landing-geometry">
          <div className="landing-geometry__intro">
            <p className="landing-section__eyebrow">Geometry editing</p>

            <h2 className="landing-geometry__title">
              Редактирование не только объектов, но и геометрии
            </h2>

            <p className="landing-geometry__text">
              В Planara можно работать с разными уровнями выделения: объектами, рёбрами и вершинами.
              Это делает редактор полезным не только для просмотра сцены, но и для её изменения.
            </p>
          </div>

          <div className="landing-geometry__blocks">
            {geometryBlocks.map((block) => (
              <article
                key={block.title}
                className={[
                  'landing-geometry-block',
                  block.reversed ? 'landing-geometry-block--reversed' : '',
                ].join(' ')}
              >
                <div className="landing-geometry-block__content">
                  <p className="landing-section__eyebrow">{block.eyebrow}</p>

                  <h3 className="landing-geometry-block__title">{block.title}</h3>

                  <p className="landing-geometry-block__description">{block.description}</p>
                </div>

                <div className="landing-geometry-demo">
                  {/* Позже можно заменить на GIF:
                  <img src="/assets/landing/vertex-demo.gif" alt={block.title} />
                */}

                  <div className="landing-geometry-demo__grid" />

                  <div className="landing-geometry-demo__badge">
                    <EditRegular />
                    <span>{block.demoTitle}</span>
                  </div>

                  <div className="landing-geometry-demo__mesh">
                    <span className="landing-geometry-demo__point landing-geometry-demo__point--one" />
                    <span className="landing-geometry-demo__point landing-geometry-demo__point--two" />
                    <span className="landing-geometry-demo__point landing-geometry-demo__point--three" />
                    <span className="landing-geometry-demo__point landing-geometry-demo__point--four" />

                    <span className="landing-geometry-demo__edge landing-geometry-demo__edge--one" />
                    <span className="landing-geometry-demo__edge landing-geometry-demo__edge--two" />
                    <span className="landing-geometry-demo__edge landing-geometry-demo__edge--three" />
                  </div>

                  <p className="landing-geometry-demo__caption">{block.demoCaption}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-workflow">
          <div className="landing-workflow__header">
            <p className="landing-section__eyebrow">Workflow</p>
            <h2 className="landing-workflow__title">От проекта до готовой сцены</h2>
          </div>

          <div className="landing-workflow__steps">
            {workflowSteps.map((step, index) => (
              <article key={step.title} className="landing-workflow-step">
                <span className="landing-workflow-step__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="landing-workflow-step__title">{step.title}</h3>

                <p className="landing-workflow-step__description">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="sdk" className="landing-sdk">
          <div className="landing-sdk__content">
            <p className="landing-section__eyebrow">SDK</p>

            <h2 className="landing-sdk__title">Пакеты для интеграции редактора</h2>

            <p className="landing-sdk__text">
              Planara можно использовать не только как готовое приложение, но и как набор
              SDK-пакетов для подключения редактора, сцены и React-компонентов в собственный
              интерфейс.
            </p>

            <div className="landing-sdk__stats">
              <div className="landing-sdk__stat">
                <span>Total downloads</span>
                <strong>{new Intl.NumberFormat('ru-RU').format(totalSdkDownloads)}</strong>
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

        <section className="landing-cta">
          <div>
            <p className="landing-section__eyebrow">Начать работу</p>
            <h2 className="landing-cta__title">Создайте первый проект</h2>
          </div>

          <Link className="landing-button landing-button--light" to={routeNames.REGISTER_PAGE}>
            <span>Перейти в приложение</span>
            <ArrowRightRegular />
          </Link>
        </section>
      </main>
    </SiteShell>
  );
};

export default LandingPage;
