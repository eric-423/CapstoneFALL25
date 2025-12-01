import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otp, phoneNumber, newPassword } = body;

    if (!otp || !phoneNumber || !newPassword) {
      return NextResponse.json(
        { error: 'OTP, phone number and new password are required' },
        { status: 400 }
      );
    }

    const response = await http.post('/auth/customer/reset-password', {
      otp,
      phoneNumber,
      newPassword,
    });

    return NextResponse.json(response.data, { status: response.status || 200 });
  } catch (error: unknown) {
    console.error('Reset Password API Error:', error);

    const errorMessage =
      (error as { response?: { data?: { message?: string; error?: string; desc?: string } } })?.response?.data?.desc ||
      (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
      (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
      'Không thể đặt lại mật khẩu. Vui lòng thử lại.';

    const statusCode = (error as { response?: { status?: number } })?.response?.status || 400;

    return NextResponse.json(
      { error: errorMessage, desc: errorMessage },
      { status: statusCode }
    );
  }
}

