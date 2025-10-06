import config from '@/configs';

import { Cookies } from 'react-cookie';

const cookies = new Cookies(null, { path: '/' });

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const setCookie = (name: string, value: string, expires?: Date) => {
  cookies.set(name, value, { expires: expires });
};

export const removeCookie = (name: string) => {
  cookies.remove(name);
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
export const setAuthToken = (token: string) => {
  setCookie('authToken', token);
};

export const getAuthToken = () => {
  return getCookie('authToken');
};

export const removeAuthToken = () => {
  removeCookie('authToken');
};
