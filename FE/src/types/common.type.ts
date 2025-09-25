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
