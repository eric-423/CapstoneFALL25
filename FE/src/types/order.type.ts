import { OrderStatus } from '@/utils/enum';

import { OrderProduct, OrderProductResponse } from './product.type';

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
