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

      const maxAgeInSeconds = Math.floor(response.data.expiresIn / 1000);

      responseData.cookies.set('token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: maxAgeInSeconds,
      });


      if (response.data.userInfo?.role) {
        responseData.cookies.set('role', response.data.userInfo.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
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
