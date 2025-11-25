import http from '@/utils/http';

export const GET_PRODUCT_TYPE_QUERY_KEY = 'GET_PRODUCT_TYPE_QUERY_KEY';
export const GET_PRODUCT_TYPE_STALE_TIME = 1000 * 60 * 30;
export const GET_PRODUCTS_QUERY_KEY = 'GET_PRODUCTS_QUERY_KEY';
export const GET_PRODUCTS_BY_BRANCH_QUERY_KEY = 'GET_PRODUCTS_BY_BRANCH_QUERY_KEY';
export const GET_PRODUCT_SEARCH_QUERY_KEY = 'GET_PRODUCT_SEARCH_QUERY_KEY';
export const GET_TOP_SELLING_QUERY_KEY = 'GET_TOP_SELLING_QUERY_KEY';

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
    inStock?: boolean;
}

export interface ProductType {
    id: number;
    name: string;
}

export interface TopSellingItem {
    type: string;
    id: number;
    name: string;
    quantitySold: number;
    revenue: number;
    imageUrl: string;
}

export interface TopSellingResponse {
    topItems: TopSellingItem[];
    message: string;
}

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

export interface ProductSearchParams {
    branchId: number;
    isActive?: boolean;
    keyword?: string;
    productTypeId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    page?: number;
    size?: number;
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
    const { data } = await http.get('/product-types');
    return [{ id: 0, name: 'Tất cả' }, ...data.data] as ProductType[];
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


    if (productTypeId !== undefined && productTypeId !== 0) {
        params.productTypeId = productTypeId;
    }

    const { data } = await http.get('/products/search', {
        params,
    });



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

// Wrapper function để tìm kiếm sản phẩm với ProductSearchParams
export const searchProducts = async (
    params: ProductSearchParams
): Promise<ProductSearchResponse> => {
    const {
        branchId,
        isActive = true,
        keyword = '',
        productTypeId,
        minPrice = 0,
        maxPrice = 1000000000,
        sortBy = 'name',
        sortDirection = 'ASC',
        page = 0,
        size = 100,
    } = params;

    const response = await getProduct(
        branchId,
        keyword,
        isActive,
        minPrice,
        maxPrice,
        page,
        size,
        sortBy as SortBy,
        sortDirection,
        productTypeId
    );

    // Convert ProductResponse về ProductSearchResponse format
    return {
        content: response.data.content,
        pageNumber: response.data.number,
        pageSize: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        last: response.data.last,
        first: response.data.number === 0,
        empty: response.data.content.length === 0,
    };
}

export interface TopSellingApiResponse {
    status: number;
    desc: string | null;
    data: TopSellingResponse;
}

export const getTopSellingProducts = async (branchId: number, limit: number = 1): Promise<TopSellingApiResponse> => {
    const { data } = await http.get('/statistics/top-selling', {
        params: {
            branchId,
            limit,
        },
    });
    return data;
};

