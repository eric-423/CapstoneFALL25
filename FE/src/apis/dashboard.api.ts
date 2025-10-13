import axios from 'axios';

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  rating: number;
  productType: string;
  productQuantity: number;
}

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

export interface WeeklyRevenueResponse {
  status: number;
  desc: string | null;
  data: {
    week: number;
    revenue: number;
  }[];
}

export interface MonthlyRevenueResponse {
  status: number;
  desc: string | null;
  data: {
    month: number;
    revenue: number;
  }[];
}

export interface MonthlyRevenueResponse {
  status: number;
  desc: string | null;
  data: {
    month: number;
    revenue: number;
  }[];
}

export interface BranchRevenueResponse {
  status: number;
  desc: string | null;
  data: {
    branchId: number;
    branchName: string;
    revenue: number;
  }[];
}

export interface ManagerDashboardResponse {
  status: number;
  desc: string | null;
  data: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
  };
}

export interface LatestOrdersResponse {
  status: number;
  desc: string | null;
  data: DashboardOrderItem[];
}

export interface DashboardProductItem {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  productType: string;
  productQuantity: number;
  recipe: {
    id: number;
    name: string;
    ingredients: string[];
  } | null;
  status: boolean;
}
export interface PageableInfo {
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

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
  customerDTO: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
  };
  pickupTime: string | null;
  customerName: string | null;
  status: string;
}

export interface DashboardOrderResponse {
  status: number;
  desc: string | null;
  data: {
    content: DashboardOrderItem[];
    pageable: PageableInfo;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}

export interface DashboardProductResponse {
  status: number;
  desc: string | null;
  data: {
    content: DashboardProductItem[];
    pageable: PageableInfo;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}

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
    pageable: PageableInfo;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}



// ------ API Calls ------


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

export const getWeeklyRevenue = async (month: number, year: number): Promise<WeeklyRevenueResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<WeeklyRevenueResponse>(`https://tam-tac.com/api/dashboard/revenue/week?month=${month}&year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMonthlyRevenue = async (year: number): Promise<MonthlyRevenueResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<MonthlyRevenueResponse>(`https://tam-tac.com/api/dashboard/revenue/month?year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const getBranchRevenue = async (): Promise<BranchRevenueResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<BranchRevenueResponse>('https://tam-tac.com/api/dashboard/revenue/branch', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getManagerDashboard = async (): Promise<ManagerDashboardResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<ManagerDashboardResponse>('https://tam-tac.com/api/dashboard/manager', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getLatestOrders = async (): Promise<LatestOrdersResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<LatestOrdersResponse>('https://tam-tac.com/api/dashboard/latest-orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

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

export interface DeleteProductResponse {
  status: number;
  desc: string | null;
  data: {
    message: string;
    success: boolean;
  };
}

export const deleteDashboardProduct = async (productId: number): Promise<DeleteProductResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.delete<DeleteProductResponse>(`https://tam-tac.com/api/products/admin/delete/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


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
