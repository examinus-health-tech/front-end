import { createContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { api } from 'src/services/api';
import { validateStoredToken } from '@utils/tokenValidation';
import { logger } from '@utils/debugLogger';
import { decodeJwtPayload } from '@utils/jwt';
import { registerDeviceOnBackend } from 'src/services/register-device-backend';
import { OneSignal } from 'react-native-onesignal';

// Chave para armazenamento seguro de biometria (apenas alfanumericos, ".", "-" e "_")
const BIOMETRIC_TOKEN_KEY = 'examinus_biometric_token';

interface User {
  userId?: string;
  name?: string;
  token?: string;
  fullName?: string;
  email?: string;
}

interface BiometricUserData {
  userId: string;
  name: string;
  fullName: string;
  email: string;
  token: string;
}

interface AuthContextData {
  user?: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithBiometric: (userData: BiometricUserData) => Promise<void>;
  signInWithGoogle: (authCode: string) => Promise<void>;
  signUpWithGoogle: (authCode: string) => Promise<void>;
  signInWithApple: (identityToken: string, fullName?: any, emailFromCredential?: string | null) => Promise<void>;
  signUpWithApple: (identityToken: string, fullName?: any, emailFromCredential?: string | null) => Promise<void>;
  signUp: (name: string, email: string, password: string, confirmationPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  resetPassword: (newPassword: string, confirmationPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
  getUserInfo: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Iniciando logout - limpando todos os dados do usuário...');

      // 🔔 Desassocia o dispositivo do usuário no OneSignal
      // Isso garante que notificações do usuário anterior não cheguem neste dispositivo
      try {
        console.log('📱 Desassociando dispositivo do OneSignal...');
        OneSignal.logout();
        console.log('✅ Dispositivo desassociado do OneSignal');
      } catch (oneSignalError) {
        console.warn('⚠️ Erro ao desassociar OneSignal (não crítico):', oneSignalError);
      }

      // Limpar TODOS os dados armazenados do usuário
      await AsyncStorage.multiRemove([
        '@app:user',
        '@app:personalData',
        '@app:onboardingData',
        '@examinus:auth-token',
        '@examinus:user',
      ]);

      console.log('✅ Dados do AsyncStorage removidos');

      // NOTA: NAO apagar o token biometrico no logout!
      // O token deve persistir para permitir login biometrico depois do logout.
      // O token so e removido quando o usuario desabilita explicitamente a biometria
      // ou quando o token expira/e revogado pelo backend.

      // Pequeno delay para mostrar o loading
      await new Promise<void>((resolve) => setTimeout(resolve, 800));

      setUser(null);
      console.log('✅ Logout concluído');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      // Silent fail - user will be signed out anyway
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadStoredUser();

    // Register token interceptor
    const unsubscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      unsubscribe();
    };
  }, [signOut]);

  async function loadStoredUser() {
    try {
      logger.auth('Iniciando loadStoredUser', { action: 'loadStoredUser' });

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('LoadStoredUser timeout')), 10000)
      );

      const loadPromise = (async () => {
        // Validate token before loading user
        const isValidToken = await validateStoredToken();
        logger.auth('Token validation result', { isValidToken });

        if (isValidToken) {
          const storedUser = await AsyncStorage.getItem('@app:user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              logger.auth('User loaded from storage', {
                userId: userData.userId,
                hasToken: !!userData.token,
              });
              setUser(userData);
            } catch (parseError) {
              logger.error('Error parsing user data from storage', parseError);
              await AsyncStorage.removeItem('@app:user');
              setUser(null);
            }
          } else {
            logger.auth('No user found in storage');
            setUser(null);
          }
        } else {
          // Token is invalid, clear user
          logger.auth('Invalid token, clearing user');
          setUser(null);
        }
      })();

      await Promise.race([loadPromise, timeoutPromise]);
    } catch (error) {
      logger.error('Error in loadStoredUser', { error, action: 'loadStoredUser' });
      setUser(null);
    } finally {
      logger.auth('LoadStoredUser completed, setting isLoading = false');
      setIsLoading(false);
    }
  }

  async function signIn(userName: string, password: string) {
    try {
      setIsLoading(true);
      setError(null); // Limpar erro anterior

      const startTime = Date.now();

      logger.auth('Starting login attempt', {
        userName,
        action: 'signIn',
        apiUrl: process.env.EXPO_PUBLIC_API_URL,
      });

      console.log('🔐 [LOGIN] Iniciando login:', {
        userName,
        timestamp: new Date().toISOString(),
        timeout: '30s',
      });

      // Add timeout to login request
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout - sem resposta do servidor')), 30000)
      );

      const loginPromise = api.post('authentication', {
        userName,
        password,
      });

      const response = (await Promise.race([loginPromise, timeoutPromise])) as any;

      const elapsed = Date.now() - startTime;
      console.log('⏱️ [LOGIN] Tempo de resposta:', `${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);

      const { data } = response;
      const userData = data.data;

      // LOG DETALHADO: Ver exatamente o que o backend está retornando
      console.log('📊 [AUTH] Dados recebidos do backend (signIn):', {
        userId: userData.userId,
        name: userData.name,
        fullName: userData.fullName,
        email: userData.email,
        hasToken: !!userData.token,
        allFields: Object.keys(userData),
      });

      // Limpar dados de onboarding de outro usuário ANTES de setar o novo usuário
      // O checkOnboardingCompletion buscará os dados corretos do servidor
      console.log('🧹 [AUTH] Limpando dados locais de outro usuário antes do login...');
      await AsyncStorage.multiRemove(['@app:personalData', '@app:onboardingData']);
      console.log('✅ [AUTH] Dados de onboarding locais removidos no login');

      // ⚠️ TEMPORÁRIO: Extrair email do token JWT se não vier do backend
      // TODO: Backend deveria retornar email diretamente
      let emailFromToken = userData.email;
      if (userData.token && !emailFromToken) {
        try {
          const tokenPayload = decodeJwtPayload(userData.token);
          emailFromToken = tokenPayload?.Email || tokenPayload?.email;
          console.log('⚠️ [AUTH] Email NÃO veio do backend, extraído do JWT:', emailFromToken);
        } catch (error) {
          console.log('⚠️ [AUTH] Erro ao extrair email do token:', error);
        }
      }

      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name,
        email: emailFromToken || userData.email,
      };

      console.log('Token:', JSON.stringify(formattedUserData, null, 2));

      // CORREÇÃO: Garantir que o token esteja persistido ANTES de qualquer navegação
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Verificar se os dados foram persistidos corretamente
      const verifyData = await AsyncStorage.getItem('@app:user');
      if (!verifyData) {
        throw new Error('Falha ao persistir dados do usuário');
      }

      console.log('✅ [AUTH] Usuário setado e verificado:', {
        userId: formattedUserData.userId,
        name: formattedUserData.name,
        email: formattedUserData.email
      });

      // CORREÇÃO: Registrar OneSignal IMEDIATAMENTE (não com delay)
      try {
        console.log('📱 Registrando OneSignal external_id...');
        await OneSignal.login(formattedUserData.userId);
        console.log('✅ OneSignal external_id registrado');
      } catch (oneSignalError) {
        console.warn('⚠️ Erro ao registrar OneSignal external_id (não crítico):', oneSignalError);
      }

      // Agora sim, setar o usuário e disparar navegação
      setUser(formattedUserData);

      // Registra dispositivo no backend em background (não bloqueia)
      registerDeviceOnBackend().catch((deviceError) => {
        console.warn('⚠️ Erro ao registrar dispositivo no backend (não crítico):', deviceError);
      });
    } catch (error: any) {
      // Log estruturado completo
      const errorDetails = {
        timestamp: new Date().toISOString(),
        action: 'signIn',
        userName,
        error: {
          message: error?.message,
          code: error?.code,
          name: error?.name,
        },
        request: {
          hasRequest: !!error.request,
          url: error?.config?.url,
          method: error?.config?.method,
          timeout: error?.config?.timeout,
        },
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        } : null,
      };

      console.error('❌ [LOGIN ERROR]', {
        userName,
        status: error?.response?.status,
        message: error?.message,
      });

      console.error('📋 [LOGIN ERROR - Detalhes completos]', JSON.stringify(errorDetails, null, 2));

      logger.error('Login failed', {
        action: 'signIn',
        userName,
        error: {
          message: error?.message,
          status: error?.response?.status,
          code: error?.code,
          hasResponse: !!error.response,
          hasRequest: !!error.request,
        },
      });

      let errorMessage = 'Erro de conexão. Verifique sua internet.';

      if (error.message === 'Login timeout - sem resposta do servidor') {
        errorMessage = 'Tempo limite excedido. Verifique sua conexão e tente novamente.';
      } else if (error.response) {
        // Erro do servidor com resposta
        if (error.response.status === 401) {
          errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.message || 'Erro desconhecido.';
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      } else if (error.message) {
        // Outro tipo de erro
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      logger.auth('Login attempt completed', { action: 'signIn' });
      setIsLoading(false);
    }
  }

  // Login biometrico - recebe dados do usuario diretamente da API biometrica
  async function signInWithBiometric(userData: BiometricUserData) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔐 [BIOMETRIC LOGIN] Iniciando login biometrico:', {
        userId: userData.userId,
        email: userData.email,
        timestamp: new Date().toISOString(),
      });

      // Limpar dados de onboarding de outro usuario
      console.log('🧹 [AUTH] Limpando dados locais antes do login biometrico...');
      await AsyncStorage.multiRemove(['@app:personalData', '@app:onboardingData']);

      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name,
        email: userData.email,
      };

      // CORREÇÃO: Garantir que o token esteja persistido ANTES de qualquer navegação
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Verificar se os dados foram persistidos corretamente
      const verifyData = await AsyncStorage.getItem('@app:user');
      if (!verifyData) {
        throw new Error('Falha ao persistir dados do usuário');
      }

      console.log('✅ [BIOMETRIC LOGIN] Usuario setado e verificado:', {
        userId: formattedUserData.userId,
        name: formattedUserData.name,
        email: formattedUserData.email,
      });

      // CORREÇÃO: Registrar OneSignal IMEDIATAMENTE (não com delay)
      // O login do OneSignal deve ser feito antes da navegação para garantir
      // que o external_id esteja associado corretamente
      try {
        console.log('📱 Registrando OneSignal external_id (biometric)...');
        await OneSignal.login(formattedUserData.userId);
        console.log('✅ OneSignal external_id registrado');
      } catch (oneSignalError) {
        // Não bloquear o login se OneSignal falhar
        console.warn('⚠️ Erro ao registrar OneSignal external_id (nao critico):', oneSignalError);
      }

      // Agora sim, setar o usuário e disparar navegação
      setUser(formattedUserData);

      // Registra dispositivo no backend em background (não bloqueia)
      // Usa Promise sem await para não atrasar a navegação
      registerDeviceOnBackend().catch((deviceError) => {
        console.warn('⚠️ Erro ao registrar dispositivo no backend (nao critico):', deviceError);
      });

    } catch (error: any) {
      console.error('❌ [BIOMETRIC LOGIN ERROR]', error);
      const errorMessage = error?.message || 'Erro no login biometrico';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle(authCode: string) {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        provider: 'Google',
        idToken: authCode,
      };

      console.log('🔐 [Google Auth] idToken enviado:', authCode);

      // Add timeout for better UX
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite excedido. Tente novamente.')), 15000)
      );

      const loginPromise = api.post('authentication/external', payload);
      const response = (await Promise.race([loginPromise, timeoutPromise])) as any;

      // LOG: Verificar se o backend está enviando cookies
      console.log('🍪 [AUTH] Headers da resposta:', {
        headers: response.headers,
        setCookie: response.headers['set-cookie'],
        allHeaderKeys: Object.keys(response.headers || {}),
      });

      const { data } = response;
      const userData = data.data;

      // LOG DETALHADO: Ver exatamente o que o backend está retornando
      console.log('📊 [AUTH] Dados recebidos do backend (signInWithGoogle):', {
        userId: userData.userId,
        name: userData.name,
        fullName: userData.fullName,
        email: userData.email,
        hasToken: !!userData.token,
        allFields: Object.keys(userData),
      });

      // Limpar dados de onboarding de outro usuário ANTES de setar o novo usuário
      console.log('🧹 [AUTH] Limpando dados locais de outro usuário antes do login Google...');
      await AsyncStorage.multiRemove(['@app:personalData', '@app:onboardingData']);
      console.log('✅ [AUTH] Dados de onboarding locais removidos no login Google');

      // ⚠️ TEMPORÁRIO: Extrair email do token JWT se não vier do backend
      // TODO: Backend deveria retornar email diretamente
      let emailFromToken = userData.email;
      if (userData.token && !emailFromToken) {
        try {
          const tokenPayload = decodeJwtPayload(userData.token);
          emailFromToken = tokenPayload?.Email || tokenPayload?.email;
          console.log('⚠️ [AUTH] Email NÃO veio do backend, extraído do JWT:', emailFromToken);
        } catch (error) {
          console.log('⚠️ [AUTH] Erro ao extrair email do token:', error);
        }
      }

      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name,
        email: emailFromToken || userData.email,
      };

      // CORREÇÃO: Garantir que o token esteja persistido ANTES de qualquer navegação
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Verificar se os dados foram persistidos corretamente
      const verifyData = await AsyncStorage.getItem('@app:user');
      if (!verifyData) {
        throw new Error('Falha ao persistir dados do usuário');
      }

      console.log('✅ [AUTH] Usuário Google setado e verificado:', {
        userId: formattedUserData.userId,
        name: formattedUserData.name,
        email: formattedUserData.email
      });

      // CORREÇÃO: Registrar OneSignal IMEDIATAMENTE (não com delay)
      try {
        console.log('📱 Registrando OneSignal external_id (Google)...');
        await OneSignal.login(formattedUserData.userId);
        console.log('✅ OneSignal external_id registrado (Google)');
      } catch (oneSignalError) {
        console.warn('⚠️ Erro ao registrar OneSignal external_id (Google - não crítico):', oneSignalError);
      }

      // Agora sim, setar o usuário e disparar navegação
      setUser(formattedUserData);

      // Registra dispositivo no backend em background (não bloqueia)
      registerDeviceOnBackend().catch((deviceError) => {
        console.warn('⚠️ Erro ao registrar dispositivo no backend (Google - não crítico):', deviceError);
      });

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
    } catch (error: any) {
      console.error('❌ [AUTH] Erro no login Google:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
        hasResponse: !!error.response,
        hasRequest: !!error.request,
        authCode: authCode?.substring(0, 20) + '...',
      });

      let errorMessage = 'Erro ao fazer login com Google.';

      if (error.message === 'Tempo limite excedido. Tente novamente.') {
        errorMessage = error.message;
      } else if (error.response) {
        console.error('❌ [AUTH] Erro de resposta do servidor:', {
          status: error.response.status,
          data: error.response.data,
        });

        if (error.response.status === 401) {
          errorMessage = 'Token Google inválido ou expirado.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Google.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente.';
        } else {
          errorMessage = error.response.data?.message || 'Erro no servidor.';
        }
      } else if (error.request) {
        console.error('❌ [AUTH] Erro de conexão:', error.request);
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      } else {
        console.error('❌ [AUTH] Erro desconhecido:', error.message);
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpWithGoogle(authCode: string) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 [AUTH] Iniciando cadastro com Google...');
      console.log('🔑 [AUTH] idToken recebido:', authCode?.substring(0, 20) + '...');

      const payload = {
        provider: 'Google',
        idToken: authCode,
      };

      console.log('🔑 [AUTH] Enviando payload para backend:', payload);

      // Add timeout for better UX
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite excedido. Tente novamente.')), 15000)
      );

      const signupPromise = api.post('authentication/external', payload);
      const response = (await Promise.race([signupPromise, timeoutPromise])) as any;

      console.log('✅ [AUTH] Resposta do cadastro Google:', {
        status: response.status,
        hasData: !!response.data,
        dataContent: response.data,
      });

      const { data } = response;

      // Se já existe um usuário (signin automático), vai ter userData
      if (data?.data && data.data.userId && data.data.token) {
        console.log('✅ [AUTH] Usuário Google já existe - fazendo login automático');

        const userData = data.data;

        // Extrair email do token JWT
        let emailFromToken = userData.email;
        if (userData.token && !emailFromToken) {
          try {
            const tokenPayload = decodeJwtPayload(userData.token);
            emailFromToken = tokenPayload?.Email || tokenPayload?.email;
          } catch (error) {
            console.log('⚠️ [AUTH] Erro ao extrair email do token:', error);
          }
        }

        const formattedUserData = {
          userId: userData.userId,
          name: userData.name,
          token: userData.token,
          fullName: userData.fullName || userData.name,
          email: emailFromToken || userData.email,
        };

        // Limpar dados de onboarding de outro usuário
        await AsyncStorage.multiRemove(['@app:personalData', '@app:onboardingData']);
        console.log('🧹 Dados de onboarding antigos removidos (login Google)');

        // CORREÇÃO: Garantir que o token esteja persistido ANTES de qualquer navegação
        await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

        // Verificar se os dados foram persistidos corretamente
        const verifyData = await AsyncStorage.getItem('@app:user');
        if (!verifyData) {
          throw new Error('Falha ao persistir dados do usuário');
        }

        // CORREÇÃO: Registrar OneSignal IMEDIATAMENTE
        try {
          console.log('📱 Registrando OneSignal external_id (signUpWithGoogle)...');
          await OneSignal.login(formattedUserData.userId);
          console.log('✅ OneSignal external_id registrado (signUpWithGoogle)');
        } catch (oneSignalError) {
          console.warn('⚠️ Erro ao registrar OneSignal (signUpWithGoogle - não crítico):', oneSignalError);
        }

        // Agora sim, setar o usuário e disparar navegação
        setUser(formattedUserData);

        // Registra dispositivo no backend em background (não bloqueia)
        registerDeviceOnBackend().catch((deviceError) => {
          console.warn('⚠️ Erro ao registrar dispositivo no backend (signUpWithGoogle - não crítico):', deviceError);
        });

        return;
      }

      // Se não tem userData mas status é 201/204, é um cadastro novo bem-sucedido
      if (response.status === 201 || response.status === 204) {
        console.log('✅ [AUTH] Novo usuário Google cadastrado com sucesso');

        // Limpar dados de onboarding antigos
        await AsyncStorage.removeItem('@app:personalData');
        await AsyncStorage.removeItem('@app:onboardingData');
        console.log('🧹 Dados de onboarding antigos removidos (cadastro Google novo)');

        // Redirecionar para onboarding ou home (o hook vai detectar que não tem dados completos)
        setUser(null);
        return;
      }

      // Se chegou aqui, algo está errado
      throw new Error('Resposta inesperada do servidor');
    } catch (error: any) {
      console.log('❌ Erro no cadastro Google:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
        hasResponse: !!error.response,
        hasRequest: !!error.request,
      });

      let errorMessage = 'Erro ao fazer cadastro com Google.';

      if (error.message === 'Tempo limite excedido. Tente novamente.') {
        errorMessage = error.message;
      } else if (error.response) {
        console.log('📊 Detalhes do erro do servidor:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Google.';
        } else if (error.response.status === 400) {
          // Extrair mensagem detalhada do backend
          const backendMessage = error.response.data?.message || error.response.data?.error;
          errorMessage = backendMessage || 'Dados inválidos do Google.';
        } else if (error.response.status === 409) {
          errorMessage = 'Usuário já existe. Tente fazer login.';
        } else if (error.response.status >= 500) {
          // Mostrar mensagem do backend se disponível
          const backendMessage = error.response.data?.message || error.response.data?.error;
          errorMessage = backendMessage || 'Erro interno do servidor. Tente novamente.';
        } else {
          errorMessage = error.response.data?.message || 'Erro no servidor.';
        }
      } else if (error.request) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      }

      console.log('🚨 Mensagem de erro final (Google signup):', errorMessage);

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithApple(identityToken: string, fullName?: any, emailFromCredential?: string | null) {
    console.log('🍎 Fazendo login com Apple...', { hasToken: !!identityToken, fullName, emailFromCredential });

    try {
      setIsLoading(true);
      setError(null);

      console.log('🍎 Fazendo login com Apple...');

      // Add timeout for better UX
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite excedido. Tente novamente.')), 15000)
      );

      const claims = decodeJwtPayload(identityToken);
      logger.network('Apple Claims (signIn)', {
        apiUrl: 'local',
        action: 'apple_claims_signin',
        extra: { claims },
      });

      const claimsEmail = claims?.email;
      const appleUserId = claims?.sub || claims?.user_id || claims?.uid || null;
      const resolvedEmail = emailFromCredential || claimsEmail || null;

      const joinedName = fullName ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() : '';
      const formattedFullName = joinedName.length > 0 ? joinedName : undefined;
      const fallbackFullName =
        formattedFullName || (resolvedEmail ? resolvedEmail.split('@')[0] || undefined : undefined) || 'Apple User';

      logger.network('Apple resolved fields (signIn)', {
        apiUrl: 'local',
        action: 'apple_signin_resolved',
        extra: { formattedFullName, fallbackFullName, resolvedEmail, appleUserId },
      });

      const urlPath = 'authentication/external';
      const baseURL = (api as any)?.defaults?.baseURL;
      const url = `${baseURL}${urlPath}`;
      const startTime = Date.now();

      const payload = {
        provider: 'Apple',
        idToken: identityToken,
        fullName: fallbackFullName,
        email: resolvedEmail,
        appleUserId,
      };

      logger.network('Apple Auth request (signIn)', {
        apiUrl: url,
        action: 'apple_signin_request',
        extra: { method: 'POST', headers: { authorization: 'omitted' }, payload, baseURL, urlPath },
      });

      const loginPromise = api.post(urlPath, payload);

      const response = (await Promise.race([loginPromise, timeoutPromise])) as any;

      const totalTime = Date.now() - startTime;
      logger.network('Apple Auth response (signIn)', {
        apiUrl: url,
        action: 'apple_signin_response',
        status: response?.status,
        totalTime,
        extra: {
          headers: response?.headers,
          data: response?.data,
        },
      });

      console.log('✅ Login Apple bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      // Limpar dados de onboarding de outro usuário ANTES de setar o novo usuário
      console.log('🧹 [AUTH] Limpando dados locais de outro usuário antes do login Apple...');
      await AsyncStorage.multiRemove(['@app:personalData', '@app:onboardingData']);
      console.log('✅ [AUTH] Dados de onboarding locais removidos no login Apple');

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      // CORREÇÃO: Garantir que o token esteja persistido ANTES de qualquer navegação
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Verificar se os dados foram persistidos corretamente
      const verifyData = await AsyncStorage.getItem('@app:user');
      if (!verifyData) {
        throw new Error('Falha ao persistir dados do usuário');
      }

      console.log('✅ [AUTH] Usuário Apple setado e verificado:', { userId: formattedUserData.userId, name: formattedUserData.name });

      // CORREÇÃO: Registrar OneSignal IMEDIATAMENTE (ANTES de setUser)
      try {
        console.log('📱 Registrando OneSignal external_id (Apple)...');
        await OneSignal.login(formattedUserData.userId);
        console.log('✅ OneSignal external_id registrado (Apple)');
      } catch (oneSignalError) {
        console.warn('⚠️ Erro ao registrar OneSignal external_id (Apple - não crítico):', oneSignalError);
      }

      // Agora sim, setar o usuário e disparar navegação
      setUser(formattedUserData);

      // Registra dispositivo no backend em background (não bloqueia)
      registerDeviceOnBackend().catch((deviceError) => {
        console.warn('⚠️ Erro ao registrar dispositivo no backend (Apple - não crítico):', deviceError);
      });

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
    } catch (error: any) {
      console.log('❌ Erro no login Apple:', error);

      let errorMessage = 'Erro ao fazer login com Apple.';

      if (error.message === 'Tempo limite excedido. Tente novamente.') {
        errorMessage = error.message;
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Apple.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Apple.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente.';
        } else {
          errorMessage = error.response.data?.message || 'Erro no servidor.';
        }
      } else if (error.request) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpWithApple(identityToken: string, fullName?: any, emailFromCredential?: string | null) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🍎 Fazendo cadastro com Apple...');

      // Add timeout for better UX
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite excedido. Tente novamente.')), 15000)
      );

      const claims = decodeJwtPayload(identityToken);
      const email = (claims?.email as string | undefined) || (emailFromCredential ?? undefined);
      const appleUserId = claims?.sub || claims?.user_id || claims?.uid;

      const joinedName = fullName ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() : '';
      const formattedFullName = joinedName.length > 0 ? joinedName : undefined;
      const fallbackFullName =
        formattedFullName || (email ? email.split('@')[0] || undefined : undefined) || 'Apple User';

      logger.auth('Apple claims resolved (signUp)', {
        action: 'apple_signup_claims',
        extra: {
          hasClaims: !!claims,
          claims,
          emailFromCredential,
          chosenEmail: email,
          appleUserId,
          formattedFullName,
          fallbackFullName,
        },
      });

      const urlPath = 'authentication/external';
      const baseURL = (api as any)?.defaults?.baseURL;
      const url = `${baseURL}${urlPath}`;
      const startTime = Date.now();

      const payload = {
        provider: 'Apple',
        idToken: identityToken,
        fullName: fallbackFullName,
        email,
        appleUserId,
      };

      logger.network('Apple Auth request (signUp)', {
        apiUrl: url,
        action: 'apple_signup_request',
        extra: { method: 'POST', headers: { authorization: 'omitted' }, payload, baseURL, urlPath },
      });

      const signupPromise = api.post(urlPath, payload);

      const response = (await Promise.race([signupPromise, timeoutPromise])) as any;

      const totalTime = Date.now() - startTime;
      logger.network('Apple Auth response (signUp)', {
        apiUrl: url,
        action: 'apple_signup_response',
        status: response?.status,
        totalTime,
        extra: {
          headers: response?.headers,
          data: response?.data,
        },
      });

      console.log('✅ Cadastro Apple bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      // Limpar dados de onboarding antigos para novo usuário
      await AsyncStorage.removeItem('@app:personalData');
      await AsyncStorage.removeItem('@app:onboardingData');
      console.log('🧹 Dados de onboarding antigos removidos (cadastro Apple)');

      // CORREÇÃO: Garantir que o token esteja persistido ANTES de qualquer navegação
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Verificar se os dados foram persistidos corretamente
      const verifyData = await AsyncStorage.getItem('@app:user');
      if (!verifyData) {
        throw new Error('Falha ao persistir dados do usuário');
      }

      console.log('✅ [AUTH] Usuário Apple cadastrado e verificado:', { userId: formattedUserData.userId, name: formattedUserData.name });

      // CORREÇÃO: Registrar OneSignal IMEDIATAMENTE (ANTES de setUser)
      try {
        console.log('📱 Registrando OneSignal external_id (signUpWithApple)...');
        await OneSignal.login(formattedUserData.userId);
        console.log('✅ OneSignal external_id registrado (signUpWithApple)');
      } catch (oneSignalError) {
        console.warn('⚠️ Erro ao registrar OneSignal external_id (signUpWithApple - não crítico):', oneSignalError);
      }

      // Agora sim, setar o usuário e disparar navegação
      setUser(formattedUserData);

      // Registra dispositivo no backend em background (não bloqueia)
      registerDeviceOnBackend().catch((deviceError) => {
        console.warn('⚠️ Erro ao registrar dispositivo no backend (signUpWithApple - não crítico):', deviceError);
      });

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
    } catch (error: any) {
      console.log('❌ Erro no cadastro Apple:', error);

      let errorMessage = 'Erro ao fazer cadastro com Apple.';

      if (error.message === 'Tempo limite excedido. Tente novamente.') {
        errorMessage = error.message;
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Apple.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Apple.';
        } else if (error.response.status === 409) {
          errorMessage = 'Conta já existe com este Apple ID.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente.';
        } else {
          errorMessage = error.response.data?.message || 'Erro no servidor.';
        }
      } else if (error.request) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      }

      logger.network('Apple Auth failed (signUp)', {
        action: 'apple_signup_error',
        status: error?.response?.status,
        extra: { data: error?.response?.data, message: errorMessage },
      });

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(fullname: string, email: string, password: string, confirmationPassword: string) {
    try {
      setIsLoading(true);
      setError(null);

      const startTime = Date.now();

      console.log('🚀 [SIGNUP] Iniciando cadastro:', {
        email,
        fullname,
        timestamp: new Date().toISOString(),
        timeout: '45s',
      });

      // Add timeout de 45s - backend leva ~30s para processar cadastro
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite excedido. O cadastro pode demorar um pouco. Tente novamente.')), 45000)
      );

      const signupPromise = api.post('users',
        {
          fullname,
          email,
          password,
          confirmationPassword,
        },
        {
          timeout: 45000, // Sobrescrever timeout global para essa requisição
        }
      );

      const response = (await Promise.race([signupPromise, timeoutPromise])) as any;

      const elapsed = Date.now() - startTime;

      console.log('⏱️ [SIGNUP] Tempo de resposta:', `${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);

      console.log('✅ Cadastro bem-sucedido:', {
        status: response.status,
        hasData: !!response.data,
        dataContent: response.data,
      });

      // Handle 204 No Content - signup successful but no user data returned
      if (response.status === 204) {
        console.log('✅ Cadastro realizado com sucesso (204 - No Content)');
        console.log('🔄 Fazendo login automático para obter dados de sessão...');

        // Limpar dados de onboarding antigos para novo usuário
        await AsyncStorage.removeItem('@app:personalData');
      await AsyncStorage.removeItem('@app:onboardingData');
        console.log('🧹 Dados de onboarding antigos removidos');

        // Auto-login after successful signup
        try {
          await signIn(email, password);
          console.log('✅ Login automático realizado após cadastro');
          return;
        } catch (loginError: any) {
          console.log('❌ Erro no login automático após cadastro:', {
            message: loginError?.message,
            email: email,
          });
          // Even if auto-login fails, signup was successful
          // User can login manually later
          throw new Error(
            'Conta criada com sucesso, mas houve erro no login automático. Tente fazer login manualmente.'
          );
        }
      }

      const { data } = response;

      // For other success status codes, try to process user data
      if (!data || !data.data) {
        console.log('⚠️ Resposta da API sem dados do usuário:', {
          hasData: !!data,
          dataContent: data,
          success: data?.success,
          message: data?.message,
        });

        // Se a API retornou sucesso mas sem dados do usuário, considere como erro
        if (data && data.success === false) {
          throw new Error(
            'Erro no cadastro: ' +
              (Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Dados insuficientes retornados')
          );
        }

        throw new Error('Cadastro não retornou dados do usuário');
      }

      const userData = data.data;

      // Validar se userData tem os campos necessários
      if (!userData.userId || !userData.token) {
        console.log('⚠️ Dados do usuário incompletos:', {
          hasUserId: !!userData.userId,
          hasToken: !!userData.token,
          userData: userData,
        });
        throw new Error('Cadastro incompleto: dados do usuário insuficientes');
      }

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      // Limpar dados de onboarding antigos para novo usuário
      await AsyncStorage.removeItem('@app:personalData');
      await AsyncStorage.removeItem('@app:onboardingData');
      console.log('🧹 Dados de onboarding antigos removidos');

      // Salvar dados do usuário e fazer login automático
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));
      setUser(formattedUserData);

      console.log('✅ Login automático realizado após cadastro');
    } catch (error: any) {
      // Log estruturado completo do erro
      const errorDetails = {
        timestamp: new Date().toISOString(),
        action: 'signUp',
        email,
        error: {
          message: error?.message,
          code: error?.code,
          name: error?.name,
        },
        request: {
          hasRequest: !!error.request,
          url: error?.config?.url,
          method: error?.config?.method,
          timeout: error?.config?.timeout,
        },
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
      };

      console.error('❌ [SIGNUP ERROR]', {
        email,
        status: error?.response?.status,
        message: error?.message,
      });

      console.error('📋 [SIGNUP ERROR - Detalhes completos]', JSON.stringify(errorDetails, null, 2));

      let errorMessage = 'Erro ao criar conta.';

      // Tratamento específico para timeout
      if (error.message && error.message.includes('Tempo limite excedido')) {
        errorMessage = error.message;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Caso especial: erro com propriedade 'response' direta (não error.response)
      if (error.response && Array.isArray(error.response) && !error.response.status) {
        console.log('🔍 Detectado erro com response array direto');
        errorMessage = error.response.join(', ');
      } else if (error.response && error.response.status) {
        console.log('📊 Detalhes da resposta do erro:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Verificar se a resposta é um array diretamente
        if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.join(', ');
        } else if (error.response.status === 400) {
          // Melhor tratamento para erro 400
          const responseData = error.response.data;
          if (responseData && typeof responseData === 'object') {
            if (responseData.message) {
              if (Array.isArray(responseData.message)) {
                errorMessage = responseData.message.join(', ');
              } else {
                errorMessage = responseData.message;
              }
            } else if (responseData.errors && Array.isArray(responseData.errors)) {
              errorMessage = responseData.errors.join(', ');
            } else if (responseData.response && Array.isArray(responseData.response)) {
              // Caso especial: erro dentro de response array
              errorMessage = responseData.response.join(', ');
            } else {
              errorMessage = 'Dados inválidos fornecidos.';
            }
          } else {
            errorMessage = 'Dados inválidos.';
          }
        } else if (error.response.status === 409) {
          errorMessage = 'Email já está em uso. Tente fazer login.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          // Fallback para outros status codes
          const responseData = error.response.data;
          if (responseData && responseData.message) {
            errorMessage = Array.isArray(responseData.message) ? responseData.message.join(', ') : responseData.message;
          } else if (responseData && responseData.response && Array.isArray(responseData.response)) {
            // Caso especial: erro dentro de response array
            errorMessage = responseData.response.join(', ');
          } else {
            errorMessage = `Erro ${error.response.status}: ${error.response.statusText || 'Erro desconhecido'}`;
          }
        }
      } else if (error.request) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.log('🚨 Mensagem de erro final:', errorMessage);
      console.log('🚨 Tipo de errorMessage:', typeof errorMessage, errorMessage);

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function forgotPassword(email: string) {
    try {
      setIsLoading(true);

      await api.post('password-reset/request', {
        email,
      });

      // Armazena o email para uso nas próximas etapas do fluxo de reset
      // NÃO usa setUser para não fazer o app pensar que está logado
      setResetEmail(email);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(code: string) {
    try {
      setIsLoading(true);

      await api.post('password-reset/verify', {
        email: resetEmail,
        code,
      });

      setResetCode(code);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(newPassword: string, confirmationPassword: string) {
    try {
      setIsLoading(true);

      await api.post('password-reset/password-confirm-reset', {
        email: resetEmail,
        code: resetCode,
        newPassword,
        confirmationPassword,
      });

      // Limpa os dados de reset após sucesso
      setResetEmail(null);
      setResetCode(null);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const getUserInfo = useCallback(async () => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);

      console.log('🔍 [AUTH] Buscando informações do usuário:', {
        userId: user.userId,
        url: `users/${user.userId}`,
        baseURL: (api as any)?.defaults?.baseURL,
        hasToken: !!user.token,
      });

      const response = await api.get('users/' + user?.userId);

      const newUserContent = {
        ...user,
        ...response.data.data,
      };

      setUser(newUserContent);
    } catch (error: any) {
      // Silenciar erros 404/500 relacionados a usuários OAuth não encontrados
      // Isso acontece quando o backend tem problemas para encontrar usuários criados via OAuth
      const isUserNotFound =
        error?.message?.includes('Usuário autenticado não encontrado') ||
        error?.message?.includes('404');

      if (isUserNotFound) {
        console.log('⚠️ [AUTH] Backend não encontrou usuário (provável usuário OAuth), mantendo dados do token');
        return;
      }

      // Para outros erros, logar mas não quebrar a aplicação
      console.error('❌ [AUTH] Erro ao buscar informações do usuário:', error.message);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const deleteAccount = useCallback(async () => {
    if (!user?.userId) {
      throw new Error('Usuário não encontrado');
    }

    try {
      setIsLoading(true);
      setError(null);

      await api.delete(`/users/${user.userId}`);

      // Clear user data after successful deletion
      await AsyncStorage.removeItem('@app:user');
      setUser(null);
    } catch (error: any) {
      console.log('❌ Erro ao deletar conta:', error);

      let errorMessage = 'Erro ao deletar conta.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não autorizado. Faça login novamente.';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuário não encontrado.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.message || 'Erro ao deletar conta.';
        }
      } else if (error.request) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      error,
      clearError,
      isLoading,
      signIn,
      signInWithBiometric,
      signInWithGoogle,
      signUpWithGoogle,
      signInWithApple,
      signUpWithApple,
      signUp,
      signOut,
      forgotPassword,
      verifyCode,
      resetPassword,
      deleteAccount,
      getUserInfo,
    }),
    [
      user,
      error,
      isLoading,
      clearError,
      signIn,
      signInWithGoogle,
      signUpWithGoogle,
      signInWithApple,
      signUpWithApple,
      signUp,
      signOut,
      forgotPassword,
      verifyCode,
      resetPassword,
      deleteAccount,
      getUserInfo,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
