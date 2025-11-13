import http from '@/utils/http';
import JwtDecode from '@/utils/jwtDecode';

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

export const USER_SIGN_UP_KEY = 'USER_SIGN_UP_KEY';
export const GET_ME_QUERY_KEY = 'GET_ME_QUERY_KEY';

export const signUp = (phoneNumber: string) => http.post('/customer/sign-up', { phoneNumber });
export const sendOTP = (phoneNumber: string) => http.post('/verify-code/send?mode=', { phoneNumber });
export const refetchToken = (refresh: string) => http.post(`/token/refresh?token=${refresh}`);



// Register với thông tin đầy đủ
export const registerWithOTP = async (data: RegisterData, otp: string) => {
  const response = await http.post('/customer/register', {
    ...data,
    otp,
  });
  return response;
};

// Send OTP cho registration
export const sendRegistrationOTP = async (phoneNumber: string) => {
  const response = await http.post('/verify-code/send', { phoneNumber, mode: 'REGISTRATION' });
  return response;
};

export const signIn = async (data: { phoneNumber: string; password: string }) => {
  const response = await http.post('/customer/sign-in', data);
  return response;
};

export const signInStaff = async (data: { phoneNumber: string; password: string }) => {
  const response = await http.post('/auth/sign-in', data);
  return response;
};


export const changePassword = (data: { phoneNumber: string; password: string }) =>
  http.post('/customer/change-password', data);

// New: Customer register and OTP send


export const refetchUserData = (token: string) => {
  const data = refetchToken(token);
  return data.then((response) => {
    if (response.data) {
      const decodedData = JwtDecode(response.data.data.access_token);
      const userData = {
        id: decodedData.id,
        phoneNumber: decodedData.phone,
        role: decodedData.role,
        exp: decodedData.exp,
      };
      return {
        accessToken: response.data.data.access_token,
        refreshToken: response.data.data.refresh_token,
        userData,
      };
    }
    throw new Error('Failed to refetch user data');
  });
};


// ADMIN USER CRUD
export const getAllUsers = async (page = 0, size = 10000, isActive = true, roleId?: number) => {
  const token = localStorage.getItem('access_token');
  let url = `/users/admin/get-all-user?page=${page}&size=${size}&isActive=${isActive}`;
  if (roleId) url += `&roleId=${roleId}`;
  const response = await http.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createUser = async (data: CreateUserData): Promise<UserResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await http.post<UserResponse>('/users/admin/create', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (userId: number, data: UpdateUserData): Promise<UserResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await http.put<UserResponse>(`/users/admin/update/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await http.delete(`/users/admin/delete/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserDetail = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await http.get(`/users/admin/detail/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const unbanUser = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await http.put(
    `/users/admin/unban/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};



// ========================================================




// login 

export const loginCustomerViaApiRoute = async (data: { phoneNumber: string; password: string }) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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



export const registerCustomer = (data: { fullName: string; phoneNumber: string; password: string; dateOfBirth: string }) =>
  http.post('/auth/customer/register', data);

export const sendOtp = (channel: 'email' | 'zalo', indentifier: string) =>
  http.post('/auth/otp/send', { channel, indentifier });

export const verifyOTP = (channel: 'email' | 'zalo', identifier: string, inputOtp: string) =>
  http.post(`/auth/otp/verify`, { channel, identifier, inputOtp });

export const getTimeResendOtp = (channel: 'email' | 'zalo', identifier: string) =>
  http.get(`/auth/otp/ttl?channel=${channel}&identifier=${identifier}`);



// lấy thông tin 
// get info

// customers/42/informations
export const getCustomerInformation = async (userId: number) => {
  const response = await fetch(`/api/customer/infomation?userId=${userId}`, {
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

  return response.json();
};



// =====================================  employee ================================



export const loginEmployee = (data: { email: string; password: string }) =>
  http.post('/auth/employee/login', data);



export const loginEmployeeViaApiRoute = async (data: { email: string; password: string }) => {
  const response = await fetch('/api/auth/employee/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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