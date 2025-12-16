import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse, CustomError, ErrorCodes } from '@/lib/error-handler';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const body = await request.json();
    const { phoneNumber, password } = body;

    if (!phoneNumber || !password) {
      return createErrorResponse(
        new CustomError('Phone number and password are required', 400, ErrorCodes.VALIDATION_ERROR)
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/customer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phoneNumber, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || errorData?.error || 'Đăng nhập thất bại. Vui lòng thử lại.';
      return NextResponse.json(errorMessage, { status: response.status });
    }

    const responseData = await response.json();

    if (responseData?.token) {
      const expiresIn = responseData.expiresIn || 7 * 24 * 60 * 60 * 1000;
      const maxAgeInSeconds = Math.floor(expiresIn / 1000);

      cookieStore.set('token', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: maxAgeInSeconds,
      });

      if (responseData.userInfo?.role) {
        const role = responseData.userInfo.role;

        cookieStore.set('role', role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: maxAgeInSeconds,
        });
      }
    }

    return NextResponse.json({
      success: true,
      role: responseData?.userInfo?.role || 'CUSTOMER',
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        return createErrorResponse(
          new CustomError('Không thể kết nối đến server. Vui lòng kiểm tra lại.', 503, ErrorCodes.NETWORK_ERROR)
        );
      }
    }
    return createErrorResponse(error as Error);
  }
}
