import { JwtPayload } from 'jwt-decode';

import { SuccessResponse } from './response.type';

export type AuthResponse = SuccessResponse<{
  access_token: string;
  refresh_token: string;
}>;

export type JWTDecodeData = JwtPayload & {
  id: number;
  role: string;
  phone: string;
};
