import { api } from './api';
import Constants from 'expo-constants';
import { Platform, Linking } from 'react-native';

// URLs das lojas de aplicativos
const APP_STORE_URL = 'https://apps.apple.com/br/app/examinus/id6754453015';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.examinus.app';

export interface VersionInfo {
  minVersion: string;
  latestVersion: string;
  forceUpdate: boolean;
  updateMessage?: string;
}

/**
 * Compara duas versões semânticas (ex: "1.2.3")
 * Retorna:
 *  -1 se version1 < version2
 *   0 se version1 == version2
 *   1 se version1 > version2
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  // Garantir que ambos tenham 3 partes (major.minor.patch)
  while (v1Parts.length < 3) v1Parts.push(0);
  while (v2Parts.length < 3) v2Parts.push(0);

  for (let i = 0; i < 3; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1;
    if (v1Parts[i] < v2Parts[i]) return -1;
  }

  return 0;
}

/**
 * Obtém a versão atual do app
 */
export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version || '1.0.0';
}

/**
 * Verifica se o app precisa de atualização obrigatória
 */
export async function checkForceUpdate(): Promise<{
  needsUpdate: boolean;
  versionInfo: VersionInfo | null;
}> {
  try {
    const response = await api.get('/app/version');
    const versionInfo: VersionInfo = {
      minVersion: response.data?.data?.minVersion || '1.0.0',
      latestVersion: response.data?.data?.latestVersion || '1.0.0',
      forceUpdate: response.data?.data?.forceUpdate || false,
      updateMessage: response.data?.data?.updateMessage,
    };

    const currentVersion = getCurrentAppVersion();
    const needsUpdate = compareVersions(currentVersion, versionInfo.minVersion) < 0;

    return {
      needsUpdate: needsUpdate || versionInfo.forceUpdate,
      versionInfo,
    };
  } catch (error) {
    if (__DEV__) console.log('Erro ao verificar versão:', error);
    // Em caso de erro, não bloquear o usuário
    return {
      needsUpdate: false,
      versionInfo: null,
    };
  }
}

/**
 * Abre a loja de aplicativos correspondente à plataforma
 */
export async function openAppStore(): Promise<void> {
  const storeUrl = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;

  try {
    const canOpen = await Linking.canOpenURL(storeUrl);
    if (canOpen) {
      await Linking.openURL(storeUrl);
    } else {
      if (__DEV__) console.log('Não foi possível abrir a loja de aplicativos');
    }
  } catch (error) {
    if (__DEV__) console.log('Erro ao abrir loja de aplicativos:', error);
  }
}
