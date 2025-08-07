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

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
}) as APIInstanceProps;

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Lógica para tratar erros, como token expirado (código 401)
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('@app:user');
    }

    return Promise.reject(error);
  }
);

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError.response?.status === 401) {
        signOut();
        return Promise.reject(requestError);
      }

      if (requestError.response && requestError.response.data?.error) {
        return Promise.reject(new AppError(requestError.response.data.error.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
