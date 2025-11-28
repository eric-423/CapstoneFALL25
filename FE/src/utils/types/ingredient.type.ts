export interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    unitId: number;
    supplier: string;
    caloriePerUnit: number; // calories per unit
    cost: number; // cost per unit
    lastUpdated: string; // ISO date string
    category: 'vegetable' | 'meat' | 'seafood' | 'spice' | 'grain' | 'dairy' | 'other';
    image?: string;
}

export interface IngredientFormData {
    name: string;
    quantity: number;
    unitId: number;
    supplier: string;
    caloriePerUnit: number;
    cost: number;
    category: Ingredient['category'];
    image?: string;
}

export interface IngredientStats {
    totalIngredients: number;
    lowStockCount: number;
    totalValue: number;
    categoriesCount: number;
}
