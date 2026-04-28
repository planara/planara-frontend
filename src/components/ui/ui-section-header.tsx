// Types
import type { ReactNode } from 'react';

type UiSectionHeaderProps = {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  className?: string;
};

export const UiSectionHeader = ({
  eyebrow,
  title,
  actions,
  className = '',
}: UiSectionHeaderProps) => {
  return (
    <div className={['ui-section-header', className].join(' ')}>
      <div>
        <p className="ui-section-header__eyebrow">{eyebrow}</p>
        <h2 className="ui-section-header__title">{title}</h2>
      </div>

      {actions && <div className="ui-section-header__actions">{actions}</div>}
    </div>
  );
};

export default UiSectionHeader;
