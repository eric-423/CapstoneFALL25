import { SuccessResponse } from './response.type';

export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  address: string;
  isActive: boolean;
  dateOfBirth: string | null;
  createdAt: string;
  memberPoint: number;
  memberRank: string;
}

export type UserResponse = SuccessResponse<{
  user: User;
}>;

export type CreateAccountResponse = SuccessResponse<{
  id: string;
}>;

export type VerifyTokenForgotPasswordResponse = SuccessResponse<{
  success: boolean;
}>;

export type UserAuthData = {
  id: number;
  phoneNumber: string;
  role: string;
  isNewUser?: boolean;
};
