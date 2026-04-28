// Types
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { UiButtonVariant, UiButtonSize } from '@/types';

type UiButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: UiButtonVariant;
  size?: UiButtonSize;
  icon?: ReactNode;
  iconPosition?: 'before' | 'after';
  fullWidth?: boolean;
};

export const UiButton = ({
  children,
  className = '',
  variant = UiButtonVariant.Light,
  size = UiButtonSize.Medium,
  icon,
  iconPosition = 'before',
  fullWidth = false,
  type = 'button',
  ...props
}: UiButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={[
        'ui-button',
        `ui-button--${variant.toString()}`,
        `ui-button--${size.toString()}`,
        fullWidth ? 'ui-button--full' : '',
        className,
      ].join(' ')}
    >
      {icon && iconPosition === 'before' && <span className="ui-button__icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'after' && <span className="ui-button__icon">{icon}</span>}
    </button>
  );
};

export default UiButton;
