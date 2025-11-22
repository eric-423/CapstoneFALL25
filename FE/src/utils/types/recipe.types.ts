/**
 * Recipe Management Types with BOM (Bill of Materials) Structure
 * Supports versioning, cost calculation, nutrition tracking, and publish workflow
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type RecipeStatus = 'draft' | 'qa' | 'published' | 'archived';
export type RecipeCategory = 'appetizer' | 'main' | 'side' | 'dessert' | 'beverage' | 'sauce' | 'combo';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type MeasurementUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'cup' | 'tbsp' | 'tsp' | 'pinch';

// Common allergens
export type Allergen =
    | 'gluten'
    | 'dairy'
    | 'eggs'
    | 'fish'
    | 'shellfish'
    | 'tree_nuts'
    | 'peanuts'
    | 'soy'
    | 'sesame'
    | 'none';

// ============================================================================
// BOM ITEM (Ingredient in Recipe)
// ============================================================================

export interface RecipeBOMItem {
    id: string;
    ingredientId: string; // Reference to Ingredient
    ingredientName: string;
    ingredientSku?: string;
    quantity: number;
    unit: MeasurementUnit;
    costPerUnit: number; // Cost of ingredient per unit
    totalCost: number; // quantity * costPerUnit (auto-calculated)

    // Nutritional values (per ingredient quantity in recipe)
    calories?: number;
    protein?: number; // grams
    carbs?: number; // grams
    fat?: number; // grams

    // Additional info
    isOptional: boolean;
    notes?: string;
    substituteIds?: string[]; // Alternative ingredient IDs
    preparationMethod?: string; // e.g., "diced", "minced", "sliced"
}

// ============================================================================
// RECIPE NUTRITION (Aggregate)
// ============================================================================

export interface RecipeNutrition {
    servingSize: string; // e.g., "1 bowl", "200g"
    servingsPerRecipe: number;

    // Per serving
    caloriesPerServing: number;
    proteinPerServing: number; // grams
    carbsPerServing: number; // grams
    fatPerServing: number; // grams
    fiberPerServing?: number; // grams
    sugarPerServing?: number; // grams
    sodiumPerServing?: number; // mg

    // Total for entire recipe
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;

    // Allergen warnings
    allergens: Allergen[];
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isHalal?: boolean;
}

// ============================================================================
// RECIPE STEP (Instructions)
// ============================================================================

export interface RecipeStep {
    stepNumber: number;
    title: string;
    instruction: string;
    durationMinutes?: number; // Time for this step
    imageUrl?: string;
    videoUrl?: string;
    criticalControlPoint?: boolean; // HACCP compliance
    temperature?: number; // For cooking steps (°C)
    equipment?: string[]; // Required equipment for this step
}

// ============================================================================
// RECIPE VERSION (Version Control)
// ============================================================================

export interface RecipeVersion {
    versionNumber: string; // e.g., "1.0", "1.1", "2.0"
    status: RecipeStatus;
    createdBy: string;
    createdAt: string;
    publishedBy?: string;
    publishedAt?: string;
    changeLog: string; // Description of changes

    // Snapshot of recipe at this version
    bom: RecipeBOMItem[];
    steps: RecipeStep[];
    nutrition: RecipeNutrition;
    totalCost: number;

    // QA tracking
    qaApprovedBy?: string;
    qaApprovedAt?: string;
    qaComments?: string;
}

// ============================================================================
// RECIPE (Main Entity)
// ============================================================================

export interface Recipe {
    id: string;
    name: string;
    nameEn?: string; // English name
    sku: string; // Unique SKU for recipe
    description: string;
    category: RecipeCategory;
    difficulty: RecipeDifficulty;

    // Current version (active)
    currentVersion: string; // e.g., "2.1"
    status: RecipeStatus;

    // BOM (Bill of Materials) - Current version's ingredients
    bom: RecipeBOMItem[];

    // Preparation details
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    totalTimeMinutes: number; // prep + cook
    steps: RecipeStep[];

    // Costing (auto-calculated from BOM)
    totalIngredientCost: number; // Sum of all BOM items
    laborCostPerUnit?: number; // Cost of labor to make
    overheadCostPerUnit?: number; // Allocated overhead
    totalCostPerUnit: number; // Total cost to produce
    suggestedPrice?: number; // Recommended selling price
    profitMargin?: number; // Percentage

    // Nutrition (auto-calculated from BOM)
    nutrition: RecipeNutrition;

    // Media
    imageUrl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;

    // Tags & categorization
    tags: string[]; // e.g., ['spicy', 'popular', 'signature']
    cuisine?: string; // e.g., 'Vietnamese', 'Thai', 'Japanese'
    mealType?: string[]; // e.g., ['lunch', 'dinner']

    // Versioning
    versions: RecipeVersion[]; // Historical versions

    // Metadata
    isActive: boolean;
    isPopular: boolean;
    isSeasonal: boolean;
    seasonalMonths?: number[]; // [1,2,3] for Jan-Mar

    // Training & compliance
    requiresTraining: boolean; // Staff must complete training
    trainingModuleId?: string;
    complianceNotes?: string; // Food safety, HACCP notes

    // Analytics
    popularityScore?: number; // 0-100
    customerRating?: number; // Average rating
    totalOrders?: number; // How many times ordered

    // Timestamps
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    publishedAt?: string;
    lastUsedAt?: string; // Last time used in an order
}

// ============================================================================
// RECIPE FILTERS & SEARCH
// ============================================================================

export interface RecipeFilters {
    search?: string;
    category?: RecipeCategory[];
    status?: RecipeStatus[];
    difficulty?: RecipeDifficulty[];
    allergens?: Allergen[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    maxPrepTime?: number;
    maxCost?: number;
    tags?: string[];
}

// ============================================================================
// RECIPE COST CALCULATION
// ============================================================================

export interface RecipeCostBreakdown {
    ingredientsCost: number;
    laborCost: number;
    overheadCost: number;
    packagingCost?: number;
    totalCost: number;
    suggestedPrice: number;
    profitMargin: number; // percentage
    profitAmount: number; // actual amount
}

// ============================================================================
// RECIPE VALIDATION
// ============================================================================

export interface RecipeValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    missingIngredients: string[]; // Ingredient IDs that don't exist
    nutritionCalculated: boolean;
    costCalculated: boolean;
    hasSteps: boolean;
    hasBOM: boolean;
}

// ============================================================================
// PUBLISH WORKFLOW
// ============================================================================

export interface RecipePublishRequest {
    recipeId: string;
    version: string;
    requestedBy: string;
    requestedAt: string;
    targetStatus: RecipeStatus; // draft → qa → published
    notes?: string;
    reviewers?: string[]; // User IDs who need to approve
}

export interface RecipePublishHistory {
    id: string;
    recipeId: string;
    version: string;
    fromStatus: RecipeStatus;
    toStatus: RecipeStatus;
    changedBy: string;
    changedAt: string;
    reason?: string;
    approvedBy?: string;
    rejectedBy?: string;
    comments?: string;
}

// ============================================================================
// HELPER FUNCTIONS TYPE DEFINITIONS
// ============================================================================

export interface RecipeCostCalculator {
    calculateBOMCost: (bom: RecipeBOMItem[]) => number;
    calculateTotalCost: (recipe: Recipe) => RecipeCostBreakdown;
    calculateProfitMargin: (cost: number, price: number) => number;
}

export interface RecipeNutritionCalculator {
    calculateTotalNutrition: (bom: RecipeBOMItem[]) => RecipeNutrition;
    calculatePerServing: (total: RecipeNutrition, servings: number) => RecipeNutrition;
    detectAllergens: (bom: RecipeBOMItem[]) => Allergen[];
}

// ============================================================================
// RECIPE SUMMARY (For Lists/Tables)
// ============================================================================

export interface RecipeSummary {
    id: string;
    name: string;
    sku: string;
    category: RecipeCategory;
    status: RecipeStatus;
    difficulty: RecipeDifficulty;
    currentVersion: string;
    totalCost: number;
    suggestedPrice?: number;
    totalTimeMinutes: number;
    imageUrl?: string;
    isPopular: boolean;
    updatedAt: string;
}
