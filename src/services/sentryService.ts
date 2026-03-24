import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

/**
 * Inicializa o Sentry para captura de erros, performance e breadcrumbs.
 * Deve ser chamado o mais cedo possível no App.tsx.
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    if (__DEV__) {
      console.warn('[Sentry] DSN não configurado. Defina EXPO_PUBLIC_SENTRY_DSN no .env');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    debug: __DEV__,
    enabled: !__DEV__, // Desativado em desenvolvimento
    environment: __DEV__ ? 'development' : 'production',
    release: `com.examinus.app@${Constants.expoConfig?.version || '1.0.0'}`,
    dist: Platform.OS === 'ios'
      ? Constants.expoConfig?.ios?.buildNumber
      : String(Constants.expoConfig?.android?.versionCode || '1'),

    // Performance monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.2, // 20% em prod
    profilesSampleRate: __DEV__ ? 1.0 : 0.1, // 10% em prod

    // Filtrar eventos
    beforeSend(event) {
      // Não enviar erros de rede comuns (timeout, sem conexão)
      const message = event.exception?.values?.[0]?.value || '';
      if (
        message.includes('Network Error') ||
        message.includes('timeout') ||
        message.includes('ECONNABORTED')
      ) {
        // Ainda envia mas com fingerprint para agrupar
        event.fingerprint = ['network-error'];
      }
      return event;
    },

    // Breadcrumbs automáticos
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    attachStacktrace: true,
  });
}

/**
 * Define o contexto do usuário no Sentry (após login).
 */
export function setSentryUser(user: { id: string; email?: string; name?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

/**
 * Limpa o contexto do usuário (após logout).
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Captura um erro manualmente com contexto adicional.
 */
export function captureError(error: Error | string, context?: Record<string, any>) {
  if (typeof error === 'string') {
    Sentry.captureMessage(error, {
      level: 'error',
      extra: context,
    });
  } else {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

/**
 * Adiciona um breadcrumb manual para rastreamento.
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, any>,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
  });
}

/**
 * Captura uma mensagem informativa.
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Inicia uma transação de performance (para medir tempos customizados).
 */
export function startSpan(name: string, op: string) {
  return Sentry.startSpan({ name, op }, (span) => span);
}

/**
 * Define um tag global (ex: feature flag, versão do backend).
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * Wrapper para funções async com captura automática de erros.
 */
export function withSentryScope<T>(
  callback: () => Promise<T>,
  scopeConfig?: { tags?: Record<string, string>; extra?: Record<string, any> }
): Promise<T> {
  return Sentry.withScope(async (scope) => {
    if (scopeConfig?.tags) {
      Object.entries(scopeConfig.tags).forEach(([key, value]) => scope.setTag(key, value));
    }
    if (scopeConfig?.extra) {
      Object.entries(scopeConfig.extra).forEach(([key, value]) => scope.setExtra(key, value));
    }
    try {
      return await callback();
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  });
}

/**
 * Rastreia uma ação do usuário (clique em botão, interação crítica).
 * Gera um breadcrumb + evento custom para poder buscar no Sentry.
 * Use em botões/ações que usuários reportam como "não funcionando".
 */
export function trackUserAction(
  action: string,
  screen: string,
  data?: Record<string, any>
) {
  // Breadcrumb para contexto em caso de erro futuro
  addBreadcrumb('user.action', `${action} em ${screen}`, data);

  // Evento custom para buscar no Sentry (Issues > Custom Events)
  Sentry.captureMessage(`[UserAction] ${action}`, {
    level: 'info',
    tags: {
      action,
      screen,
    },
    extra: data,
  });
}

/**
 * Rastreia quando uma ação do usuário falha silenciosamente
 * (sem erro, mas o resultado esperado não aconteceu).
 */
export function trackSilentFailure(
  action: string,
  screen: string,
  reason: string,
  data?: Record<string, any>
) {
  Sentry.captureMessage(`[SilentFailure] ${action}: ${reason}`, {
    level: 'warning',
    tags: {
      action,
      screen,
      failure_type: 'silent',
    },
    extra: data,
  });
}

export { Sentry };
