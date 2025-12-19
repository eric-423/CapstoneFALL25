'use server';

import config from '@/utils/configs';
import { cookies } from 'next/headers';

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name)?.value;
  return cookie;
};

export const setCookie = async (name: string, value: string, expires?: Date) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, { expires: expires });
};

export const removeCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

export const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return token;
};

export const setToken = async (token: string, expires?: Date) => {
  await setCookie('token', token, expires);
};

export const removeToken = async () => {
  await removeCookie('token');
};

export const getAccessToken = async () => {
  return await getCookie(config.cookies.token);
};

export const setAccessToken = async (token: string) => {
  await setCookie(config.cookies.token, token, new Date(new Date().setMinutes(new Date().getMinutes() + 20)));
};

export const removeAccessToken = async () => {
  await removeCookie(config.cookies.token);
};

export const getRefreshToken = async () => {
  return await getCookie(config.cookies.token);
};

export const setRefreshToken = async (token: string) => {
  await setCookie(config.cookies.token, token);
};

export const removeRefreshToken = async () => {
  await removeCookie(config.cookies.token);
};

export const setUserRole = async (role: string) => {
  await setCookie('userRole', role);
};

export const getUserRole = async () => {
  return await getCookie('userRole');
};

export const removeUserRole = async () => {
  await removeCookie('userRole');
};

export const setAuthToken = async (token: string) => {
  await setCookie('token', token);
};

export const getAuthToken = async () => {
  return await getCookie('token');
};

export const removeAuthToken = async () => {
  await removeCookie('token');
};

