// Types
import type { ReactNode } from 'react';
// Components
import UiBadge from './ui-badge';

type UiPageHeroProps = {
  badge: string;
  title: string;
  subtitle?: string;
  badgeIcon?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const UiPageHero = ({
  badge,
  title,
  subtitle,
  badgeIcon,
  actions,
  className = '',
}: UiPageHeroProps) => {
  return (
    <section className={['ui-page-hero', className].join(' ')}>
      <div className="ui-page-hero__content">
        <UiBadge icon={badgeIcon}>{badge}</UiBadge>

        <h1 className="ui-page-hero__title">{title}</h1>

        {subtitle && <p className="ui-page-hero__subtitle">{subtitle}</p>}
      </div>

      {actions && <div className="ui-page-hero__actions">{actions}</div>}
    </section>
  );
};

export default UiPageHero;
