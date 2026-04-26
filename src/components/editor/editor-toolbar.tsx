// Core
import React, { useMemo } from "react";
// Editor
import { makeEditorHandlers, useEditorHub } from "@planara/react";
// Components
import { UiButton } from "../button";

export const EditorToolbar: React.FC = () => {
  const hub = useEditorHub();
  const handlers = useMemo(() => makeEditorHandlers(hub), [hub]);

  return (
    <div className="editor-buttons__layout">
      <UiButton text="Plane" onClick={handlers.setPlaneMode} />
      <UiButton text="Wireframe" onClick={handlers.setWireframeMode} />

      <UiButton text="Translate" onClick={handlers.setTranslate} />
      <UiButton text="Scale" onClick={handlers.setScale} />
      <UiButton text="Rotate" onClick={handlers.setRotate} />

      <UiButton text="Mesh" onClick={handlers.setMeshSelect} />
      <UiButton text="Edge" onClick={handlers.setEdgeSelect} />
      <UiButton text="Vertex" onClick={handlers.setVertexSelect} />

      <UiButton text="Add Cube" onClick={handlers.addCube} />
      <UiButton text="Add Cylinder" onClick={handlers.addCylinder} />
      <UiButton text="Add Sphere" onClick={handlers.addSphere} />

      <UiButton text="Delete" onClick={handlers.deleteFigure} />
    </div>
  );
};
