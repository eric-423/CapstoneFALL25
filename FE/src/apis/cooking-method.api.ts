export interface CookingMethod {
  id: number;
  name: string;
  description: string;
}

export interface CookingMethodRequest {
  name: string;
  description: string;
}

export interface CookingMethodSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface CookingMethodResponse {
  content: CookingMethod[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export const getCookingMethods = async (params: CookingMethodSearchParams = {}) => {
  const queryParams = new URLSearchParams();
  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size !== undefined)
    queryParams.append("size", params.size.toString());
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortDirection)
    queryParams.append("sortDirection", params.sortDirection);

  const response = await fetch(`/api/cooking-methods?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cooking methods");
  }

  const data = await response.json();
  return data;
};



export const getCookingMethodById = async (id: number) => {
  const response = await fetch(`/api/cooking-methods/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cooking method");
  }

  const data = await response.json();
  return data.data;
};



export const createCookingMethod = async (cookingMethod: CookingMethodRequest) => {
  const response = await fetch("/api/cooking-methods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cookingMethod),
  });

  if (!response.ok) {
    throw new Error("Failed to create cooking method");
  }

  const data = await response.json();
  return data.data;
};

export const updateCookingMethod = async (id: number, cookingMethod: CookingMethodRequest) => {
  const response = await fetch(`/api/cooking-methods/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cookingMethod),
  });

  if (!response.ok) {
    throw new Error("Failed to update cooking method");
  }

  const data = await response.json();
  return data.data;
};
