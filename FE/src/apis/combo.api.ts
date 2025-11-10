import http from '@/utils/http';

export interface Combo {
    comboId: number;
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
    branchId: number;
    branchName: string;
    active: boolean;
}

export interface ComboSearchParams {
    branchId: number;
    keyword?: string;
    productName?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'price' | 'startDate' | 'endDate';
    sortDirection?: 'ASC' | 'DESC';
    page?: number;
    size?: number;
}

export interface ComboSearchResponse {
    content: Combo[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

export const searchCombos = async (params: ComboSearchParams): Promise<ComboSearchResponse> => {
    const { data } = await http.get('/combos/search', {
        params: {
            branchId: params.branchId,
            keyword: params.keyword,
            productName: params.productName,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
            page: params.page ?? 0,
            size: params.size ?? 10,
        },
    });
    return data;
};
