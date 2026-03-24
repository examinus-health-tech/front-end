import { renderHook, act } from '@testing-library/react-native';
import { useErrorHandler } from './useErrorHandler';

// Mock do sentryService
jest.mock('@services/sentryService', () => ({
  captureError: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar sem erro', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.error).toBeNull();
  });

  it('deve mostrar erro com showError', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showError('Algo deu errado');
    });

    expect(result.current.error).toBe('Algo deu errado');
  });

  it('deve limpar erro com clearError', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showError('Erro');
    });
    expect(result.current.error).toBe('Erro');

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('deve tratar erro de API com message string', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleApiError({ message: 'Sessão expirada' });
    });

    expect(result.current.error).toBe('Sessão expirada');
  });

  it('deve tratar erro de API com response.data.message', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleApiError({
        response: { data: { message: 'Email já cadastrado' } },
      });
    });

    expect(result.current.error).toBe('Email já cadastrado');
  });

  it('deve tratar erro string diretamente', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleApiError('Erro simples');
    });

    expect(result.current.error).toBe('Erro simples');
  });

  it('deve reportar ao Sentry via captureError', () => {
    const { captureError } = require('@services/sentryService');
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleApiError(new Error('Erro para Sentry'));
    });

    expect(captureError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ source: 'useErrorHandler' })
    );
  });
});
