import { Product } from '@/types/product.type';

import axios from 'axios';

export interface TopProduct {
  product: Product;
  revenue: number;
  quantity: number;
}

export interface TopProductsResponse {
  status: number;
  desc: string | null;
  data: TopProduct[];
}

export const GET_TOP_PRODUCTS_QUERY_KEY = 'GET_TOP_PRODUCTS';
export const getTopProducts = async (): Promise<TopProductsResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<TopProductsResponse>('https://tam-tac.com/api/dashboard/top-products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getWeeklyRevenue = async (month: number, year: number): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`https://tam-tac.com/api/dashboard/revenue/week?month=${month}&year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMonthlyRevenue = async (year: number): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`https://tam-tac.com/api/dashboard/revenue/month?year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getBranchRevenue = async (): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get('https://tam-tac.com/api/dashboard/revenue/branch', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getManagerDashboard = async (): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get('https://tam-tac.com/api/dashboard/manager', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getLatestOrders = async (): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get('https://tam-tac.com/api/dashboard/latest-orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface DashboardOrderItem {
  id: number;
  subTotal: number;
  promotionCode: string | null;
  discountValue: number;
  discountPercent: number;
  amount: number;
  shippingFee: number;
  isPickUp: boolean;
  delivery_at: string | null;
  orderStatus: string;
  note: string;
  payment_code: string;
  address: string | null;
  phone: string;
  pointUsed: number;
  pointEarned: number;
  createdAt: string;
  orderItems: {
    productId: number;
    productName: string;
    orderId: number;
    quantity: number;
    price: number;
    note: string;
    feedback: string | null;
    feedbackPoint: number;
    expiredFeedbackTime: string | null;
    productImg: string;
    feedBackYet: boolean;
  }[];
  customerDTO: any;
  pickupTime: string | null;
  customerName: string | null;
  status: string;
}

export interface DashboardOrderResponse {
  status: number;
  desc: string | null;
  data: {
    content: DashboardOrderItem[];
    pageable: any;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    empty: boolean;
  };
}

export const getDashboardOrders = async (page = 0, size = 10): Promise<DashboardOrderResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<DashboardOrderResponse>(
    `https://tam-tac.com/api/dashboard/order?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export interface DashboardProductItem {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  productType: string;
  productQuantity: number;
  recipe: any;
  status: boolean;
}

export interface DashboardProductResponse {
  status: number;
  desc: string | null;
  data: {
    content: DashboardProductItem[];
    pageable: any;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    empty: boolean;
  };
}

export const getDashboardProducts = async (page = 0, size = 10): Promise<DashboardProductResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<DashboardProductResponse>(
    `https://tam-tac.com/api/dashboard/product?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const deleteDashboardProduct = async (productId: number): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.delete(`https://tam-tac.com/api/products/admin/delete/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface DashboardUserItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
  branchId: number;
  role: string;
}

export interface DashboardUserResponse {
  status: number;
  desc: string | null;
  data: {
    content: DashboardUserItem[];
    pageable: any;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    empty: boolean;
  };
}

export const getDashboardUsers = async (page = 0, size = 10): Promise<DashboardUserResponse> => {
  const token = localStorage.getItem('access_token');
  const url = `https://tam-tac.com/api/users/admin/get-all-user?page=${page}&size=${size}&isActive=true&roleId=6`;

  const response = await axios.get<DashboardUserResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
