// Core
import type { ReactNode } from 'react';
// Components
import { AppFooter, AppHeader } from '@/components';

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
