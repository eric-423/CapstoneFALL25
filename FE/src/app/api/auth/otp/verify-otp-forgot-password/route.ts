import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, identifier, inputOtp } = body;

    if (!channel || !identifier || !inputOtp) {
      return NextResponse.json(
        { error: 'Channel, identifier and inputOtp are required' },
        { status: 400 }
      );
    }

    const response = await http.post('/auth/otp/verify-otp-forgot-password', {
      channel,
      identifier,
      inputOtp,
    });

    return NextResponse.json(response.data, { status: response.status || 200 });
  } catch (error: unknown) {
    console.error('Verify OTP Forgot Password API Error:', error);

    const errorMessage =
      (error as { response?: { data?: { message?: string; error?: string; desc?: string } } })?.response?.data?.desc ||
      (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
      (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
      'Mã OTP không đúng hoặc đã hết hạn.';

    const statusCode = (error as { response?: { status?: number } })?.response?.status || 400;

    return NextResponse.json(
      { error: errorMessage, desc: errorMessage },
      { status: statusCode }
    );
  }
}

