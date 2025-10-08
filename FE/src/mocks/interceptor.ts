import { AxiosInstance, AxiosResponse } from "axios";
import { MOCK_USERS } from "./data/users.mock";
import { MOCK_PRODUCTS } from "./data/products.mock";
import { MOCK_ORDERS } from "./data/orders.mock";
import { MOCK_BRANCHES } from "./data/branches.mock";
import { createMockJWT } from "./utils/jwt.mock";

export const setupMockInterceptor = (axiosInstance: AxiosInstance) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: AxiosResponse<any> | null = null;

  axiosInstance.interceptors.request.use(
    async (config) => {
      const url = config.url || "";
      const method = config.method?.toUpperCase();
      mockResponse = null;

      // Mock Login
      if (url.includes("/customer/sign-in") && method === "POST") {
        const { phoneNumber, password } = config.data;
        const user = MOCK_USERS.find(
          (u) => u.phone === phoneNumber && u.password === password
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          const mockAccessToken = createMockJWT(user.id, user.phone, user.role);
          const mockRefreshToken = createMockJWT(user.id, user.phone, user.role);
          localStorage.setItem("mock_user_id", user.id.toString());
          localStorage.setItem("access_token", mockAccessToken);

          mockResponse = {
            status: 200,
            statusText: "OK",
            data: {
              status: 200,
              desc: "Login successful",
              data: {
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
              },
            },
            headers: {},
            config,
          };
          return config;
        }

        return Promise.reject({
          response: {
            status: 401,
            data: { status: 401, desc: "Số điện thoại hoặc mật khẩu không đúng" },
          },
          config,
        });
      }

      // Mock Get Current User Profile
      if (url.includes("/customer/profile/") && method === "GET") {
        const token = config.headers?.Authorization;
        const tokenStr = typeof token === 'string' ? token : '';
        if (tokenStr.includes("mock_access_token") || tokenStr.includes("eyJ")) {
          const userId = parseInt(localStorage.getItem("mock_user_id") || "3");
          const user = MOCK_USERS.find((u) => u.id === userId);
          if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user;
            mockResponse = {
              status: 200,
              statusText: "OK",
              data: {
                status: 200,
                desc: null,
                data: userWithoutPassword
              },
              headers: {},
              config,
            };
            return config;
          }
        }
      }

      // Mock Products
      if (url.includes("/products") && method === "GET") {
        mockResponse = {
          status: 200,
          statusText: "OK",
          data: { success: true, data: MOCK_PRODUCTS },
          headers: {},
          config,
        };
        return config;
      }

      // Mock Orders
      if (url.includes("/orders") && method === "GET") {
        mockResponse = {
          status: 200,
          statusText: "OK",
          data: { success: true, data: MOCK_ORDERS },
          headers: {},
          config,
        };
        return config;
      }

      // Mock Branches
      if (url.includes("/branches") && method === "GET") {
        mockResponse = {
          status: 200,
          statusText: "OK",
          data: { success: true, data: MOCK_BRANCHES },
          headers: {},
          config,
        };
        return config;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (mockResponse) {
        return mockResponse;
      }
      return response;
    },
    (error) => {
      if (error.response && error.config) {
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );
};
