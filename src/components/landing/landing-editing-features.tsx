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
        <p className="landing-section__eyebrow">Редактирование геометрии</p>

        <h2 className="landing-geometry__title">
          Работайте не только с объектами, но и с их формой
        </h2>

        <p className="landing-geometry__text">
          Редактор позволяет работать не только с объектом целиком, но и с его внутренней структурой:
          вершинами, рёбрами и гранями. Это удобно, когда нужно точечно поправить форму, силуэт или
          отдельный участок модели.
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
              <UiBadge icon={<EditRegular />} className="landing-geometry-demo__badge">
                <span>{block.demoTitle}</span>
              </UiBadge>

              <div className="landing-geometry-demo__media">
                <video
                  className="landing-editor-frame__video"
                  src={block.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={block.poster}
                />
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
