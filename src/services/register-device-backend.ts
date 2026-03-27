import { OneSignal } from 'react-native-onesignal';
import { Platform, AppState } from 'react-native';
import { api } from '../services/api'; // teu axios

// Variável para controlar se está tentando registrar
let isTryingToRegister = false;

// Listener para mudanças no estado do app
let appStateListener: any = null;

// Função para tentar registrar o dispositivo quando o Player ID estiver disponível
async function tryRegisterWithDelay() {
  if (isTryingToRegister) return;

  try {
    isTryingToRegister = true;
    const playerId = await OneSignal.User.getOnesignalId();
    if (playerId) {
      console.log('[OneSignal] Player ID disponível, registrando dispositivo...');
      await registerDeviceOnBackend();

      // Remove o listener após registrar com sucesso
      if (appStateListener) {
        appStateListener.remove();
        appStateListener = null;
      }
    }
  } catch (error) {
    console.log('[OneSignal] Player ID ainda não disponível:', error);
  } finally {
    isTryingToRegister = false;
  }
}

// Inicia o listener para quando o app voltar ao foreground
function startAppStateListener() {
  if (appStateListener) {
    appStateListener.remove();
  }

  appStateListener = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      console.log('[OneSignal] App voltou ao foreground, tentando registrar dispositivo...');
      tryRegisterWithDelay();
    }
  });
}

export async function registerDeviceOnBackend() {
  // Delay inicial para dar tempo ao OneSignal se inicializar após o login
  console.log('[OneSignal] Aguardando inicialização...');
  await new Promise<void>((resolve) => setTimeout(resolve, 2000));

  // Função para tentar obter o Player ID com exponential backoff
  const getPlayerIdWithRetry = async (maxRetries = 8, initialDelayMs = 1000): Promise<string | null> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const playerId = await OneSignal.User.getOnesignalId();
        if (playerId) {
          console.log(`[OneSignal] Player ID obtido na tentativa ${i + 1}:`, playerId);
          return playerId;
        }
      } catch (error) {
        console.log(`[OneSignal] Erro na tentativa ${i + 1}:`, error);
      }

      if (i < maxRetries - 1) {
        const delay = Math.min(initialDelayMs * Math.pow(2, i), 30000);
        console.log(`[OneSignal] Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
      }
    }

    return null;
  };

  // Tenta obter o Player ID com retry
  const playerId = await getPlayerIdWithRetry();

  if (!playerId) {
    console.log('[OneSignal] Player ID não disponível após múltiplas tentativas, tentando depois...');

    // Inicia o listener para quando o app voltar ao foreground
    startAppStateListener();

    // Tenta novamente em 10 segundos (pode ser útil se o OneSignal estiver inicializando)
    setTimeout(() => {
      tryRegisterWithDelay();
    }, 10000);

    return;
  }

  console.log('[OneSignal] Registrando dispositivo', { playerId });

  try {
    await api.post('devices/register', {
      playerId,
      platform: Platform.OS,
    });
    console.log('[OneSignal] Dispositivo registrado com sucesso');

    // Remove o listener se existir
    if (appStateListener) {
      appStateListener.remove();
      appStateListener = null;
    }
  } catch (error) {
    console.error('[OneSignal] Erro ao registrar dispositivo:', error);
    throw error;
  }
}
