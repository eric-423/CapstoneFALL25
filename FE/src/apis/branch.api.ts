import http from '@/utils/http';

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  parent: boolean;
}

export const GET_BRANCHES_QUERY_KEY = 'GET_BRANCHES_QUERY_KEY';
export const GET_BRANCHES_STALE_TIME = 1000 * 60 * 30;

export const getBranches = async () => {
  const { data } = await http.get('/branches');
  return data.data as Branch[];
};
