// Types
import type { ReactNode } from 'react';
import { UiCardVariant, UiIconBoxVariant } from '@/types';
// Components
import UiCard from './ui-card';
import UiIconBox from './ui-icon-box';

type UiStatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  dark?: boolean;
  className?: string;
};

export const UiStatCard = ({
  label,
  value,
  icon,
  dark = false,
  className = '',
}: UiStatCardProps) => {
  return (
    <UiCard
      variant={dark ? UiCardVariant.Dark : UiCardVariant.Default}
      className={['ui-stat-card', className].join(' ')}
    >
      <UiIconBox icon={icon} variant={dark ? UiIconBoxVariant.Dark : UiIconBoxVariant.Dark} />

      <div>
        <p className="ui-stat-card__label">{label}</p>
        <p className="ui-stat-card__value">{value}</p>
      </div>
    </UiCard>
  );
};

export default UiStatCard;
