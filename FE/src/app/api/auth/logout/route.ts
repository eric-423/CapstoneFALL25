import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    const httpOnlyCookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    };

    const publicCookieConfig = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    };

    response.cookies.set('token', '', httpOnlyCookieConfig);
    response.cookies.set('role', '', publicCookieConfig);
    response.cookies.set('branchId', '', publicCookieConfig);

    return response;
  } catch (error) {
    console.error('[API /auth/logout] Error:', error);
    const response = NextResponse.json({ message: 'Logged out successfully' });

    return response;
  }
}
