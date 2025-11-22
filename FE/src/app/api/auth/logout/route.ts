import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear authentication cookies
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Config cho httpOnly cookies
    const httpOnlyCookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    };

    // Config cho non-httpOnly cookies
    const publicCookieConfig = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    };

    // Clear tất cả các cookies liên quan đến authentication
    // Xóa ở root path để đảm bảo cookies được xóa ở tất cả các path
    response.cookies.set('token', '', httpOnlyCookieConfig);
    response.cookies.set('access_token', '', httpOnlyCookieConfig);
    response.cookies.set('refresh_token', '', httpOnlyCookieConfig);
    response.cookies.set('userRole', '', publicCookieConfig);
    response.cookies.set('role', '', publicCookieConfig);

    return response;
  } catch (error) {
    console.error('[API /auth/logout] Error:', error);
    // Vẫn trả về response thành công để client có thể tiếp tục clear ở phía client
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Cố gắng clear cookies dù có lỗi
    try {
      response.cookies.set('token', '', { maxAge: 0, path: '/' });
      response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('userRole', '', { maxAge: 0, path: '/' });
      response.cookies.set('role', '', { maxAge: 0, path: '/' });
    } catch (cookieError) {
      console.error('[API /auth/logout] Failed to clear cookies:', cookieError);
    }
    
    return response;
  }
}
