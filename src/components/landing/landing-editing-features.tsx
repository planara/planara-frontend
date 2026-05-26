// Shared
import { geometryBlocks } from '@/shared';
// Icons
import { EditRegular } from '@fluentui/react-icons';
// Components
import { UiBadge } from '@/components';

export const LandingEditingFeatures = () => {
  return (
    <section id="geometry" className="landing-geometry">
      <div className="landing-geometry__intro">
        <p className="landing-section__eyebrow">Geometry editing</p>

        <h2 className="landing-geometry__title">
          Редактирование не только объектов, но и геометрии
        </h2>

        <p className="landing-geometry__text">
          В Planara можно работать с разными уровнями выделения: объектами, рёбрами и вершинами. Это
          делает редактор полезным не только для просмотра сцены, но и для её изменения.
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

              <UiBadge icon={<EditRegular />} className="landing-geometry-demo__badge">
                <span>{block.demoTitle}</span>
              </UiBadge>

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
  );
};

export default LandingEditingFeatures;
