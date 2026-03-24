import * as Sentry from '@sentry/react-native';
import { initSentry, setSentryUser, clearSentryUser, captureError, addBreadcrumb, captureMessage, setTag } from './sentryService';

// Sentry é mockado no jest.setup.ts

describe('sentryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initSentry', () => {
    it('não deve inicializar sem DSN', () => {
      // EXPO_PUBLIC_SENTRY_DSN não está definido no teste
      initSentry();
      expect(Sentry.init).not.toHaveBeenCalled();
    });
  });

  describe('setSentryUser', () => {
    it('deve definir o usuário no Sentry', () => {
      setSentryUser({ id: '123', email: 'user@test.com', name: 'Test User' });

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: '123',
        email: 'user@test.com',
        username: 'Test User',
      });
    });

    it('deve aceitar apenas id obrigatório', () => {
      setSentryUser({ id: '456' });

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: '456',
        email: undefined,
        username: undefined,
      });
    });
  });

  describe('clearSentryUser', () => {
    it('deve limpar o usuário no Sentry', () => {
      clearSentryUser();
      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  describe('captureError', () => {
    it('deve capturar Error com contexto', () => {
      const error = new Error('Teste de erro');
      captureError(error, { screen: 'Home' });

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        extra: { screen: 'Home' },
      });
    });

    it('deve capturar string como message', () => {
      captureError('Erro como string', { source: 'test' });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Erro como string', {
        level: 'error',
        extra: { source: 'test' },
      });
    });
  });

  describe('addBreadcrumb', () => {
    it('deve adicionar breadcrumb', () => {
      addBreadcrumb('navigation', 'Navegou para Home', { route: 'Home' });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'navigation',
        message: 'Navegou para Home',
        data: { route: 'Home' },
        level: 'info',
      });
    });

    it('deve aceitar nível customizado', () => {
      addBreadcrumb('error', 'Erro crítico', undefined, 'error');

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'error',
        message: 'Erro crítico',
        data: undefined,
        level: 'error',
      });
    });
  });

  describe('captureMessage', () => {
    it('deve capturar mensagem com nível padrão', () => {
      captureMessage('Info de teste');
      expect(Sentry.captureMessage).toHaveBeenCalledWith('Info de teste', 'info');
    });
  });

  describe('setTag', () => {
    it('deve definir tag global', () => {
      setTag('environment', 'staging');
      expect(Sentry.setTag).toHaveBeenCalledWith('environment', 'staging');
    });
  });
});
