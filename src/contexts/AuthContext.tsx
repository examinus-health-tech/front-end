import { createContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/services/api';
import { validateStoredToken } from '@utils/tokenValidation';
import { logger } from '@utils/debugLogger';
import { decodeJwtPayload } from '@utils/jwt';

interface User {
  userId?: string;
  name?: string;
  token?: string;
  fullName?: string;
}

interface AuthContextData {
  user?: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@app:user');
      // Pequeno delay para mostrar o loading
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser(null);
    } catch (error) {
      // Silent fail - user will be signed out anyway
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
            const userData = JSON.parse(storedUser);
            logger.auth('User loaded from storage', {
              userId: userData.userId,
              hasToken: !!userData.token,
            });
            setUser(userData);
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

      logger.auth('Starting login attempt', {
        userName,
        action: 'signIn',
        apiUrl: process.env.EXPO_PUBLIC_API_URL,
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

      logger.auth('Login successful', {
        userId: response.data?.data?.userId,
        hasToken: !!response.data?.data?.token,
      });

      const { data } = response;
      const userData = data.data;

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      setUser(formattedUserData);
    } catch (error: any) {
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

  async function signInWithGoogle(authCode: string) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 [AUTH] Iniciando login com Google...');
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

      const loginPromise = api.post('authentication/external', payload);
      const response = (await Promise.race([loginPromise, timeoutPromise])) as any;

      console.log('✅ [AUTH] Login Google bem-sucedido! Response:', {
        status: response.status,
        hasData: !!response.data,
        userData: response.data?.data
          ? {
              userId: response.data.data.userId,
              name: response.data.data.name,
              hasToken: !!response.data.data.token,
            }
          : null,
      });

      const { data } = response;
      const userData = data.data;

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

      setUser(formattedUserData);
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

      console.log('✅ [AUTH] Cadastro Google bem-sucedido! Response:', {
        status: response.status,
        hasData: !!response.data,
        userData: response.data?.data
          ? {
              userId: response.data.data.userId,
              name: response.data.data.name,
              hasToken: !!response.data.data.token,
            }
          : null,
      });

      const { data } = response;
      const userData = data.data;

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

      setUser(formattedUserData);
    } catch (error: any) {
      console.log('❌ Erro no cadastro Google:', error);

      let errorMessage = 'Erro ao fazer cadastro com Google.';

      if (error.message === 'Tempo limite excedido. Tente novamente.') {
        errorMessage = error.message;
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Google.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Google.';
        } else if (error.response.status === 409) {
          errorMessage = 'Usuário já existe. Tente fazer login.';
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
        formattedFullName ||
        (resolvedEmail ? resolvedEmail.split('@')[0] || undefined : undefined) ||
        'Apple User';

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

      // Ensure userData has the correct structure for app usage
      const formattedUserData = {
        userId: userData.userId,
        name: userData.name,
        token: userData.token,
        fullName: userData.fullName || userData.name, // fallback
      };

      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

      setUser(formattedUserData);
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
      const fallbackFullName = formattedFullName || (email ? (email.split('@')[0] || undefined) : undefined) || 'Apple User';

      logger.auth('Apple claims resolved (signUp)', {
        action: 'apple_signup_claims',
        extra: { hasClaims: !!claims, claims, emailFromCredential, chosenEmail: email, appleUserId, formattedFullName, fallbackFullName },
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

      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));

      // Add small delay for smooth transition
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

      setUser(formattedUserData);
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

      console.log('🚀 Criando conta para:', email);

      const response = await api.post('users', {
        fullname,
        email,
        password,
        confirmationPassword,
      });

      console.log('✅ Cadastro bem-sucedido:', {
        status: response.status,
        hasData: !!response.data,
        dataContent: response.data,
      });

      // Handle 204 No Content - signup successful but no user data returned
      if (response.status === 204) {
        console.log('✅ Cadastro realizado com sucesso (204 - No Content)');
        console.log('🔄 Fazendo login automático para obter dados de sessão...');

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

      // Salvar dados do usuário e fazer login automático
      await AsyncStorage.setItem('@app:user', JSON.stringify(formattedUserData));
      setUser(formattedUserData);

      console.log('✅ Login automático realizado após cadastro');
    } catch (error: any) {
      // Log detalhado do erro para debug
      console.log('❌ Erro no cadastro:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
        hasResponse: !!error.response,
        hasRequest: !!error.request,
        fullError: error,
      });

      let errorMessage = 'Erro ao criar conta.';

      if (error.response) {
        console.log('📊 Detalhes da resposta do erro:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        if (error.response.status === 400) {
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

      const userData = { name: email };

      setUser(userData);
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
        email: user?.name,
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
        email: user?.name,
        code: resetCode,
        newPassword,
        confirmationPassword,
      });
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

      const response = await api.get('/users/' + user?.userId);

      const newUserContent = {
        ...user,
        ...response.data.data,
      };

      setUser(newUserContent);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
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
