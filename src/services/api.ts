import axios, { AxiosError, AxiosInstance } from 'axios';
import { AppError } from '@utils/AppErrors';
import { storageAuthToken, storageAuthTokenGet } from '@storage/storageAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: () => void) => () => void;
  testConnection?: () => Promise<boolean>;
};

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (token: AxiosError) => void;
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000, // 30 segundos timeout - aumentado para evitar timeouts prematuros
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // TEMPORÁRIO: Enviar cookies até o backend ser corrigido para aceitar apenas Bearer token
  maxRedirects: 0, // Não seguir redirecionamentos
}) as APIInstanceProps;

// Função para testar conectividade
api.testConnection = async () => {
  try {
    const response = await axios.head(`${process.env.EXPO_PUBLIC_API_URL}authentication`, {
      timeout: 5000
    });
    return true;
  } catch (error: any) {
    // 405 Method Not Allowed é esperado e indica que a API está funcionando
    if (error.response?.status === 405) {
      return true;
    }
    return false;
  }
};

api.interceptors.request.use(
  async (config) => {
    try {
      let userDataParsed;
      const userData = await AsyncStorage.getItem('@app:user');

      if (userData) {
        userDataParsed = JSON.parse(userData);
      }

      const token = userDataParsed?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // TEMPORÁRIO: Garantir que withCredentials está true para enviar cookies
      // TODO: Remover quando backend for corrigido para aceitar apenas Bearer token
      config.withCredentials = true;

      return config;
    } catch (error) {
      console.error('❌ Erro no interceptor de request:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Erro no interceptor de request (rejected):', error);
    return Promise.reject(error);
  }
);

// Response interceptor will be managed by the token manager

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (requestError) => {
      // 404 em algumas rotas é esperado quando o usuário não tem dados ainda
      const expected404Routes = [
        'user-personal-data',
        'medical-exam-scores/get-last-final-result-by-current-user-logged'
      ];

      const isExpected404 =
        requestError.response?.status === 404 &&
        expected404Routes.some(route => requestError.config?.url?.includes(route));

      if (!isExpected404) {
        console.error('❌ API Error:', {
          status: requestError.response?.status,
          url: requestError.config?.url,
          message: requestError.message
        });
      }

      // Handle unauthorized access
      if (requestError.response?.status === 401) {
        try {
          await AsyncStorage.removeItem('@app:user');
        } catch (error) {
          // Silent fail
        }
        await signOut();
        return Promise.reject(new AppError('Sessão expirada. Faça login novamente.'));
      }

      // Handle server errors (5xx)
      if (requestError.response?.status >= 500) {
        return Promise.reject(new AppError('Servidor temporariamente indisponível. Tente novamente.'));
      }

      // Handle other API errors with response
      if (requestError.response?.data?.message) {
        return Promise.reject(new AppError(requestError.response.data.message));
      }

      if (requestError.response?.data?.error?.message) {
        return Promise.reject(new AppError(requestError.response.data.error.message));
      }

      // Handle network/timeout errors
      if (!requestError.response) {
        if (requestError.code === 'ECONNABORTED' || requestError.message.includes('timeout')) {
          return Promise.reject(new AppError('Tempo limite excedido. Verifique sua conexão.'));
        }

        if (requestError.code === 'NETWORK_ERROR' || requestError.message.includes('Network Error')) {
          return Promise.reject(new AppError('Sem conexão com o servidor. Verifique sua internet.'));
        }

        return Promise.reject(new AppError('Erro de conexão. Verifique sua internet.'));
      }

      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
