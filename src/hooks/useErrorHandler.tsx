import { useState, useCallback } from 'react';
import { captureError, addBreadcrumb } from '@services/sentryService';

interface UseErrorHandlerReturn {
  error: string | null;
  showError: (message: string) => void;
  clearError: () => void;
  handleApiError: (error: any) => void;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    addBreadcrumb('ui.error', message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((error: any) => {
    let errorMessage = 'Erro desconhecido';

    if (error?.response?.data?.message) {
      // Erro de API com estrutura padrão
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      // Erro JavaScript padrão
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      // Erro como string
      errorMessage = error;
    }

    // Reportar ao Sentry
    captureError(
      error instanceof Error ? error : new Error(errorMessage),
      {
        source: 'useErrorHandler',
        originalError: typeof error === 'object' ? JSON.stringify(error) : error,
      }
    );

    setError(errorMessage);
  }, []);

  return {
    error,
    showError,
    clearError,
    handleApiError,
  };
}
