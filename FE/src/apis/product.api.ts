import http from '@/utils/http';

export const GET_PRODUCT_TYPE_QUERY_KEY = 'GET_PRODUCT_TYPE_QUERY_KEY';
export const GET_PRODUCT_TYPE_STALE_TIME = 1000 * 60 * 30;
export const GET_PRODUCTS_QUERY_KEY = 'GET_PRODUCTS_QUERY_KEY';
export const GET_PRODUCTS_BY_BRANCH_QUERY_KEY = 'GET_PRODUCTS_BY_BRANCH_QUERY_KEY';

export interface SuccessResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  rating: number;
  productType: string;
  productQuantity: number;
}

export interface ProductType {
  id: number;
  name: string;
}

export type ProductResponse = SuccessResponse<{
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}>;

export type CartProduct = Product & {
  quantity: number;
  note: string;
};
export interface OrderProduct {
  productId: number;
  quantity: number;
  note: string;
}

export interface OrderProductResponse {
  productId: number;
  productName: string;
  quantity: number;
  note: string;
  price: number;
  feedback?: string;
}


export const getProductType = async () => {
  const { data } = await http.get('/product-type');
  return [{ id: 0, name: 'Tất cả' }, ...data] as ProductType[];
};

export const getProducts = async (page: number = 0, size: number = 100, productType: number = 0) => {
  const { data } = await http.get('/products', {
    params: {
      page,
      size,
      typeId: productType,
    },
  });
  return data.data;
};

export const getProductsByBranch = async (
  productType: number = 0,
  branchId: number = 1,
  page: number = 0,
  size: number = 100,
) => {
  const { data } = await http.get(`/products/branch/${branchId}`, {
    params: {
      page,
      size,
      typeId: productType,
    },
  });
  return data.data;
};
