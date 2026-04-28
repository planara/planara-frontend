import type { ReactNode } from 'react';

type UiSectionPanelProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badges?: ReactNode[];
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const UiSectionPanel = ({
  eyebrow,
  title,
  subtitle,
  badges,
  children,
  className = '',
  contentClassName = '',
}: UiSectionPanelProps) => {
  return (
    <section className={['ui-section-panel', className].join(' ')}>
      <div className="ui-section-panel__header">
        <div>
          {eyebrow && <p className="ui-section-panel__eyebrow">{eyebrow}</p>}

          <h2 className="ui-section-panel__title">{title}</h2>

          {subtitle && <p className="ui-section-panel__subtitle">{subtitle}</p>}
        </div>

        {badges && badges.length > 0 && (
          <div className="ui-section-panel__badges">
            {badges.map((badge, index) => (
              <span key={index} className="ui-section-panel__badge">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={['ui-section-panel__content', contentClassName].join(' ')}>{children}</div>
    </section>
  );
};

export default UiSectionPanel;
