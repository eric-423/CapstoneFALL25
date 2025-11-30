import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  r?: string; // role
  i?: number; // id (userId)
  p?: string; // phoneNumber
  m?: string; // mail/email
  exp: number;
  iat: number;
  [key: string]: unknown;
}

// Helper function để extract data từ token
export function extractTokenData(payload: JWTPayload) {
  return {
    id: payload.i ?? 0,
    phoneNumber: payload.p ?? '',
    role: payload.r ?? 'CUSTOMER',
    email: payload.m ?? '',
    exp: payload.exp,
    iat: payload.iat,
  };
}

function JwtDecode(token: string): JWTPayload {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return {} as JWTPayload;
  }
}

export default JwtDecode;
