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

export interface ComboItem {
    productId: number;
    quantity: number;
    note?: string;
}

export interface ComboDetail {
    id: number;
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
    branchId: number;
    comboItems: ComboItem[];
    active: boolean;
}

export interface CreateComboRequest {
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    branchId: number;
    comboItems: ComboItem[];
}

export interface UpdateComboRequest {
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    branchId: number;
    comboItems: ComboItem[];
}

export interface ComboSearchParams {
    branchId?: number;
    keyword?: string;
    productName?: string;
    isActive?: boolean;
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



export const getComboById = async (comboId: number): Promise<ComboDetail> => {
    const response = await fetch(`/api/combos/${comboId}`, {
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
    return result.data || result;
};



export const searchCombos = async (params: ComboSearchParams): Promise<ComboSearchResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries({
        branchId: params.branchId,
        keyword: params.keyword,
        productName: params.productName,
        isActive: params.isActive,
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

    const response = await fetch(`/api/combos/search?${queryParams.toString()}`, {
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

    const data = await response.json();
    return data;
};




export const createCombo = async (data: CreateComboRequest): Promise<Combo> => {
    const response = await fetch('/api/combos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
    return result.data || result;
};




export const updateCombo = async (comboId: number, data: UpdateComboRequest): Promise<Combo> => {
    const response = await fetch(`/api/combos/${comboId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
    return result.data || result;
};




export const deleteCombo = async (comboId: number): Promise<void> => {
    const response = await fetch(`/api/combos/${comboId}`, {
        method: 'DELETE',
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
};
