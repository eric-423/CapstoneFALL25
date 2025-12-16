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
      let errorDesc = 'Đăng nhập thất bại. Vui lòng thử lại.';
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorDesc = errorData?.message || errorData?.error || errorData?.desc || errorDesc;
        } else {
          const errorText = await response.text();
          if (errorText) {
            errorDesc = errorText;
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      return NextResponse.json(
        { error: 'Failed to send OTP', desc: errorDesc },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    let responseData;

    try {
      if (contentType.includes('application/json')) {
        const text = await response.text();
        if (text && text.trim()) {
          try {
            responseData = JSON.parse(text);
          } catch {
            responseData = { message: text };
          }
        } else {
          responseData = { message: 'OTP đã được gửi thành công' };
        }
      } else {
        const text = await response.text();
        responseData = text ? { message: text } : { message: 'OTP đã được gửi thành công' };
      }
    } catch (parseError) {
      console.error('Error parsing success response:', parseError);
      responseData = { message: 'OTP đã được gửi thành công' };
    }

    return NextResponse.json(responseData, { status: response.status || 200 });
  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP', desc: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
