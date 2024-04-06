import { AppError } from '@utils/AppErrors';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://j1djpwvzy1.execute-api.us-east-1.amazonaws.com/production',
  headers: {
    Authorization: 'Bearer tC4eivUAg3dEfhbYTTdpyIXWtC5xf78u',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data?.error) {
      return Promise.reject(new AppError(error.response.data.error.message));
    } else {
      return error;
    }
  }
);

export { api };
