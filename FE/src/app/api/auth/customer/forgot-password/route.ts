import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/customer/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to send OTP', desc: await response.text() },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json(), { status: response.status || 200 });
  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP', desc: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
