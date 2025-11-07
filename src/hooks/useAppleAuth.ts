import { useState } from 'react';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from './useAuth';
import { isAppleAuthAvailable, getAppleConfig } from '../config/appleAuth';

export function useAppleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup' | null>(null);
  const { signInWithApple: authSignInWithApple, signUpWithApple: authSignUpWithApple } = useAuth();

  const isAvailable = isAppleAuthAvailable();

  async function handleAppleAuth(isSignup: boolean = false) {
    try {
      setIsLoading(true);

      if (!isAvailable) {
        console.log('🍎 Apple Auth não disponível - apenas iOS');
        Alert.alert('Apple Sign In', 'O login com Apple está disponível apenas em dispositivos iOS.', [{ text: 'OK' }]);
        return;
      }

      const config = getAppleConfig();
      if (!config) {
        console.error('🍎 Apple Auth não configurado');
        throw new Error('Apple authentication not configured');
      }

      console.log('🍎 Iniciando processo de autenticação Apple...');

      // Check if Apple Sign In is supported on this device
      const isSupported = await AppleAuthentication.isAvailableAsync();
      if (!isSupported) {
        console.log('🍎 Apple Sign In não suportado neste dispositivo');
        Alert.alert(
          'Apple Sign In',
          'O login com Apple não está disponível neste dispositivo. Por favor, use outro método de autenticação.',
          [{ text: 'OK' }]
        );
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('🍎 Credencial Apple recebida:', {
        user: credential.user,
        hasIdentityToken: !!credential.identityToken,
        hasFullName: !!credential.fullName,
        email: credential.email,
      });

      if (!credential.identityToken) {
        console.error('🍎 Token de identidade não recebido');
        return;
      }

      console.log('🍎 Processando token Apple...');
      try {
        if (isSignup) {
          await authSignUpWithApple(credential.identityToken, credential.fullName, credential.email ?? null);
        } else {
          await authSignInWithApple(credential.identityToken, credential.fullName, credential.email ?? null);
        }
        console.log('🍎 Autenticação Apple concluída com sucesso');
        setCurrentMode(null);
      } catch (authError: any) {
        console.error('🍎 Erro ao processar autenticação com backend:', authError);

        // Let AuthContext handle the error display
        throw authError;
      }
    } catch (error: any) {
      console.error('❌ Erro no Apple Auth:', {
        code: error.code,
        message: error.message,
        error: error,
      });
      setCurrentMode(null);

      // User cancelled
      if (error.code === 'ERR_CANCELED' || error.code === 'ERR_REQUEST_CANCELED') {
        console.log('👤 Usuário cancelou o login Apple');
        return;
      }

      // Don't show alert for authentication errors (AuthContext handles it)
      if (error.message?.includes('Erro ao fazer') || error.message?.includes('Token')) {
        console.log('🔄 Erro de autenticação tratado pelo AuthContext');
        return;
      }

      // Show alert for other errors
      Alert.alert(
        isSignup ? 'Erro no Cadastro' : 'Erro no Login',
        `Não foi possível ${isSignup ? 'cadastrar' : 'fazer login'} com Apple. ${error.message || 'Tente novamente.'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithApple() {
    try {
      console.log('🍎 Iniciando login Apple...');
      setCurrentMode('signin');
      await handleAppleAuth(false);
    } catch (error) {
      console.error('❌ Erro ao iniciar login Apple:', error);
      setCurrentMode(null);
    }
  }

  async function signUpWithApple() {
    try {
      console.log('🍎 Iniciando cadastro Apple...');
      setCurrentMode('signup');
      await handleAppleAuth(true);
    } catch (error) {
      console.error('❌ Erro ao iniciar cadastro Apple:', error);
      setCurrentMode(null);
    }
  }

  return {
    signInWithApple,
    signUpWithApple,
    isLoading,
    isAvailable,
  };
}
