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

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const { data } = await http.get('/branches');
    
    // Xử lý cả hai trường hợp response structure: data.data hoặc data trực tiếp
    const branchesData = data?.data ?? data;
    
    // Đảm bảo luôn trả về một mảng hợp lệ (không bao giờ undefined)
    if (Array.isArray(branchesData)) {
      return branchesData as Branch[];
    }
    
    // Nếu không phải mảng hoặc undefined/null, trả về mảng rỗng
    // Điều này đảm bảo React Query không bao giờ nhận được undefined
    if (branchesData === undefined || branchesData === null) {
      console.warn('[getBranches] Response data is undefined or null');
      return [];
    }
    
    console.warn('[getBranches] Response is not an array:', branchesData);
    return [];
  } catch (error) {
    console.error('[getBranches] Error fetching branches:', error);
    // Throw error để React Query có thể xử lý error state
    // Nhưng đảm bảo trong mọi trường hợp success đều trả về mảng (không undefined)
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
