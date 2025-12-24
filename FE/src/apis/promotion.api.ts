export interface Promotion {
  id: string;
  name: string;
  description: string;
  value: number;
  minimumOrderValue: number;
  startDate: string;
  endDate: string;
  status: boolean;
  createdAt: string;
  promotionTypeName: string;
  createdByName: string;
  receivedDate: string | null;
  usedDate: string | null;
  userPromotionStatus: string | null;
  usageCount: number;
  code?: string;
}

export interface CreatePromotionData {
  name: string;
  description: string;
  value: number;
  minimumOrderValue: number;
  startDate: string;
  endDate: string;
  status: boolean;
  promotionTypeId: number;
}

export interface UpdatePromotionData {
  name: string;
  description: string;
  value: number;
  minimumOrderValue: number;
  startDate: string;
  endDate: string;
  status: boolean;
  promotionTypeId: number;
}

export interface UserAssignment {
  userId: number;
  usageCount: number;
}

export interface AssignPromotionData {
  promotionCode: string;
  userAssignments: UserAssignment[];
}

export interface PromotionsResponse {
  status: number;
  desc: string;
  data: Promotion[];
}

export interface PromotionType {
  id: number;
  name: string;
  description?: string;
}

export async function getPromotionTypes() {
  const response = await fetch("/api/promotions/type", {
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
  if (Array.isArray(result)) {
    return result as PromotionType[];
  }
  if (result.data && Array.isArray(result.data)) {
    return result.data as PromotionType[];
  }
  console.warn("Unexpected response format from promotion types API:", result);
  return [] as PromotionType[];
}

export interface GetAllPromotionsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface PromotionsPageResponse {
  content: Promotion[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export async function getAllPromotions(
  params: GetAllPromotionsParams = {}
): Promise<PromotionsPageResponse | Promotion[]> {
  const { page, size, sortBy, sortDirection } = params;

  const queryParams: Record<string, string> = {};
  if (page !== undefined) queryParams.page = String(page);
  if (size !== undefined) queryParams.size = String(size);
  if (sortBy) queryParams.sortBy = sortBy;
  if (sortDirection) queryParams.sortDirection = sortDirection;

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `/api/promotions/all${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
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

  // Nếu có pagination info, trả về object với pagination
  if (
    result.data &&
    typeof result.data === "object" &&
    "content" in result.data
  ) {
    return result.data as PromotionsPageResponse;
  }

  // Nếu không có pagination, trả về array (backward compatible)
  if (Array.isArray(result.data)) {
    return result.data as Promotion[];
  }

  return [] as Promotion[];
}

/**
 * Tạo promotion mới
 */
export async function createPromotion(data: CreatePromotionData) {
  const response = await fetch("/api/promotions/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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
  return result;
}

export async function assignPromotion(data: AssignPromotionData) {
  const response = await fetch("/api/promotions/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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
  return result;
}

export async function updatePromotion(
  promotionCode: string,
  data: UpdatePromotionData
) {
  const response = await fetch(`/api/promotions/${promotionCode}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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
  return result;
}

export async function togglePromotionStatus(
  promotionCode: string,
  status: boolean
) {
  const response = await fetch(
    `/api/promotions/change-status?promotionCode=${encodeURIComponent(
      promotionCode
    )}&status=${status}`,
    {
      method: "PUT",
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
  return result;
}

export async function getAvailablePromotions() {
  const response = await fetch("/api/promotions/available", {
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
  if (result && typeof result === "object") {
    if (Array.isArray(result)) {
      return result as Promotion[];
    }
    if (result.data && Array.isArray(result.data)) {
      return result.data as Promotion[];
    }
  }

  return [] as Promotion[];
}

// ---------- Dining table promotion validation ----------

export interface ValidateDiningTablePromotionParams {
  promotionCode: string;
  phoneNumber: string;
  orderValue: number;
}

export interface ValidateDiningTablePromotionResponse {
  status?: number;
  desc?: string | null;
  data?: boolean;
  message?: string;
  error?: string;
}

export async function validateDiningTablePromotion(
  params: ValidateDiningTablePromotionParams
): Promise<ValidateDiningTablePromotionResponse> {
  const { promotionCode, phoneNumber, orderValue } = params;

  const url = `/api/promotions/customer/dining-table/validate/${encodeURIComponent(
    promotionCode
  )}?phoneNumber=${encodeURIComponent(phoneNumber)}&orderValue=${orderValue}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = (await response.json().catch(() => ({}))) as
    | ValidateDiningTablePromotionResponse
    | Record<string, unknown>;

  if (!response.ok) {
    const message =
      (body as ValidateDiningTablePromotionResponse)?.message ||
      (body as ValidateDiningTablePromotionResponse)?.error ||
      (body as ValidateDiningTablePromotionResponse)?.desc ||
      "Mã khuyến mãi không hợp lệ";

    const error = new Error(message) as Error & {
      responseBody?: unknown;
      status?: number;
    };
    error.responseBody = body;
    error.status = response.status;
    throw error;
  }

  return body as ValidateDiningTablePromotionResponse;
}