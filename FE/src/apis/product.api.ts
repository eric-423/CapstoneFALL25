import http from '@/utils/http';

export const GET_PRODUCT_TYPE_QUERY_KEY = 'GET_PRODUCT_TYPE_QUERY_KEY';
export const GET_PRODUCT_TYPE_STALE_TIME = 1000 * 60 * 30;
export const GET_PRODUCTS_QUERY_KEY = 'GET_PRODUCTS_QUERY_KEY';
export const GET_PRODUCTS_BY_BRANCH_QUERY_KEY = 'GET_PRODUCTS_BY_BRANCH_QUERY_KEY';
export const GET_PRODUCT_SEARCH_QUERY_KEY = 'GET_PRODUCT_SEARCH_QUERY_KEY';

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
  rating?: number;
  productType: string;
  productTypeId?: number;
  productQuantity?: number;
  quantityInBranch?: number;
  createdDate?: string;
  updatedDate?: string;
  active?: boolean;
}

export interface ProductType {
  id: number;
  name: string; 
}

// Interface cho response thực tế từ API
export interface ProductSearchResponse {
  content: Product[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
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


// =============================== API PRODUCT ===============================

export type SortBy = 'name' | 'price';


export const getProduct = async (

  branchId: number,
  keyword: string,
  isActive: boolean,
  minPrice: number,
  maxPrice: number,
  page: number,
  size: number,
  sortBy: SortBy,
  sortDirection: 'ASC' | 'DESC',
  productTypeId?: number

): Promise<ProductResponse> => {

  const params: {
    branchId: number;
    keyword: string;
    isActive: boolean;
    minPrice: number;
    maxPrice: number;
    page: number;
    size: number;
    sortBy: SortBy;
    sortDirection: 'ASC' | 'DESC';
    productTypeId?: number;
  } = {
    branchId,
    keyword,
    isActive,
    minPrice,
    maxPrice,
    page,
    size,
    sortBy,
    sortDirection,
  };

  // Chỉ thêm productTypeId vào params nếu nó được định nghĩa và khác 0
  if (productTypeId !== undefined && productTypeId !== 0) {
    params.productTypeId = productTypeId;
  }

  const { data } = await http.get('/products/search', {
    params,
  });

  // Response thực tế trả về trực tiếp ProductSearchResponse, không có wrapper
  // Kiểm tra nếu response có wrapper data hoặc trả về trực tiếp
  const responseData: ProductSearchResponse = data?.data || data;

  if (!responseData || !responseData.content) {
    return {
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: page,
        size: size,
        last: true,
      },
      message: 'No data available',
      statusCode: 200,
    };
  }

  // Map từ ProductSearchResponse sang ProductResponse format
  return {
    data: {
      content: responseData.content,
      totalElements: responseData.totalElements,
      totalPages: responseData.totalPages,
      number: responseData.pageNumber,
      size: responseData.pageSize,
      last: responseData.last,
    },
    message: 'Success',
    statusCode: 200,
  };
}