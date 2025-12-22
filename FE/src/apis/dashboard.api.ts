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

// ============ DASHBOARD TABS TYPES ============

export interface DashboardFilterParams {
  branchId?: number;
  fromDate?: string;
  toDate?: string;
}

// KPI Types
export interface DashboardKPIItem {
  label: string;
  value: number;
  unit?: string;
  percentChange: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
}

export interface DashboardKPIResponse {
  status: number;
  desc: string;
  data: DashboardKPIItem[];
}

// Revenue Chart Types
export interface RevenueChartItem {
  time: string;
  revenue: number;
}

export interface RevenueChartResponse {
  status: number;
  desc: string;
  data: RevenueChartItem[];
}

// Revenue by Channel Types
export interface RevenueByChannelItem {
  channel: string;
  revenue: number;
  percentage: number;
  fill?: string;
}

export interface RevenueByChannelResponse {
  status: number;
  desc: string;
  data: RevenueByChannelItem[];
}

// Peak Hours Types
export interface PeakHoursItem {
  hour: string;
  orderCount: number;
}

export interface PeakHoursResponse {
  status: number;
  desc: string;
  data: PeakHoursItem[];
}

// Top Selling Products Types
export interface TopSellingProductItem {
  productId: number;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  image?: string;
  category?: string;
}

export interface TopSellingProductsResponse {
  status: number;
  desc: string;
  data: TopSellingProductItem[];
}

// Product Performance Types
export interface ProductPerformanceItem {
  productId: number;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface ProductPerformanceResponse {
  status: number;
  desc: string;
  data: ProductPerformanceItem[];
}

// Combo Effectiveness Types
export interface ComboEffectivenessItem {
  comboName: string;
  orders: number;
  revenue: number;
}

export interface ComboEffectivenessResponse {
  status: number;
  desc: string;
  data: ComboEffectivenessItem[];
}

// Promotion Effectiveness Types
export interface PromotionEffectivenessItem {
  code: string;
  name?: string;
  usageCount: number;
  revenueGenerated: number;
  discountTotal?: number;
}

export interface PromotionEffectivenessResponse {
  status: number;
  desc: string;
  data: PromotionEffectivenessItem[];
}

// Voucher Revenue Types
export interface VoucherRevenueItem {
  type: string;
  revenue: number;
  fill?: string;
}

export interface VoucherRevenueResponse {
  status: number;
  desc: string;
  data: VoucherRevenueItem[];
}

// Kitchen Performance Types
export interface KitchenPerformanceItem {
  timeSlot: string;
  avgPrepMinutes: number;
}

export interface KitchenPerformanceResponse {
  status: number;
  desc: string;
  data: KitchenPerformanceItem[];
}

// Staff Performance Types
export interface StaffPerformanceItem {
  staffName: string;
  ordersHandled: number;
  avgRating?: number;
}

export interface StaffPerformanceResponse {
  status: number;
  desc: string;
  data: StaffPerformanceItem[];
}

// Order Flow Types
export interface OrderFlowItem {
  stage: string;
  avgSeconds: number;
}

export interface OrderFlowResponse {
  status: number;
  desc: string;
  data: OrderFlowItem[];
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



export const GET_TOP_PRODUCTS_QUERY_KEY = 'GET_TOP_PRODUCTS';

export const getTopProducts = async (): Promise<TopProductsResponse> => {
  const token = localStorage.getItem('access_token');
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/top-products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch top products');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

export const getWeeklyRevenue = async (month: number, year: number): Promise<WeeklyRevenueResponse> => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams({ month: month.toString(), year: year.toString() });
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/revenue/week?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch weekly revenue');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

export const getMonthlyRevenue = async (year: number): Promise<MonthlyRevenueResponse> => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams({ year: year.toString() });
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/revenue/month?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch monthly revenue');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};


export const getBranchRevenue = async (): Promise<BranchRevenueResponse> => {
  const token = localStorage.getItem('access_token');
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/revenue/branch`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch branch revenue');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

export const getManagerDashboard = async (): Promise<ManagerDashboardResponse> => {
  const token = localStorage.getItem('access_token');
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/manager`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch manager dashboard');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

export const getLatestOrders = async (): Promise<LatestOrdersResponse> => {
  const token = localStorage.getItem('access_token');
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/latest-orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch latest orders');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

export const getDashboardOrders = async (page = 0, size = 10): Promise<DashboardOrderResponse> => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/order?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch dashboard orders');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

export const getDashboardProducts = async (page = 0, size = 10): Promise<DashboardProductResponse> => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/product?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch dashboard products');
  const result = await fetchResponse.json();
  return result?.data ?? result;
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
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/admin/delete/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to delete product');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};


export const getDashboardUsers = async (page = 0, size = 10): Promise<DashboardUserResponse> => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    isActive: 'true',
    roleId: '6'
  });
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/admin/get-all-user?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!fetchResponse.ok) throw new Error('Failed to fetch dashboard users');
  const result = await fetchResponse.json();
  return result?.data ?? result;
};

// ============ DASHBOARD TABS API CALLS ============

const buildQueryString = (params: DashboardFilterParams): string => {
  const searchParams = new URLSearchParams();
  if (params.branchId) searchParams.append('branchId', params.branchId.toString());
  if (params.fromDate) searchParams.append('fromDate', params.fromDate);
  if (params.toDate) searchParams.append('toDate', params.toDate);
  return searchParams.toString();
};

// Overview APIs
export const getDashboardKPIs = async (params: DashboardFilterParams = {}): Promise<DashboardKPIResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/overview/kpi${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch KPIs');
  return response.json();
};

export const getRevenueChartData = async (params: DashboardFilterParams & { groupBy?: string } = {}): Promise<RevenueChartResponse> => {
  const searchParams = new URLSearchParams();
  if (params.branchId) searchParams.append('branchId', params.branchId.toString());
  if (params.fromDate) searchParams.append('fromDate', params.fromDate);
  if (params.toDate) searchParams.append('toDate', params.toDate);
  if (params.groupBy) searchParams.append('groupBy', params.groupBy);
  const queryString = searchParams.toString();
  const url = `/api/dashboard/overview/revenue-chart${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch revenue chart');
  return response.json();
};

export const getRevenueByChannel = async (params: DashboardFilterParams = {}): Promise<RevenueByChannelResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/overview/revenue-by-channel${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch revenue by channel');
  return response.json();
};

export const getPeakHoursData = async (params: DashboardFilterParams = {}): Promise<PeakHoursResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/overview/peak-hours${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch peak hours');
  return response.json();
};

// Products APIs
export const getTopSellingProducts = async (params: DashboardFilterParams & { limit?: number } = {}): Promise<TopSellingProductsResponse> => {
  const searchParams = new URLSearchParams();
  if (params.branchId) searchParams.append('branchId', params.branchId.toString());
  if (params.fromDate) searchParams.append('fromDate', params.fromDate);
  if (params.toDate) searchParams.append('toDate', params.toDate);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  const queryString = searchParams.toString();
  const url = `/api/dashboard/products/top-selling${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch top selling products');
  return response.json();
};

export const getProductPerformance = async (params: DashboardFilterParams = {}): Promise<ProductPerformanceResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/products/performance${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch product performance');
  return response.json();
};

export const getComboEffectiveness = async (params: DashboardFilterParams = {}): Promise<ComboEffectivenessResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/products/combo-effectiveness${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch combo effectiveness');
  return response.json();
};

// Marketing APIs
export const getPromotionEffectiveness = async (params: DashboardFilterParams = {}): Promise<PromotionEffectivenessResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/marketing/promotions${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch promotion effectiveness');
  return response.json();
};

export const getVoucherRevenue = async (params: DashboardFilterParams = {}): Promise<VoucherRevenueResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/marketing/vouchers${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch voucher revenue');
  return response.json();
};

// Operations APIs
export const getKitchenPerformance = async (params: DashboardFilterParams = {}): Promise<KitchenPerformanceResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/operations/kitchen-performance${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch kitchen performance');
  return response.json();
};

export const getStaffPerformance = async (params: DashboardFilterParams = {}): Promise<StaffPerformanceResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/operations/staff-performance${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch staff performance');
  return response.json();
};

export const getOrderFlow = async (params: DashboardFilterParams = {}): Promise<OrderFlowResponse> => {
  const queryString = buildQueryString(params);
  const url = `/api/dashboard/operations/order-flow${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch order flow');
  return response.json();
};

