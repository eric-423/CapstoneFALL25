import { jwtDecode } from 'jwt-decode';

function JwtDecode(token: string): Record<string, any> {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return {};
  }
}

export default JwtDecode;
