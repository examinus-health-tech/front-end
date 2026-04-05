import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { api } from 'src/services/api';

// Chaves para armazenamento seguro (apenas alfanumericos, ".", "-" e "_")
const BIOMETRIC_TOKEN_KEY = 'examinus_biometric_token';
const BIOMETRIC_ENABLED_KEY = 'examinus_biometric_enabled';

interface BiometricTokenData {
  biometricToken: string;
  userId: string;
  expiresAt: string;
}

interface BiometricAuthResult {
  success: boolean;
  error?: string;
  userData?: {
    userId: string;
    name: string;
    fullName: string;
    email: string;
    token: string;
  };
}

// Obter identificador unico do dispositivo
async function getDeviceId(): Promise<string> {
  try {
    if (Platform.OS === 'ios') {
      const iosId = await Application.getIosIdForVendorAsync();
      return iosId || 'ios-unknown';
    }
    const androidId = Application.getAndroidId();
    return androidId || 'android-unknown';
  } catch (error) {
    if (__DEV__) console.error('👆 [BIOMETRIC] Erro ao obter deviceId:', error);
    return `${Platform.OS}-fallback-${Date.now()}`;
  }
}

export function useBiometricAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricType, setBiometricType] = useState<string | null>(null);

  // Verifica se o dispositivo suporta biometria
  const checkBiometricAvailability = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        if (__DEV__) console.log('👆 [BIOMETRIC] Dispositivo nao possui hardware biometrico');
        setIsAvailable(false);
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        if (__DEV__) console.log('👆 [BIOMETRIC] Nenhuma biometria cadastrada no dispositivo');
        setIsAvailable(false);
        return false;
      }

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      let type = 'Biometria';
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        type = Platform.OS === 'ios' ? 'Face ID' : 'Reconhecimento Facial';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        type = Platform.OS === 'ios' ? 'Touch ID' : 'Impressao Digital';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        type = 'Iris';
      }

      if (__DEV__) console.log('👆 [BIOMETRIC] Tipo de biometria disponivel:', type);
      setBiometricType(type);
      setIsAvailable(true);
      return true;
    } catch (error) {
      if (__DEV__) console.error('👆 [BIOMETRIC] Erro ao verificar disponibilidade:', error);
      setIsAvailable(false);
      return false;
    }
  }, []);

  // Verifica se a biometria esta habilitada (tem token valido)
  // Se currentUserId for fornecido, verifica se o token pertence a esse usuário
  const checkBiometricEnabled = useCallback(async (currentUserId?: string) => {
    try {
      const tokenData = await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);

      if (!tokenData) {
        setIsEnabled(false);
        return false;
      }

      const parsed: BiometricTokenData = JSON.parse(tokenData);

      // Verifica se o token expirou
      const expiresAt = new Date(parsed.expiresAt);
      if (expiresAt < new Date()) {
        if (__DEV__) console.log('👆 [BIOMETRIC] Token expirado, removendo...');
        await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
        setIsEnabled(false);
        return false;
      }

      // Se um userId foi fornecido, verifica se o token pertence a esse usuário
      if (currentUserId && parsed.userId !== currentUserId) {
        if (__DEV__) console.log('👆 [BIOMETRIC] Token pertence a outro usuário, ignorando...');
        setIsEnabled(false);
        return false;
      }

      if (__DEV__) console.log('👆 [BIOMETRIC] Token valido encontrado para o usuário atual');
      setIsEnabled(true);
      return true;
    } catch (error) {
      if (__DEV__) console.error('👆 [BIOMETRIC] Erro ao verificar status:', error);
      setIsEnabled(false);
      return false;
    }
  }, []);

  // Inicializacao
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await checkBiometricAvailability();
      await checkBiometricEnabled();
      setIsLoading(false);
    }
    init();
  }, [checkBiometricAvailability, checkBiometricEnabled]);

  // Habilita biometria usando API do backend (NAO precisa de senha!)
  const enableBiometric = useCallback(async (userEmail: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (__DEV__) console.log('👆 [BIOMETRIC] Habilitando biometria...');

      // 1. Verifica disponibilidade
      const available = await checkBiometricAvailability();
      if (!available) {
        if (__DEV__) console.log('👆 [BIOMETRIC] Biometria nao disponivel');
        return { success: false, error: 'Biometria não disponível neste dispositivo' };
      }

      // 2. Solicita autenticacao biometrica local para confirmar identidade
      // disableDeviceFallback: true = força usar Face ID/Touch ID sem fallback para senha
      const localAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade para habilitar o login biometrico',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: true,
      });

      if (!localAuth.success) {
        if (__DEV__) console.log('👆 [BIOMETRIC] Autenticacao local falhou:', JSON.stringify(localAuth));
        return { success: false, error: 'Autenticação cancelada' };
      }

      // 3. Obtem deviceId unico
      const deviceId = await getDeviceId();
      if (__DEV__) console.log('👆 [BIOMETRIC] DeviceId:', deviceId);

      // 4. Chama API do backend para obter token biometrico
      if (__DEV__) console.log('[BIOMETRIC] Chamando API enable...');
      const response = await api.post('authentication/biometric/enable', {
        email: userEmail,
        deviceId,
      });

      if (__DEV__) console.log('[BIOMETRIC] Resposta da API recebida');
      const { biometricToken, userId, expiresAt } = response.data.data;

      // 5. Armazena token de forma segura
      const tokenData: BiometricTokenData = {
        biometricToken,
        userId,
        expiresAt,
      };
      await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY, JSON.stringify(tokenData));

      setIsEnabled(true);
      if (__DEV__) console.log('👆 [BIOMETRIC] Biometria habilitada com sucesso via API');
      return { success: true };
    } catch (error: any) {
      if (__DEV__) console.error('[BIOMETRIC] Erro ao habilitar biometria:', error?.message);
      if (__DEV__) console.error('[BIOMETRIC] Response status:', error?.response?.status);

      // Extrai mensagem de erro da API
      const apiMessage = error?.response?.data?.message
        || error?.response?.data?.errors?.[0]?.message
        || error?.response?.data?.title;

      if (error?.response?.status === 401) {
        return { success: false, error: 'Sessão expirada. Faça login novamente.' };
      }

      return { success: false, error: apiMessage || error.message || 'Erro ao habilitar biometria' };
    }
  }, [checkBiometricAvailability]);

  // Desabilita biometria usando API do backend
  const disableBiometric = useCallback(async (userId: string): Promise<boolean> => {
    try {
      if (__DEV__) console.log('👆 [BIOMETRIC] Desabilitando biometria...');

      // Chama API do backend para revogar token
      await api.patch(`authentication/biometric/disable/${userId}`);

      // Remove token local
      await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);

      setIsEnabled(false);
      if (__DEV__) console.log('👆 [BIOMETRIC] Biometria desabilitada com sucesso');
      return true;
    } catch (error: any) {
      if (__DEV__) console.error('[BIOMETRIC] Erro ao desabilitar biometria:', error?.message);
      // Mesmo se a API falhar, remove o token local
      await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
      setIsEnabled(false);
      return true;
    }
  }, []);

  // Autentica usando biometria e faz login via API
  const authenticateWithBiometric = useCallback(async (): Promise<BiometricAuthResult> => {
    try {
      if (__DEV__) console.log('👆 [BIOMETRIC] Iniciando autenticacao biometrica...');

      // 1. Verifica se tem token armazenado
      const tokenData = await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);
      if (!tokenData) {
        return { success: false, error: 'Biometria nao esta habilitada' };
      }

      const parsed: BiometricTokenData = JSON.parse(tokenData);

      // 2. Verifica se o token expirou
      const expiresAt = new Date(parsed.expiresAt);
      if (expiresAt < new Date()) {
        await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
        setIsEnabled(false);
        return { success: false, error: 'Token biometrico expirado. Habilite novamente.' };
      }

      // 3. Solicita autenticacao biometrica local (Face ID/Touch ID apenas)
      const localAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entre com sua biometria',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: true,
      });

      if (!localAuth.success) {
        const failedResult = localAuth as { success: false; error: string };
        const errorMsg = failedResult.error || 'unknown';
        if (__DEV__) console.log('👆 [BIOMETRIC] Autenticacao local falhou:', errorMsg);
        return {
          success: false,
          error: errorMsg === 'user_cancel'
            ? 'Autenticacao cancelada'
            : 'Falha na autenticacao biometrica'
        };
      }

      // 4. Chama API do backend para fazer login com token biometrico
      const response = await api.post('authentication/biometric/login', {
        biometricToken: parsed.biometricToken,
      });

      const userData = response.data.data;

      if (__DEV__) console.log('👆 [BIOMETRIC] Login biometrico bem-sucedido');
      return {
        success: true,
        userData: {
          userId: userData.userId,
          name: userData.name,
          fullName: userData.fullName,
          email: userData.email,
          token: userData.token,
        },
      };
    } catch (error: any) {
      if (__DEV__) console.error('[BIOMETRIC] Erro no login biometrico:', error?.message);

      // Se o token foi revogado ou expirou no backend, limpa local
      if (error?.response?.status === 400 || error?.response?.status === 401) {
        await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
        setIsEnabled(false);
        return { success: false, error: 'Token biometrico invalido. Habilite novamente.' };
      }

      return { success: false, error: 'Erro ao autenticar. Tente novamente.' };
    }
  }, []);

  // Verifica se pode fazer login biometrico
  const canUseBiometricLogin = useCallback(async (): Promise<boolean> => {
    try {
      const tokenData = await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);
      if (!tokenData) return false;

      const parsed: BiometricTokenData = JSON.parse(tokenData);
      const expiresAt = new Date(parsed.expiresAt);

      return expiresAt > new Date();
    } catch {
      return false;
    }
  }, []);

  // Limpa todos os dados biometricos (para logout)
  const clearBiometricData = useCallback(async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
      setIsEnabled(false);
      if (__DEV__) console.log('👆 [BIOMETRIC] Dados biometricos limpos');
    } catch (error) {
      if (__DEV__) console.error('👆 [BIOMETRIC] Erro ao limpar dados:', error);
    }
  }, []);

  return {
    // Estado
    isAvailable,
    isEnabled,
    isLoading,
    biometricType,

    // Acoes
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    canUseBiometricLogin,
    clearBiometricData,

    // Utilitarios
    checkBiometricAvailability,
    checkBiometricEnabled,
  };
}
