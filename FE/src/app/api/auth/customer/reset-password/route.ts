import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/customer/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ otp, phoneNumber, newPassword }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to reset password', desc: await response.text() },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json(), { status: response.status || 200 });
  } catch (error) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password', desc: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
