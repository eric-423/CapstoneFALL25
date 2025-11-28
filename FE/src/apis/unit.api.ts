export interface Unit {
    id: number;
    name: string;
    symbols: string;
    isDeleted?: boolean;
}

export interface CreateUnitRequest {
    name: string;
    symbols: string;
}

export interface UpdateUnitRequest {
    name: string;
    symbols: string;
}

export async function getUnits(): Promise<Unit[]> {
    const response = await fetch('/api/units', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch units');
    }

    const result = await response.json();
    return result.data;
}

export async function createUnit(request: CreateUnitRequest): Promise<Unit> {
    const response = await fetch('/api/units', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create unit');
    }

    const result = await response.json();
    return result.data;
}

export async function updateUnit(id: number, request: UpdateUnitRequest): Promise<void> {
    const response = await fetch(`/api/units/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update unit');
    }
}

export async function deleteUnit(id: number): Promise<void> {
    const response = await fetch(`/api/units/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete unit');
    }

    const result = await response.json();
    if (result.status !== 200) {
        throw new Error(result.desc || 'Failed to delete unit');
    }
}
