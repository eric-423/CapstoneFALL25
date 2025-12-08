import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/otp/verify-otp-forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel, identifier, inputOtp }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to verify OTP', desc: await response.text() },
        { status: response.status }
      );
    }

    const responseData = await response.json();


    return NextResponse.json(responseData, { status: response.status });

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

