// Core
import { type ChangeEvent, useMemo, useRef } from 'react';
// Routing
import { useNavigate, useParams } from 'react-router-dom';
// Icons
import {
  AddRegular,
  ArrowLeftRegular,
  BoxRegular,
  DeleteRegular,
  EyeOffRegular,
  EyeRegular,
  GridRegular,
  MoreHorizontalRegular,
  ShapeIntersectRegular,
} from '@fluentui/react-icons';
// Components
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
// Editor
import { makeEditorHandlers, useEditorHub } from '@planara/react';
// Shared
import { routeNames } from '@/shared';

type EditorToolbarProps = {
  statsOpen: boolean;
  onToggleStats: () => void;
};

export const EditorToolbar = ({ statsOpen, onToggleStats }: EditorToolbarProps) => {
  const navigate = useNavigate();

  const hub = useEditorHub();
  const handlers = useMemo(() => makeEditorHandlers(hub), [hub]);
  const { projectId } = useParams<{ projectId: string }>();

  const sceneInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const getExportFilename = (sourceFilename?: string) => {
    const extension = sourceFilename?.includes('.')
      ? sourceFilename.slice(sourceFilename.lastIndexOf('.'))
      : '.json';

    return `project-${projectId ?? 'untitled'}${extension}`;
  };

  const downloadFile = (content: string, mimeType: string, filename: string) => {
    const blob = new Blob([content], {
      type: mimeType,
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleLoadScene = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const response = handlers.loadScene(content);

      console.log('load scene response:', response);
    } catch (error) {
      console.error('Load scene failed:', error);
    } finally {
      event.target.value = '';
    }
  };

  const handleLoadModel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const response = handlers.loadFigure(content);

      console.log('load figure response:', response);
    } catch (error) {
      console.error('Load figure failed:', error);
    } finally {
      event.target.value = '';
    }
  };

  const handleExportProject = () => {
    const exportResponse = handlers.exportScene();

    console.log('export response:', exportResponse);

    if (!exportResponse?.result) {
      console.warn(exportResponse?.response?.message ?? 'Scene export failed');
      return;
    }

    const { result } = exportResponse;

    downloadFile(result.content, result.mimeType, getExportFilename(result.filename));
  };

  return (
    <header className="editor-toolbar">
      <div className="editor-toolbar__left">
        <button
          className="editor-toolbar__back"
          type="button"
          onClick={() => navigate(routeNames.PROJECTS_PAGE)}
        >
          <ArrowLeftRegular />
        </button>

        <div className="editor-toolbar__brand">
          <div className="editor-toolbar__logo">
            <BoxRegular />
          </div>

          <div>
            <p className="editor-toolbar__name">Planara Editor</p>
            <p className="editor-toolbar__caption">3D workspace</p>
          </div>
        </div>
      </div>

      <nav className="editor-toolbar__menus" aria-label="Панель редактора">
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className="editor-toolbar__menu-button"
              icon={<GridRegular />}
            >
              Вид
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={handlers.setPlaneMode}>Plane</MenuItem>
              <MenuItem onClick={handlers.setWireframeMode}>Wireframe</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className="editor-toolbar__menu-button"
              icon={<ShapeIntersectRegular />}
            >
              Трансформации
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={handlers.setTranslate}>Перемещение</MenuItem>
              <MenuItem onClick={handlers.setScale}>Масштабирование</MenuItem>
              <MenuItem onClick={handlers.setRotate}>Вращение</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className="editor-toolbar__menu-button"
              icon={<BoxRegular />}
            >
              Выделение
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={handlers.setMeshSelect}>Объект</MenuItem>
              <MenuItem onClick={handlers.setFaceSelect}>Грань</MenuItem>
              <MenuItem onClick={handlers.setEdgeSelect}>Ребро</MenuItem>
              <MenuItem onClick={handlers.setVertexSelect}>Вершина</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className="editor-toolbar__menu-button"
              icon={<AddRegular />}
            >
              Добавить
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={handlers.addPlane}>Плоскость</MenuItem>
              <MenuItem onClick={handlers.addCube}>Куб</MenuItem>
              <MenuItem onClick={handlers.addSphere}>Сфера</MenuItem>
              <MenuItem onClick={handlers.addUVSphere}>UV-сфера</MenuItem>
              <MenuItem onClick={handlers.addIcosphere}>Икосфера</MenuItem>
              <MenuItem onClick={handlers.addCylinder}>Цилиндр</MenuItem>
              <MenuItem onClick={handlers.addCone}>Конус</MenuItem>
              <MenuItem onClick={handlers.addPyramid}>Пирамида</MenuItem>
              <MenuItem onClick={handlers.addTetrahedron}>Тетраэдр</MenuItem>
              <MenuItem onClick={handlers.addOctahedron}>Октаэдр</MenuItem>
              <MenuItem onClick={handlers.addDodecahedron}>Додекаэдр</MenuItem>
              <MenuItem onClick={handlers.addTorusKnot}>Тороидальный узел</MenuItem>
              <MenuItem onClick={handlers.addCircle}>Окружность</MenuItem>
              <MenuItem onClick={handlers.addRing}>Кольцо</MenuItem>
              <MenuItem onClick={handlers.addCapsule}>Капсула</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className="editor-toolbar__menu-button"
              icon={statsOpen ? <EyeOffRegular /> : <EyeRegular />}
            >
              Панели
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={onToggleStats}>
                {statsOpen ? 'Скрыть статистику' : 'Показать статистику'}
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </nav>

      <div className="editor-toolbar__right">
        <button className="editor-toolbar__danger" type="button" onClick={handlers.deleteFigure}>
          <DeleteRegular />
          <span>Удалить</span>
        </button>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <button className="editor-toolbar__more" type="button" aria-label="Работа с файлами">
              <MoreHorizontalRegular />
            </button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => modelInputRef.current?.click()}>Загрузить модель</MenuItem>

              <MenuItem onClick={() => sceneInputRef.current?.click()}>Загрузить сцену</MenuItem>

              <MenuItem onClick={handleExportProject}>Экспортировать проект</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <input ref={modelInputRef} type="file" accept=".obj" hidden onChange={handleLoadModel} />

        <input ref={sceneInputRef} type="file" accept=".obj" hidden onChange={handleLoadScene} />
      </div>
    </header>
  );
};

export default EditorToolbar;
