import { Link, NavLink, useParams } from 'react-router-dom';

import {
  ArrowLeftRegular,
  BoxRegular,
  CodeRegular,
  CopyRegular,
  DocumentRegular,
} from '@fluentui/react-icons';

import { SiteShell } from '@/components';

type DocsBlock =
  | {
      type: 'text';
      value: string;
    }
  | {
      type: 'code';
      language: string;
      value: string;
    }
  | {
      type: 'cards';
      items: Array<{
        title: string;
        description: string;
      }>;
    };

type DocsSection = {
  slug: string;
  title: string;
  description: string;
  blocks: DocsBlock[];
};

type PackageDocs = {
  slug: string;
  name: string;
  type: string;
  description: string;
  sections: DocsSection[];
};

const packagesDocs: Record<string, PackageDocs> = {
  core: {
    slug: 'core',
    name: '@planara/core',
    type: 'Core пакет',
    description: 'Базовая логика редактора, состояние сцены, handlers, selection и transform.',
    sections: [
      {
        slug: 'overview',
        title: 'Обзор',
        description: 'Краткое описание core-пакета и его роли внутри Planara.',
        blocks: [
          {
            type: 'text',
            value:
              '@planara/core содержит основную бизнес-логику редактора. Он связывает сцену, инструменты, режимы выделения, трансформации и публичный API редактора.',
          },
          {
            type: 'code',
            language: 'ts',
            value: `import { createAppHub } from '@planara/core';

const editorHub = createAppHub(canvas);

editorHub.start();`,
          },
        ],
      },
      {
        slug: 'installation',
        title: 'Установка',
        description: 'Команда установки core-пакета.',
        blocks: [
          {
            type: 'code',
            language: 'bash',
            value: 'npm install @planara/core',
          },
        ],
      },
      {
        slug: 'methods',
        title: 'Методы',
        description: 'Основные методы editor hub.',
        blocks: [
          {
            type: 'cards',
            items: [
              {
                title: 'start',
                description: 'Запускает цикл работы редактора и renderer.',
              },
              {
                title: 'stop',
                description: 'Останавливает цикл работы редактора.',
              },
              {
                title: 'dispose',
                description: 'Очищает ресурсы редактора и renderer.',
              },
              {
                title: 'resizeRenderer',
                description: 'Обновляет размеры renderer после изменения контейнера.',
              },
              {
                title: 'getSelectionStats',
                description: 'Возвращает статистику выбранного объекта или элемента геометрии.',
              },
            ],
          },
          {
            type: 'code',
            language: 'ts',
            value: `editorHub.start();

editorHub.resizeRenderer();

const stats = editorHub.getSelectionStats();

editorHub.stop();`,
          },
        ],
      },
      {
        slug: 'tools',
        title: 'Инструменты',
        description: 'Режимы трансформации и выделения.',
        blocks: [
          {
            type: 'cards',
            items: [
              {
                title: 'Translate',
                description: 'Перемещение объекта, ребра или вершины.',
              },
              {
                title: 'Rotate',
                description: 'Вращение выбранного элемента.',
              },
              {
                title: 'Scale',
                description: 'Масштабирование выбранного элемента.',
              },
              {
                title: 'Mesh select',
                description: 'Выделение объекта целиком.',
              },
              {
                title: 'Edge select',
                description: 'Выделение ребер геометрии.',
              },
              {
                title: 'Vertex select',
                description: 'Выделение отдельных вершин.',
              },
            ],
          },
          {
            type: 'code',
            language: 'ts',
            value: `editorHub.setToolMode('translate');
editorHub.setSelectMode('vertex');`,
          },
        ],
      },
      {
        slug: 'figures',
        title: 'Фигуры',
        description: 'Добавление базовых фигур в сцену.',
        blocks: [
          {
            type: 'text',
            value:
              'Core-пакет предоставляет методы для добавления фигур. Конкретная визуализация выполняется через renderer-слой.',
          },
          {
            type: 'code',
            language: 'ts',
            value: `editorHub.addFigure('mesh', 'cube');
editorHub.addFigure('mesh', 'sphere');
editorHub.addFigure('mesh', 'cylinder');`,
          },
        ],
      },
    ],
  },

  react: {
    slug: 'react',
    name: '@planara/react',
    type: 'React пакет',
    description: 'React-адаптер для EditorProvider, EditorCanvas и хуков редактора.',
    sections: [
      {
        slug: 'overview',
        title: 'Обзор',
        description: 'React-слой для подключения редактора в приложение.',
        blocks: [
          {
            type: 'text',
            value:
              '@planara/react предоставляет готовые React-компоненты и хуки для работы с редактором.',
          },
        ],
      },
      {
        slug: 'installation',
        title: 'Установка',
        description: 'Команда установки React-пакета.',
        blocks: [
          {
            type: 'code',
            language: 'bash',
            value: 'npm install @planara/react',
          },
        ],
      },
      {
        slug: 'components',
        title: 'Компоненты',
        description: 'Основные React-компоненты пакета.',
        blocks: [
          {
            type: 'cards',
            items: [
              {
                title: 'EditorProvider',
                description: 'Провайдер контекста редактора.',
              },
              {
                title: 'EditorCanvas',
                description: 'Canvas-компонент для подключения renderer и editor hub.',
              },
            ],
          },
          {
            type: 'code',
            language: 'tsx',
            value: `import { EditorCanvas, EditorProvider } from '@planara/react';

export const EditorPage = () => {
  return (
    <EditorProvider>
      <EditorCanvas />
    </EditorProvider>
  );
};`,
          },
        ],
      },
      {
        slug: 'hooks',
        title: 'Хуки',
        description: 'Хуки для доступа к состоянию и API редактора.',
        blocks: [
          {
            type: 'cards',
            items: [
              {
                title: 'useEditorHub',
                description: 'Возвращает API редактора.',
              },
              {
                title: 'useSelectionStats',
                description: 'Возвращает статистику выбранного объекта.',
              },
            ],
          },
          {
            type: 'code',
            language: 'tsx',
            value: `import { useSelectionStats } from '@planara/react';

export const FigureStats = () => {
  const stats = useSelectionStats();

  if (!stats) {
    return null;
  }

  return <div>{stats.position.x}</div>;
};`,
          },
        ],
      },
      {
        slug: 'handlers',
        title: 'Handlers',
        description: 'Готовые обработчики действий редактора.',
        blocks: [
          {
            type: 'code',
            language: 'tsx',
            value: `import { useMemo } from 'react';
import { makeEditorHandlers, useEditorHub } from '@planara/react';

export const Toolbar = () => {
  const hub = useEditorHub();
  const handlers = useMemo(() => makeEditorHandlers(hub), [hub]);

  return (
    <button type="button" onClick={handlers.addCube}>
      Add cube
    </button>
  );
};`,
          },
        ],
      },
    ],
  },

  three: {
    slug: 'three',
    name: '@planara/three',
    type: 'Three.js пакет',
    description: 'Renderer-слой, viewport, сцена, камера и интеграция с Three.js.',
    sections: [
      {
        slug: 'overview',
        title: 'Обзор',
        description: 'Three.js-слой редактора.',
        blocks: [
          {
            type: 'text',
            value:
              '@planara/three отвечает за визуализацию сцены, renderer, камеру и работу с объектами Three.js.',
          },
        ],
      },
      {
        slug: 'installation',
        title: 'Установка',
        description: 'Команда установки Three.js-пакета.',
        blocks: [
          {
            type: 'code',
            language: 'bash',
            value: 'npm install @planara/three',
          },
        ],
      },
      {
        slug: 'renderer',
        title: 'Renderer',
        description: 'Создание и обновление renderer.',
        blocks: [
          {
            type: 'code',
            language: 'ts',
            value: `import { createRenderer } from '@planara/three';

const renderer = createRenderer({
  canvas,
  width: 1200,
  height: 800,
});

renderer.render();`,
          },
        ],
      },
      {
        slug: 'viewport',
        title: 'Viewport',
        description: 'Работа с размерами и viewport.',
        blocks: [
          {
            type: 'code',
            language: 'ts',
            value: `renderer.resize({
  width: parent.clientWidth,
  height: parent.clientHeight,
});`,
          },
        ],
      },
    ],
  },

  types: {
    slug: 'types',
    name: '@planara/types',
    type: 'Types пакет',
    description: 'Общие TypeScript-типы для пакетов Planara.',
    sections: [
      {
        slug: 'overview',
        title: 'Обзор',
        description: 'Типы и контракты SDK.',
        blocks: [
          {
            type: 'text',
            value:
              '@planara/types содержит общие типы, которые используются core, three и react-пакетами.',
          },
        ],
      },
      {
        slug: 'installation',
        title: 'Установка',
        description: 'Команда установки types-пакета.',
        blocks: [
          {
            type: 'code',
            language: 'bash',
            value: 'npm install @planara/types',
          },
        ],
      },
      {
        slug: 'entities',
        title: 'Сущности',
        description: 'Основные типы сущностей редактора.',
        blocks: [
          {
            type: 'cards',
            items: [
              {
                title: 'ToolMode',
                description: 'Тип режима инструмента: translate, rotate, scale.',
              },
              {
                title: 'SelectMode',
                description: 'Тип режима выделения: mesh, edge, vertex.',
              },
              {
                title: 'SelectionStats',
                description: 'Статистика выбранного объекта.',
              },
            ],
          },
          {
            type: 'code',
            language: 'ts',
            value: `import type { ToolMode, SelectMode } from '@planara/types';

const toolMode: ToolMode = 'translate';
const selectMode: SelectMode = 'mesh';`,
          },
        ],
      },
    ],
  },
};

const copyToClipboard = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

type CodeBlockProps = {
  code: string;
  language: string;
};

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  return (
    <div className="sdk-docs-code">
      <div className="sdk-docs-code__header">
        <span>{language}</span>

        <button type="button" onClick={() => copyToClipboard(code)}>
          <CopyRegular />
          <span>Copy</span>
        </button>
      </div>

      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

type DocsBlocksProps = {
  blocks: DocsBlock[];
};

const DocsBlocks = ({ blocks }: DocsBlocksProps) => {
  return (
    <div className="sdk-docs-blocks">
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return (
            <p key={index} className="sdk-docs-section__text">
              {block.value}
            </p>
          );
        }

        if (block.type === 'code') {
          return <CodeBlock key={index} code={block.value} language={block.language} />;
        }

        return (
          <div key={index} className="sdk-docs-api">
            {block.items.map((item) => (
              <article key={item.title} className="sdk-docs-api__item">
                <div className="sdk-docs-api__icon">
                  <CodeRegular />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const SdkDocsPage = () => {
  const { packageSlug, sectionSlug } = useParams<{
    packageSlug: string;
    sectionSlug: string;
  }>();

  const currentPackage = packagesDocs[packageSlug ?? 'react'] ?? packagesDocs.react;

  const currentSection =
    currentPackage.sections.find((section) => section.slug === sectionSlug) ??
    currentPackage.sections[0];

  return (
    <SiteShell>
      <main className="sdk-docs-page">
        <aside className="sdk-docs-sidebar">
          <Link className="sdk-docs-sidebar__back" to="/sdk">
            <ArrowLeftRegular />
            <span>SDK</span>
          </Link>

          <div className="sdk-docs-sidebar__package">
            <div className="sdk-docs-sidebar__icon">
              <BoxRegular />
            </div>

            <div>
              <span className="sdk-docs-sidebar__name">{currentPackage.name}</span>
              <span className="sdk-docs-sidebar__type">{currentPackage.type}</span>
            </div>
          </div>

          <nav className="sdk-docs-sidebar__nav" aria-label="Навигация по документации">
            {currentPackage.sections.map((section) => (
              <NavLink
                key={section.slug}
                to={`/sdk/${currentPackage.slug}/docs/${section.slug}`}
                className={({ isActive }) =>
                  [
                    'sdk-docs-sidebar__nav-item',
                    isActive ? 'sdk-docs-sidebar__nav-item--active' : '',
                  ].join(' ')
                }
              >
                {section.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="sdk-docs-content">
          <section className="sdk-docs-section sdk-docs-section--page">
            <div className="sdk-docs-section__header">
              <p className="sdk-docs-section__eyebrow">{currentPackage.name}</p>

              <h1 className="sdk-docs-section__title">{currentSection.title}</h1>

              <p className="sdk-docs-section__lead">{currentSection.description}</p>
            </div>

            <DocsBlocks blocks={currentSection.blocks} />
          </section>

          <section className="sdk-docs-next">
            <div>
              <p className="sdk-docs-section__eyebrow">Package</p>
              <h2>{currentPackage.name}</h2>
              <p>{currentPackage.description}</p>
            </div>

            <DocumentRegular />
          </section>
        </section>
      </main>
    </SiteShell>
  );
};

export default SdkDocsPage;
