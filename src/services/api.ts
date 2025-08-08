import axios, { AxiosError, AxiosInstance } from 'axios';
import { AppError } from '@utils/AppErrors';
import { storageAuthToken, storageAuthTokenGet } from '@storage/storageAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: () => void) => () => void;
};

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (token: AxiosError) => void;
};

console.log('🔧 Configurando API com URL:', process.env.EXPO_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000, // 15 segundos timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) as APIInstanceProps;

// Função para testar conectividade
api.testConnection = async () => {
  try {
    console.log('🧪 Testando conectividade com:', process.env.EXPO_PUBLIC_API_URL);
    const response = await api.get('/health', { timeout: 5000 });
    console.log('✅ API está acessível');
    return true;
  } catch (error) {
    console.log('❌ Erro de conectividade:', error);
    return false;
  }
};

api.interceptors.request.use(
  async (config) => {
    let userDataParsed;
    const userData = await AsyncStorage.getItem('@app:user');

    if (userData) {
      userDataParsed = JSON.parse(userData);
    }

    const token = userDataParsed?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor will be managed by the token manager

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      // Handle unauthorized access
      if (requestError.response?.status === 401) {
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
      
      // Handle other API errors
      if (requestError.response && requestError.response.data?.error) {
        return Promise.reject(new AppError(requestError.response.data.error.message));
      }
      
      // Handle network errors
      if (!requestError.response) {
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
