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

export async function getAllPromotions() {
  const response = await fetch("/api/promotions/all", {
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
  return result.data as Promotion[];
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
