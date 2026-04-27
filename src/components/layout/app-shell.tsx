// Core
import type { ReactNode } from 'react';
// Components
import { AppFooter } from '@/components/layout/app-footer';
import { AppHeader } from '@/components/layout/app-header';

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-shell__content">{children}</div>
      <AppFooter />
    </div>
  );
};

export default AppShell;
