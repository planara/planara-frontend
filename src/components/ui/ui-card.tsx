// Types
import type { HTMLAttributes, ReactNode } from 'react';
import { UiCardVariant } from '@/types';

type UiCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: UiCardVariant;
};

export const UiCard = ({
  children,
  className = '',
  variant = UiCardVariant.Default,
  ...props
}: UiCardProps) => {
  return (
    <div {...props} className={['ui-card', `ui-card--${variant.toString()}`, className].join(' ')}>
      {children}
    </div>
  );
};

export default UiCard;
