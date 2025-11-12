import http from '@/utils/http';

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  parent: boolean;
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

export const GET_BRANCHES_QUERY_KEY = 'GET_BRANCHES_QUERY_KEY';
export const GET_BRANCHES_STALE_TIME = 1000 * 60 * 30;

export const getBranches = async () => {
  const { data } = await http.get('/branches');
  return data.data as Branch[];
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
