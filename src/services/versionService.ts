import { api } from './api';
import Constants from 'expo-constants';
import { Platform, Linking } from 'react-native';

const FALLBACK_APP_STORE_URL = 'https://apps.apple.com/br/app/examinus/id6754453015';
const FALLBACK_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.examinus.app';

export type VersionMode = 'ok' | 'force';

export interface VersionInfo {
  mode: VersionMode;
  latestVersion: string;
  storeUrl?: string;
  updateMessage?: string;
}

/**
 * Compara duas versões semânticas (ex: "1.2.3")
 * Retorna -1, 0 ou 1. Mantida como utilitária pública;
 * a decisão de força agora é feita pelo backend via Mode.
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  while (v1Parts.length < 3) v1Parts.push(0);
  while (v2Parts.length < 3) v2Parts.push(0);

  for (let i = 0; i < 3; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1;
    if (v1Parts[i] < v2Parts[i]) return -1;
  }

  return 0;
}

export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version || '1.0.0';
}

/**
 * Pergunta ao backend se a versão atual precisa atualizar.
 * Política: backend decide com base em platform + version.
 * Fail-open: qualquer erro de rede/parsing → needsUpdate=false.
 */
export async function checkForceUpdate(): Promise<{
  needsUpdate: boolean;
  versionInfo: VersionInfo | null;
}> {
  try {
    const response = await api.get('app/version', {
      params: {
        platform: Platform.OS,
        version: getCurrentAppVersion(),
      },
    });

    const data = response.data?.data;
    const versionInfo: VersionInfo = {
      mode: (data?.mode as VersionMode) ?? 'ok',
      latestVersion: data?.latestVersion ?? '',
      storeUrl: data?.storeUrl ?? undefined,
      updateMessage: data?.updateMessage ?? undefined,
    };

    return {
      needsUpdate: versionInfo.mode === 'force',
      versionInfo,
    };
  } catch (error) {
    if (__DEV__) console.log('Erro ao verificar versão:', error);
    return {
      needsUpdate: false,
      versionInfo: null,
    };
  }
}

/**
 * Abre a loja. Usa o storeUrl vindo do backend quando disponível;
 * cai pra URL fixa por plataforma se não vier.
 */
export async function openAppStore(storeUrl?: string): Promise<void> {
  const fallback = Platform.OS === 'ios' ? FALLBACK_APP_STORE_URL : FALLBACK_PLAY_STORE_URL;
  const url = storeUrl || fallback;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      if (__DEV__) console.log('Não foi possível abrir a loja de aplicativos');
    }
  } catch (error) {
    if (__DEV__) console.log('Erro ao abrir loja de aplicativos:', error);
  }
}
