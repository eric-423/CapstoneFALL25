import { phoneSchema } from '@/utils/schema';

import z from 'zod';

export const checkoutSchema = z
    .object({
        fulfillmentMethod: z.enum(['pickup', 'delivery'], {
            required_error: 'Vui lòng chọn hình thức nhận hàng',
        }),
        customerName: z
            .string({ required_error: 'Vui lòng nhập tên' })
            .min(2, 'Tên không hợp lệ')
            .max(50, 'Tên không hợp lệ'),
        customerPhone: phoneSchema,
        receiveTime: z.date().optional(),
        deliveryAddress: z
            .string()
            .max(200, 'Địa chỉ không được quá 200 ký tự')
            .optional(),
        paymentMethod: z.enum(['cash', 'qr'], {
            required_error: 'Vui lòng chọn phương thức thanh toán',
        }),
        note: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
    })
    .superRefine((data, ctx) => {
        if (data.fulfillmentMethod === 'pickup') {
            if (!data.receiveTime) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['receiveTime'],
                    message: 'Vui lòng chọn thời gian nhận món tại quán',
                });
            }
        } else {
            if (!data.deliveryAddress || data.deliveryAddress.trim().length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['deliveryAddress'],
                    message: 'Vui lòng nhập địa chỉ giao hàng',
                });
            }
        }
    });
export type CheckoutFormData = z.infer<typeof checkoutSchema>;