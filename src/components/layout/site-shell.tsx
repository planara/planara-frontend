// Core
import type { ReactNode } from 'react';
// Components
import { AppFooter } from '@/components/layout/app-footer';

type SiteShellProps = {
  children: ReactNode;
};

export const SiteShell = ({ children }: SiteShellProps) => {
  return (
    <div className="app-shell">
      <div className="app-shell__content">{children}</div>
      <AppFooter />
    </div>
  );
};

export default SiteShell;
