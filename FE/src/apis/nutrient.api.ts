

export interface Nutrient {
    id: number;
    name: string;
    code: string;
    unit: string;
    energyPerUnit: number;
}

export interface NutrientRequest {
    name: string;
    code: string;
    unit: string;
    energyPerUnit: number;
}

export interface NutrientSearchParams {
    keyword?: string;
    unit?: string;
    page?: number;
    size?: number;
    sortDirection?: 'ASC' | 'DESC';
}

export interface NutrientResponse {
    content: Nutrient[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

export const getNutrients = async (params: NutrientSearchParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.unit) queryParams.append('unit', params.unit);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const response = await fetch(`/api/nutrients?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch nutrients');
    }

    const data = await response.json();
    return data;
};

export const getNutrientById = async (id: number) => {
    const response = await fetch(`/api/nutrients/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch nutrient');
    }

    const data = await response.json();
    return data.data;
};

export const createNutrient = async (nutrient: NutrientRequest) => {
    const response = await fetch('/api/nutrients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutrient),
    });

    if (!response.ok) {
        throw new Error('Failed to create nutrient');
    }

    const data = await response.json();
    return data.data;
};

export const updateNutrient = async (id: number, nutrient: NutrientRequest) => {
    const response = await fetch(`/api/nutrients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutrient),
    });

    if (!response.ok) {
        throw new Error('Failed to update nutrient');
    }

    const data = await response.json();
    return data.data;
};

export const deleteNutrient = async (id: number) => {
    const response = await fetch(`/api/nutrients/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete nutrient');
    }

    const data = await response.json();
    return data;
};
