// Core
import React, { useState } from 'react';
// Contexts
import { LoadingContext } from './loading-context';

/**
 * Провайдер контекста загрузки.
 *
 * Оборачивает дочерние компоненты и предоставляет методы управления состоянием загрузки.
 *
 * @param {Object} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Дочерние компоненты, которым нужен доступ к контексту загрузки.
 *
 * @example
 * <LoadingProvider>
 *   <App />
 * </LoadingProvider>
 */
export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
