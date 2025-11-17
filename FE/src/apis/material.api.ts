// Material Type interfaces
export interface MaterialType {
    id: number;
    name: string;
    isDeleted: boolean;
}

export interface CreateMaterialTypeRequest {
    name: string;
}

export interface UpdateMaterialTypeRequest {
    name: string;
}

// Material interfaces
export interface Material {
    id: number;
    name: string;
    quantity: number;
    caloriesPerUnit: number;
    unit: string;
    threshold: number;
    materialTypeId: number;
    materialTypeName: string;
    isDeleted: boolean;
}

export interface CreateMaterialRequest {
    name: string;
    caloriesPerUnit: number;
    unit: string;
    threshold: number;
    materialTypeId: number;
}

export interface UpdateMaterialRequest {
    name: string;
    caloriesPerUnit: number;
    unit: string;
    threshold: number;
    materialTypeId: number;
}

export interface MaterialSearchRequest {
    includeDeleted?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

export interface PaginatedMaterialResponse {
    status: number;
    desc: string;
    data: {
        content: Material[];
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        last: boolean;
        first: boolean;
        empty: boolean;
    };
}

// Warehouse interfaces
export interface Warehouse {
    id: number;
    address: string;
    isActive: boolean | null;
    branchId: number;
    branchName: string;
    branchAddress: string;
}

export interface CreateWarehouseRequest {
    address: string;
    branchId: number;
    isActive: boolean;
}

export interface UpdateWarehouseRequest {
    address: string;
    branchId: number;
    isActive: boolean;
}

// Warehouse Material interfaces
export interface WarehouseMaterial {
    materialId: number;
    materialName: string;
    materialTypeName: string;
    quantity: number;
    caloriesPerUnit: number;
    unit: string;
    threshold: number;
    warehouseId: number;
    warehouseAddress: string;
}

export interface AddMaterialsToWarehouseRequest {
    materials: {
        materialId: number;
        quantity: number;
    }[];
}

// ==================== Material Type API ====================

export async function getMaterialTypes(includeDeleted: boolean = false): Promise<MaterialType[]> {
    const response = await fetch(
        `/api/material-types?includeDeleted=${includeDeleted}`,
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch material types');
    }

    const result = await response.json();
    return result.data;
}

export async function createMaterialType(request: CreateMaterialTypeRequest): Promise<void> {
    const response = await fetch('/api/material-types', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create material type');
    }
}

export async function updateMaterialType(id: number, request: UpdateMaterialTypeRequest): Promise<void> {
    const response = await fetch(`/api/material-types/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update material type');
    }
}

export async function deleteMaterialType(id: number): Promise<void> {
    const response = await fetch(`/api/material-types/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete material type');
    }
}

// ==================== Material API ====================

export async function getMaterials(searchRequest?: MaterialSearchRequest): Promise<PaginatedMaterialResponse> {
    const params = new URLSearchParams();

    if (searchRequest) {
        if (searchRequest.includeDeleted !== undefined) params.append('includeDeleted', searchRequest.includeDeleted.toString());
        if (searchRequest.page !== undefined) params.append('page', searchRequest.page.toString());
        if (searchRequest.size !== undefined) params.append('size', searchRequest.size.toString());
        if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
        if (searchRequest.sortDirection) params.append('sortDirection', searchRequest.sortDirection);
    }

    const response = await fetch(
        `/api/materials?${params.toString()}`,
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch materials');
    }

    return response.json();
}

export async function createMaterial(request: CreateMaterialRequest): Promise<void> {
    const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create material');
    }
}

export async function updateMaterial(id: number, request: UpdateMaterialRequest): Promise<void> {
    const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update material');
    }
}

export async function deleteMaterial(id: number): Promise<void> {
    const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete material');
    }
}

// ==================== Warehouse API ====================

export async function getWarehouses(): Promise<Warehouse[]> {
    const response = await fetch('/api/warehouses', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch warehouses');
    }

    const result = await response.json();
    return result.data;
}

export async function createWarehouse(request: CreateWarehouseRequest): Promise<void> {
    const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create warehouse');
    }
}

export async function updateWarehouse(id: number, request: UpdateWarehouseRequest): Promise<void> {
    const response = await fetch(`/api/warehouses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update warehouse');
    }
}

// ==================== Warehouse Material API ====================

export async function getWarehouseMaterials(warehouseId: number): Promise<WarehouseMaterial[]> {
    const response = await fetch(`/api/warehouses/${warehouseId}/materials`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch warehouse materials');
    }

    const result = await response.json();
    return result.data;
}

export async function addMaterialsToWarehouse(
    warehouseId: number,
    request: AddMaterialsToWarehouseRequest
): Promise<void> {
    const response = await fetch(`/api/warehouses/${warehouseId}/materials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to add materials to warehouse');
    }
}
