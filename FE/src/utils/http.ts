import configs from '@/utils/configs';
import { apiBaseURL } from '@/utils/configs/environment';

import axios, { AxiosError, AxiosInstance } from 'axios';

import { HTTP_STATUS } from './constants';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
  getToken,
  setToken,
  removeToken,
} from './cookies';


// --------
class Http {
  private accessToken: string;
  private refreshToken: string;
  instance: AxiosInstance;

  constructor() {
    this.accessToken = getToken() || getAccessToken();
    this.refreshToken = getRefreshToken();

    this.instance = axios.create({
      baseURL: apiBaseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
            setToken(this.accessToken);
            setRefreshToken(this.refreshToken);
          }
        } else if (method === 'post' && url?.includes('employee/login')) {
          // Employee login response: { token, tokenType, expiresIn, userInfo }
          if (response.data?.token) {
            this.accessToken = response.data.token;
            setToken(this.accessToken);
            // Employee login không có refresh_token
          }
        } else if (method === 'post' && url?.includes('sign-in')) {
          if (response.data.data?.access_token) {
            this.accessToken = response.data.data.access_token;
            this.refreshToken = response.data.data.refresh_token;
            setToken(this.accessToken);
            setRefreshToken(this.refreshToken);
          }
        } else if (url === configs.routes.logout) {
          this.accessToken = '';
          this.refreshToken = '';
          removeToken();
          removeAccessToken();
          removeRefreshToken();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          removeToken();
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
