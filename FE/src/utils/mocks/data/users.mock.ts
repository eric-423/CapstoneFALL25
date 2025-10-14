export const MOCK_USERS = [
  {
    id: 1,
    email: "admin@tamtac.com",
    password: "admin123",
    fullName: "Admin User",
    phone: "0901234567",
    phoneNumber: "0901234567",
    role: "ADMIN",
    avatar: null,
  },
  {
    id: 2,
    email: "manager@tamtac.com",
    password: "manager123",
    fullName: "Manager User",
    phone: "0902234567",
    phoneNumber: "0902234567",
    role: "MANAGER",
    branchId: 1,
    avatar: null,
  },
  {
    id: 3,
    email: "customer@tamtac.com",
    password: "customer123",
    fullName: "Customer User",
    phone: "0903234567",
    phoneNumber: "0903234567",
    role: "CUSTOMER",
    avatar: null,
  },
];

export const MOCK_TOKENS = {
  accessToken: "mock_access_token_12345",
  refreshToken: "mock_refresh_token_67890",
};
