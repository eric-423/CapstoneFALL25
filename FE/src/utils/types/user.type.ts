import { SuccessResponse } from "./response.type";

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
  fullName?: string;
  // Tên hiển thị (có thể trùng fullName, dùng cho UI)
  name?: string;
  role: string;
  // Có thể vắng mặt ở một số luồng auth, nên để optional
  memberAssociation?: memberAssociation;
  // Được sử dụng trong auth hooks nhưng trước đây chưa khai báo trong type
  isNewUser?: boolean;
};

export type memberAssociation = {
  id: number;
  point: number;
  name: string;
  description: string;
};
