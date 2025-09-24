// Export all types for easy importing
export * from './product';
export * from './user';
export * from './order';
export * from './common';

// Re-export commonly used types for convenience
export type {
    Product,
    Category,
    CartItem,
    Cart,
    ProductFilters,
    SearchResult
} from './product';

export type {
    User,
    Address,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    AuthState
} from './user';

export type {
    Order,
    OrderItem,
    OrderStatus,
    PaymentStatus,
    PaymentMethod,
    CreateOrderRequest,
    OrderTrackingInfo
} from './order';

export type {
    ApiResponse,
    ResponseMeta,
    LoadingState,
    AsyncData,
    Notification,
    NotificationType,
    SelectOption,
    FormFieldError
} from './common';