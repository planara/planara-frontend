// Core
import React, { type JSX, useState } from 'react';
// Types
import type { AlertType } from '@/types/layout/alert/alert-type.ts';
import { AlertPosition } from '@/types/layout/alert/alert-position';
import { AlertStatus } from '@/types/layout/alert/alert-status';
// Contexts
import { AlertContext } from './alert-context';

/** Провайдер контекста оповещений. */
export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  /**
   * Добавляет новое уведомление.
   * @param {string} message - Сообщение для уведомления.
   * @param status - Тип сообщения
   * @param position - Расположение на странице
   */
  const addAlert = (message: string, status: AlertStatus, position: AlertPosition) => {
    const id = Date.now();
    setAlerts([...alerts, { id, message, status, position }]);
  };

  /**
   * Удаляет уведомление по ID.
   * @param {number} id - Идентификатор уведомления для удаления.
   */
  const removeAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
