// Types
import type { AlertStatus } from '@/types/layout/alert/alert-status.ts';
import type { AlertPosition } from '@/types/layout/alert/alert-position.ts';

/**
 * Тип, представляющий уведомление.
 * @property {number} id - ID уведомления.
 * @property {string} message - Текст сообщения уведомления.
 */
export type AlertType = {
  id: number;
  message: string;
  status: AlertStatus;
  position: AlertPosition;
};
