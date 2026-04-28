import { useState } from 'react';

import { DesktopRegular, ArrowLeftRegular } from '@fluentui/react-icons';

// Editor
import { EditorCanvas, EditorProvider } from '@planara/react';
// Components
import EditorToolbar from '@/components/editor/editor-toolbar';
import FigureStats from '@/components/editor/figure-stats';

import { routeNames } from '@/shared/constants/host-names';

export const EditorPage = () => {
  const [statsOpen, setStatsOpen] = useState(true);

  const toggleStats = () => {
    setStatsOpen((prev) => !prev);
  };

  return (
    <EditorProvider>
      <main className="editor-page">
        <section className="editor-desktop-only">
          <div className="editor-desktop-only__card">
            <div className="editor-desktop-only__visual">
              <div className="editor-desktop-only__grid" />

              <div className="editor-desktop-only__icon">
                <DesktopRegular />
              </div>
            </div>

            <div className="editor-desktop-only__content">
              <p className="editor-desktop-only__eyebrow">Planara Editor</p>

              <h1 className="editor-desktop-only__title">Редактор доступен только на десктопе</h1>

              <p className="editor-desktop-only__text">
                Для работы с 3D-сценой, инструментами трансформации и выделением откройте редактор
                на устройстве с большим экраном.
              </p>

              <a className="editor-desktop-only__button" href={routeNames.PROJECTS_PAGE}>
                <ArrowLeftRegular />
                <span>Вернуться к проектам</span>
              </a>
            </div>
          </div>
        </section>

        <section className="editor-workspace">
          <EditorToolbar statsOpen={statsOpen} onToggleStats={toggleStats} />

          <section className="editor-page__body">
            <div className="editor-renderer">
              <EditorCanvas className="editor-renderer__canvas" />
              <FigureStats open={statsOpen} onClose={toggleStats} />
            </div>
          </section>
        </section>
      </main>
    </EditorProvider>
  );
};

export default EditorPage;
