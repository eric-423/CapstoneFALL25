import { Branch } from '@/types/branch.type';
import http from '@/utils/http';

export const GET_BRANCHES_QUERY_KEY = 'GET_BRANCHES_QUERY_KEY';
export const GET_BRANCHES_STALE_TIME = 1000 * 60 * 30;

export const getBranches = async () => {
  const { data } = await http.get('/branches');
  return data.data as Branch[];
};
