// Types
import type { ReactNode } from 'react';

type UiBadgeProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export const UiBadge = ({ children, icon, className = '' }: UiBadgeProps) => {
  return (
    <div className={['ui-badge', className].join(' ')}>
      {icon && <span className="ui-badge__icon">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

export default UiBadge;
