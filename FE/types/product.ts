// Product and Menu types for Cơm Tấm customer portal
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    images?: string[]; // Multiple product images
    category: string;
    tags: string[];
    isPopular: boolean;
    isFeatured: boolean;
    isNew: boolean;
    isAvailable: boolean;
    rating: number;
    reviewCount: number;
    ingredients?: string[];
    allergens?: string[];
    spicyLevel?: 1 | 2 | 3 | 4 | 5;
    preparationTime: number; // minutes
    calories?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    nutritionInfo?: NutritionInfo;
    variants?: ProductVariant[]; // Size/options variations
}

export interface ProductVariant {
    id: string;
    name: string; // "Nhỏ", "Vừa", "Lớn"
    priceAdjustment: number; // + or - from base price
    isDefault?: boolean;
}

export interface NutritionInfo {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber: number; // grams
    sodium: number; // mg
}

export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    productCount: number;
    isActive: boolean;
    sortOrder: number;
}

// Cart types for customer shopping
export interface CartItem {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    variantId?: string;
    variant?: ProductVariant;
    specialInstructions?: string;
    addedAt: Date;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    couponCode?: string;
    estimatedDeliveryTime?: number; // minutes
}

// Review and Rating types
export interface ProductReview {
    id: string;
    productId: string;
    userId: string;
    user: {
        name: string;
        avatar?: string;
    };
    rating: number; // 1-5
    title: string;
    content: string;
    images?: string[];
    helpful: number; // helpful votes
    createdAt: Date;
    verifiedPurchase: boolean;
}

export interface ProductRating {
    average: number;
    total: number;
    breakdown: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

// Search and Filter types
export interface ProductFilters {
    categories?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
    ratings?: number; // minimum rating
    tags?: string[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    spicyLevel?: number[];
    sortBy?: 'name' | 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'newest';
}

export interface SearchResult {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    filters: ProductFilters;
    suggestions?: string[]; // search suggestions
}