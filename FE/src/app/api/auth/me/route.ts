import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id?: number;
  sub?: string;
  phoneNumber?: string;
  phone?: string;
  fullName?: string;
  name?: string;
  username?: string;
  role?: string;
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

      if (!decodedToken || (!decodedToken.id && !decodedToken.sub)) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      const fullName =
        decodedToken.fullName ||
        decodedToken.name ||
        decodedToken.username ||
        '';

      return NextResponse.json({
        id: decodedToken.id || decodedToken.sub,
        phoneNumber: decodedToken.phoneNumber || decodedToken.phone || '',
        fullName,
        role: decodedToken.role || 'CUSTOMER',
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


