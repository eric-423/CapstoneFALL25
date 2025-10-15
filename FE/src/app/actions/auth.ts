'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import http from '@/utils/http';

export async function loginAction(formData: FormData) {
  try {
    const phoneNumber = formData.get('phoneNumber') as string;
    const password = formData.get('password') as string;

    if (!phoneNumber || !password) {
      return { error: 'Số điện thoại và mật khẩu là bắt buộc' };
    }

    const response = await http.post('/auth/sign-in', {
      phoneNumber,
      password,
    });

    if (response.data.data.access_token) {
      const cookieStore = cookies();
      
      cookieStore.set('access_token', response.data.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      cookieStore.set('refresh_token', response.data.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      cookieStore.set('userRole', response.data.data.user.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      // Redirect based on role
      const role = response.data.data.user.role;
      if (role === 'ADMIN') {
        redirect('/admin');
      } else if (role === 'MANAGER') {
        redirect('/manager');
      } else {
        redirect('/');
      }
    }

    return { error: 'Đăng nhập thất bại' };
  } catch (error) {
    console.error('Login Action Error:', error);
    return { error: 'Số điện thoại hoặc mật khẩu không đúng' };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = cookies();
    
    cookieStore.set('access_token', '', { maxAge: 0 });
    cookieStore.set('refresh_token', '', { maxAge: 0 });
    cookieStore.set('userRole', '', { maxAge: 0 });

    redirect('/login');
  } catch (error) {
    console.error('Logout Action Error:', error);
    redirect('/');
  }
}
