export interface RecipeIngredient {
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unitId: number;
}

export interface Recipe {
    id: number;
    name: string;
    description: string;
    price: number;
    prepTime: number; // in minutes
    servingSize: number;
    ingredients: RecipeIngredient[];
    totalCalories: number; // auto-calculated
    image?: string;
    category: 'main' | 'appetizer' | 'dessert' | 'drink' | 'side';
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: string;
    hasTrainingCourse: boolean;
}

export interface RecipeFormData {
    name: string;
    description: string;
    price: number;
    prepTime: number;
    servingSize: number;
    ingredients: RecipeIngredient[];
    image?: string;
    category: Recipe['category'];
    difficulty: Recipe['difficulty'];
}

export interface RecipeStats {
    totalRecipes: number;
    avgCalories: number;
    avgPrepTime: number;
    withTrainingCourse: number;
}
