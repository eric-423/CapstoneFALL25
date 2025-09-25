import { z } from 'zod';

import { PHONE_REGEX, USER_MESSAGES } from './constants';

// GLOBAL SCHEMA
export const emailSchema = z
  .string({
    message: USER_MESSAGES.EMAIL_MESSAGE,
  })
  .email({
    message: USER_MESSAGES.EMAIL_MESSAGE,
  })
  .optional();

export const setPasswordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type setPasswordFormData = z.infer<typeof setPasswordSchema>;

// export const fullnameSchema = z
//   .string({
//     message: USER_MESSAGES.FULLNAME_MESSAGE,
//   })
//   .min(1, {
//     message: USER_MESSAGES.FULLNAME_MESSAGE,
//   });

export const phoneSchema = z
  .string({
    message: USER_MESSAGES.PHONE_MESSAGE,
  })
  .trim()
  .refine((value) => PHONE_REGEX.test(value), {
    message: USER_MESSAGES.PHONE_MESSAGE,
  });
