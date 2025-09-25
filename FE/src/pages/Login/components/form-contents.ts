import { AUTH_FORM_FIELDS } from '@/utils/constants';

import loginSchema, { otpSchema, phoneSchema, setPasswordSchema } from '../schema';

import { zodResolver } from '@hookform/resolvers/zod';

export const SET_FORM_FIELDS = {
  phone: [AUTH_FORM_FIELDS.phoneNumber],
  login: [AUTH_FORM_FIELDS.phoneNumber, AUTH_FORM_FIELDS.password],
  otp: [AUTH_FORM_FIELDS.otp],
  setPassword: [AUTH_FORM_FIELDS.password, AUTH_FORM_FIELDS.confirmPassword],
};

// Get title and subtitle based on current step
export const FORM_CONTENTS = {
  phone: {
    title: 'Xác thực số điện thoại',
    description: 'Thương hiệu cơm tấm hàng đầu dành cho sinh viên',
  },
  login: {
    title: 'Đăng nhập',
    description: 'Chào mừng bạn quay lại',
  },
  otp: {
    title: 'Xác thực OTP',
    description: 'Mã xác thực đã được gửi đến Zalo của bạn, đừng chặn tin nhắn từ người lạ nhé!',
  },
  setPassword: {
    title: 'Đăng ký mật khẩu',
    description: 'Đăng ký mật khẩu để đăng nhập lần sau',
  },
  success: {
    title: 'Đăng nhập thành công',
    description: 'Bạn đã đăng nhập thành công',
  },
};

export const FORM_RESOLVERS = {
  phone: zodResolver(phoneSchema),
  login: zodResolver(loginSchema),
  otp: zodResolver(otpSchema),
  setPassword: zodResolver(setPasswordSchema),
};
