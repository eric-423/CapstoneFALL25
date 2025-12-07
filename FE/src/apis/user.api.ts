import http from "@/utils/http";
import JwtDecode from "@/utils/jwtDecode";
import { PromotionsResponse } from "./promotion.api";

export interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  branchId: number;
  roleId: number;
  password: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  branchId?: number;
  roleId?: number;
}

export interface UserSearchRequest {
  keyword?: string;
  role?: string;
  branchId?: number;
  status?: boolean;
  isBan?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface PaginatedUserResponse {
  status: number;
  desc: string;
  data: {
    content: UserResponse[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
  };
}

export interface UserStatisticsResponse {
  status: number;
  desc: string;
  data: {
    activeUsers: number;
    inactiveUsers: number;
    totalUsers: number;
    branchId: number | null;
  };
}

export interface UserResponse {
  status: number;
  desc: string | null;
  data: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    createdAt: string;
    branchId: number;
    role: string;
  };
}

export interface RegisterData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  gender: string;
  address: string;
  province: string;
  district: string;
  ward: string;
}

export const USER_SIGN_UP_KEY = "USER_SIGN_UP_KEY";
export const GET_ME_QUERY_KEY = "GET_ME_QUERY_KEY";

export const signUp = (phoneNumber: string) =>
  http.post("/customer/sign-up", { phoneNumber });
export const sendOTP = (phoneNumber: string) =>
  http.post("/verify-code/send?mode=", { phoneNumber });
export const refetchToken = (refresh: string) =>
  http.post(`/token/refresh?token=${refresh}`);

// Register với thông tin đầy đủ
export const registerWithOTP = async (data: RegisterData, otp: string) => {
  const response = await http.post("/customer/register", {
    ...data,
    otp,
  });
  return response;
};

export const sendRegistrationOTP = async (phoneNumber: string) => {
  const response = await http.post("/verify-code/send", {
    phoneNumber,
    mode: "REGISTRATION",
  });
  return response;
};

export const signIn = async (data: {
  phoneNumber: string;
  password: string;
}) => {
  const response = await http.post("/customer/sign-in", data);
  return response;
};

export const signInStaff = async (data: {
  phoneNumber: string;
  password: string;
}) => {
  const response = await http.post("/auth/sign-in", data);
  return response;
};

export const changePassword = (userId: number, newPassword: string) =>
  http.post(`/auth/customer/change-password/${userId}`, newPassword, {
    headers: {
      "Content-Type": "text/plain",
    },
  });

// New: Customer register and OTP send

export const refetchUserData = (token: string) => {
  const data = refetchToken(token);
  return data.then((response) => {
    if (response.data) {
      const decodedData = JwtDecode(response.data.data.access_token);
      const userData = {
        id: decodedData.i ?? 0,
        phoneNumber: decodedData.p ?? "",
        role: decodedData.r ?? "CUSTOMER",
        exp: decodedData.exp,
      };
      return {
        accessToken: response.data.data.access_token,
        refreshToken: response.data.data.refresh_token,
        userData,
      };
    }
    throw new Error("Failed to refetch user data");
  });
};

// ADMIN USER CRUD
export const getAllUsers = async (searchRequest?: UserSearchRequest) => {
  const params = new URLSearchParams();

  if (searchRequest) {
    if (searchRequest.keyword) params.append("keyword", searchRequest.keyword);
    if (searchRequest.role) params.append("role", searchRequest.role);
    if (searchRequest.branchId !== undefined)
      params.append("branchId", searchRequest.branchId.toString());
    if (searchRequest.status !== undefined)
      params.append("status", searchRequest.status.toString());
    if (searchRequest.isBan !== undefined)
      params.append("isBan", searchRequest.isBan.toString());
    if (searchRequest.page !== undefined)
      params.append("page", searchRequest.page.toString());
    if (searchRequest.size !== undefined)
      params.append("size", searchRequest.size.toString());
    if (searchRequest.sortBy) params.append("sortBy", searchRequest.sortBy);
    if (searchRequest.sortDirection)
      params.append("sortDirection", searchRequest.sortDirection);
  }

  const response = await fetch(`/api/users?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const getUserStatistics = async (
  branchId?: number
): Promise<UserStatisticsResponse> => {
  const params = new URLSearchParams();

  if (branchId !== undefined) {
    params.append("branchId", branchId.toString());
  }

  const response = await fetch(`/api/users/statistics?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user statistics");
  }

  return response.json();
};

export const createUser = async (
  data: CreateUserData
): Promise<UserResponse> => {
  const token = localStorage.getItem("access_token");
  const response = await http.post<UserResponse>("/users/admin/create", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (
  userId: number,
  data: UpdateUserData
): Promise<UserResponse> => {
  const token = localStorage.getItem("access_token");
  const response = await http.put<UserResponse>(
    `/users/admin/update/${userId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getUserDetail = async (userId: number) => {
  const token = localStorage.getItem("access_token");
  const response = await http.get(`/users/admin/detail/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const unbanUser = async (userId: number) => {
  const token = localStorage.getItem("access_token");
  const response = await http.put(
    `/users/admin/unban/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// ========================================================

// login

export const loginCustomerViaApiRoute = async (data: {
  phoneNumber: string;
  password: string;
}) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  const responseData = await response.json();

  return {
    status: response.status,
    data: responseData,
  };
};

// login customer
// export const loginCustomer = (data: { phoneNumber: string; password: string }) =>
//   http.post('/auth/customer/login', data);

// Gọi qua Next.js API route (mới - tự động set cookies httpOnly)

export const registerCustomer = (data: {
  fullName: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
}) => http.post("/auth/customer/register", data);

export const sendOtp = (channel: "email" | "zalo", indentifier: string) =>
  http.post("/auth/otp/send", { channel, indentifier });

export const verifyOTP = (
  channel: "email" | "zalo",
  identifier: string,
  inputOtp: string
) => http.post(`/auth/otp/verify`, { channel, identifier, inputOtp });

export const getTimeResendOtp = (
  channel: "email" | "zalo",
  identifier: string
) => http.get(`/auth/otp/ttl?channel=${channel}&identifier=${identifier}`);

export const forgotPassword = async (phoneNumber: string) => {
  const response = await fetch("/api/auth/customer/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ phoneNumber }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  return response.json();
};

export const verifyOtpForgotPassword = async (data: {
  channel: "email" | "zalo";
  identifier: string;
  inputOtp: string;
}) => {
  const response = await fetch("/api/auth/otp/verify-otp-forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  return {
    status: response.status,
    data: await response.json(),
  };
};

export const resetPassword = async (data: {
  otp: string;
  phoneNumber: string;
  newPassword: string;
}) => {
  const response = await fetch("/api/auth/customer/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  return {
    status: response.status,
    data: await response.json(),
  };
};

// lấy thông tin
// get info

// customers/42/informations
export const getCustomerInformation = async (userId: number) => {
  const response = await fetch(`/api/customer/infomation?userId=${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export interface SaveCustomerInformationPayload {
  userId: number;
  name: string;
  address: string;
  phoneNumber: string;
  isDefault?: boolean;
}

export const saveCustomerInformation = async (
  payload: SaveCustomerInformationPayload
) => {
  const response = await fetch(`/api/customer/infomation`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export const deleteCustomerInformation = async (
  userId: number,
  informationId: number
) => {
  const response = await fetch(
    `/api/customer/infomation/${informationId}?userId=${userId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export interface UpdateCustomerInformationPayload {
  userId: number;
  informationId: number;
  name: string;
  address: string;
  phoneNumber: string;
  isDefault?: boolean;
}

export const updateCustomerInformation = async (
  payload: UpdateCustomerInformationPayload
) => {
  const response = await fetch(
    `/api/customer/infomation/${payload.informationId}?userId=${payload.userId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        address: payload.address,
        phoneNumber: payload.phoneNumber,
        isDefault: payload.isDefault,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

// =====================================  employee ================================

export const loginEmployeeViaApiRoute = async (data: {
  email: string;
  password: string;
}) => {
  const response = await fetch("/api/auth/employee/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  const responseData = await response.json();

  return {
    status: response.status,
    data: responseData,
  };
};

// =====================================  promotion ================================

export async function getMyPromotion(): Promise<PromotionsResponse> {
  const response = await fetch("/api/customer/promotion", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();
  return result as PromotionsResponse;
}

export interface CustomerDetails {
  id: number;
  name: string;
  phoneNumber: string;
  point: number;
  memberAssociation: {
    id: number;
    point: number;
    name: string;
    description: string;
  };
  // Optional fields (for backward compatibility)
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | null;
  createdAt?: string;
  memberPoint?: number;
  memberRank?: string;
  isActive?: boolean;
}

export interface CustomerDetailsResponse {
  status: number;
  desc: string;
  data: CustomerDetails;
}

export async function getCustomerDetails(): Promise<CustomerDetailsResponse> {
  const response = await fetch("/api/customer/details", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();

  // Nếu result đã có structure { status, desc, data } thì trả về trực tiếp
  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    "status" in result
  ) {
    return result as CustomerDetailsResponse;
  }

  // Nếu result là data trực tiếp (không có wrapper), wrap lại
  return {
    status: 200,
    desc: "Success",
    data: result as CustomerDetails,
  };
}
