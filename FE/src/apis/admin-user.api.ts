// Admin User Management API

export interface User {
    id: number;
    fullName: string;
    address: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
    note: string;
    isBan: boolean;
    createdAt: string;
    role: string;
    memberPoint: number;
    emailVerified: boolean;
    phoneVerified: boolean;
    isBusy: boolean;
    branchId: number | null;
    memberAssociationId: number | null;
    memberAssociationName: string | null;
}

export interface CreateUserRequest {
    fullName: string;
    address: string;
    phoneNumber: string;
    email: string;
    password: string;
    dateOfBirth: string;
    note: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    memberAssociationId?: number;
}

export interface UpdateUserRequest {
    fullName: string;
    address: string;
    phoneNumber: string;
    email: string;
    password?: string;
    dateOfBirth: string;
    note: string;
    isBan: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    isBusy: boolean;
    memberPoint: number;
    memberAssociationId?: number;
}

export interface RoleHistory {
    id: number;
    userId: number;
    userName: string;
    roleId: number | null;
    roleName: string;
    branchId: number | null;
    branchName: string | null;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
}

export interface CreateRoleHistoryRequest {
    userId: number;
    roleId: number;
    branchId?: number;
    startDate: string;
}

/**
 * Lấy danh sách users
 */
export const getUsers = async (): Promise<User[]> => {
    const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
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
    return result.data;
};

/**
 * Lấy chi tiết user
 */
export const getUserById = async (userId: number): Promise<User> => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        credentials: 'include',
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
    return result.data;
};

/**
 * Tạo user mới
 */
export const createUser = async (data: CreateUserRequest): Promise<User> => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
    return result.data || result;
};

/**
 * Cập nhật user
 */
export const updateUser = async (userId: number, data: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
    return result.data || result;
};

/**
 * Ban user
 */
export const banUser = async (userId: number): Promise<void> => {
    const response = await fetch(`/api/users/${userId}/ban`, {
        method: 'PUT',
        credentials: 'include',
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
};

/**
 * Unban user
 */
export const unbanUser = async (userId: number): Promise<void> => {
    const response = await fetch(`/api/users/${userId}/unban`, {
        method: 'PUT',
        credentials: 'include',
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
};

/**
 * Lấy role history của user
 */
export const getUserRoleHistory = async (userId: number): Promise<RoleHistory[]> => {
    const response = await fetch(`/api/role-histories/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
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
    return result.data;
};

/**
 * Tạo role history
 */
export const createRoleHistory = async (data: CreateRoleHistoryRequest): Promise<RoleHistory> => {
    const response = await fetch('/api/role-histories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
    return result.data || result;
};
