import { DismissRegular } from '@fluentui/react-icons';

import { useSelectionStats } from '@planara/react';

type FigureStatsProps = {
  open: boolean;
  onClose: () => void;
};

const formatValue = (value: number) => {
  return value.toFixed(2);
};

export const FigureStats = ({ open, onClose }: FigureStatsProps) => {
  const stats = useSelectionStats();

  return (
    <aside
      className={['figure-stats', open ? 'figure-stats--open' : 'figure-stats--closed'].join(' ')}
    >
      <div className="figure-stats__header">
        <p className="figure-stats__eyebrow">Inspector</p>

        <button className="figure-stats__close" type="button" onClick={onClose}>
          <DismissRegular />
        </button>
      </div>

      {!stats ? (
        <div className="figure-stats__empty">
          <span className="figure-stats__dot" />
          <span>Ничего не выбрано</span>
        </div>
      ) : (
        <div className="figure-stats__list">
          <div className="figure-stats__group">
            <span className="figure-stats__label">Position</span>
            <span className="figure-stats__value">
              {formatValue(stats.position.x)} / {formatValue(stats.position.y)} /{' '}
              {formatValue(stats.position.z)}
            </span>
          </div>

          <div className="figure-stats__group">
            <span className="figure-stats__label">Rotation</span>
            <span className="figure-stats__value">
              {formatValue(stats.rotation.x)} / {formatValue(stats.rotation.y)} /{' '}
              {formatValue(stats.rotation.z)}
            </span>
          </div>

          <div className="figure-stats__group">
            <span className="figure-stats__label">Scale</span>
            <span className="figure-stats__value">
              {formatValue(stats.scale.x)} / {formatValue(stats.scale.y)} /{' '}
              {formatValue(stats.scale.z)}
            </span>
          </div>

          <div className="figure-stats__group">
            <span className="figure-stats__label">Size</span>
            <span className="figure-stats__value">
              {formatValue(stats.size.x)} / {formatValue(stats.size.y)} /{' '}
              {formatValue(stats.size.z)}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FigureStats;
