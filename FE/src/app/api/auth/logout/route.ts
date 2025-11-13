import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear authentication cookies
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    const cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
    };

    response.cookies.set('token', '', cookieConfig);
    response.cookies.set('access_token', '', cookieConfig);
    response.cookies.set('refresh_token', '', cookieConfig);

    response.cookies.set('userRole', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    response.cookies.set('role', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
