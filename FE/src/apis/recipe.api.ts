import { Material } from './material.api';
import { CookingMethod } from './cooking-method.api';

export interface ProductRecipes {
    id: number;
    productId: number;
    material: Material;
    cookingMethod: CookingMethod;
    quantity: number;
    orderStep: number;
    createdAt: string;
}

export interface ProductRecipesRequestForMany {
    materialId: number;
    cookingMethodId: number;
    quantity: number;
    orderStep: number;
}

export const getRecipesByProductId = async (productId: number) => {
    const response = await fetch(`/api/recipes/product/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    return data.data; // Backend returns { data: [...] }
};

export const updateManyRecipes = async (productId: number, recipes: ProductRecipesRequestForMany[]) => {
    const response = await fetch(`/api/recipes/update-many/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipes),
    });

    if (!response.ok) {
        throw new Error('Failed to update recipes');
    }

    const data = await response.json();
    return data.data;
};
