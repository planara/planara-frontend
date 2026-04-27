// Types
import type { AlertStatus } from '@/types/layout/alert/alert-status';
import type { AlertType } from '@/types/layout/alert/alert-type';
import type { AlertPosition } from '@/types/layout/alert/alert-position';

/**
 * Тип контекста уведомлений.
 *
 * @property {AlertType[]} alerts - Список текущих уведомлений.
 * @property {(message: string) => void} addAlert - Функция для добавления нового уведомления.
 * @property {(id: number) => void} removeAlert - Функция для удаления уведомления по ID.
 *
 * @example
 * ```tsx
 * const { alerts, addAlert, removeAlert } = useContext(AlertContext)!;
 * addAlert('Произошла ошибка!');
 * removeAlert(1234567890);
 * console.log(alerts);
 * ```
 */
export type AlertContextType = {
  /**
   * Контейнер для хранения уведомлений
   */
  alerts: AlertType[];
  /**
   * Метод для добавления уведомления в очередь
   * @param message - Сообщение для уведомления
   * @example
   * ```tsx
   * addAlert({message});
   * ```
   */
  addAlert: (message: string, status: AlertStatus, position: AlertPosition) => void;
  /**
   * Метод для удаления уведомления из очереди
   * @param id - ID уведомления, которое нужно удалить
   * @example
   * ```tsx
   * removeAlert({id});
   * ```
   */
  removeAlert: (id: number) => void;
};
