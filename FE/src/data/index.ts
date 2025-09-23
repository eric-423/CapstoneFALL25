// Export all mock data and constants
export * from './products';
export * from './promotions';
export * from './blog';
export * from './constants';

// Re-export types for convenience
export type {
    Product,
    Category
} from './products';

export type {
    Promotion,
    Coupon
} from './promotions';

export type {
    BlogPost,
    BlogCategory
} from './blog';

export type {
    OrderStatus,
    PaymentStatus,
    UserRole
} from './constants';