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
    // Build query params
    const queryParams = new URLSearchParams();
    Object.entries({
        branchId: params.branchId,
        keyword: params.keyword,
        productName: params.productName,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        page: params.page ?? 0,
        size: params.size ?? 10,
    }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
        }
    });

    const response = await fetch(`/api/combos/search?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to search combos');
    }

    const data = await response.json();
    return data;
};
