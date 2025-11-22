/**
 * Recipe Cost & Nutrition Calculation Helpers
 * Auto-calculate costs, nutrition, and allergens from BOM
 */

import {
    Recipe,
    RecipeBOMItem,
    RecipeNutrition,
    RecipeCostBreakdown,
    Allergen,
} from '@/utils/types/recipe.types';

// ============================================================================
// COST CALCULATIONS
// ============================================================================

/**
 * Calculate total cost from BOM items
 */
export function calculateBOMCost(bom: RecipeBOMItem[]): number {
    return bom.reduce((total, item) => {
        const itemCost = item.quantity * item.costPerUnit;
        return total + itemCost;
    }, 0);
}

/**
 * Calculate complete recipe cost breakdown
 */
export function calculateRecipeCost(recipe: Recipe): RecipeCostBreakdown {
    const ingredientsCost = calculateBOMCost(recipe.bom);
    const laborCost = recipe.laborCostPerUnit || 0;
    const overheadCost = recipe.overheadCostPerUnit || 0;
    const packagingCost = 0; // Can be added later

    const totalCost = ingredientsCost + laborCost + overheadCost + packagingCost;
    const suggestedPrice = recipe.suggestedPrice || totalCost * 3; // 3x markup default
    const profitAmount = suggestedPrice - totalCost;
    const profitMargin = totalCost > 0 ? (profitAmount / suggestedPrice) * 100 : 0;

    return {
        ingredientsCost,
        laborCost,
        overheadCost,
        packagingCost,
        totalCost,
        suggestedPrice,
        profitMargin,
        profitAmount,
    };
}

/**
 * Calculate profit margin percentage
 */
export function calculateProfitMargin(cost: number, price: number): number {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
}

/**
 * Update BOM item total cost
 */
export function updateBOMItemCost(item: RecipeBOMItem): RecipeBOMItem {
    return {
        ...item,
        totalCost: item.quantity * item.costPerUnit,
    };
}

// ============================================================================
// NUTRITION CALCULATIONS
// ============================================================================

/**
 * Calculate total nutrition from BOM
 */
export function calculateTotalNutrition(bom: RecipeBOMItem[]): {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
} {
    return bom.reduce(
        (totals, item) => ({
            totalCalories: totals.totalCalories + (item.calories || 0),
            totalProtein: totals.totalProtein + (item.protein || 0),
            totalCarbs: totals.totalCarbs + (item.carbs || 0),
            totalFat: totals.totalFat + (item.fat || 0),
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
}

/**
 * Calculate per-serving nutrition
 */
export function calculatePerServingNutrition(
    totals: { totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number },
    servings: number
): {
    caloriesPerServing: number;
    proteinPerServing: number;
    carbsPerServing: number;
    fatPerServing: number;
} {
    if (servings === 0) {
        return {
            caloriesPerServing: 0,
            proteinPerServing: 0,
            carbsPerServing: 0,
            fatPerServing: 0,
        };
    }

    return {
        caloriesPerServing: Math.round(totals.totalCalories / servings),
        proteinPerServing: Math.round((totals.totalProtein / servings) * 10) / 10,
        carbsPerServing: Math.round((totals.totalCarbs / servings) * 10) / 10,
        fatPerServing: Math.round((totals.totalFat / servings) * 10) / 10,
    };
}

/**
 * Create complete nutrition info for recipe
 */
export function calculateRecipeNutrition(
    bom: RecipeBOMItem[],
    servingsPerRecipe: number,
    servingSize: string
): RecipeNutrition {
    const totals = calculateTotalNutrition(bom);
    const perServing = calculatePerServingNutrition(totals, servingsPerRecipe);

    // Detect allergens from BOM
    const allergens = detectAllergens(bom);

    return {
        servingSize,
        servingsPerRecipe,
        ...perServing,
        ...totals,
        allergens,
        isVegetarian: false, // Would need to check ingredient properties
        isVegan: false,
        isGlutenFree: !allergens.includes('gluten'),
    };
}

// ============================================================================
// ALLERGEN DETECTION
// ============================================================================

/**
 * Detect allergens from BOM items
 * In real app, this would check ingredient database
 */
export function detectAllergens(bom: RecipeBOMItem[]): Allergen[] {
    const allergenSet = new Set<Allergen>();

    // In production, would query ingredient database for allergen info
    // For now, simple name-based detection
    bom.forEach((item) => {
        const name = item.ingredientName.toLowerCase();

        if (name.includes('wheat') || name.includes('flour') || name.includes('bread')) {
            allergenSet.add('gluten');
        }
        if (name.includes('milk') || name.includes('cheese') || name.includes('butter') || name.includes('cream')) {
            allergenSet.add('dairy');
        }
        if (name.includes('egg')) {
            allergenSet.add('eggs');
        }
        if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) {
            allergenSet.add('fish');
        }
        if (name.includes('shrimp') || name.includes('crab') || name.includes('lobster')) {
            allergenSet.add('shellfish');
        }
        if (name.includes('peanut')) {
            allergenSet.add('peanuts');
        }
        if (name.includes('soy') || name.includes('tofu')) {
            allergenSet.add('soy');
        }
        if (name.includes('sesame')) {
            allergenSet.add('sesame');
        }
    });

    return Array.from(allergenSet);
}

// ============================================================================
// RECIPE VERSION COMPARISON
// ============================================================================

/**
 * Compare two BOM lists to find changes
 */
export interface BOMDiff {
    added: RecipeBOMItem[];
    removed: RecipeBOMItem[];
    modified: Array<{
        old: RecipeBOMItem;
        new: RecipeBOMItem;
        changes: string[];
    }>;
}

export function compareBOM(oldBOM: RecipeBOMItem[], newBOM: RecipeBOMItem[]): BOMDiff {
    const oldMap = new Map(oldBOM.map((item) => [item.ingredientId, item]));
    const newMap = new Map(newBOM.map((item) => [item.ingredientId, item]));

    const added: RecipeBOMItem[] = [];
    const removed: RecipeBOMItem[] = [];
    const modified: BOMDiff['modified'] = [];

    // Find added items
    newBOM.forEach((item) => {
        if (!oldMap.has(item.ingredientId)) {
            added.push(item);
        }
    });

    // Find removed items
    oldBOM.forEach((item) => {
        if (!newMap.has(item.ingredientId)) {
            removed.push(item);
        }
    });

    // Find modified items
    newBOM.forEach((newItem) => {
        const oldItem = oldMap.get(newItem.ingredientId);
        if (oldItem) {
            const changes: string[] = [];

            if (oldItem.quantity !== newItem.quantity) {
                changes.push(`Quantity: ${oldItem.quantity} → ${newItem.quantity}`);
            }
            if (oldItem.unit !== newItem.unit) {
                changes.push(`Unit: ${oldItem.unit} → ${newItem.unit}`);
            }
            if (oldItem.costPerUnit !== newItem.costPerUnit) {
                changes.push(`Cost: ${oldItem.costPerUnit} → ${newItem.costPerUnit}`);
            }

            if (changes.length > 0) {
                modified.push({ old: oldItem, new: newItem, changes });
            }
        }
    });

    return { added, removed, modified };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate recipe has all required data
 */
export function validateRecipe(recipe: Recipe): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!recipe.name) errors.push('Recipe name is required');
    if (!recipe.sku) errors.push('Recipe SKU is required');
    if (recipe.bom.length === 0) errors.push('Recipe must have at least one ingredient');
    if (recipe.steps.length === 0) errors.push('Recipe must have at least one step');

    // Warnings
    if (!recipe.imageUrl) warnings.push('Recipe image is recommended');
    if (recipe.totalCostPerUnit === 0) warnings.push('Recipe cost should be calculated');
    if (!recipe.suggestedPrice) warnings.push('Suggested price is recommended');

    // BOM validation
    recipe.bom.forEach((item, index) => {
        if (item.quantity <= 0) {
            errors.push(`BOM item ${index + 1}: Quantity must be greater than 0`);
        }
        if (item.costPerUnit < 0) {
            errors.push(`BOM item ${index + 1}: Cost cannot be negative`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
