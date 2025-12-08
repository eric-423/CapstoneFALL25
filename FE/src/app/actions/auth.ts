'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  try {
    const phoneNumber = formData.get('phoneNumber') as string;
    const password = formData.get('password') as string;

    if (!phoneNumber || !password) {
      return { error: 'Số điện thoại và mật khẩu là bắt buộc' };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        password,
      }),
    });

    if (!response.ok) {
      return { error: 'Số điện thoại hoặc mật khẩu không đúng' };
    }

    const responseData = await response.json();
    const data = responseData?.data || responseData;

    if (data?.access_token) {
      const cookieStore = await cookies();

      cookieStore.set('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      if (data.refresh_token) {
        cookieStore.set('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      if (data.user?.role) {
        cookieStore.set('userRole', data.user.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 24 hours
        });

        // Redirect based on role
        const role = data.user.role;
        if (role === 'ADMIN') {
          redirect('/admin');
        } else if (role === 'MANAGER') {
          redirect('/manager');
        } else if (role === 'STAFF' || role === 'Staff') {
          redirect('/staff/orders');
        } else {
          redirect('/');
        }
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
    const cookieStore = await cookies();

    cookieStore.set('access_token', '', { maxAge: 0 });
    cookieStore.set('refresh_token', '', { maxAge: 0 });
    cookieStore.set('userRole', '', { maxAge: 0 });

    redirect('/login');
  } catch (error) {
    console.error('Logout Action Error:', error);
    redirect('/');
  }
}
