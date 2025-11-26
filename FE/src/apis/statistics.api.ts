// Statistics API functions

export interface RevenueStatistics {
  date: string;
  branchId: number;
  branchName: string;
  totalRevenue: number;
  totalOrders: number;
  message: string;
}

export interface OrderCountStatistics {
  date: string;
  branchId: number;
  branchName: string;
  totalOrders: number;
  shippingOrders: number;
  pickupOrders: number;
  diningOrders: number;
  message: string;
}

export interface NewCustomerStatistics {
  currentDate: string;
  comparisonDate: string;
  newCustomersToday: number;
  newCustomersComparison: number;
  difference: number;
  percentageChange: number;
  comparisonType: "DAILY" | "MONTHLY";
  message: string;
}

export interface ServiceTimeStatistics {
  currentDate: string;
  comparisonDate: string;
  averageServiceTimeMinutes: number;
  comparisonAverageServiceTimeMinutes: number;
  differenceMinutes: number;
  percentageChange: number;
  totalOrdersProcessed: number;
  comparisonOrdersProcessed: number;
  comparisonType: "DAILY" | "MONTHLY";
  message: string;
}

export interface Revenue7Days {
  branchId: number | null;
  branchName: string;
  dailyRevenues: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
  totalRevenue: number;
  averageRevenue: number;
  message: string;
}

export interface MaterialUsage {
  materialId: number;
  materialName: string;
  quantityUsed: number;
  unit: string;
}

export interface TopMaterials {
  materials: MaterialUsage[];
}

export interface SellingItem {
  itemId: number;
  itemName: string;
  itemType: "PRODUCT" | "COMBO";
  quantitySold: number;
  totalRevenue: number;
  imageUrl?: string;
}

export interface TopSellingItems {
  items: SellingItem[];
}

/**
 * Lấy thống kê doanh thu theo ngày
 */
export async function getRevenueStatistics(branchId: number, date?: string) {
  const params = new URLSearchParams({ branchId: branchId.toString() });
  if (date) params.append("date", date);

  const response = await fetch(`/api/statistics/revenue?${params.toString()}`, {
    method: "GET",
    credentials: "include",
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

  const result = await response.json();
  return result.data as RevenueStatistics;
}

/**
 * Lấy thống kê số lượng đơn hàng theo ngày
 */
export async function getOrderCountStatistics(branchId: number, date?: string) {
  const params = new URLSearchParams({ branchId: branchId.toString() });
  if (date) params.append("date", date);

  const response = await fetch(
    `/api/statistics/order-count?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();
  return result.data as OrderCountStatistics;
}

/**
 * Lấy thống kê khách hàng mới
 */
export async function getNewCustomerStatistics(
  comparisonType: "DAILY" | "MONTHLY" = "DAILY"
) {
  const params = new URLSearchParams({ comparisonType });

  const response = await fetch(
    `/api/statistics/new-customers?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();
  return result.data as NewCustomerStatistics;
}

export async function getServiceTimeStatistics(
  branchId: number,
  date?: string,
  comparisonType: "DAILY" | "MONTHLY" = "DAILY"
) {
  const params = new URLSearchParams({
    branchId: branchId.toString(),
    comparisonType,
  });
  if (date) params.append("date", date);

  const response = await fetch(
    `/api/statistics/service-time?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();
  return result.data as ServiceTimeStatistics;
}

export async function getRevenue7Days(branchId?: number) {
  const params = new URLSearchParams();
  if (branchId) params.append("branchId", branchId.toString());

  const response = await fetch(
    `/api/statistics/revenue-7days?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();
  return result.data as Revenue7Days;
}

/**
 * Lấy top nguyên liệu sử dụng nhiều nhất
 */
export async function getTopMaterials(branchId?: number, limit: number = 5) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (branchId) params.append("branchId", branchId.toString());

  const response = await fetch(
    `/api/statistics/top-materials?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();
  return result.data as TopMaterials;
}

export async function getTopSellingItems(
  branchId?: number,
  limit: number = 5
): Promise<TopSellingItems> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (branchId) params.append("branchId", branchId.toString());

  const response = await fetch(
    `/api/statistics/top-selling?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  const result = await response.json();

  if (!result.data || !result.data.topItems) {
    return { items: [] };
  }

  const mappedItems: SellingItem[] = result.data.topItems.map((item: any) => ({
    itemId: item.id,
    itemName: item.name,
    itemType: item.type,
    quantitySold: item.quantitySold,
    totalRevenue: item.revenue,
    imageUrl: item.imageUrl,
  }));

  return { items: mappedItems };
}
