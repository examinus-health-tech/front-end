import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { getGoogleClientId, getGoogleIOSClientId, isGoogleAuthConfigured } from '../config/googleAuth';
import { checkCampaignVoucher } from '@services/campaignService';

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

      console.log('🔍 Verificando Google Play Services...');

      // Check if Google Play Services are available
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      } catch (playServicesError: any) {
        console.error('❌ Google Play Services não disponível:', playServicesError);
        Alert.alert(
          'Google Services',
          'Os Google Play Services não estão disponíveis neste dispositivo. Por favor, use outro método de autenticação.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('🔍 Iniciando Google Sign In...');

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      console.log('🔍 userInfo received:', {
        hasIdToken: !!userInfo.data?.idToken,
        hasUser: !!userInfo.data?.user,
        type: userInfo.type,
      });

      if (!userInfo.data?.idToken) {
        console.error('❌ Token não recebido do Google');
        return;
      }

      console.log(`🔍 Processing Google ${isSignup ? 'signup' : 'signin'}...`);

      try {
        if (isSignup) {
          await authSignUpWithGoogle(userInfo.data.idToken);

          // Verifica se o email está em uma campanha promocional (voucher enviado por email)
          const email = userInfo.data.user?.email;
          if (email) {
            checkCampaignVoucher(email, true).catch(() => {});
          }
        } else {
          await authSignInWithGoogle(userInfo.data.idToken);
        }
        console.log('✅ Google auth concluída com sucesso');
      } catch (authError: any) {
        console.error('❌ Erro ao processar autenticação com backend:', authError);

        // Let AuthContext handle the error display
        throw authError;
      }
    } catch (error: any) {
      console.error('❌ Erro no Google OAuth:', {
        code: error?.code,
        message: error?.message,
        error: error,
      });

      // User cancelled
      if (error.code === 'SIGN_IN_CANCELLED' || error.code === '-5') {
        console.log('👤 Usuário cancelou o login Google');
        return;
      }

      // Network error
      if (error.code === 'NETWORK_ERROR' || error.code === 7) {
        Alert.alert('Erro de Rede', 'Não foi possível conectar ao Google. Verifique sua conexão e tente novamente.', [
          { text: 'OK' },
        ]);
        return;
      }

      // Don't show alert for authentication errors (AuthContext handles it)
      if (
        error.message?.includes('Erro ao fazer') ||
        error.message?.includes('Request failed') ||
        error.message?.includes('Token')
      ) {
        console.log('🔄 Erro de autenticação tratado pelo AuthContext');
        return;
      }

      // Show alert for other errors
      Alert.alert(
        isSignup ? 'Erro no Cadastro' : 'Erro no Login',
        `Não foi possível ${isSignup ? 'cadastrar' : 'fazer login'} com Google. ${error.message || 'Tente novamente.'}`,
        [{ text: 'OK' }]
      );
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
