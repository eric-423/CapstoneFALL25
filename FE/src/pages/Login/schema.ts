import { PHONE_REGEX } from '@/utils/constants';

import { z } from 'zod';

// Make all fields optional in base schemas, validation happens conditionally
export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => PHONE_REGEX.test(val), {
      message: 'Số điện thoại không hợp lệ',
    }),
  password: z.string().optional(),
  otp: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => PHONE_REGEX.test(val), {
      message: 'Số điện thoại không hợp lệ',
    }),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val && val.length >= 6;
      },
      { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
    ),
  otp: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export const otpSchema = z.object({
  phoneNumber: z.string(),
  password: z.string().optional(),
  otp: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val && val.length === 6;
      },
      { message: 'Mã OTP phải có đúng 6 số' },
    ),
  confirmPassword: z.string().optional(),
});

export const setPasswordSchema = z.object({
  phoneNumber: z.string(),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val && val.length >= 6;
      },
      { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
    ),
  confirmPassword: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val && val.length >= 6;
      },
      { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
    ),
  otp: z.string().optional(),
});

// Base form values type
export type AuthFormValues = {
  phoneNumber: string;
  password?: string;
  otp?: string;
  confirmPassword?: string;
};

export default loginSchema;
