
export interface CookingMethodNutrient {
    cookingMethodId: number;
    cookingMethodName: string;
    nutrientId: number;
    nutrientName: string;
    retentionFactor: number;
}

export interface CookingMethodNutrientRequest {
    cookingMethodId: number;
    nutrientId: number;
    retentionFactor: number;
}

export const getAllCookingMethodNutrients = async () => {
    const response = await fetch('/api/cooking-method-nutrients', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cooking method nutrients');
    }

    const data = await response.json();
    return data.data as CookingMethodNutrient[];
};

export const getCookingMethodNutrientById = async (cookingMethodId: number, nutrientId: number) => {
    const response = await fetch(`/api/cooking-method-nutrients/${cookingMethodId}/${nutrientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cooking method nutrient');
    }

    const data = await response.json();
    return data.data as CookingMethodNutrient;
};

export const createCookingMethodNutrient = async (request: CookingMethodNutrientRequest) => {
    const response = await fetch('/api/cooking-method-nutrients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create cooking method nutrient');
    }

    const data = await response.json();
    return data.data;
};

export const updateCookingMethodNutrient = async (cookingMethodId: number, nutrientId: number, request: CookingMethodNutrientRequest) => {
    const response = await fetch(`/api/cooking-method-nutrients/${cookingMethodId}/${nutrientId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update cooking method nutrient');
    }

    const data = await response.json();
    return data.data;
};

export const deleteCookingMethodNutrient = async (cookingMethodId: number, nutrientId: number) => {
    const response = await fetch(`/api/cooking-method-nutrients/${cookingMethodId}/${nutrientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete cooking method nutrient');
    }

    const data = await response.json();
    return data;
};
