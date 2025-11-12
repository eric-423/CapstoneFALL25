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


//taoj order
export const createOrderApiRoute = async (payload: CreateOrderPayload) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};



// export const getCustomerInformation = async (userId: number) => {
//   const response = await fetch(`/api/customer/infomation?userId=${userId}`, {
//     method: 'GET',
//     credentials: 'include',
//   });

//   if (!response.ok) {
//     const errorBody = await response.json().catch(() => ({}));
//     throw {
//       response: {
//         data: errorBody,
//         status: response.status,
//       },
//     };
//   }

//   return response.json();
// };




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

