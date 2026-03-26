import { api } from './api';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

interface AnalyticsEvent {
  eventName: string;
  category?: 'navigation' | 'engagement' | 'conversion' | 'error' | 'performance';
  screen?: string;
  properties?: Record<string, string>;
}

interface ScreenView {
  screenName: string;
  duration?: number; // ms
}

// Buffer para enviar eventos em lote
let eventBuffer: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;
const FLUSH_INTERVAL = 10000; // 10 segundos
const MAX_BUFFER_SIZE = 20;

const getAppVersion = (): string => {
  return Constants.expoConfig?.version || '1.0.0';
};

const getPlatform = (): string => {
  return Platform.OS;
};

/**
 * Rastreia um evento de analytics
 */
export const trackEvent = (
  eventName: string,
  category?: AnalyticsEvent['category'],
  screen?: string,
  properties?: Record<string, string>
) => {
  const event: AnalyticsEvent = {
    eventName,
    category,
    screen,
    properties,
  };

  eventBuffer.push(event);

  // Flush imediato se buffer cheio
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    flushEvents();
  } else if (!flushTimeout) {
    // Agenda flush
    flushTimeout = setTimeout(flushEvents, FLUSH_INTERVAL);
  }
};

/**
 * Rastreia visualização de tela
 */
export const trackScreenView = async (screenName: string, duration?: number) => {
  try {
    await api.post('analytics/screen', {
      screenName,
      platform: getPlatform(),
      appVersion: getAppVersion(),
      clientTimestamp: new Date().toISOString(),
      duration,
    });
  } catch (error) {
    // Silently fail - analytics não deve quebrar o app
    if (__DEV__) console.log('[Analytics] Erro ao rastrear tela:', screenName);
  }
};

/**
 * Envia eventos em lote para o backend
 */
const flushEvents = async () => {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  if (eventBuffer.length === 0) return;

  const eventsToSend = [...eventBuffer];
  eventBuffer = [];

  try {
    await api.post('analytics/events/batch', {
      events: eventsToSend.map(e => ({
        ...e,
        platform: getPlatform(),
        appVersion: getAppVersion(),
        clientTimestamp: new Date().toISOString(),
      })),
    });
  } catch (error) {
    // Se falhar, adiciona de volta ao buffer (até o limite)
    eventBuffer = [...eventsToSend.slice(0, MAX_BUFFER_SIZE - eventBuffer.length), ...eventBuffer];
    if (__DEV__) console.log('[Analytics] Erro ao enviar eventos, mantidos no buffer');
  }
};

// ============================================
// EVENTOS PRÉ-DEFINIDOS
// ============================================

export const Analytics = {
  // Navegação
  screenView: (screenName: string) => trackScreenView(screenName),

  // Login/Auth
  loginSuccess: (method: 'email' | 'google' | 'apple' | 'biometric') =>
    trackEvent('login_success', 'conversion', 'login', { method }),

  loginFailure: (method: string, reason: string) =>
    trackEvent('login_failure', 'error', 'login', { method, reason }),

  logout: () => trackEvent('logout', 'engagement', 'settings'),

  // Onboarding
  onboardingStart: () => trackEvent('onboarding_start', 'conversion', 'onboarding'),

  onboardingStep: (step: number, stepName: string) =>
    trackEvent('onboarding_step', 'conversion', 'onboarding', { step: String(step), stepName }),

  onboardingComplete: () => trackEvent('onboarding_complete', 'conversion', 'onboarding'),

  // Exames
  examUploadStart: (type: string) =>
    trackEvent('exam_upload_start', 'engagement', 'upload', { examType: type }),

  examUploadSuccess: (type: string) =>
    trackEvent('exam_upload_success', 'conversion', 'upload', { examType: type }),

  examUploadFailure: (type: string, reason: string) =>
    trackEvent('exam_upload_failure', 'error', 'upload', { examType: type, reason }),

  examView: (examId: string) =>
    trackEvent('exam_view', 'engagement', 'exam_details', { examId }),

  // Health Score
  healthScoreView: () => trackEvent('health_score_view', 'engagement', 'home'),

  // Fitness
  fitnessSync: (source: string) =>
    trackEvent('fitness_sync', 'engagement', 'fitness', { source }),

  weightLog: () => trackEvent('weight_log', 'engagement', 'fitness'),

  // Notificações
  notificationOpen: (notificationId: string, type: string) =>
    trackEvent('notification_open', 'engagement', 'notification', { notificationId, type }),

  // Erros
  error: (errorType: string, message: string, screen?: string) =>
    trackEvent('app_error', 'error', screen, { errorType, message }),

  // Performance
  apiLatency: (endpoint: string, latencyMs: number) =>
    trackEvent('api_latency', 'performance', undefined, { endpoint, latencyMs: String(latencyMs) }),

  // Flush manual (chamar no AppState background)
  flush: flushEvents,
};

export default Analytics;
