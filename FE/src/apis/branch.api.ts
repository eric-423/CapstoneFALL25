import { getToken } from "@/utils/cookies.client";
import { TableData } from "./table.api";


export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  parent: boolean;
}

export interface BranchDetail {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  isParent: boolean;
}

export interface BranchStatistics {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  parentBranches: number;
  branches: BranchDetail[];
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  phoneNumber: string;
}

export interface UpdateBranchRequest {
  name: string;
  address: string;
  phoneNumber: string;
}

export interface NearbyBranch {
  branchId: number;
  name: string;
  address: string;
  phoneNumber: string;
  isParent: boolean;
  distanceInMeters?: number;
  distanceText?: string;
}

export interface CustomerInformation {
  informationId: number;
  fullName: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export const GET_BRANCHES_QUERY_KEY = "GET_BRANCHES_QUERY_KEY";
export const GET_BRANCHES_STALE_TIME = 1000 * 60 * 30;

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/branches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
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
    const branchesData = result?.data ?? result;

    if (Array.isArray(branchesData)) {
      return branchesData.filter((branch: Branch) => branch.active === true) as Branch[];
    }

    if (branchesData === undefined || branchesData === null) {
      return [];
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const getNearbyBranches = async (
  address: string,
  limit = 20
): Promise<NearbyBranch[]> => {
  const params = new URLSearchParams({ address, limit: limit.toString() });
  const response = await fetch(`/api/branches/nearby?${params.toString()}`, {
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
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};


export const getBranchStatistics = async (): Promise<BranchStatistics> => {
  const response = await fetch("/api/branches/statistics", {
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
  return result.data || result;
};

export const createBranch = async (
  data: CreateBranchRequest
): Promise<BranchDetail> => {
  const response = await fetch("/api/branches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  return result.data || result;
};



export const updateBranch = async (
  branchId: number,
  data: UpdateBranchRequest
): Promise<BranchDetail> => {
  const response = await fetch(`/api/branches/${branchId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
  return result.data || result;
};



export const deactivateBranch = async (branchId: number): Promise<void> => {
  const response = await fetch(`/api/branches/${branchId}/deactivate`, {
    method: "PUT",
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
};



export const activateBranch = async (branchId: number): Promise<void> => {
  const response = await fetch(`/api/branches/${branchId}/activate`, {
    method: "PUT",
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
};




export const getTablesByBranch = async (
  branchId: number
): Promise<TableData[]> => {
  const response = await fetch(`/api/table/branch/${branchId}`, {
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

  const data = await response.json();
  return data;
};
