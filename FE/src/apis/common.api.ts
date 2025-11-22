import axios from 'axios';

export interface District {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
}
export interface Province {
  id: string;
  name: string;
  slug: string;
}
export type GetDistrictResponse = {
  total: number;
  data: District[];
};


export const GET_DISTRICTS_QUERY_KEY = 'GET_DISTRICTS_QUERY_KEY';

export const getDistricts = async (provinceId: string, page: number = 0, size: number = 63, query: string = '') => {
  const { data } = await axios({
    url: `https://open.oapi.vn/location/districts/${provinceId}?page=${page}&size=${size}&query=${query}`,
    method: 'GET',
  });
  return data.data as District[];
};
