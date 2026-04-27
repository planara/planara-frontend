// Core
import { useContext } from 'react';
// Contexts
import { LoadingContext } from '@/shared/contexts/loading/loading-context';
// Types
import type { LoadingContextType } from '@/types/contexts/loading-context-type';

/**
 * Хук для доступа к контексту загрузки.
 *
 * Должен вызываться только внутри компонента, обёрнутого в `LoadingProvider`.
 *
 * @throws {Error} Если используется вне `LoadingProvider`.
 *
 * @returns {LoadingContextType} Контекст загрузки.
 *
 * @example
 * const {loading, startLoading, stopLoading} = useLoading();
 */
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within an LoadingProvider');
  }

  return context;
};
