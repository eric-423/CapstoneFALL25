import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  id: number;
  phoneNumber: string;
  fullName?: string;
  name?: string;
  email: string;
  role: string;
  branchId: number;
  exp: number;
  iat: number;
  [key: string]: unknown;
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
