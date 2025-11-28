// Utensil Type interfaces
export interface UtensilType {
    id: number;
    name: string;
    description: string;
}

export interface CreateUtensilTypeRequest {
    name: string;
    description: string;
}

export interface UpdateUtensilTypeRequest {
    name: string;
    description: string;
}

// Cooking Utensil interfaces
export interface CookingUtensil {
    id: number;
    name: string;
    quantity: number;
    utensilsTypeId: number;
    utensilsTypeName: string;
    warehouseId: number;
    warehouseName: string;
}

export interface CreateCookingUtensilRequest {
    name: string;
    quantity: number;
    utensilsTypeId: number;
    warehouseId: number;
}

export interface UpdateCookingUtensilRequest {
    name: string;
    quantity: number;
    utensilsTypeId: number;
    warehouseId: number;
}

export interface CookingUtensilSearchRequest {
    keyword?: string;
    utensilsTypeId?: number;
    warehouseId?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

export interface PaginatedCookingUtensilResponse {
    status: number;
    desc: string;
    data: {
        content: CookingUtensil[];
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        last: boolean;
        first: boolean;
        empty: boolean;
    };
}

// ==================== Utensil Type API ====================

export async function getUtensilTypes(includeDeleted: boolean = false): Promise<UtensilType[]> {
    // Note: Backend doesn't support includeDeleted for UtensilTypes based on controller analysis, 
    // but keeping the parameter for now if needed or if search request supports it implicitly.
    // The controller takes UtensilTypeSearchRequest.
    const response = await fetch(
        `/api/utensils-types`,
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch utensil types');
    }

    const result = await response.json();
    return result.data.content || result.data;
}

export async function createUtensilType(request: CreateUtensilTypeRequest): Promise<UtensilType> {
    const response = await fetch('/api/utensils-types', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create utensil type');
    }

    const result = await response.json();
    return result.data;
}

export async function updateUtensilType(id: number, request: UpdateUtensilTypeRequest): Promise<void> {
    const response = await fetch(`/api/utensils-types/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update utensil type');
    }
}

export async function deleteUtensilType(id: number): Promise<void> {
    const response = await fetch(`/api/utensils-types/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete utensil type');
    }
}

// ==================== Cooking Utensil API ====================

export async function getCookingUtensils(params: CookingUtensilSearchRequest = {}): Promise<PaginatedCookingUtensilResponse> {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.utensilsTypeId !== undefined) queryParams.append('utensilsTypeId', params.utensilsTypeId.toString());
    if (params.warehouseId !== undefined) queryParams.append('warehouseId', params.warehouseId.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const response = await fetch(`/api/cooking-utensils?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cooking utensils');
    }

    return await response.json();
}

export async function getCookingUtensil(id: number): Promise<CookingUtensil> {
    const response = await fetch(`/api/cooking-utensils/${id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cooking utensil');
    }

    const result = await response.json();
    return result.data;
}

export async function createCookingUtensil(request: CreateCookingUtensilRequest): Promise<CookingUtensil> {
    const response = await fetch('/api/cooking-utensils', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create cooking utensil');
    }

    const result = await response.json();
    return result.data;
}

export async function updateCookingUtensil(id: number, request: UpdateCookingUtensilRequest): Promise<void> {
    const response = await fetch(`/api/cooking-utensils/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update cooking utensil');
    }
}

export async function deleteCookingUtensil(id: number): Promise<void> {
    const response = await fetch(`/api/cooking-utensils/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete cooking utensil');
    }
}
