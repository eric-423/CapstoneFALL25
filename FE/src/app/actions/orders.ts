"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createOrderAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { error: "Bạn cần đăng nhập để đặt hàng" };
    }

    const products = JSON.parse(formData.get("products") as string);
    const deliveryAddress = formData.get("deliveryAddress") as string;
    const note = formData.get("note") as string;
    const paymentMethod = formData.get("paymentMethod") as string;

    if (!products || products.length === 0) {
      return { error: "Giỏ hàng trống" };
    }

    if (!deliveryAddress) {
      return { error: "Vui lòng nhập địa chỉ giao hàng" };
    }

    const orderData = {
      products,
      deliveryAddress,
      note,
      paymentMethod,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      return { error: "Đặt hàng thất bại" };
    }

    const responseData = await response.json();
    const data = responseData?.data || responseData;

    // Redirect to payment or order confirmation
    if (data?.orderId) {
      redirect(`/payment-success?orderId=${data.orderId}`);
    }

    return { error: "Đặt hàng thất bại" };
  } catch (error) {
    console.error("Create Order Action Error:", error);
    return { error: "Có lỗi xảy ra khi đặt hàng" };
  }
}
