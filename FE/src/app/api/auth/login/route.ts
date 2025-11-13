import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, password } = body;

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required' },
        { status: 400 }
      );
    }

    const response = await http.post('/auth/customer/login', {
      phoneNumber,
      password,
    });

    const responseData = NextResponse.json(response.data);

    if (response.data?.token) {

      // Use expiresIn if available, otherwise default to 7 days
      const expiresIn = response.data.expiresIn || 7 * 24 * 60 * 60 * 1000;
      const maxAgeInSeconds = Math.floor(expiresIn / 1000);

      responseData.cookies.set('token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: maxAgeInSeconds,
      });


      if (response.data.userInfo?.role) {
        const role = response.data.userInfo.role;

        responseData.cookies.set('role', role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: maxAgeInSeconds,
        });

        responseData.cookies.set('userRole', role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: maxAgeInSeconds,
        });
      }
    }

    return responseData;

  } catch (error: unknown) {
    console.error('Login API Error:', error);

    const errorMessage = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message
      || (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error
      || 'Đăng nhập thất bại. Vui lòng thử lại.';

    const statusCode = (error as { response?: { status?: number } })?.response?.status || 401;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );


  }
}
