import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { getGoogleClientId, isGoogleAuthConfigured } from '../config/googleAuth';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

// Configuração do Google OAuth
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup' | null>(null);
  const { signInWithGoogle: authSignInWithGoogle, signUpWithGoogle: authSignUpWithGoogle } = useAuth();

  // Verificar se o Google Auth está configurado
  const isConfigured = isGoogleAuthConfigured();
  const clientId = getGoogleClientId();

  // Request básico para ambos os fluxos
  const [request, response, promptAsync] = useAuthRequest(
    isConfigured ? {
      clientId: clientId!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'com.examinus.mobile',
        path: 'oauth'
      }),
      responseType: 'code',
      additionalParameters: {
        // Sempre força seleção de conta para evitar login automático
        prompt: 'select_account',
      },
    } : null,
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success' && currentMode) {
      handleGoogleLogin(response.params.code, currentMode === 'signup');
    }
  }, [response, currentMode]);

  async function handleGoogleLogin(authCode: string, isSignup: boolean = false) {
    try {
      setIsLoading(true);
      if (isSignup) {
        await authSignUpWithGoogle(authCode);
      } else {
        await authSignInWithGoogle(authCode);
      }
      // Sucesso - limpar o modo
      setCurrentMode(null);
    } catch (error: any) {
      console.error('❌ Erro no Google OAuth:', error);
      setCurrentMode(null); // Limpar modo em caso de erro também
      Alert.alert(
        isSignup ? 'Erro no Cadastro' : 'Erro no Login',
        `Não foi possível ${isSignup ? 'cadastrar' : 'fazer login'} com Google. Tente novamente.`,
        [{ text: 'OK' }]
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      console.log('🚀 Iniciando login Google...');
      setCurrentMode('signin');
      
      // Verificar se está configurado
      if (!isConfigured) {
        Alert.alert(
          'Google Login - Configuração Pendente',
          'O login com Google foi implementado mas ainda precisa ser configurado com os Client IDs do Google Console.\n\nPróximos passos:\n1. Criar projeto no Google Console\n2. Configurar OAuth credentials\n3. Atualizar os Client IDs no código',
          [
            { text: 'Entendi', style: 'default' },
            { text: 'Ver Documentação', style: 'cancel', onPress: () => console.log('📋 Ver: GOOGLE_AUTH_SETUP.md') }
          ]
        );
        return;
      }

      if (!request) {
        Alert.alert(
          'Erro de configuração',
          'Erro interno na configuração do Google OAuth.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await promptAsync();
      console.log('📱 Resultado do login Google:', result.type);
      
      if (result.type === 'cancel') {
        console.log('👤 Usuário cancelou o login Google');
        setCurrentMode(null);
      }
      
    } catch (error) {
      console.error('❌ Erro ao iniciar login Google:', error);
      setCurrentMode(null);
      Alert.alert(
        'Erro',
        'Não foi possível iniciar o login com Google.',
        [{ text: 'OK' }]
      );
    }
  }

  async function signUpWithGoogle() {
    try {
      console.log('🚀 Iniciando cadastro Google...');
      setCurrentMode('signup');
      
      // Verificar se está configurado
      if (!isConfigured) {
        Alert.alert(
          'Google Cadastro - Configuração Pendente',
          'O cadastro com Google foi implementado mas ainda precisa ser configurado com os Client IDs do Google Console.\n\nPróximos passos:\n1. Criar projeto no Google Console\n2. Configurar OAuth credentials\n3. Atualizar os Client IDs no código',
          [
            { text: 'Entendi', style: 'default' },
            { text: 'Ver Documentação', style: 'cancel', onPress: () => console.log('📋 Ver: GOOGLE_AUTH_SETUP.md') }
          ]
        );
        return;
      }

      if (!request) {
        Alert.alert(
          'Erro de configuração',
          'Erro interno na configuração do Google OAuth.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await promptAsync();
      console.log('📱 Resultado do cadastro Google:', result.type);
      
      if (result.type === 'cancel') {
        console.log('👤 Usuário cancelou o cadastro Google');
        setCurrentMode(null);
      }
      
    } catch (error) {
      console.error('❌ Erro ao iniciar cadastro Google:', error);
      setCurrentMode(null);
      Alert.alert(
        'Erro',
        'Não foi possível iniciar o cadastro com Google.',
        [{ text: 'OK' }]
      );
    }
  }

  return {
    signInWithGoogle,
    signUpWithGoogle,
    isLoading,
    request,
    isConfigured,
  };
}