// Types
import type { ReactNode } from 'react';
import { UiIconBoxVariant } from '@/types';

type UiIconBoxProps = {
  icon: ReactNode;
  variant?: UiIconBoxVariant;
  className?: string;
};

export const UiIconBox = ({
  icon,
  variant = UiIconBoxVariant.Light,
  className = '',
}: UiIconBoxProps) => {
  return (
    <div className={['ui-icon-box', `ui-icon-box--${variant}`, className].join(' ')}>{icon}</div>
  );
};

export default UiIconBox;
