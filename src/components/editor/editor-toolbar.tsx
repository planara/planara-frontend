import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';

import { makeEditorHandlers, useEditorHub } from '@planara/react';

import { routeNames } from '@/shared/constants/host-names';

type EditorToolbarProps = {
  statsOpen: boolean;
  onToggleStats: () => void;
};

export const EditorToolbar = ({ statsOpen, onToggleStats }: EditorToolbarProps) => {
  const navigate = useNavigate();

  const hub = useEditorHub();
  const handlers = useMemo(() => makeEditorHandlers(hub), [hub]);

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
              <MenuItem onClick={handlers.setTranslate}>Translate</MenuItem>
              <MenuItem onClick={handlers.setScale}>Scale</MenuItem>
              <MenuItem onClick={handlers.setRotate}>Rotate</MenuItem>
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
              <MenuItem onClick={handlers.setMeshSelect}>Mesh</MenuItem>
              <MenuItem onClick={handlers.setEdgeSelect}>Edge</MenuItem>
              <MenuItem onClick={handlers.setVertexSelect}>Vertex</MenuItem>
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
              <MenuItem onClick={handlers.addCube}>Cube</MenuItem>
              <MenuItem onClick={handlers.addCylinder}>Cylinder</MenuItem>
              <MenuItem onClick={handlers.addSphere}>Sphere</MenuItem>
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

        <button className="editor-toolbar__more" type="button" aria-label="Дополнительные действия">
          <MoreHorizontalRegular />
        </button>
      </div>
    </header>
  );
};

export default EditorToolbar;
