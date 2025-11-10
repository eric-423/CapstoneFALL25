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

export interface OrderItemRequest {
  productId: number;
  comboId: number;
  quantity: number;
  price: number;
  note: string;
}

export interface DiningOrderRequest {
  customerId: number;
  promotionCode?: string;
  discountValue?: number;
  shippingAddress?: string;
  shippingPhoneNumber?: string;
  orderItemList: OrderItemRequest[];
  mode: 'DINING' | 'SHIPPING' | 'PICKUP';
  diningTableId: number;
  branchId: number;
}

export interface DiningTablePaymentRequest {
  orderId: number;
  paymentMethodId: number; // 1 = cash, 2 = transfer
  promotionCode?: string;
  discountValue?: number;
}

export interface UpdateDiningTableOrderRequest {
  diningTableId: number;
  orderItems: OrderItemRequest[];
}

export interface OrderProductResponse {
  productId: number;
  productName: string;
  quantity: number;
  note: string;
  price: number;
  feedback?: string;
}

export interface Order {
  customerId: number;
  customerName: string;
  customerEmail?: string;
  promotionCode: string;
  note: string;
  address: string;
  phoneNumber: string;
  branchId: number;
  pointUsed: number;
  pointEarned: number;
  paymentMethodId: number;
  longitude: string;
  latitude: string;
  orderItems: OrderProduct[];
  pickUp: boolean;
  pickupTime: string;
}

export const initialOrder: Order = {
  customerId: 0,
  customerName: '',
  customerEmail: '',
  promotionCode: '',
  note: '',
  address: '',
  phoneNumber: '',
  branchId: 1,
  pointUsed: 0,
  pointEarned: 0,
  paymentMethodId: 0,
  longitude: '',
  latitude: '',
  orderItems: [],
  pickUp: true,
  pickupTime: '',
};

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

export const placeOrder = async (order: Order) => {
  const { data } = await http.post('/orders/', order);
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

export const createDiningOrder = async (orderRequest: DiningOrderRequest) => {
  const { data } = await http.post('/orders', orderRequest);
  return data;
};

export const payDiningTableOrder = async (paymentRequest: DiningTablePaymentRequest) => {
  const { data } = await http.post('/orders/dining-table/payment', paymentRequest);
  return data;
};

export const updateDiningTableOrder = async (orderId: number, updateRequest: UpdateDiningTableOrderRequest) => {
  const { data } = await http.put(`/orders/dining-table/update/${orderId}`, updateRequest);
  return data;
};
