import { useState, useCallback } from 'react';

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

    setError(errorMessage);
  }, []);

  return {
    error,
    showError,
    clearError,
    handleApiError,
  };
}
