import configs from '@/configs';

import axios, { AxiosError, AxiosInstance } from 'axios';

import { HTTP_STATUS } from './constants';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './cookies';
import { setupMockInterceptor } from '@/mocks/interceptor';

class Http {
  private accessToken: string;
  private refreshToken: string;
  instance: AxiosInstance;

  constructor() {
    this.accessToken = getAccessToken();
    this.refreshToken = getRefreshToken();
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      setupMockInterceptor(this.instance);
    }
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config;
        if (method === 'post' && url?.includes('token/refresh')) {
          if (response.data.access_token) {
            this.accessToken = response.data.access_token;
            this.refreshToken = response.data.refresh_token;
            setAccessToken(this.accessToken);
            setRefreshToken(this.refreshToken);
          }
        } else if (method === 'post' && url?.includes('sign-in')) {
          if (response.data.data.access_token) {
            this.accessToken = response.data.data.access_token;
            this.refreshToken = response.data.data.refresh_token;
            setAccessToken(this.accessToken);
            setRefreshToken(this.refreshToken);
          }
        } else if (url === configs.routes.logout) {
          this.accessToken = '';
          this.refreshToken = '';
          removeAccessToken();
          removeRefreshToken();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          removeAccessToken();
          removeRefreshToken();
        }

        return Promise.reject(error);
      },
    );
  }
}

const http = new Http().instance;

export default http;
