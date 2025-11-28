import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const response = await http.post('/auth/customer/forgot-password', {
      phoneNumber,
    });

    return NextResponse.json(response.data, { status: response.status || 200 });
  } catch (error: unknown) {
    console.error('Forgot Password API Error:', error);

    const errorMessage =
      (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
      (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
      'Không thể gửi mã OTP. Vui lòng thử lại.';

    const statusCode = (error as { response?: { status?: number } })?.response?.status || 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

