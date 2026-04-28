// Types
import type { ReactNode } from 'react';
import { UiIconBoxVariant } from '@/types';
// Components
import UiIconBox from './ui-icon-box';

type UiEmptyStateProps = {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
};

export const UiEmptyState = ({ icon, title, text, action }: UiEmptyStateProps) => {
  return (
    <div className="ui-empty-state">
      <UiIconBox icon={icon} variant={UiIconBoxVariant.Dark} />

      <h3 className="ui-empty-state__title">{title}</h3>

      <p className="ui-empty-state__text">{text}</p>

      {action && <div className="ui-empty-state__action">{action}</div>}
    </div>
  );
};

export default UiEmptyState;
