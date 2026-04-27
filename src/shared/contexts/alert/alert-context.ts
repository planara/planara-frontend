// Core
import { createContext } from 'react';
// Types
import type { AlertContextType } from '@/types/contexts/alert-context-type';

/**
 * Контекст уведомлений.
 *
 * Предоставляет доступ к состоянию и методам для управления уведомлениями:
 * добавление и удаление уведомлений.
 *
 * Используется в `AlertProvider`, и доступен через `useContext(AlertContext)`.
 *
 * Значение по умолчанию — `undefined`, поэтому необходимо использовать внутри `AlertProvider`.
 *
 * @example
 * ```tsx
 * const {alerts, addAlert, removeAlert} = useContext(AlertContext)!;
 * addAlert("Что-то произошло!");
 * ```
 */
export const AlertContext = createContext<AlertContextType | undefined>(undefined);
