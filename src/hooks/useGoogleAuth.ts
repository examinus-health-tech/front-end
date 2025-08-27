import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { getGoogleClientId, getGoogleIOSClientId, isGoogleAuthConfigured } from '../config/googleAuth';

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle: authSignInWithGoogle, signUpWithGoogle: authSignUpWithGoogle } = useAuth();

  // Verificar se o Google Auth está configurado
  const isConfigured = isGoogleAuthConfigured();
  const clientId = getGoogleClientId();
  const iosClientId = getGoogleIOSClientId();

  // Configurar GoogleSignin
  if (isConfigured && clientId) {
    console.log('🔧 Configurando GoogleSignin:', {
      webClientId: clientId,
      iosClientId: iosClientId,
    });

    GoogleSignin.configure({
      webClientId: clientId,
      iosClientId: iosClientId,
      offlineAccess: false,
      hostedDomain: '',
      forceCodeForRefreshToken: false,
    });

    console.log('✅ GoogleSignin configurado com sucesso!');
  }

  async function handleGoogleAuth(isSignup: boolean = false) {
    try {
      setIsLoading(true);

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      console.warn('🔍 userInfo:', userInfo);

      if (userInfo.idToken) {
        if (isSignup) {
          console.warn('🔍 userInfo:', userInfo);

          await authSignUpWithGoogle(userInfo.idToken);
        } else {
          console.warn('🔍 userInfo:', userInfo);

          await authSignInWithGoogle(userInfo.idToken);
        }
      } else {
        throw new Error('Não foi possível obter token de autenticação do Google');
      }
    } catch (error: any) {
      console.error('❌ Erro no Google OAuth:', error);

      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('👤 Usuário cancelou o login Google');
        return;
      }

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

      // Verificar se está configurado
      if (!isConfigured) {
        Alert.alert(
          'Google Login - Configuração Pendente',
          'O login com Google foi implementado mas ainda precisa ser configurado com os Client IDs do Google Console.\n\nPróximos passos:\n1. Criar projeto no Google Console\n2. Configurar OAuth credentials\n3. Atualizar os Client IDs no código',
          [
            { text: 'Entendi', style: 'default' },
            { text: 'Ver Documentação', style: 'cancel', onPress: () => console.log('📋 Ver: GOOGLE_AUTH_SETUP.md') },
          ]
        );
        return;
      }

      await handleGoogleAuth(false);
    } catch (error) {
      console.error('❌ Erro ao iniciar login Google:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o login com Google.', [{ text: 'OK' }]);
    }
  }

  async function signUpWithGoogle() {
    try {
      console.log('🚀 Iniciando cadastro Google...');

      // Verificar se está configurado
      if (!isConfigured) {
        Alert.alert(
          'Google Cadastro - Configuração Pendente',
          'O cadastro com Google foi implementado mas ainda precisa ser configurado com os Client IDs do Google Console.\n\nPróximos passos:\n1. Criar projeto no Google Console\n2. Configurar OAuth credentials\n3. Atualizar os Client IDs no código',
          [
            { text: 'Entendi', style: 'default' },
            { text: 'Ver Documentação', style: 'cancel', onPress: () => console.log('📋 Ver: GOOGLE_AUTH_SETUP.md') },
          ]
        );
        return;
      }

      await handleGoogleAuth(true);
    } catch (error) {
      console.error('❌ Erro ao iniciar cadastro Google:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o cadastro com Google.', [{ text: 'OK' }]);
    }
  }

  return {
    signInWithGoogle,
    signUpWithGoogle,
    isLoading,
    isConfigured,
  };
}
