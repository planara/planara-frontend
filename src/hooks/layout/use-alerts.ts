// Core
import { useContext } from 'react';
// Contexts
import { AlertContext } from '@/shared/contexts/alert/alert-context';
// Types
import type { AlertContextType } from '@/types/contexts/alert-context-type';

/**
 * Хук для доступа к контексту уведомлений.
 *
 * Предоставляет методы `addAlert`, `removeAlert` и список `alerts` из `AlertContext`.
 * Должен использоваться только внутри компонента, обёрнутого в `AlertProvider`.
 *
 * @throws {Error} Если используется вне `AlertProvider`.
 *
 * @returns {AlertContextType} Контекст уведомлений.
 *
 * @example
 * ```tsx
 * const { alerts, addAlert, removeAlert } = useAlerts();
 * addAlert("Новое уведомление!");
 * ```
 */
export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
