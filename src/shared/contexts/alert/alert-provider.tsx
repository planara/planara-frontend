import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { AlertContext } from './alert-context';
import type { AlertType } from '@/types/layout/alert/alert-type';
import { AlertPosition } from '@/types/layout/alert/alert-position';
import { AlertStatus } from '@/types/layout/alert/alert-status';

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = useCallback((message: string, status: AlertStatus, position: AlertPosition) => {
    setAlerts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        message,
        status,
        position,
      },
    ]);
  }, []);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      alerts,
      addAlert,
      removeAlert,
    }),
    [alerts, addAlert, removeAlert],
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
