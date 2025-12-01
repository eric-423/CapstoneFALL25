import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  r?: string; // role
  i?: number; // id (userId)
  p?: string; // phoneNumber
  m?: string; // mail/email
  isNewUser?: boolean;
  exp?: number;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }

      const userId = decodedToken.i;
      if (!decodedToken || !userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      return NextResponse.json({
        id: userId,
        phoneNumber: decodedToken.p ?? '',
        fullName: '',
        role: decodedToken.r ?? 'CUSTOMER',
        isNewUser: decodedToken.isNewUser ?? false,
        exp: decodedToken.exp,
      });
    } catch (decodeError) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}


