import http from '@/utils/http';

export enum OrderStatus {
  'PROCESSING' = 'Đang chuẩn bị',
  'IN_DELIVERY' = 'Đang giao hàng',
  'COMPLETED' = 'Đã giao',
  'VERIFIED' = 'Đặt Hàng Thành Công',
  'CANCELLED' = 'Đã hủy',
  'PAID' = 'Đã thanh toán',
  'UNPAID' = 'Chờ Thanh Toán',
}

export interface OrderProduct {
  productId: number;
  quantity: number;
  note: string;
}

export interface OrderProductResponse {
  productId: number;
  productName: string;
  quantity: number;
  note: string;
  price: number;
  feedback?: string;
}

export type OrderMode = 'PICKUP' | 'DELIVERY';

export interface CreateOrderItem {
  productId: number;
  comboId?: number | null;
  quantity: number;
  price: number;
  note?: string;
}

export interface CreateOrderPayload {
  customerId?: number;
  promotionCode?: string;
  discountValue?: number;
  shippingAddress?: string;
  shippingPhoneNumber?: string;
  orderItemList: CreateOrderItem[];
  mode: OrderMode | string;
  diningTableId?: number | null;
  branchId: number;
}

export interface OrderResponse {
  id: number;
  date: Date;
  restaurant: string;
  items: OrderProductResponse[];
  totalItems: number;
  subTotal: number;
  orderStatus: OrderStatus;
  paymentStatus: OrderStatus;
  customerName: string;
  customerPhone: string;
  rated?: boolean;
  pickupTime: string;
  payment_code?: string;
}


export const GET_CUSTOMER_ORDER_QUERY_KEY = 'GET_CUSTOMER_ORDER_QUERY_KEY';

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await http.post('/orders', payload);
  return data;
};

export const getCustomerOrders = async (userId: number) => {
  const { data } = await http.get(`/orders/customer/${userId}?size=100`);
  return data;
};

export const cancelOrder = async (orderId: number, customerId: number) => {
  const { data } = await http.put(`/orders/cancel/${orderId}?customerId=${customerId}`);
  return data;
};
