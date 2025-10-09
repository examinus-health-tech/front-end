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

console.log('🔧 Configurando API com URL:', process.env.EXPO_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000, // 30 segundos timeout - aumentado para evitar timeouts prematuros
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) as APIInstanceProps;

// Função para testar conectividade
api.testConnection = async () => {
  try {
    console.log('🧪 Testando conectividade com:', process.env.EXPO_PUBLIC_API_URL);
    // Testa endpoint authentication com HEAD para verificar se API responde
    const response = await axios.head(`${process.env.EXPO_PUBLIC_API_URL}authentication`, { 
      timeout: 5000
    });
    console.log('✅ API está acessível:', response.status);
    return true;
  } catch (error: any) {
    // 405 Method Not Allowed é esperado e indica que a API está funcionando
    if (error.response?.status === 405) {
      console.log('✅ API está acessível (405 esperado para HEAD)');
      return true;
    }
    console.log('❌ Erro de conectividade:', {
      message: error.message,
      code: error.code,
      status: error.response?.status
    });
    return false;
  }
};

api.interceptors.request.use(
  async (config) => {
    try {
      console.log('🌐 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        hasData: !!config.data
      });

      let userDataParsed;
      const userData = await AsyncStorage.getItem('@app:user');

      if (userData) {
        userDataParsed = JSON.parse(userData);
      }

      const token = userDataParsed?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token adicionado ao header');
      }

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
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        hasData: !!response.data
      });
      return response;
    },
    async (requestError) => {
      console.error('❌ API Error Response:', {
        status: requestError.response?.status,
        url: requestError.config?.url,
        hasResponse: !!requestError.response,
        hasRequest: !!requestError.request,
        message: requestError.message,
        code: requestError.code,
        responseData: requestError.response?.data
      });

      // Handle unauthorized access
      if (requestError.response?.status === 401) {
        console.log('🔒 Token expirado - fazendo logout');
        // Clear any stored user data
        try {
          await AsyncStorage.removeItem('@app:user');
        } catch (error) {
          // Silent fail
        }
        
        // Sign out user
        await signOut();
        
        return Promise.reject(new AppError('Sessão expirada. Faça login novamente.'));
      }
      
      // Handle server errors (5xx)
      if (requestError.response?.status >= 500) {
        console.log('🚨 Erro do servidor:', requestError.response.status);
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
          console.log('⏱️ Timeout na requisição');
          return Promise.reject(new AppError('Tempo limite excedido. Verifique sua conexão.'));
        }
        
        if (requestError.code === 'NETWORK_ERROR' || requestError.message.includes('Network Error')) {
          console.log('🌐 Erro de rede');
          return Promise.reject(new AppError('Sem conexão com o servidor. Verifique sua internet.'));
        }
        
        console.log('🔌 Erro de conexão genérico');
        return Promise.reject(new AppError('Erro de conexão. Verifique sua internet.'));
      }
      
      // Default error
      console.log('❓ Erro desconhecido:', requestError);
      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
