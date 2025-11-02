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

      // ==================== NEW API: Customer Login ====================
      // Check mock accounts first, if not found → let real API handle
      if (url.includes("/api/auth/customer/login") && method === "POST") {
        const { phoneNumber, password } = config.data;
        const mockUser = MOCK_USERS.find(
          (u) => u.phone === phoneNumber && u.password === password && u.role === "CUSTOMER"
        );

        if (mockUser) {
          console.log("🎭 [MOCK] Customer login with mock account:", mockUser.fullName);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = mockUser;
          const mockAccessToken = createMockJWT(mockUser.id, mockUser.phone, mockUser.role);
          const mockRefreshToken = createMockJWT(mockUser.id, mockUser.phone, mockUser.role);
          localStorage.setItem("mock_user_id", mockUser.id.toString());
          localStorage.setItem("access_token", mockAccessToken);

          const mockResponse = {
            status: 200,
            statusText: "OK",
            data: {
              status: 200,
              desc: "Login successful (Mock Account)",
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

        // Not a mock account → continue to real API
        console.log("🌐 [REAL API] Customer login:", phoneNumber);
        return config;
      }

      // ==================== NEW API: Employee Login ====================
      // Check mock accounts first, if not found → let real API handle
      if (url.includes("/api/auth/employee/login") && method === "POST") {
        const { email, password } = config.data;
        const mockUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password && u.role !== "CUSTOMER"
        );

        if (mockUser) {
          console.log("🎭 [MOCK] Employee login with mock account:", mockUser.fullName, "-", mockUser.role);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = mockUser;
          const mockAccessToken = createMockJWT(mockUser.id, mockUser.phone, mockUser.role);
          const mockRefreshToken = createMockJWT(mockUser.id, mockUser.phone, mockUser.role);
          localStorage.setItem("mock_user_id", mockUser.id.toString());
          localStorage.setItem("access_token", mockAccessToken);

          const mockResponse = {
            status: 200,
            statusText: "OK",
            data: {
              status: 200,
              desc: "Login successful (Mock Account)",
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

        // Not a mock account → continue to real API
        console.log("🌐 [REAL API] Employee login:", email);
        return config;
      }

      // ==================== OLD API: Customer Login (Legacy) ====================
      if (url.includes("/customer/sign-in") && method === "POST") {
        const { phoneNumber, password } = config.data;
        const user = MOCK_USERS.find(
          (u) => u.phone === phoneNumber && u.password === password && u.role === "CUSTOMER"
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = user;
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

        // Not found in mock → continue to real API (if implemented)
        return config;
      }

      // ==================== OLD API: Staff Login (Legacy) ====================
      if (url.includes("/auth/sign-in") && method === "POST") {
        const { phoneNumber, password } = config.data;
        // For staff, phoneNumber field is actually email
        const user = MOCK_USERS.find(
          (u) => u.email === phoneNumber && u.password === password && u.role !== "CUSTOMER"
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = user;
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

        // Not found in mock → continue to real API (if implemented)
        return config;
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