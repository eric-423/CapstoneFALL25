import { Nutrient } from './nutrient.api';

export interface MaterialNutrient {
    materialId: number;
    nutrientId: number;
    nutrient: Nutrient;
    amountPer100Unit: number;
}

export interface MaterialNutrientRequest {
    nutrientId: number;
    amountPer100Unit: number;
    state?: string; // Optional, backend seems to have it
}

export interface MaterialNutrientSearchParams {
    materialId?: number;
    nutrientId?: number;
    page?: number;
    size?: number;
    sortDirection?: 'ASC' | 'DESC';
}

export interface MaterialNutrientResponse {
    content: MaterialNutrient[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

export const getMaterialNutrients = async (params: MaterialNutrientSearchParams = {}): Promise<MaterialNutrientResponse> => {
    const queryParams = new URLSearchParams();
    if (params.materialId) queryParams.append('materialId', params.materialId.toString());
    if (params.nutrientId) queryParams.append('nutrientId', params.nutrientId.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const response = await fetch(`/api/material-nutrients?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch material nutrients');
    }

    const data = await response.json();
    return data;
};

export const updateManyMaterialNutrients = async (materialId: number, nutrients: MaterialNutrientRequest[]) => {
    const response = await fetch(`/api/material-nutrients/${materialId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutrients),
    });

    if (!response.ok) {
        throw new Error('Failed to update material nutrients');
    }

    const data = await response.json();
    return data.data;
};

export const deleteMaterialNutrient = async (materialId: number, nutrientId: number) => {
    const response = await fetch(`/api/material-nutrients/${materialId}/${nutrientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete material nutrient');
    }

    const data = await response.json();
    return data;
};
