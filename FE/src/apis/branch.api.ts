import http from '@/utils/http';

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

export const GET_BRANCHES_QUERY_KEY = 'GET_BRANCHES_QUERY_KEY';
export const GET_BRANCHES_STALE_TIME = 1000 * 60 * 30;

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const { data } = await http.get('/branches');

    const branchesData = data?.data ?? data;

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



export const getNearbyBranches = async (address: string, limit = 20): Promise<NearbyBranch[]> => {
  const params = new URLSearchParams({ address, limit: limit.toString() });
  const response = await fetch(`/api/branches/nearby?${params.toString()}`, {
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

  const result = await response.json();
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};

// Admin Branch Management APIs
export const getBranchStatistics = async (): Promise<BranchStatistics> => {
  const response = await fetch('/api/branches/statistics', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch branch statistics');
  }

  const result = await response.json();
  return result.data || result;
};

export const createBranch = async (data: CreateBranchRequest): Promise<BranchDetail> => {
  const response = await fetch('/api/branches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create branch');
  }

  const result = await response.json();
  return result.data || result;
};

export const updateBranch = async (branchId: number, data: UpdateBranchRequest): Promise<BranchDetail> => {
  const response = await fetch(`/api/branches/${branchId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update branch');
  }

  const result = await response.json();
  return result.data || result;
};

export const deactivateBranch = async (branchId: number): Promise<void> => {
  const response = await fetch(`/api/branches/${branchId}/deactivate`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to deactivate branch');
  }
};

export const activateBranch = async (branchId: number): Promise<void> => {
  const response = await fetch(`/api/branches/${branchId}/activate`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to activate branch');
  }
};

// Import TableData type from table.api
import { TableData } from './table.api';

export const getTablesByBranch = async (branchId: number): Promise<TableData[]> => {
  const response = await fetch(`/api/table/branch/${branchId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tables by branch');
  }

  const data = await response.json();
  return data;
};
