/**
 * Тип контекста загрузки.
 *
 * @property {boolean} loading - Состояние загрузки (true — если идёт загрузка).
 * @property startLoading - Функция для начала загрузки.
 * @property stopLoading - Функция для завершения загрузки.
 *
 * @example
 * startLoading();
 * // async operation
 * stopLoading();
 */
export type LoadingContextType = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};
