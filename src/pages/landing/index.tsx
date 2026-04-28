import { Link } from 'react-router-dom';

import {
  ArrowRightRegular,
  CodeRegular,
  CubeRegular,
  DocumentRegular,
  EditRegular,
  LayerRegular,
  SparkleRegular,
} from '@fluentui/react-icons';

import { routeNames } from '@/shared/constants/host-names';
import { SiteShell, UiBadge } from '@/components';

const totalSdkDownloads = 4400;

const features = [
  {
    title: '3D-редактор в браузере',
    description:
      'Создавайте и редактируйте сцены прямо в веб-интерфейсе без установки десктопных приложений.',
    icon: <CubeRegular />,
  },
  {
    title: 'Работа с проектами',
    description: 'Сохраняйте сцены как проекты и возвращайтесь к ним из личного кабинета.',
    icon: <LayerRegular />,
  },
  {
    title: 'React SDK',
    description: 'Подключайте редактор, canvas и хуки через собственные npm-пакеты Planara.',
    icon: <CodeRegular />,
  },
];

const geometryBlocks = [
  {
    eyebrow: 'Vertex editing',
    title: 'Редактирование вершин',
    description:
      'Переключайтесь в режим вершин и точечно меняйте форму объекта. Такой подход позволяет работать не только с целой фигурой, но и с её геометрией.',
    demoTitle: 'Vertex mode',
    demoCaption: 'Выбор и трансформация отдельных точек',
    reversed: false,
  },
  {
    eyebrow: 'Edge editing',
    title: 'Работа с рёбрами',
    description:
      'Выделяйте рёбра модели и изменяйте структуру объекта через режим edge-selection. Это делает редактор ближе к полноценным инструментам моделирования.',
    demoTitle: 'Edge mode',
    demoCaption: 'Редактирование связей между вершинами',
    reversed: true,
  },
  {
    eyebrow: 'Transform tools',
    title: 'Translate, rotate и scale',
    description:
      'Для объектов и элементов геометрии доступны базовые инструменты трансформации: перемещение, вращение и масштабирование.',
    demoTitle: 'Transform',
    demoCaption: 'Инструменты управления формой и положением',
    reversed: false,
  },
];

const workflowSteps = [
  {
    title: 'Создайте проект',
    description: 'Новый workspace создаётся из личного кабинета и сразу готов к работе.',
  },
  {
    title: 'Откройте редактор',
    description: 'Работайте с объектами, режимами выделения и инструментами трансформации.',
  },
  {
    title: 'Сохраните сцену',
    description: 'Файл проекта хранится на сервере и доступен при следующем открытии.',
  },
];

export const LandingPage = () => {
  return (
    <SiteShell>
      <main className="landing-page">
        <header className="landing-header">
          <Link className="landing-header__brand" to="/">
            <span className="landing-header__logo">P</span>

            <span className="landing-header__brand-text">
              <span className="landing-header__brand-name">Planara</span>
              <span className="landing-header__brand-caption">3D workspace</span>
            </span>
          </Link>

          <nav className="landing-header__nav" aria-label="Главная навигация">
            <a href="#editor">Редактор</a>
            <a href="#geometry">Геометрия</a>
            <a href="#sdk">SDK</a>
          </nav>

          <div className="landing-header__actions">
            <Link className="landing-header__link" to={routeNames.LOGIN_PAGE}>
              Войти
            </Link>

            <Link className="landing-header__button" to={routeNames.REGISTER_PAGE}>
              Начать
            </Link>
          </div>
        </header>

        <section className="landing-hero">
          <div className="landing-hero__content">
            <UiBadge icon={<SparkleRegular />} className="landing-hero__badge">
              Planara editor
            </UiBadge>

            <h1 className="landing-hero__title">Веб-редактор для работы с 3D-сценами</h1>

            <p className="landing-hero__subtitle">
              Planara объединяет личный кабинет, проекты, браузерный 3D-редактор и SDK-пакеты для
              интеграции редактора в React-приложения.
            </p>

            <div className="landing-hero__actions">
              <Link className="landing-button landing-button--dark" to={routeNames.REGISTER_PAGE}>
                <span>Создать аккаунт</span>
                <ArrowRightRegular />
              </Link>

              <Link className="landing-button landing-button--light" to="/sdk">
                <DocumentRegular />
                <span>Смотреть SDK</span>
              </Link>
            </div>
          </div>
        </section>

        <section id="editor" className="landing-editor-showcase">
          <div className="landing-editor-showcase__header">
            <div>
              <p className="landing-section__eyebrow">Editor preview</p>

              <h2 className="landing-editor-showcase__title">
                Полноценное рабочее пространство прямо в браузере
              </h2>
            </div>

            <p className="landing-editor-showcase__text">
              Здесь можно показать GIF с реальной работой редактора: создание объекта, переключение
              режимов, выделение элементов и трансформации.
            </p>
          </div>

          <div className="landing-editor-frame">
            <div className="landing-editor-frame__topbar">
              <div className="landing-editor-frame__dots">
                <span />
                <span />
                <span />
              </div>

              <span>Planara workspace</span>
            </div>

            <div className="landing-editor-frame__body">
              <video
                className="landing-editor-frame__video"
                src="/assets/editor-preview.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/editor-preview-poster.png"
              />
            </div>
          </div>
        </section>

        <section id="features" className="landing-section">
          <div className="landing-section__header">
            <div>
              <p className="landing-section__eyebrow">Возможности</p>
              <h2 className="landing-section__title">База для работы со сценами</h2>
            </div>
          </div>

          <div className="landing-features">
            {features.map((feature) => (
              <article key={feature.title} className="landing-feature-card">
                <div className="landing-feature-card__icon">{feature.icon}</div>

                <h3 className="landing-feature-card__title">{feature.title}</h3>

                <p className="landing-feature-card__description">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

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
