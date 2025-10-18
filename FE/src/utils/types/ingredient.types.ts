/**
 * Ingredient Management TypeScript Types
 * For F&B Restaurant Management System
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum IngredientCategory {
    MEAT = 'meat',
    SEAFOOD = 'seafood',
    VEGETABLE = 'vegetable',
    FRUIT = 'fruit',
    GRAIN = 'grain',
    DAIRY = 'dairy',
    SPICE = 'spice',
    OIL = 'oil',
    SAUCE = 'sauce',
    BEVERAGE = 'beverage',
    OTHER = 'other',
}

export enum IngredientUnit {
    // Weight
    KG = 'kg',
    G = 'g',
    MG = 'mg',
    // Volume
    L = 'l',
    ML = 'ml',
    // Count
    PIECE = 'piece',
    PACK = 'pack',
    BOX = 'box',
    BAG = 'bag',
    CAN = 'can',
    BOTTLE = 'bottle',
}

export enum IngredientStatus {
    ACTIVE = 'active',
    DISCONTINUED = 'discontinued',
    OUT_OF_STOCK = 'out_of_stock',
    LOW_STOCK = 'low_stock',
}

export enum StorageCondition {
    FROZEN = 'frozen', // < -18°C
    REFRIGERATED = 'refrigerated', // 0-4°C
    COOL = 'cool', // 8-15°C
    ROOM_TEMP = 'room_temp', // 15-25°C
    DRY = 'dry', // Khô ráo
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface Ingredient {
    id: string;
    name: string;
    nameEn?: string;
    sku?: string; // Stock Keeping Unit
    barcode?: string;
    qrCode?: string;

    // Category & Classification
    category: IngredientCategory;
    subcategory?: string;
    tags?: string[];

    // Units & Conversion
    baseUnit: IngredientUnit; // Unit cơ bản (kg, l, piece)
    unitConversions?: UnitConversion[]; // Chuyển đổi giữa các đơn vị

    // Storage & Handling
    storageCondition: StorageCondition;
    shelfLifeDays?: number; // Hạn sử dụng (ngày)

    // Nutritional Info (per 100g/100ml)
    caloriesPer100?: number;
    proteinPer100?: number;
    carbsPer100?: number;
    fatPer100?: number;
    allergens?: string[]; // ['gluten', 'dairy', 'nuts']

    // Costing
    costPerUnit: number; // Giá mua/đơn vị cơ bản
    currency: string; // VND, USD

    // Supplier
    primarySupplier?: Supplier;
    alternativeSuppliers?: Supplier[];

    // Status
    status: IngredientStatus;
    isActive: boolean;

    // Images
    imageUrl?: string;
    images?: string[];

    // Metadata
    description?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface UnitConversion {
    fromUnit: IngredientUnit;
    toUnit: IngredientUnit;
    factor: number; // Hệ số chuyển đổi (1 kg = 1000 g → factor = 1000)
    description?: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    leadTimeDays?: number; // Thời gian giao hàng (ngày)
    minOrderAmount?: number;
    paymentTerms?: string; // 'COD', 'Net 30', 'Net 60'
    rating?: number; // 1-5
    isActive: boolean;
    notes?: string;
    createdAt: string;
}

export interface IngredientInventory {
    id: string;
    ingredientId: string;
    branchId: string;
    branchName: string;

    // Stock Levels
    currentStock: number;
    unit: IngredientUnit;
    minStock: number; // Ngưỡng tối thiểu
    maxStock: number; // Ngưỡng tối đa
    reorderPoint: number; // Điểm đặt hàng lại
    reorderQuantity: number; // Số lượng đặt hàng mỗi lần

    // Value
    totalValue: number; // Tổng giá trị tồn kho

    // Status
    status: 'adequate' | 'low' | 'critical' | 'overstock';
    lastStockTakeDate?: string;

    // Location
    storageLocation?: string; // 'Kho lạnh A1', 'Kệ B3'

    updatedAt: string;
}

export interface IngredientBatch {
    id: string;
    ingredientId: string;
    branchId: string;

    // Batch Info
    batchNumber: string;
    lotNumber?: string;

    // Quantity
    quantity: number;
    unit: IngredientUnit;
    remainingQuantity: number;

    // Dates
    receivedDate: string;
    manufactureDate?: string;
    expiryDate?: string;

    // Supplier
    supplierId: string;
    supplierName: string;

    // Costing
    costPerUnit: number;
    totalCost: number;

    // Status
    status: 'active' | 'expired' | 'recalled' | 'depleted';

    // Quality
    qualityCheckPassed?: boolean;
    qualityNotes?: string;

    // Storage
    storageLocation?: string;

    // Traceability
    receivedBy?: string;
    notes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface IngredientUsage {
    id: string;
    ingredientId: string;
    ingredientName: string;

    // Used in which recipes
    recipes: RecipeUsage[];

    // Usage Statistics
    totalUsageLastMonth: number;
    totalUsageLast3Months: number;
    averageDailyUsage: number;

    // Forecasting
    forecastedUsageNextMonth?: number;
    suggestedOrderQuantity?: number;
}

export interface RecipeUsage {
    recipeId: string;
    recipeName: string;
    quantityNeeded: number;
    unit: IngredientUnit;
    isOptional: boolean;
}

export interface IngredientTransaction {
    id: string;
    ingredientId: string;
    branchId: string;

    // Transaction Type
    type: 'purchase' | 'usage' | 'waste' | 'transfer' | 'adjustment' | 'return';

    // Quantity
    quantity: number;
    unit: IngredientUnit;

    // Related Info
    relatedBatchId?: string;
    relatedOrderId?: string;
    relatedRecipeId?: string;
    relatedTransferId?: string;

    // Costing
    costPerUnit?: number;
    totalCost?: number;

    // Details
    reason?: string;
    notes?: string;

    // Metadata
    performedBy: string;
    performedAt: string;
    createdAt: string;
}

export interface IngredientAlert {
    id: string;
    ingredientId: string;
    ingredientName: string;
    branchId: string;
    branchName: string;

    // Alert Type
    type: 'low_stock' | 'critical_stock' | 'expiring_soon' | 'expired' | 'overstock' | 'no_supplier';
    severity: 'info' | 'warning' | 'critical';

    // Message
    title: string;
    message: string;

    // Status
    isRead: boolean;
    isResolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface IngredientFilters {
    search?: string;
    category?: IngredientCategory[];
    status?: IngredientStatus[];
    branchId?: string;
    supplierId?: string;
    stockLevel?: 'all' | 'low' | 'critical' | 'adequate' | 'overstock';
    expiryWithinDays?: number; // Show items expiring within X days
}

export interface IngredientStats {
    totalIngredients: number;
    activeIngredients: number;
    lowStockCount: number;
    criticalStockCount: number;
    expiringWithin7Days: number;
    totalInventoryValue: number;
    categoryCounts: Record<IngredientCategory, number>;
}

// ============================================================================
// UNIT CONVERSION UTILITIES
// ============================================================================

export const COMMON_CONVERSIONS: UnitConversion[] = [
    // Weight
    { fromUnit: IngredientUnit.KG, toUnit: IngredientUnit.G, factor: 1000 },
    { fromUnit: IngredientUnit.G, toUnit: IngredientUnit.MG, factor: 1000 },

    // Volume
    { fromUnit: IngredientUnit.L, toUnit: IngredientUnit.ML, factor: 1000 },
];

export function convertUnit(
    quantity: number,
    fromUnit: IngredientUnit,
    toUnit: IngredientUnit,
    customConversions?: UnitConversion[]
): number | null {
    if (fromUnit === toUnit) return quantity;

    const conversions = [...COMMON_CONVERSIONS, ...(customConversions || [])];

    // Find direct conversion
    const directConversion = conversions.find(
        c => c.fromUnit === fromUnit && c.toUnit === toUnit
    );

    if (directConversion) {
        return quantity * directConversion.factor;
    }

    // Find reverse conversion
    const reverseConversion = conversions.find(
        c => c.fromUnit === toUnit && c.toUnit === fromUnit
    );

    if (reverseConversion) {
        return quantity / reverseConversion.factor;
    }

    // No conversion found
    return null;
}
