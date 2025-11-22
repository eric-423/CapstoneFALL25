'use server';

import http from '@/utils/http';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createOrderAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return { error: 'Bạn cần đăng nhập để đặt hàng' };
    }

    // Parse form data
    const products = JSON.parse(formData.get('products') as string);
    const deliveryAddress = formData.get('deliveryAddress') as string;
    const note = formData.get('note') as string;
    const paymentMethod = formData.get('paymentMethod') as string;

    if (!products || products.length === 0) {
      return { error: 'Giỏ hàng trống' };
    }

    if (!deliveryAddress) {
      return { error: 'Vui lòng nhập địa chỉ giao hàng' };
    }

    const orderData = {
      products,
      deliveryAddress,
      note,
      paymentMethod,
    };

    const response = await http.post('/orders', orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Redirect to payment or order confirmation
    if (response.data.data.orderId) {
      redirect(`/payment-success?orderId=${response.data.data.orderId}`);
    }

    return { error: 'Đặt hàng thất bại' };
  } catch (error) {
    console.error('Create Order Action Error:', error);
    return { error: 'Có lỗi xảy ra khi đặt hàng' };
  }
}

export async function cancelOrderAction(orderId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return { error: 'Bạn cần đăng nhập để hủy đơn hàng' };
    }

    const response = await http.patch(`/orders/${orderId}/cancel`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { success: true, message: 'Hủy đơn hàng thành công' };
  } catch (error) {
    console.error('Cancel Order Action Error:', error);
    return { error: 'Không thể hủy đơn hàng' };
  }
}
