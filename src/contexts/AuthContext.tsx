import { createContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/services/api';
import { validateStoredToken } from '@utils/tokenValidation';
import { logger } from '@utils/debugLogger';

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
  signInWithApple: (identityToken: string, fullName?: any) => Promise<void>;
  signUpWithApple: (identityToken: string, fullName?: any) => Promise<void>;
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

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));

      setUser(userData);
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

      console.log('🔑 Fazendo login com Google...');

      console.warn('🔍 authCode:', authCode);

      const response = await api.post('authentication/external', {
        provider: 'google',
        idToken: authCode,
      });

      console.log('✅ Login Google bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.warn('🔍 authCode:', authCode);

      console.log('❌ Erro no login Google:', error);

      let errorMessage = 'Erro ao fazer login com Google.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Google.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Google.';
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

  async function signUpWithGoogle(authCode: string) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 Fazendo cadastro com Google...');

      const response = await api.post('authentication/external', {
        provider: 'Google',
        idToken: authCode,
      });

      console.log('✅ Cadastro Google bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.log('❌ Erro no cadastro Google:', error);

      let errorMessage = 'Erro ao fazer cadastro com Google.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Google.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Google.';
        } else if (error.response.status === 409) {
          errorMessage = 'Usuário já existe. Tente fazer login.';
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

  async function signInWithApple(identityToken: string, fullName?: any) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🍎 Fazendo login com Apple...');

      const response = await api.post('authentication/external', {
        provider: 'Apple',
        idToken: identityToken,
        fullName: fullName ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() : undefined,
      });

      console.log('✅ Login Apple bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.log('❌ Erro no login Apple:', error);

      let errorMessage = 'Erro ao fazer login com Apple.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Apple.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Apple.';
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

  async function signUpWithApple(identityToken: string, fullName?: any) {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🍎 Fazendo cadastro com Apple...');

      const response = await api.post('authentication/external', {
        provider: 'Apple',
        idToken: identityToken,
        fullName: fullName ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() : undefined,
      });

      console.log('✅ Cadastro Apple bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.log('❌ Erro no cadastro Apple:', error);

      let errorMessage = 'Erro ao fazer cadastro com Apple.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Não foi possível autenticar com Apple.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos do Apple.';
        } else if (error.response.status === 409) {
          errorMessage = 'Usuário já existe. Tente fazer login.';
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

      console.log('✅ Cadastro bem-sucedido:', response.data);

      const { data } = response;
      const userData = data.data;

      // Salvar dados do usuário e fazer login automático
      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      setUser(userData);

      console.log('✅ Login automático realizado após cadastro');
    } catch (error: any) {
      console.log('❌ Erro no cadastro:', error);

      let errorMessage = 'Erro ao criar conta.';

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos.';
        } else if (error.response.status === 409) {
          errorMessage = 'Email já está em uso. Tente fazer login.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.message || 'Erro desconhecido.';
        }
      } else if (error.request) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }

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
