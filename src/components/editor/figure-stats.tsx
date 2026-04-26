// Core
import React from 'react';
// Editor
import { useSelectionStats } from '@planara/react';

export const FigureStats: React.FC = () => {
  const stats = useSelectionStats();

  if (!stats) {
    return <div className="figure-stats__layout">Ничего не выбрано</div>;
  }

  const { position, rotation, scale, size } = stats;

  return (
    <div className="figure-stats__layout">
      <div>
        Position: {position.x.toFixed(2)} / {position.y.toFixed(2)} / {position.z.toFixed(2)}
      </div>
      <div>
        Rotation: {rotation.x.toFixed(2)} / {rotation.y.toFixed(2)} / {rotation.z.toFixed(2)}
      </div>
      <div>
        Scale: {scale.x.toFixed(2)} / {scale.y.toFixed(2)} / {scale.z.toFixed(2)}
      </div>
      <div>
        Size: {size.x.toFixed(2)} / {size.y.toFixed(2)} / {size.z.toFixed(2)}
      </div>
    </div>
  );
};

export default FigureStats;
