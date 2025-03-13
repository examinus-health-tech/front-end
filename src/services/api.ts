import axios, { AxiosError, AxiosInstance } from 'axios';
import { AppError } from '@utils/AppErrors';
import { storageAuthToken, storageAuthTokenGet } from '@storage/storageAuthToken';

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: () => void) => () => void;
};

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (token: AxiosError) => void;
};

const api = axios.create({
  baseURL: 'https://j1djpwvzy1.execute-api.us-east-1.amazonaws.com/production',
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError.response?.status === 403) {
        const { refreshToken, idToken } = await storageAuthTokenGet();

        if (!refreshToken || !idToken) {
          signOut();
          return Promise.reject(requestError);
        }

        const originalRequestConfig = requestError.config;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = { Authorization: `Bearer ${token}` };
                resolve(api(originalRequestConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        }

        isRefreshing = true;

        // temporario ate voltar a funcionar o refresh
        signOut();
        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/user/auth/refresh-token', {
              RefreshToken: refreshToken,
              IdToken: idToken,
            });

            await storageAuthToken({
              token: data.AccessToken,
              refreshToken: data.RefreshToken,
              idToken: data.IdToken,
            });

            if (originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
            }

            originalRequestConfig.headers = { Authorization: `Bearer ${data.AccessToken}` };
            api.defaults.headers.common['Authorization'] = `Bearer ${data.AccessToken}`;

            failedQueue.forEach((request) => {
              request.onSuccess(data.AccessToken);
            });

            console.log('TOKEN ATUALIZADO!');

            resolve(api(originalRequestConfig));
          } catch (error: any) {
            failedQueue.forEach((request) => {
              request.onFailure(error);
            });
            signOut();
            reject(error);
          } finally {
            isRefreshing = false;
            failedQueue = [];
          }
        });
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
