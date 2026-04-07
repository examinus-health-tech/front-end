import React, { useContext } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';
import { AuthContext, AuthProvider } from './AuthContext';
import { USER_STORAGE } from '@storage/storageConfig';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-secure-store with in-memory store (matches global jest.setup.ts pattern)
const secureStoreData: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key: string) => Promise.resolve(secureStoreData[key] || null)),
  setItemAsync: jest.fn((key: string, value: string) => {
    secureStoreData[key] = value;
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key: string) => {
    delete secureStoreData[key];
    return Promise.resolve();
  }),
}));

// Mock da API
jest.mock('src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    registerInterceptTokenManager: jest.fn(() => jest.fn()), // retorna unsubscribe
    defaults: { baseURL: 'https://api.test.com/' },
  },
}));

// Mock tokenValidation
jest.mock('@utils/tokenValidation', () => ({
  validateStoredToken: jest.fn().mockResolvedValue(false),
  validateTokenWithBackend: jest.fn().mockResolvedValue(true),
}));

// Mock debugLogger
jest.mock('@utils/debugLogger', () => ({
  logger: {
    auth: jest.fn(),
    error: jest.fn(),
    network: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock jwt
jest.mock('@utils/jwt', () => ({
  decodeJwtPayload: jest.fn().mockReturnValue({
    Email: 'test@test.com',
    email: 'test@test.com',
    sub: 'apple-user-123',
  }),
}));

// Mock register-device-backend
jest.mock('src/services/register-device-backend', () => ({
  registerDeviceOnBackend: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-onesignal (incluindo login/logout)
jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    initialize: jest.fn(),
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn(),
    Debug: { setLogLevel: jest.fn() },
    Notifications: {
      getPermissionAsync: jest.fn().mockResolvedValue(true),
      requestPermission: jest.fn().mockResolvedValue(true),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    User: {
      pushSubscription: {
        optIn: jest.fn(),
        getTokenAsync: jest.fn().mockResolvedValue('mock-token'),
        getOptedIn: jest.fn().mockReturnValue(true),
        getId: jest.fn().mockReturnValue('mock-id'),
      },
      getOnesignalId: jest.fn().mockResolvedValue('mock-player-id'),
    },
  },
  LogLevel: { Verbose: 0 },
}));

import { api } from 'src/services/api';
import { validateStoredToken, validateTokenWithBackend } from '@utils/tokenValidation';
import { decodeJwtPayload } from '@utils/jwt';
import { registerDeviceOnBackend } from 'src/services/register-device-backend';
import { OneSignal } from 'react-native-onesignal';
const mockApi = api as jest.Mocked<typeof api>;
const mockValidateStoredToken = validateStoredToken as jest.MockedFunction<typeof validateStoredToken>;
const mockValidateTokenWithBackend = validateTokenWithBackend as jest.MockedFunction<typeof validateTokenWithBackend>;
const mockDecodeJwtPayload = decodeJwtPayload as jest.MockedFunction<typeof decodeJwtPayload>;

function useAuthContext() {
  return useContext(AuthContext);
}

// Dados de usuario mock
const mockUserData = {
  userId: 'user-123',
  name: 'Test User',
  token: 'mock-jwt-token',
  fullName: 'Test User Full',
  email: 'test@test.com',
};

const mockApiResponse = {
  data: {
    data: {
      userId: 'user-123',
      name: 'Test User',
      token: 'mock-jwt-token',
      fullName: 'Test User Full',
      email: 'test@test.com',
    },
  },
};

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Clear SecureStore in-memory data
    Object.keys(secureStoreData).forEach(key => delete secureStoreData[key]);

    // Restore SecureStore mock implementations (clearAllMocks removes them)
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      (key: string) => Promise.resolve(secureStoreData[key] || null)
    );
    (SecureStore.setItemAsync as jest.Mock).mockImplementation(
      (key: string, value: string) => {
        secureStoreData[key] = value;
        return Promise.resolve();
      }
    );
    (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
      (key: string) => {
        delete secureStoreData[key];
        return Promise.resolve();
      }
    );

    // Defaults: token invalido (para nao carregar user do storage), API retorna sucesso
    mockValidateStoredToken.mockResolvedValue(false);
    mockValidateTokenWithBackend.mockResolvedValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    mockDecodeJwtPayload.mockReturnValue({ Email: 'test@test.com', sub: 'apple-user-123' });
    (registerDeviceOnBackend as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // =============================================
  // ESTADO INICIAL E CARREGAMENTO
  // =============================================

  describe('Estado inicial', () => {
    it('deve iniciar com user null', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      // Avanca timers para loadStoredUser completar
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.user).toBeNull();
    });

    it('deve iniciar com isLoading true e depois false apos carregamento', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      // Inicialmente pode ser true (durante loadStoredUser)
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve iniciar com error null', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.error).toBeNull();
    });

    it('deve marcar isAuthReady como true apos carregamento', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isAuthReady).toBe(true);
    });

    it('deve registrar interceptor de token na inicializacao', () => {
      renderHook(() => useAuthContext(), { wrapper });
      expect(api.registerInterceptTokenManager).toHaveBeenCalled();
    });

    it('deve fornecer todas as funcoes esperadas', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(typeof result.current.signIn).toBe('function');
      expect(typeof result.current.signInWithBiometric).toBe('function');
      expect(typeof result.current.signInWithGoogle).toBe('function');
      expect(typeof result.current.signUpWithGoogle).toBe('function');
      expect(typeof result.current.signInWithApple).toBe('function');
      expect(typeof result.current.signUpWithApple).toBe('function');
      expect(typeof result.current.signUp).toBe('function');
      expect(typeof result.current.signOut).toBe('function');
      expect(typeof result.current.forgotPassword).toBe('function');
      expect(typeof result.current.verifyCode).toBe('function');
      expect(typeof result.current.resetPassword).toBe('function');
      expect(typeof result.current.deleteAccount).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
      expect(typeof result.current.getUserInfo).toBe('function');
      expect(typeof result.current.updateUserPhoto).toBe('function');
    });
  });

  // =============================================
  // RESTAURACAO DE SESSAO (loadStoredUser)
  // =============================================

  describe('Restauracao de sessao do storage', () => {
    it('deve restaurar usuario quando token armazenado e valido', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthReady).toBe(true);
    });

    it('deve limpar usuario quando token armazenado e invalido', async () => {
      mockValidateStoredToken.mockResolvedValue(false);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthReady).toBe(true);
    });

    it('deve tratar ausencia de usuario no SecureStore', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      // SecureStore is empty by default (cleared in beforeEach)

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthReady).toBe(true);
    });

    it('deve tratar dados corrompidos no SecureStore', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = 'invalid-json{{{';

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.user).toBeNull();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(USER_STORAGE);
    });

    it('deve lidar com timeout do loadStoredUser', async () => {
      // Simula validateStoredToken que nunca resolve
      mockValidateStoredToken.mockImplementation(
        () => new Promise(() => {}) // Nunca resolve
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      // Avanca timer do timeout (10s)
      await act(async () => {
        jest.advanceTimersByTime(15000);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthReady).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro generico no loadStoredUser', async () => {
      mockValidateStoredToken.mockRejectedValue(new Error('Unexpected error'));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthReady).toBe(true);
    });
  });

  // =============================================
  // SIGN IN (email/senha)
  // =============================================

  describe('signIn', () => {
    it('deve fazer login com sucesso', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      expect(mockApi.post).toHaveBeenCalledWith('authentication', {
        userName: 'test@test.com',
        password: 'password123',
      });
      expect(result.current.user?.userId).toBe('user-123');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve persistir dados no SecureStore ao fazer login', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        USER_STORAGE,
        expect.any(String)
      );
    });

    it('deve limpar dados de onboarding antes do login', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        ['@app:personalData', '@app:onboardingData']
      );
    });

    it('deve registrar OneSignal apos login', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      expect(OneSignal.login).toHaveBeenCalledWith('user-123');
    });

    it('deve registrar dispositivo no backend em background', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      expect(registerDeviceOnBackend).toHaveBeenCalled();
    });

    it('deve extrair email do JWT quando backend nao envia email', async () => {
      const responseWithoutEmail = {
        data: {
          data: {
            userId: 'user-123',
            name: 'Test User',
            token: 'mock-jwt-token',
            fullName: 'Test User Full',
            // email ausente
          },
        },
      };

      mockDecodeJwtPayload.mockReturnValueOnce({ Email: 'jwt@test.com' });
      (mockApi.post as jest.Mock).mockResolvedValueOnce(responseWithoutEmail);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      expect(decodeJwtPayload).toHaveBeenCalledWith('mock-jwt-token');
    });

    it('deve tratar erro de credenciais invalidas (401)', async () => {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: { message: 'Unauthorized' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.signIn('test@test.com', 'wrongpassword');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe('Credenciais inválidas. Verifique seu email e senha.');
      expect(result.current.error).toBe('Credenciais inválidas. Verifique seu email e senha.');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro 400 com mensagem do backend', async () => {
      const error: any = new Error('Bad Request');
      error.response = { status: 400, data: { message: 'Email invalido' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.signIn('invalid', 'password');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe('Email invalido');
      expect(result.current.error).toBe('Email invalido');
    });

    it('deve tratar erro de servidor (500+)', async () => {
      const error: any = new Error('Internal Server Error');
      error.response = { status: 500, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password');
        })
      ).rejects.toThrow('Erro no servidor. Tente novamente mais tarde.');
    });

    it('deve tratar erro de rede (sem response)', async () => {
      const error: any = new Error('Network Error');
      error.request = {}; // Tem request mas nao tem response

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password');
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar timeout de login', async () => {
      // Simula API que demora mais que 30s
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {}) // Nunca resolve
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      const signInPromise = act(async () => {
        await result.current.signIn('test@test.com', 'password');
      });

      // Avanca o timer do timeout (30s)
      await act(async () => {
        jest.advanceTimersByTime(35000);
      });

      await expect(signInPromise).rejects.toThrow('Tempo limite excedido. Verifique sua conexão e tente novamente.');
    });

    it('deve lancar erro quando persistencia falha', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);
      // Override setItemAsync to NOT store data, so getItemAsync returns null (verification fails)
      (SecureStore.setItemAsync as jest.Mock).mockImplementation(() => Promise.resolve());
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(() => Promise.resolve(null));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password');
        })
      ).rejects.toThrow();
    });

    it('deve tratar erro generico (sem response e sem request)', async () => {
      const error = new Error('Erro inesperado');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password');
        })
      ).rejects.toThrow('Erro inesperado');
    });

    it('deve tratar erro com status desconhecido', async () => {
      const error: any = new Error('Erro');
      error.response = { status: 418, data: { message: 'Teapot' }, statusText: 'I am a teapot' };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password');
        })
      ).rejects.toThrow('Teapot');
    });
  });

  // =============================================
  // SIGN IN COM BIOMETRIA
  // =============================================

  describe('signInWithBiometric', () => {
    const biometricData = {
      userId: 'user-bio',
      name: 'Bio User',
      fullName: 'Bio User Full',
      email: 'bio@test.com',
      token: 'bio-token',
    };

    it('deve fazer login biometrico com sucesso', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signInWithBiometric(biometricData);
      });

      expect(result.current.user?.userId).toBe('user-bio');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve limpar dados de onboarding antes do login biometrico', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signInWithBiometric(biometricData);
      });

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        ['@app:personalData', '@app:onboardingData']
      );
    });

    it('deve registrar OneSignal no login biometrico', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signInWithBiometric(biometricData);
      });

      expect(OneSignal.login).toHaveBeenCalledWith('user-bio');
    });

    it('deve continuar login biometrico mesmo se OneSignal falhar', async () => {
      (OneSignal.login as jest.Mock).mockRejectedValueOnce(new Error('OneSignal error'));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signInWithBiometric(biometricData);
      });

      expect(result.current.user?.userId).toBe('user-bio');
    });

    it('deve lancar erro quando persistencia falha no login biometrico', async () => {
      // Override setItemAsync to NOT store data, so getItemAsync returns null (verification fails)
      (SecureStore.setItemAsync as jest.Mock).mockImplementation(() => Promise.resolve());
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(() => Promise.resolve(null));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.signInWithBiometric(biometricData);
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe('Falha ao persistir dados do usuário');
      expect(result.current.error).toBe('Falha ao persistir dados do usuário');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve usar name como fallback para fullName quando ausente', async () => {
      const bioDataNoFullName = { ...biometricData, fullName: '' };

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signInWithBiometric(bioDataNoFullName);
      });

      // fullName deve usar name como fallback (|| userData.name)
      expect(result.current.user?.fullName).toBeTruthy();
    });
  });

  // =============================================
  // SIGN IN COM GOOGLE
  // =============================================

  describe('signInWithGoogle', () => {
    it('deve fazer login com Google com sucesso', async () => {
      // Usar real timers para este teste, pois signInWithGoogle tem setTimeout(300) interno
      jest.useRealTimers();

      const googleApiResponse = {
        ...mockApiResponse,
        headers: { 'content-type': 'application/json' },
      };
      (mockApi.post as jest.Mock).mockResolvedValueOnce(googleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      // Esperar loadStoredUser completar
      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signInWithGoogle('google-auth-code');
      });

      expect(mockApi.post).toHaveBeenCalledWith('authentication/external', {
        provider: 'Google',
        idToken: 'google-auth-code',
      });
      expect(result.current.user?.userId).toBe('user-123');

      // Restaurar fake timers para os proximos testes
      jest.useFakeTimers();
    });

    it('deve tratar erro 401 do Google', async () => {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('invalid-code');
        })
      ).rejects.toThrow('Token Google inválido ou expirado.');
    });

    it('deve tratar erro 400 com mensagem do backend', async () => {
      const error: any = new Error('Bad Request');
      error.response = { status: 400, data: { message: 'Token expirado' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('expired-code');
        })
      ).rejects.toThrow('Token expirado');
    });

    it('deve tratar erro de servidor (500+) no Google', async () => {
      const error: any = new Error('Server Error');
      error.response = { status: 500, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('code');
        })
      ).rejects.toThrow('Erro interno do servidor. Tente novamente.');
    });

    it('deve tratar erro de rede no Google', async () => {
      const error: any = new Error('Network Error');
      error.request = {};

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('code');
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar timeout no login Google', async () => {
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      const signInPromise = act(async () => {
        await result.current.signInWithGoogle('code');
      });

      await act(async () => {
        jest.advanceTimersByTime(20000);
      });

      await expect(signInPromise).rejects.toThrow('Tempo limite excedido. Tente novamente.');
    });

    it('deve tratar erro com status desconhecido no Google', async () => {
      const error: any = new Error('Erro');
      error.response = { status: 418, data: { message: 'Custom error' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('code');
        })
      ).rejects.toThrow('Custom error');
    });
  });

  // =============================================
  // SIGN UP COM GOOGLE
  // =============================================

  describe('signUpWithGoogle', () => {
    it('deve fazer cadastro/login automatico com Google quando usuario ja existe', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        ...mockApiResponse,
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signUpWithGoogle('google-code');
      });

      expect(result.current.user?.userId).toBe('user-123');
    });

    it('deve tratar novo cadastro Google com status 201', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 201,
        data: {},
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signUpWithGoogle('google-code');
      });

      // Usuario deve ser null (novo cadastro sem login automatico)
      expect(result.current.user).toBeNull();
    });

    it('deve tratar novo cadastro Google com status 204', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 204,
        data: {},
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signUpWithGoogle('google-code');
      });

      expect(result.current.user).toBeNull();
    });

    it('deve tratar erro 409 (conflito - usuario ja existe)', async () => {
      const error: any = new Error('Conflict');
      error.response = { status: 409, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Usuário já existe. Tente fazer login.');
    });

    it('deve tratar erro 401 no cadastro Google', async () => {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Não foi possível autenticar com Google.');
    });

    it('deve tratar erro 400 com mensagem do backend', async () => {
      const error: any = new Error('Bad Request');
      error.response = { status: 400, data: { message: 'Token invalido' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Token invalido');
    });

    it('deve tratar erro 500+ com mensagem do backend', async () => {
      const error: any = new Error('Server Error');
      error.response = { status: 500, data: { message: 'Erro interno' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Erro interno');
    });

    it('deve tratar erro de rede no cadastro Google', async () => {
      const error: any = new Error('Network Error');
      error.request = {};

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar resposta inesperada (sem userData e sem status 201/204)', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { data: null },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      // A mensagem original "Resposta inesperada do servidor" e capturada pelo catch
      // que a converte para "Erro ao fazer cadastro com Google."
      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Erro ao fazer cadastro com Google.');
    });
  });

  // =============================================
  // SIGN IN COM APPLE
  // =============================================

  describe('signInWithApple', () => {
    const appleApiResponse = {
      ...mockApiResponse,
      headers: { 'content-type': 'application/json' },
    };

    it('deve fazer login com Apple com sucesso', async () => {
      jest.useRealTimers();

      (mockApi.post as jest.Mock).mockResolvedValueOnce(appleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signInWithApple('apple-identity-token', { givenName: 'John', familyName: 'Doe' });
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'authentication/external',
        expect.objectContaining({
          provider: 'Apple',
          idToken: 'apple-identity-token',
        })
      );
      expect(result.current.user?.userId).toBe('user-123');

      jest.useFakeTimers();
    });

    it('deve resolver fullName a partir de claims quando fullName nao e fornecido', async () => {
      jest.useRealTimers();

      mockDecodeJwtPayload.mockReturnValueOnce({
        email: 'apple@test.com',
        sub: 'apple-123',
      });

      (mockApi.post as jest.Mock).mockResolvedValueOnce(appleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signInWithApple('apple-token', undefined, 'apple@test.com');
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'authentication/external',
        expect.objectContaining({
          provider: 'Apple',
          email: 'apple@test.com',
        })
      );

      jest.useFakeTimers();
    });

    it('deve usar "Apple User" como fallback quando nao ha nome nem email', async () => {
      jest.useRealTimers();

      mockDecodeJwtPayload.mockReturnValueOnce({ sub: 'apple-123' });

      (mockApi.post as jest.Mock).mockResolvedValueOnce(appleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signInWithApple('apple-token');
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'authentication/external',
        expect.objectContaining({
          fullName: 'Apple User',
        })
      );

      jest.useFakeTimers();
    });

    it('deve tratar erro 401 no login Apple', async () => {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithApple('invalid-token');
        })
      ).rejects.toThrow('Não foi possível autenticar com Apple.');
    });

    it('deve tratar erro 400 no login Apple', async () => {
      const error: any = new Error('Bad Request');
      error.response = { status: 400, data: { message: 'Dados invalidos' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithApple('apple-token');
        })
      ).rejects.toThrow('Dados invalidos');
    });

    it('deve tratar erro de rede no login Apple', async () => {
      const error: any = new Error('Network Error');
      error.request = {};

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithApple('apple-token');
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar timeout no login Apple', async () => {
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      const signInPromise = act(async () => {
        await result.current.signInWithApple('apple-token');
      });

      await act(async () => {
        jest.advanceTimersByTime(20000);
      });

      await expect(signInPromise).rejects.toThrow('Tempo limite excedido. Tente novamente.');
    });

    it('deve tratar erro 500+ no login Apple', async () => {
      const error: any = new Error('Server Error');
      error.response = { status: 500, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithApple('apple-token');
        })
      ).rejects.toThrow('Erro interno do servidor. Tente novamente.');
    });
  });

  // =============================================
  // SIGN UP COM APPLE
  // =============================================

  describe('signUpWithApple', () => {
    const appleApiResponse = {
      ...mockApiResponse,
      headers: { 'content-type': 'application/json' },
    };

    it('deve fazer cadastro com Apple com sucesso', async () => {
      jest.useRealTimers();

      (mockApi.post as jest.Mock).mockResolvedValueOnce(appleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signUpWithApple('apple-token', { givenName: 'Jane', familyName: 'Smith' }, 'jane@test.com');
      });

      expect(result.current.user?.userId).toBe('user-123');

      jest.useFakeTimers();
    });

    it('deve tratar erro 409 (conta ja existe com Apple ID)', async () => {
      const error: any = new Error('Conflict');
      error.response = { status: 409, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithApple('apple-token');
        })
      ).rejects.toThrow('Conta já existe com este Apple ID.');
    });

    it('deve tratar erro 401 no cadastro Apple', async () => {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithApple('apple-token');
        })
      ).rejects.toThrow('Não foi possível autenticar com Apple.');
    });

    it('deve tratar timeout no cadastro Apple', async () => {
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      const signUpPromise = act(async () => {
        await result.current.signUpWithApple('apple-token');
      });

      await act(async () => {
        jest.advanceTimersByTime(20000);
      });

      await expect(signUpPromise).rejects.toThrow('Tempo limite excedido. Tente novamente.');
    });

    it('deve tratar erro de rede no cadastro Apple', async () => {
      const error: any = new Error('Network Error');
      error.request = {};

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithApple('apple-token');
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar erro 400 no cadastro Apple', async () => {
      const error: any = new Error('Bad Request');
      error.response = { status: 400, data: { message: 'Token invalido Apple' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithApple('apple-token');
        })
      ).rejects.toThrow('Token invalido Apple');
    });

    it('deve tratar erro 500+ no cadastro Apple', async () => {
      const error: any = new Error('Server Error');
      error.response = { status: 500, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithApple('apple-token');
        })
      ).rejects.toThrow('Erro interno do servidor. Tente novamente.');
    });
  });

  // =============================================
  // SIGN UP (email/senha)
  // =============================================

  describe('signUp', () => {
    it('deve fazer cadastro com sucesso e login automatico quando status 204', async () => {
      // Primeiro post: signup retorna 204
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 204,
        data: {},
      });
      // Segundo post: auto-login
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signUp('Test User', 'test@test.com', 'password123', 'password123');
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'users',
        {
          fullname: 'Test User',
          email: 'test@test.com',
          password: 'password123',
          confirmationPassword: 'password123',
        },
        { timeout: 45000 }
      );
    });

    it('deve tratar cadastro com dados completos retornados', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            userId: 'new-user',
            name: 'New User',
            token: 'new-token',
            fullName: 'New User Full',
          },
        },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signUp('New User', 'new@test.com', 'password', 'password');
      });

      expect(result.current.user?.userId).toBe('new-user');
    });

    it('deve tratar erro quando auto-login falha apos cadastro 204', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 204,
        data: {},
      });
      (mockApi.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'pass', 'pass');
        })
      ).rejects.toThrow('Conta criada com sucesso, mas houve erro no login automático.');
    });

    it('deve tratar erro quando API retorna success false', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { success: false, message: ['Senha muito fraca', 'Email invalido'] },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'pass', 'pass');
        })
      ).rejects.toThrow('Erro no cadastro: Senha muito fraca, Email invalido');
    });

    it('deve tratar resposta sem dados do usuario', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { success: true },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'pass', 'pass');
        })
      ).rejects.toThrow('Cadastro não retornou dados do usuário');
    });

    it('deve tratar dados incompletos (sem userId ou token)', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { data: { name: 'User' } },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'pass', 'pass');
        })
      ).rejects.toThrow('Cadastro incompleto: dados do usuário insuficientes');
    });

    it('deve tratar timeout no cadastro', async () => {
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      const signUpPromise = act(async () => {
        await result.current.signUp('User', 'user@test.com', 'pass', 'pass');
      });

      await act(async () => {
        jest.advanceTimersByTime(50000);
      });

      await expect(signUpPromise).rejects.toThrow('Tempo limite excedido');
    });

    it('deve tratar erro 409 (email ja em uso)', async () => {
      const error: any = new Error('Conflict');
      error.response = { status: 409, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'existing@test.com', 'pass', 'pass');
        })
      ).rejects.toThrow('Email já está em uso. Tente fazer login.');
    });

    it('deve tratar erro 400 com mensagem de array', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: { message: ['Senha deve ter 8+ caracteres', 'Email obrigatorio'] },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Senha deve ter 8+ caracteres, Email obrigatorio');
    });

    it('deve tratar erro 400 com errors array', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: { errors: ['Campo invalido', 'Formato incorreto'] },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Campo invalido, Formato incorreto');
    });

    it('deve tratar erro 400 com response array dentro de data', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: { response: ['Erro 1', 'Erro 2'] },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro 1, Erro 2');
    });

    it('deve tratar erro 400 com objeto sem campos conhecidos', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: { unknown: 'field' },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Dados inválidos fornecidos.');
    });

    it('deve tratar erro 400 com data nao-objeto', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: 'string error',
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Dados inválidos.');
    });

    it('deve tratar erro 500+ no cadastro', async () => {
      const error: any = new Error('Server Error');
      error.response = { status: 500, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro no servidor. Tente novamente mais tarde.');
    });

    it('deve tratar erro de rede no cadastro', async () => {
      const error: any = new Error('Network Error');
      error.request = {};

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar erro com response array direta (nao error.response.data)', async () => {
      const error: any = new Error('Error');
      error.response = ['Erro 1', 'Erro 2'];

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro 1, Erro 2');
    });

    it('deve tratar data como array na resposta do erro', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: ['Erro A', 'Erro B'],
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro A, Erro B');
    });

    it('deve tratar erro com status desconhecido e response array no data', async () => {
      const error: any = new Error('Error');
      error.response = {
        status: 422,
        statusText: 'Unprocessable',
        data: { response: ['Campo X invalido'] },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Campo X invalido');
    });

    it('deve tratar erro com status desconhecido sem mensagem', async () => {
      const error: any = new Error('Error');
      error.response = {
        status: 422,
        statusText: 'Unprocessable',
        data: {},
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro 422: Unprocessable');
    });

    it('deve tratar erro generico (message direta)', async () => {
      const error = new Error('Erro personalizado');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro personalizado');
    });
  });

  // =============================================
  // SIGN OUT
  // =============================================

  describe('signOut', () => {
    it('deve fazer logout com sucesso e limpar usuario', async () => {
      jest.useRealTimers();

      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password');
      });

      expect(result.current.user).not.toBeNull();

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();

      jest.useFakeTimers();
    });

    it('deve desassociar dispositivo do OneSignal no logout', async () => {
      jest.useRealTimers();

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(OneSignal.logout).toHaveBeenCalled();

      jest.useFakeTimers();
    });

    it('deve limpar dados do AsyncStorage e SecureStore no logout', async () => {
      jest.useRealTimers();

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      // User data is now in SecureStore, deleted separately
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(USER_STORAGE);

      // Other data still cleaned via AsyncStorage.multiRemove
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining([
          '@app:personalData',
          '@app:onboardingData',
        ])
      );

      jest.useFakeTimers();
    });

    it('deve continuar o logout mesmo se OneSignal falhar', async () => {
      jest.useRealTimers();

      (OneSignal.logout as jest.Mock).mockImplementation(() => {
        throw new Error('OneSignal error');
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();

      jest.useFakeTimers();
    });

    it('deve limpar usuario mesmo quando AsyncStorage falha', async () => {
      jest.useRealTimers();

      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      // Mesmo com erro, user deve ser limpo
      expect(result.current.user).toBeNull();

      jest.useFakeTimers();
    });
  });

  // =============================================
  // FORGOT PASSWORD / VERIFY CODE / RESET PASSWORD
  // =============================================

  describe('forgotPassword', () => {
    it('deve enviar solicitacao de reset de senha com sucesso', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.forgotPassword('test@test.com');
      });

      expect(mockApi.post).toHaveBeenCalledWith('password-reset/request', {
        email: 'test@test.com',
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro ao solicitar reset de senha', async () => {
      const error = new Error('Erro ao enviar email');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.forgotPassword('test@test.com');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.error).toBe('Erro ao enviar email');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro nao-Error no forgotPassword', async () => {
      (mockApi.post as jest.Mock).mockRejectedValueOnce('string error');

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.forgotPassword('test@test.com');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.error).toBe('Erro desconhecido');
    });
  });

  describe('verifyCode', () => {
    it('deve verificar codigo com sucesso', async () => {
      // Primeiro fazer forgotPassword para setar resetEmail
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.forgotPassword('test@test.com');
      });

      await act(async () => {
        await result.current.verifyCode('123456');
      });

      expect(mockApi.post).toHaveBeenCalledWith('password-reset/verify', {
        email: 'test@test.com',
        code: '123456',
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro ao verificar codigo', async () => {
      const error = new Error('Codigo invalido');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.verifyCode('999999');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.error).toBe('Codigo invalido');
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha com sucesso', async () => {
      // Fluxo completo: forgotPassword -> verifyCode -> resetPassword
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.forgotPassword('test@test.com');
      });

      await act(async () => {
        await result.current.verifyCode('123456');
      });

      await act(async () => {
        await result.current.resetPassword('newPass123', 'newPass123');
      });

      expect(mockApi.post).toHaveBeenCalledWith('password-reset/password-confirm-reset', {
        email: 'test@test.com',
        code: '123456',
        newPassword: 'newPass123',
        confirmationPassword: 'newPass123',
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro ao resetar senha', async () => {
      const error = new Error('Senha muito fraca');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.resetPassword('weak', 'weak');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.error).toBe('Senha muito fraca');
    });
  });

  // =============================================
  // DELETE ACCOUNT
  // =============================================

  describe('deleteAccount', () => {
    it('deve deletar conta com sucesso', async () => {
      // Primeiro fazer login
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.deleteAccount();
      });

      expect(mockApi.delete).toHaveBeenCalledWith('users/user-123');
      expect(result.current.user).toBeNull();
    });

    it('deve limpar todos os dados incluindo biometria ao deletar conta', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.deleteAccount();
      });

      // User data deleted from SecureStore separately
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(USER_STORAGE);

      // Biometric and other data cleaned via AsyncStorage.multiRemove
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining([
          '@examinus:biometric_token',
          '@examinus:biometric_enabled',
        ])
      );
    });

    it('deve continuar com limpeza local quando backend retorna 404', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error: any = new Error('Not Found');
      error.response = { status: 404, data: {} };
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.deleteAccount();
      });

      // Mesmo com 404, conta deve ter sido "deletada" localmente
      expect(result.current.user).toBeNull();
    });

    it('deve lancar erro quando usuario nao esta logado', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.deleteAccount();
        })
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve tratar erro 401 ao deletar conta', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: {} };
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await expect(
        act(async () => {
          await result.current.deleteAccount();
        })
      ).rejects.toThrow('Não autorizado. Faça login novamente.');
    });

    it('deve tratar erro 500+ ao deletar conta', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error: any = new Error('Server Error');
      error.response = { status: 500, data: {} };
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await expect(
        act(async () => {
          await result.current.deleteAccount();
        })
      ).rejects.toThrow('Erro no servidor. Tente novamente mais tarde.');
    });

    it('deve tratar erro de rede ao deletar conta', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error: any = new Error('Network Error');
      error.request = {};
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await expect(
        act(async () => {
          await result.current.deleteAccount();
        })
      ).rejects.toThrow('Sem conexão com o servidor. Verifique sua internet.');
    });

    it('deve tratar erro com mensagem customizada do backend', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error: any = new Error('Error');
      error.response = { status: 403, data: { message: 'Conta bloqueada' } };
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await expect(
        act(async () => {
          await result.current.deleteAccount();
        })
      ).rejects.toThrow('Conta bloqueada');
    });
  });

  // =============================================
  // GET USER INFO
  // =============================================

  describe('getUserInfo', () => {
    it('deve buscar informacoes do usuario com sucesso', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: { photoUrl: 'https://photo.com/user.jpg' } },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      expect(mockApi.get).toHaveBeenCalledWith('users/user-123');
      expect(result.current.user?.photoUrl).toBe('https://photo.com/user.jpg');
    });

    it('deve nao fazer nada quando nao ha usuario logado', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      expect(mockApi.get).not.toHaveBeenCalledWith(expect.stringContaining('users/'));
    });

    it('deve silenciar erro de usuario OAuth nao encontrado (404)', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error = new Error('Usuário autenticado não encontrado');
      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      // Nao deve setar erro
      expect(result.current.error).toBeNull();
      // User deve ser mantido
      expect(result.current.user?.userId).toBe('user-123');
    });

    it('deve setar erro para outros tipos de erro', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error = new Error('Erro generico de servidor');
      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      expect(result.current.error).toBe('Erro generico de servidor');
    });
  });

  // =============================================
  // UPDATE USER PHOTO
  // =============================================

  describe('updateUserPhoto', () => {
    it('deve atualizar foto de perfil do usuario', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.updateUserPhoto('base64-photo-data');
      });

      expect(result.current.user?.profilePhotoBase64).toBe('base64-photo-data');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        USER_STORAGE,
        expect.stringContaining('base64-photo-data')
      );
    });

    it('deve remover foto ao passar null', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify({ ...mockUserData, profilePhotoBase64: 'old-photo' });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.updateUserPhoto(null);
      });

      expect(result.current.user?.profilePhotoBase64).toBeUndefined();
    });

    it('deve nao fazer nada quando nao ha usuario logado', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.updateUserPhoto('photo');
      });

      // Sem usuario, nao deve chamar setItem
      // A funcao retorna cedo com return
    });

    it('deve tratar erro ao persistir foto no SecureStore', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      // Now make SecureStore.setItemAsync fail for the updateUserPhoto call
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      // Nao deve lancar erro, apenas logar
      await act(async () => {
        await result.current.updateUserPhoto('photo');
      });

      // Estado deve ter sido atualizado mesmo com erro no storage
      expect(result.current.user?.profilePhotoBase64).toBe('photo');
    });
  });

  // =============================================
  // CLEAR ERROR
  // =============================================

  describe('clearError', () => {
    it('deve limpar erro', async () => {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401, data: {} };
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        try {
          await result.current.signIn('test@test.com', 'wrong');
        } catch (e) {
          // Esperado
        }
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  // =============================================
  // VALIDACAO DE TOKEN EM BACKGROUND
  // =============================================

  describe('Validacao de token em background', () => {
    it('deve validar token apos usuario ser carregado (validacao inicial)', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      mockValidateTokenWithBackend.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      // Avanca 2 segundos para a validacao inicial com backend
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      expect(validateTokenWithBackend).toHaveBeenCalled();
    });

    it('deve fazer logout quando token e rejeitado pelo backend na validacao inicial', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      mockValidateTokenWithBackend.mockResolvedValue(false);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      // Delay do signOut (800ms)
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });

    it('deve ignorar erro de rede na validacao inicial com backend', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      mockValidateTokenWithBackend.mockRejectedValue(new Error('Network error'));
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      // User should remain logged in despite backend validation error
      expect(result.current.user?.userId).toBe('user-123');
    });
  });

  // =============================================
  // SIGN IN - ADDITIONAL ERROR BRANCHES
  // =============================================

  describe('signIn - branches adicionais', () => {
    it('deve tratar erro 400 sem mensagem do backend (fallback)', async () => {
      const error: any = new Error('Bad Request');
      error.response = { status: 400, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password');
        })
      ).rejects.toThrow('Dados inválidos.');
    });

    it('deve tratar erro quando OneSignal.login falha no signIn', async () => {
      (OneSignal.login as jest.Mock).mockRejectedValueOnce(new Error('OneSignal error'));
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      // Should still complete login despite OneSignal error
      expect(result.current.user?.userId).toBe('user-123');
    });

    it('deve tratar erro quando decodeJwtPayload falha ao extrair email', async () => {
      const responseWithoutEmail = {
        data: {
          data: {
            userId: 'user-123',
            name: 'Test User',
            token: 'mock-jwt-token',
            fullName: 'Test User Full',
          },
        },
      };

      mockDecodeJwtPayload.mockImplementationOnce(() => {
        throw new Error('Invalid JWT');
      });
      (mockApi.post as jest.Mock).mockResolvedValueOnce(responseWithoutEmail);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      // Should still complete login
      expect(result.current.user?.userId).toBe('user-123');
    });

    it('deve tratar registerDeviceOnBackend falhando em background', async () => {
      (registerDeviceOnBackend as jest.Mock).mockRejectedValueOnce(new Error('Device error'));
      (mockApi.post as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signIn('test@test.com', 'password123');
      });

      // Should still complete login
      expect(result.current.user?.userId).toBe('user-123');
    });
  });

  // =============================================
  // SIGN IN GOOGLE - ADDITIONAL BRANCHES
  // =============================================

  describe('signInWithGoogle - branches adicionais', () => {
    it('deve extrair email do JWT quando backend nao envia email no Google login', async () => {
      jest.useRealTimers();

      const responseWithoutEmail = {
        data: {
          data: {
            userId: 'user-g1',
            name: 'Google User',
            token: 'google-jwt-token',
            fullName: 'Google User Full',
          },
        },
        headers: { 'content-type': 'application/json' },
      };

      mockDecodeJwtPayload.mockReturnValueOnce({ Email: 'google@jwt.com' });
      (mockApi.post as jest.Mock).mockResolvedValueOnce(responseWithoutEmail);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signInWithGoogle('google-code');
      });

      expect(decodeJwtPayload).toHaveBeenCalledWith('google-jwt-token');

      jest.useFakeTimers();
    });

    it('deve tratar persistencia falhando no Google login', async () => {
      const googleApiResponse = {
        ...mockApiResponse,
        headers: { 'content-type': 'application/json' },
      };
      (mockApi.post as jest.Mock).mockResolvedValueOnce(googleApiResponse);
      // Override SecureStore to NOT persist data, so verification fails
      (SecureStore.setItemAsync as jest.Mock).mockImplementation(() => Promise.resolve());
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(() => Promise.resolve(null));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('code');
        })
      ).rejects.toThrow();
    });

    it('deve tratar erro generico sem response e sem request no Google', async () => {
      const error = new Error('Erro desconhecido Google');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithGoogle('code');
        })
      ).rejects.toThrow('Erro ao fazer login com Google.');
    });
  });

  // =============================================
  // SIGN UP GOOGLE - ADDITIONAL BRANCHES
  // =============================================

  describe('signUpWithGoogle - branches adicionais', () => {
    it('deve tratar persistencia falhando no signup Google com usuario existente', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        ...mockApiResponse,
      });
      // Override SecureStore to NOT persist data, so verification fails
      (SecureStore.setItemAsync as jest.Mock).mockImplementation(() => Promise.resolve());
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(() => Promise.resolve(null));

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow();
    });

    it('deve tratar erro com status desconhecido sem mensagem no signup Google', async () => {
      const error: any = new Error('Unknown');
      error.response = { status: 418, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Erro no servidor.');
    });

    it('deve tratar erro 500+ sem mensagem do backend no signup Google', async () => {
      const error: any = new Error('Server Error');
      error.response = { status: 502, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithGoogle('google-code');
        })
      ).rejects.toThrow('Erro interno do servidor. Tente novamente.');
    });

    it('deve tratar timeout no cadastro Google', async () => {
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      const signUpPromise = act(async () => {
        await result.current.signUpWithGoogle('google-code');
      });

      await act(async () => {
        jest.advanceTimersByTime(20000);
      });

      await expect(signUpPromise).rejects.toThrow('Tempo limite excedido. Tente novamente.');
    });

    it('deve extrair email do JWT no signup Google quando backend nao envia email', async () => {
      const responseWithoutEmail = {
        status: 200,
        data: {
          data: {
            userId: 'user-gs',
            name: 'Google User',
            token: 'google-jwt',
            fullName: 'Google User Full',
          },
        },
      };

      mockDecodeJwtPayload.mockReturnValueOnce({ Email: 'google-signup@jwt.com' });
      (mockApi.post as jest.Mock).mockResolvedValueOnce(responseWithoutEmail);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.signUpWithGoogle('google-code');
      });

      expect(decodeJwtPayload).toHaveBeenCalledWith('google-jwt');
    });
  });

  // =============================================
  // SIGN IN APPLE - ADDITIONAL BRANCHES
  // =============================================

  describe('signInWithApple - branches adicionais', () => {
    it('deve tratar erro com status desconhecido no login Apple', async () => {
      const error: any = new Error('Unknown');
      error.response = { status: 418, data: { message: 'Teapot Apple' } };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithApple('apple-token');
        })
      ).rejects.toThrow('Teapot Apple');
    });

    it('deve tratar erro com status desconhecido sem mensagem no login Apple', async () => {
      const error: any = new Error('Unknown');
      error.response = { status: 418, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signInWithApple('apple-token');
        })
      ).rejects.toThrow('Erro no servidor.');
    });

    it('deve usar email da credencial quando claims nao tem email', async () => {
      jest.useRealTimers();

      mockDecodeJwtPayload.mockReturnValueOnce({ sub: 'apple-sub-123' });

      const appleApiResponse = {
        ...mockApiResponse,
        headers: { 'content-type': 'application/json' },
      };

      (mockApi.post as jest.Mock).mockResolvedValueOnce(appleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signInWithApple('apple-token', undefined, 'cred@apple.com');
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'authentication/external',
        expect.objectContaining({
          email: 'cred@apple.com',
        })
      );

      jest.useFakeTimers();
    });
  });

  // =============================================
  // SIGN UP APPLE - ADDITIONAL BRANCHES
  // =============================================

  describe('signUpWithApple - branches adicionais', () => {
    it('deve tratar erro com status desconhecido sem mensagem no cadastro Apple', async () => {
      const error: any = new Error('Unknown');
      error.response = { status: 418, data: {} };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUpWithApple('apple-token');
        })
      ).rejects.toThrow('Erro no servidor.');
    });

    it('deve usar emailFromCredential como fallback no signUpWithApple', async () => {
      jest.useRealTimers();

      mockDecodeJwtPayload.mockReturnValueOnce({ sub: 'apple-sub' });

      const appleApiResponse = {
        ...mockApiResponse,
        headers: { 'content-type': 'application/json' },
      };
      (mockApi.post as jest.Mock).mockResolvedValueOnce(appleApiResponse);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthReady).toBe(true);
      });

      await act(async () => {
        await result.current.signUpWithApple('apple-token', undefined, 'fallback@apple.com');
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'authentication/external',
        expect.objectContaining({
          email: 'fallback@apple.com',
        })
      );

      jest.useFakeTimers();
    });
  });

  // =============================================
  // SIGN UP - ADDITIONAL BRANCHES
  // =============================================

  describe('signUp - branches adicionais', () => {
    it('deve tratar success false com string message (nao array)', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { success: false, message: 'Erro simples' },
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro no cadastro: Erro simples');
    });

    it('deve tratar erro com status desconhecido e message string no signup', async () => {
      const error: any = new Error('Error');
      error.response = {
        status: 422,
        statusText: 'Unprocessable',
        data: { message: 'Validation failed' },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Validation failed');
    });

    it('deve tratar erro com status desconhecido e message array no signup', async () => {
      const error: any = new Error('Error');
      error.response = {
        status: 422,
        statusText: 'Unprocessable',
        data: { message: ['Erro 1', 'Erro 2'] },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Erro 1, Erro 2');
    });

    it('deve tratar erro 400 com message string (nao array)', async () => {
      const error: any = new Error('Bad Request');
      error.response = {
        status: 400,
        data: { message: 'Campo invalido simples' },
      };

      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await expect(
        act(async () => {
          await result.current.signUp('User', 'user@test.com', 'p', 'p');
        })
      ).rejects.toThrow('Campo invalido simples');
    });
  });

  // =============================================
  // VERIFY CODE / RESET PASSWORD - non-Error
  // =============================================

  describe('verifyCode - branches adicionais', () => {
    it('deve tratar erro nao-Error no verifyCode', async () => {
      (mockApi.post as jest.Mock).mockRejectedValueOnce('string error');

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.verifyCode('999999');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.error).toBe('Erro desconhecido');
    });
  });

  describe('resetPassword - branches adicionais', () => {
    it('deve tratar erro nao-Error no resetPassword', async () => {
      (mockApi.post as jest.Mock).mockRejectedValueOnce('string error');

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.resetPassword('new', 'new');
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.error).toBe('Erro desconhecido');
    });
  });

  // =============================================
  // DELETE ACCOUNT - ADDITIONAL BRANCHES
  // =============================================

  describe('deleteAccount - branches adicionais', () => {
    it('deve continuar deletando conta quando OneSignal falha', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({});
      (OneSignal.logout as jest.Mock).mockImplementation(() => {
        throw new Error('OneSignal error');
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.deleteAccount();
      });

      expect(result.current.user).toBeNull();
    });

    it('deve tratar erro sem response e sem request ao deletar conta', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error = new Error('Unknown delete error');
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await expect(
        act(async () => {
          await result.current.deleteAccount();
        })
      ).rejects.toThrow('Erro ao deletar conta.');
    });
  });

  // =============================================
  // GET USER INFO - ADDITIONAL BRANCHES
  // =============================================

  describe('getUserInfo - branches adicionais', () => {
    it('deve silenciar erro 404 no getUserInfo', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      const error = new Error('404');
      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      // Should not set error for 404
      expect(result.current.error).toBeNull();
    });

    it('deve tratar erro nao-Error no getUserInfo', async () => {
      mockValidateStoredToken.mockResolvedValue(true);
      secureStoreData[USER_STORAGE] = JSON.stringify(mockUserData);

      // Simulate non-Error thrown
      (mockApi.get as jest.Mock).mockRejectedValueOnce({ message: undefined });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.user?.userId).toBe('user-123');
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      expect(result.current.error).toBe('Erro desconhecido');
    });
  });
});
