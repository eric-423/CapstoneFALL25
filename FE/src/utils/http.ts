import configs from '@/utils/configs';
import { apiBaseURL } from '@/utils/configs/environment';

import axios, { AxiosError, AxiosInstance } from 'axios';

import { HTTP_STATUS } from './constants';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setRefreshToken,
  getToken,
  setToken,
  removeToken,
} from './cookies.client';


// --------
class Http {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  instance: AxiosInstance;

  constructor() {
    // Fallback nếu apiBaseURL không có giá trị
    const baseURL = apiBaseURL || 'http://localhost:8080'; // Thay bằng domain backend của bạn

    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('  - axios.defaults.baseURL:', this.instance.defaults.baseURL);

    this.instance.interceptors.request.use(
      (config) => {
        if (!this.accessToken) {
          try {
            const token = getToken();
            const accessToken = getAccessToken();
            this.accessToken = token || accessToken || null;
            this.refreshToken = getRefreshToken() || null;
          } catch (error) {
            console.error('Error getting token:', error);
          }
        }

        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
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
            this.refreshToken = response.data.refresh_token || null;
            if (this.accessToken) {
              setToken(this.accessToken);
            }
            if (this.refreshToken) {
              setRefreshToken(this.refreshToken);
            }
          }
        } else if (method === 'post' && url?.includes('employee/login')) {
          if (response.data?.token) {
            this.accessToken = response.data.token;
            if (this.accessToken) {
              setToken(this.accessToken);
            }
          }
        } else if (method === 'post' && url?.includes('sign-in')) {
          if (response.data.data?.access_token) {
            this.accessToken = response.data.data.access_token;
            this.refreshToken = response.data.data.refresh_token || null;
            if (this.accessToken) {
              setToken(this.accessToken);
            }
            if (this.refreshToken) {
              setRefreshToken(this.refreshToken);
            }
          }
        } else if (url === configs.routes.logout) {
          this.accessToken = null;
          this.refreshToken = null;
          removeToken();
          removeAccessToken();
          removeRefreshToken();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          this.accessToken = null;
          this.refreshToken = null;
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
