export interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    unit: 'kg' | 'g' | 'ml' | 'l' | 'piece' | 'pack';
    supplier: string;
    caloriePerUnit: number; // calories per 100g or 100ml
    cost: number; // cost per unit
    threshold: number; // minimum stock level
    lastUpdated: string; // ISO date string
    category: 'vegetable' | 'meat' | 'seafood' | 'spice' | 'grain' | 'dairy' | 'other';
    image?: string;
}

export interface IngredientFormData {
    name: string;
    quantity: number;
    unit: Ingredient['unit'];
    supplier: string;
    caloriePerUnit: number;
    cost: number;
    threshold: number;
    category: Ingredient['category'];
    image?: string;
}

export interface IngredientStats {
    totalIngredients: number;
    lowStockCount: number;
    totalValue: number;
    categoriesCount: number;
}
