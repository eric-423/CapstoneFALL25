import config from '@/utils/configs';

const getCookieValue = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
};

const setCookieValue = (name: string, value: string, expires?: Date) => {
  if (typeof window === 'undefined') return;

  let cookie = `${name}=${value}; path=/`;
  if (expires) {
    cookie += `; expires=${expires.toUTCString()}`;
  }
  document.cookie = cookie;
};

const removeCookieValue = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getCookie = (name: string): string | undefined => {
  return getCookieValue(name);
};

export const setCookie = (name: string, value: string, expires?: Date) => {
  setCookieValue(name, value, expires);
};

export const removeCookie = (name: string) => {
  removeCookieValue(name);
};

export const getToken = (): string | undefined => {
  return getCookieValue('token');
};

export const setToken = (token: string, expires?: Date) => {
  setCookieValue('token', token, expires);
};

export const removeToken = () => {
  removeCookieValue('token');
};

export const getAccessToken = (): string | undefined => {
  return getCookieValue(config.cookies.accessToken);
};

export const setAccessToken = (token: string) => {
  setCookieValue(config.cookies.accessToken, token, new Date(new Date().setMinutes(new Date().getMinutes() + 20)));
};

export const removeAccessToken = () => {
  removeCookieValue(config.cookies.accessToken);
};

export const getRefreshToken = (): string | undefined => {
  return getCookieValue(config.cookies.refreshToken);
};

export const setRefreshToken = (token: string) => {
  setCookieValue(config.cookies.refreshToken, token);
};

export const removeRefreshToken = () => {
  removeCookieValue(config.cookies.refreshToken);
};

export const setUserRole = (role: string) => {
  setCookieValue('userRole', role);
};

export const getUserRole = (): string | undefined => {
  return getCookieValue('userRole');
};

export const removeUserRole = () => {
  removeCookieValue('userRole');
};

export const setAuthToken = (token: string) => {
  setCookieValue('token', token);
};

export const getAuthToken = (): string | undefined => {
  return getCookieValue('token');
};

export const removeAuthToken = () => {
  removeCookieValue('token');
};

