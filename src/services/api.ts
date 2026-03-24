import axios, { AxiosError, AxiosInstance } from 'axios';
import { AppError } from '@utils/AppErrors';
import { storageAuthToken, storageAuthTokenGet } from '@storage/storageAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureError, addBreadcrumb } from '@services/sentryService';

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
    Accept: 'application/json',
  },
  withCredentials: true, // TEMPORÁRIO: Enviar cookies até o backend ser corrigido para aceitar apenas Bearer token
  maxRedirects: 0, // Não seguir redirecionamentos
}) as APIInstanceProps;

// Função para testar conectividade
api.testConnection = async () => {
  try {
    const response = await axios.head(`${process.env.EXPO_PUBLIC_API_URL}authentication`, {
      timeout: 5000,
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

        // Log detalhado para debug
        if (config.url?.includes('/users/') || config.url?.includes('/notifications')) {
          console.log('🔐 [API] Request details:', {
            url: config.url,
            method: config.method,
            hasAuthHeader: !!config.headers.Authorization,
            tokenPrefix: token.substring(0, 30) + '...',
            userId: userDataParsed?.userId,
            withCredentials: config.withCredentials,
          });
        }
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
      // Log de sucesso para debug (apenas rotas importantes)
      if (response.config.url?.includes('/users') || response.config.url?.includes('authentication')) {
        console.log('✅ [API] Request bem-sucedida:', {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
          responseTime: response.headers['x-response-time'] || 'N/A',
        });
      }
      return response;
    },
    async (requestError) => {
      // 404 em algumas rotas é esperado quando o usuário não tem dados ainda
      const expected404Routes = [
        'user-personal-data',
        'medical-exam-scores/get-last-final-result-by-current-user-logged',
      ];

      const isExpected404 =
        requestError.response?.status === 404 &&
        expected404Routes.some((route) => requestError.config?.url?.includes(route));

      if (!isExpected404) {
        // Log estruturado completo para TODOS os erros
        const errorLog = {
          timestamp: new Date().toISOString(),
          error: {
            message: requestError.message,
            code: requestError.code,
            name: requestError.name,
          },
          request: {
            method: requestError.config?.method?.toUpperCase(),
            url: requestError.config?.url,
            fullURL: `${requestError.config?.baseURL}${requestError.config?.url}`,
            headers: requestError.config?.headers,
            data: requestError.config?.data,
            timeout: requestError.config?.timeout,
          },
          response: requestError.response ? {
            status: requestError.response.status,
            statusText: requestError.response.statusText,
            headers: requestError.response.headers,
            data: requestError.response.data,
          } : null,
        };

        // Log compacto no console
        console.error('❌ [API ERROR]', {
          method: errorLog.request.method,
          url: errorLog.request.url,
          status: errorLog.response?.status,
          message: requestError.message,
        });

        // Log completo expandido para debug detalhado
        console.error('📋 [API ERROR - Detalhes completos]', JSON.stringify(errorLog, null, 2));

        // Reportar ao Sentry (erros 5xx e erros sem resposta)
        if (!requestError.response || requestError.response.status >= 500) {
          captureError(requestError, {
            url: requestError.config?.url,
            method: requestError.config?.method,
            status: requestError.response?.status,
            responseData: requestError.response?.data,
          });
        }

        // Breadcrumb para todos os erros de API
        addBreadcrumb('http', `API Error: ${requestError.config?.method?.toUpperCase()} ${requestError.config?.url}`, {
          status: requestError.response?.status,
          message: requestError.message,
        }, 'error');
      }

      // Handle unauthorized access
      // IMPORTANTE: Não fazer logout em 401 nas rotas de autenticação
      // pois isso significa credenciais inválidas, não sessão expirada
      const isAuthRoute = requestError.config?.url?.includes('authentication');

      if (requestError.response?.status === 401 && !isAuthRoute) {
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
        // Tentar extrair mensagem detalhada do backend
        const backendMessage =
          requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          requestError.response?.data?.details;

        // Se tem mensagem específica, usar ela
        if (backendMessage) {
          const errorMsg = Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage;
          console.error('❌ Erro 500 com detalhes do backend:', errorMsg);
          return Promise.reject(new AppError(errorMsg));
        }

        // Caso contrário, usar mensagem genérica
        return Promise.reject(new AppError('Servidor temporariamente indisponível. Tente novamente.'));
      }

      // Handle other API errors with response
      if (requestError.response?.data?.message) {
        const errorMsg = Array.isArray(requestError.response.data.message)
          ? requestError.response.data.message.join(', ')
          : requestError.response.data.message;

        console.log('📋 [API] Mensagem de erro do backend:', errorMsg);
        return Promise.reject(new AppError(errorMsg));
      }

      if (requestError.response?.data?.error?.message) {
        console.log('📋 [API] Mensagem de erro do backend (error.message):', requestError.response.data.error.message);
        return Promise.reject(new AppError(requestError.response.data.error.message));
      }

      // Se não tem mensagem específica, logar o erro completo
      if (requestError.response?.data) {
        console.log('📋 [API] Response data completo:', requestError.response.data);
      }

      // Handle network/timeout errors
      if (!requestError.response) {
        console.error('🌐 [API] Erro de rede/conexão:', {
          code: requestError.code,
          message: requestError.message,
          url: requestError.config?.url,
          method: requestError.config?.method,
          timeout: requestError.config?.timeout,
          hasRequest: !!requestError.request,
        });

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
