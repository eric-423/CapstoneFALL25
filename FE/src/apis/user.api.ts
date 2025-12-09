import { getToken } from "@/utils/cookies.client";
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

export const signUp = async (phoneNumber: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customer/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) throw new Error('Failed to sign up');
    return response.json();
};

export const sendOTP = async (phoneNumber: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-code/send?mode=`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    return response.json();
};

export const refetchToken = async (refresh: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/token/refresh?token=${refresh}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    return response.json();
};

// Register với thông tin đầy đủ
export const registerWithOTP = async (data: RegisterData, otp: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, otp }),
    });
    if (!response.ok) throw new Error('Failed to register');
    return response.json();
};

export const sendRegistrationOTP = async (phoneNumber: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-code/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, mode: "REGISTRATION" }),
    });
    if (!response.ok) throw new Error('Failed to send registration OTP');
    return response.json();
};

export const signIn = async (data: {
    phoneNumber: string;
    password: string;
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customer/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to sign in');
    return response.json();
};

export const signInStaff = async (data: {
    phoneNumber: string;
    password: string;
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to sign in staff');
    return response.json();
};

export const changePassword = async (userId: number, newPassword: string) => {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/customer/change-password/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: newPassword,
    });
    if (!response.ok) throw new Error('Failed to change password');
    return response.json();
};

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
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/admin/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });
    if (!fetchResponse.ok) throw new Error('Failed to create user');
    const result = await fetchResponse.json();
    return result?.data ?? result;
};

export const updateUser = async (
    userId: number,
    data: UpdateUserData
): Promise<UserResponse> => {
    const token = localStorage.getItem("access_token");
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/admin/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });
    if (!fetchResponse.ok) throw new Error('Failed to update user');
    const result = await fetchResponse.json();
    return result?.data ?? result;
};

export const getUserDetail = async (userId: number) => {
    const token = localStorage.getItem("access_token");
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/admin/detail/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    if (!fetchResponse.ok) throw new Error('Failed to get user detail');
    const result = await fetchResponse.json();
    return result?.data ?? result;
};

export const unbanUser = async (userId: number) => {
    const token = localStorage.getItem("access_token");
    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/admin/unban/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({}),
    });
    if (!fetchResponse.ok) throw new Error('Failed to unban user');
    const result = await fetchResponse.json();
    return result?.data ?? result;
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

export const registerCustomer = async (data: {
    fullName: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: string;
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/customer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to register customer');
    return response.json();
};

export const sendOtp = async (channel: "email" | "zalo", indentifier: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, indentifier }),
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    return response.json();
};

export const verifyOTP = async (
    channel: "email" | "zalo",
    identifier: string,
    inputOtp: string
) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, identifier, inputOtp }),
    });
    if (!response.ok) throw new Error('Failed to verify OTP');
    return response.json();
};

export const getTimeResendOtp = async (
    channel: "email" | "zalo",
    identifier: string
) => {
    const params = new URLSearchParams({ channel, identifier });
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/otp/ttl?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to get OTP TTL');
    return response.json();
};

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

    const contentType = response.headers.get("content-type") ?? "";
    const rawBody = await response.text();

    const parsed = contentType.includes("application/json")
        ? (() => {
            try {
                return JSON.parse(rawBody);
            } catch {
                return null;
            }
        })()
        : null;

    if (!response.ok) {
        throw {
            response: {
                data: parsed ?? { message: rawBody || "Unknown error" },
                status: response.status,
            },
        };
    }

    return parsed ?? { message: rawBody };
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
