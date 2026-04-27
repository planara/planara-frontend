// Core
import { createContext } from 'react';
// Types
import type { LoadingContextType } from '@/types/contexts/loading-context-type';

/**
 * Контекст загрузки.
 * Используется для управления глобальным состоянием загрузки в приложении.
 *
 * Должен использоваться через `LoadingProvider`.
 */
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
