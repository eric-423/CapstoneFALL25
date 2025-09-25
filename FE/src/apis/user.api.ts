import http from '@/utils/http';
import JwtDecode from '@/utils/jwtDecode';
import axios from 'axios';

export const USER_SIGN_UP_KEY = 'USER_SIGN_UP_KEY';
export const GET_ME_QUERY_KEY = 'GET_ME_QUERY_KEY';

export const signUp = (phoneNumber: string) => http.post('/customer/sign-up', { phoneNumber });

export const sendOTP = (phoneNumber: string) => http.post('/verify-code/send?mode=', { phoneNumber });

export const verifyOTP = (phoneNumber: string, otp: string) =>
  http.post(`https://tam-tac.com/api/verify-code/verify?phoneNumber=${phoneNumber}&code=${otp}`);

export const signIn = async (data: { phoneNumber: string; password: string }) => {
  const response = await http.post('/customer/sign-in', data);
  return response.data;
};

export const changePassword = (data: { phoneNumber: string; password: string }) =>
  http.post('/customer/change-password', data);

export const refetchToken = (refresh: string) => http.post(`https://tam-tac.com/api/token/refresh?token=${refresh}`);

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

export const getMe = (userId: number) => http.get(`/customer/profile/${userId}`);

// ADMIN USER CRUD
export const getAllUsers = async (page = 0, size = 10000, isActive = true, roleId?: number) => {
  const token = localStorage.getItem('access_token');
  let url = `https://tam-tac.com/api/users/admin/get-all-user?page=${page}&size=${size}&isActive=${isActive}`;
  if (roleId) url += `&roleId=${roleId}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createUser = async (data: any) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.post('https://tam-tac.com/api/users/admin/create', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (userId: number, data: any) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.put(`https://tam-tac.com/api/users/admin/update/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.delete(`https://tam-tac.com/api/users/admin/delete/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserDetail = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`https://tam-tac.com/api/users/admin/detail/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const unbanUser = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.put(
    `/users/admin/unban/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};
