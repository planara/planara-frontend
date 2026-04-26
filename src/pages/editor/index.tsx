// Editor
import { EditorCanvas, EditorProvider } from '@planara/react';
// Components
import { EditorToolbar } from '../../components/editor/editor-toolbar.tsx';
import FigureStats from '../../components/editor/figure-stats.tsx';

export const EditorPage = () => {
  return (
    <EditorProvider>
      <div className="editor__page">
        <EditorToolbar />

        <div className="editor__page__body">
          <div className="editor-renderer__container">
            <EditorCanvas className="editor-renderer__canvas" />
          </div>
        </div>

        <FigureStats />
      </div>
    </EditorProvider>
  );
};

export default EditorPage;
