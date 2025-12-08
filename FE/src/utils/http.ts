import axios, { AxiosInstance } from "axios";

import { getToken } from "./cookies.client";

class Http {
  private token: string | null = null;
  instance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (!this.token) {
          try {
            const token = getToken();
            this.token = token || null;
          } catch (error) {
            console.error("Error getting token:", error);
          }
        }

        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;

export default http;
