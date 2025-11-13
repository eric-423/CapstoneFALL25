import config from '@/utils/configs';

import { Cookies } from 'react-cookie';

const cookies = new Cookies(null, { path: '/' });

export const getCookie = (name: string) => {
  const cookie = cookies.get(name);
  console.log('cookie', cookie);
  return cookie;
};

export const setCookie = (name: string, value: string, expires?: Date) => {
  cookies.set(name, value, { expires: expires });
};

export const removeCookie = (name: string) => {
  cookies.remove(name);
};

export const getToken = () => {
  const token = getCookie('token');
  return token;
};

export const setToken = (token: string, expires?: Date) => {
  setCookie('token', token, expires);
};

export const removeToken = () => {
  removeCookie('token');
};

// Access token
export const getAccessToken = () => {
  return getCookie(config.cookies.accessToken);
};

export const setAccessToken = (token: string) => {
  setCookie(config.cookies.accessToken, token, new Date(new Date().setMinutes(new Date().getMinutes() + 20)));
};

export const removeAccessToken = () => {
  removeCookie(config.cookies.accessToken);
};

// Refresh token
export const getRefreshToken = () => {
  return getCookie(config.cookies.refreshToken);
};

export const setRefreshToken = (token: string) => {
  setCookie(config.cookies.refreshToken, token);
};

export const removeRefreshToken = () => {
  removeCookie(config.cookies.refreshToken);
};

// User role for middleware
export const setUserRole = (role: string) => {
  setCookie('userRole', role);
};

export const getUserRole = () => {
  return getCookie('userRole');
};

export const removeUserRole = () => {
  removeCookie('userRole');
};

// Auth token for middleware (separate from access token)
// DEPRECATED: Use getToken/setToken instead
export const setAuthToken = (token: string) => {
  setCookie('token', token);
};

export const getAuthToken = () => {
  return getCookie('token');
};

export const removeAuthToken = () => {
  removeCookie('token');
};
