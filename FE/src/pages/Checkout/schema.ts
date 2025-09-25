import { phoneSchema } from '@/utils/schema';

import z from 'zod';

export const checkoutSchema = z.object({
  customerName: z
    .string({ required_error: 'Vui lòng nhập tên' })
    .min(2, 'Tên không hợp lệ')
    .max(50, 'Tên không hợp lệ'),
  customerPhone: phoneSchema,
  customerEmail: z.string().email('Email không hợp lệ').max(100, 'Email không hợp lệ').optional(),
  receiveTime: z.date({
    required_error: 'Vui lòng chọn thời gian nhận hàng',
  }),
  paymentMethod: z.enum(['cash', 'qr'], {
    required_error: 'Vui lòng chọn phương thức thanh toán',
  }),
  note: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
