import { AxiosInstance, AxiosResponse } from "axios";
import { MOCK_USERS } from "./data/users.mock";
import { MOCK_PRODUCTS } from "./data/products.mock";
import { MOCK_ORDERS } from "./data/orders.mock";
import { MOCK_BRANCHES } from "./data/branches.mock";
import { createMockJWT } from "./utils/jwt.mock";

export const setupMockInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const url = config.url || "";
      const method = config.method?.toUpperCase();

      // Mock Customer Login (by phone number)
      if (url.includes("/customer/sign-in") && method === "POST") {
        const { phoneNumber, password } = config.data;
        const user = MOCK_USERS.find(
          (u) => u.phone === phoneNumber && u.password === password && u.role === "CUSTOMER"
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          const mockAccessToken = createMockJWT(user.id, user.phone, user.role);
          const mockRefreshToken = createMockJWT(user.id, user.phone, user.role);
          localStorage.setItem("mock_user_id", user.id.toString());
          localStorage.setItem("access_token", mockAccessToken);

          const mockResponse = {
            status: 200,
            statusText: "OK",
            data: {
              status: 200,
              desc: "Login successful",
              data: {
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
                user: userWithoutPassword,
              },
            },
            headers: {},
            config,
          };
          
          throw { mockResponse };
        }

        throw {
          response: {
            status: 401,
            data: { status: 401, desc: "Số điện thoại hoặc mật khẩu không đúng" },
          },
          config,
        };
      }

      // Mock Staff Login (by email - for Admin, Manager, etc.)
      if (url.includes("/auth/sign-in") && method === "POST") {
        const { phoneNumber, password } = config.data;
        // For staff, phoneNumber field is actually email
        const user = MOCK_USERS.find(
          (u) => u.email === phoneNumber && u.password === password && u.role !== "CUSTOMER"
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          const mockAccessToken = createMockJWT(user.id, user.phone, user.role);
          const mockRefreshToken = createMockJWT(user.id, user.phone, user.role);
          localStorage.setItem("mock_user_id", user.id.toString());
          localStorage.setItem("access_token", mockAccessToken);

          const mockResponse = {
            status: 200,
            statusText: "OK",
            data: {
              status: 200,
              desc: "Login successful",
              data: {
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
                user: userWithoutPassword,
              },
            },
            headers: {},
            config,
          };
          
          throw { mockResponse };
        }

        throw {
          response: {
            status: 401,
            data: { status: 401, desc: "Email hoặc mật khẩu không đúng" },
          },
          config,
        };
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
            const mockResponse = {
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
            throw { mockResponse };
          }
        }
      }

      // Mock Products
      if (url.includes("/products") && method === "GET") {
        const mockResponse = {
          status: 200,
          statusText: "OK",
          data: { success: true, data: MOCK_PRODUCTS },
          headers: {},
          config,
        };
        throw { mockResponse };
      }

      // Mock Orders
      if (url.includes("/orders") && method === "GET") {
        const mockResponse = {
          status: 200,
          statusText: "OK",
          data: { success: true, data: MOCK_ORDERS },
          headers: {},
          config,
        };
        throw { mockResponse };
      }

      // Mock Branches
      if (url.includes("/branches") && method === "GET") {
        const mockResponse = {
          status: 200,
          statusText: "OK",
          data: { success: true, data: MOCK_BRANCHES },
          headers: {},
          config,
        };
        throw { mockResponse };
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle mock responses
      if (error.mockResponse) {
        return Promise.resolve(error.mockResponse);
      }
      return Promise.reject(error);
    }
  );
};