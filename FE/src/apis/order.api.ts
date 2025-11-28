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
  branchId: number;
}

export interface OrderResponse {
  id: number;
  date: Date;
  restaurant: string;
  items: OrderProductResponse[];
  totalItems: number;
  subTotal: number;
  orderStatus: string;
  paymentStatus: string;
  customerName: string;
  customerPhone: string;
  address?: string | null;
  branchName?: string;
  branchAddress?: string;
  shippingFee?: number;
  discountValue?: number;
  amount?: number;
  promotionCode?: string | null;
  pointUsed?: number;
  pointEarned?: number;
  shipperName?: string | null;
  waiterName?: string | null;
  chefName?: string | null;
  rated?: boolean;
  pickupTime: string;
  payment_code?: string;
  orderDate?: string;
  paymentTime?: string | null;
  deliveryAt?: string | null;
}

export interface CustomerOrderDetailItem {
  productId: number;
  productName: string;
  orderId: number;
  quantity: number;
  price: number;
  note?: string | null;
  feedback?: string | null;
  feedbackPoint?: number | null;
  expiredFeedbackTime?: string | null;
  productImg?: string | null;
  comboDTO?: unknown;
  isConfirmed?: boolean;
  isDelivered?: boolean | null;
  feedBackYet?: boolean;
}

export interface CustomerOrderDetailCustomerDTO {
  id: number;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean | null;
  dateOfBirth?: string | null;
  createdAt?: string | null;
  memberPoint?: number | null;
  memberRank?: string | null;
}

export interface CustomerOrderDetailData {
  id: number;
  subTotal: number;
  promotionCode?: string | null;
  discountValue?: number | null;
  discountPercent?: number | null;
  amount: number;
  shippingFee?: number | null;
  isPickUp?: boolean;
  isTable?: boolean;
  delivery_at?: string | null;
  deliveryAt?: string | null;
  orderStatus: string;
  status?: string;
  note?: string | null;
  payment_code?: string | null;
  address?: string | null;
  branchName?: string | null;
  branchAddress?: string | null;
  phone?: string | null;
  pointUsed?: number;
  pointEarned?: number;
  createdAt?: string | null;
  orderItems: CustomerOrderDetailItem[];
  customerDTO?: CustomerOrderDetailCustomerDTO | null;
  pickupTime?: string | null;
  customerName?: string | null;
  paymentUrl?: string | null;
  shipperName?: string | null;
  waiterName?: string | null;
  chefName?: string | null;
}

export interface CustomerOrderDetailApiResponse {
  status: number;
  desc: string | null;
  data: CustomerOrderDetailData;
}


export interface OrderStatusesResponse {
  status: number;
  desc: string;
  data: string[];
}

export interface BranchOrderResponse {
  id: number;
  orderStatus: string;
  orderDate: string;
  paymentTime: string | null;
  deliveryAt: string | null;
  customerName: string;
  customerPhone: string;
  address: string | null;
  branchName: string;
  branchAddress: string;
  subTotal: number;
  shippingFee: number;
  discountValue: number;
  amount: number;
  promotionCode: string | null;
  pointUsed: number;
  pointEarned: number;
  shipperName: string | null;
  waiterName: string | null;
  chefName: string | null;
  itemCount: number;
  table: boolean;
  pickUp: boolean;
}

export interface BranchOrdersApiResponse {
  status: number;
  desc: string;
  data: BranchOrderResponse[];
}



export interface WaiterOrderItemRequest {
  productId: number;
  comboId: number;
  quantity: number;
  price: number;
  note: string;
}

export interface WaiterConfirmRequest {
  orderId: number;
  waiterId: number;
  orderItems: WaiterOrderItemRequest[];
}

export interface WaiterDeliveredRequest {
  orderId: number;
  waiterId: number;
  orderItems: WaiterOrderItemRequest[];
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






export const getCustomerOrders = async (status?: string) => {
  const queryParams = status ? `?status=${encodeURIComponent(status)}` : '';

  const response = await fetch(`/api/orders/customer/my-orders${queryParams}`, {
    method: 'GET',
    credentials: 'include',
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

export const getCustomerOrderDetail = async (orderId: number): Promise<CustomerOrderDetailApiResponse> => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'GET',
    credentials: 'include',
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

export const cancelOrder = async (orderId: number, customerId: number) => {
  const { data } = await http.put(`/orders/cancel/${orderId}?customerId=${customerId}`);
  return data;
};

export const createDiningOrder = async (orderRequest: DiningOrderRequest) => {
  const { data } = await http.post('/orders/dining-table/create', orderRequest);
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


export const getOrderStatuses = async (): Promise<OrderStatusesResponse> => {
  try {
    const response = await fetch('/api/orders/statuses', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      const error = new Error(`Failed to fetch order statuses: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getBranchOrders = async (status?: string): Promise<BranchOrdersApiResponse> => {
  try {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`/api/orders/branch/my-branch${params}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      const error = new Error(`Failed to fetch branch orders: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    throw error;
  }
};

export interface AssignChefResponse {
  success: boolean;
  message?: string;
}

export const assignChefToOrder = async (orderId: number): Promise<AssignChefResponse> => {
  try {
    const url = `/api/orders/manager/assign/cheff/${orderId}`;

    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      const error = new Error(`Failed to assign chef: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    const success = data === true || data === 'true' || data.success === true;
    return { success };
  } catch (error) {
    throw error;
  }
};


export const staffAssignChefToOrder = async (orderId: number): Promise<AssignChefResponse> => {
  try {
    const url = `/api/orders/staff/assign/cheff/${orderId}`;

    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      const error = new Error(`Failed to assign chef: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    const success = data === true || data === 'true' || data.success === true;
    return { success };
  } catch (error) {
    throw error;
  }
};


export const assignShipperToOrder = async (orderId: number): Promise<AssignShipperResponse> => {
  try {
    const response = await fetch(`/api/orders/manager/assign/shipper/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
    });

    const data = await response.json();
    return {
      success: data === true || data === 'true' || data.success === true || response.ok,
      message: data.message || 'Đã assign shipper thành công'
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Hiện Tại Tất Cả Shipper Đang Bận'
    };
  }
};



export const staffAssignShipperToOrder = async (orderId: number): Promise<AssignShipperResponse> => {
  try {
    const response = await fetch(`/api/orders/staff/assign/shipper/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
    });

    const data = await response.json();
    return {
      success: data === true || data === 'true' || data.success === true || response.ok,
      message: data.message || 'Đã assign shipper thành công'
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Hiện Tại Tất Cả Shipper Đang Bận'
    };
  }
};


export const getChefOrders = async (chefId: number, status?: string): Promise<BranchOrdersApiResponse> => {
  try {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`/api/orders/cheff/view/${chefId}${params}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      const error = new Error(`Failed to fetch chef orders: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export interface MarkOrderAsCookedResponse {
  success: boolean;
  message?: string;
}

export const markOrderAsCooked = async (orderId: number): Promise<MarkOrderAsCookedResponse> => {
  try {
    const response = await fetch(`/api/orders/cheff/cooked/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      const error = new Error(`Failed to mark order as cooked: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return {
      success: data === true || data === 'true' || data.success === true || response.ok,
      message: data.message || 'Đã đánh dấu đơn hàng là đã nấu xong'
    };
  } catch (error) {
    throw error;
  }
};


export const waiterConfirmOrder = async (request: WaiterConfirmRequest): Promise<void> => {
  try {
    const response = await fetch('/api/orders/waiter/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to confirm order' }));
      const error = new Error(`Failed to confirm order: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export const waiterDeliveredOrder = async (request: WaiterDeliveredRequest): Promise<void> => {
  try {
    const response = await fetch('/api/orders/waiter/delivered', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to mark as delivered' }));
      const error = new Error(`Failed to mark as delivered: ${response.status} ${response.statusText}`);
      (error as Error & { response?: { data: unknown; status: number } }).response = {
        data: errorBody,
        status: response.status,
      };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export interface AssignShipperResponse {
  success: boolean;
  message?: string;
}



