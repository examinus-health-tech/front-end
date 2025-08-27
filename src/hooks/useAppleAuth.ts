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
        throw new Error('Apple authentication is only available on iOS');
      }

      const config = getAppleConfig();
      if (!config) {
        throw new Error('Apple authentication not configured');
      }

      console.log('🍎 Iniciando processo de autenticação Apple...');
      
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
        email: credential.email
      });

      if (credential.identityToken) {
        console.log('🍎 Processando token Apple...');
        if (isSignup) {
          await authSignUpWithApple(credential.identityToken, credential.fullName);
        } else {
          await authSignInWithApple(credential.identityToken, credential.fullName);
        }
        console.log('🍎 Autenticação Apple concluída com sucesso');
        setCurrentMode(null);
      } else {
        console.error('🍎 Token de identidade não recebido');
        throw new Error('Apple authentication failed - no identity token received');
      }
    } catch (error: any) {
      console.error('❌ Erro no Apple Auth:', error);
      setCurrentMode(null);
      
      if (error.code === 'ERR_CANCELED') {
        console.log('👤 Usuário cancelou o login Apple');
        return;
      }
      
      Alert.alert(
        isSignup ? 'Erro no Cadastro' : 'Erro no Login',
        `Não foi possível ${isSignup ? 'cadastrar' : 'fazer login'} com Apple. Tente novamente.`,
        [{ text: 'OK' }]
      );
      throw error;
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