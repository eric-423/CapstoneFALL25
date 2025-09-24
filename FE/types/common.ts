// Common types and utilities for Cơm Tấm customer portal
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: ValidationError[];
    meta?: ResponseMeta;
}

export interface ResponseMeta {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
}

export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
    query?: string;
    filters?: Record<string, unknown>;
}

// UI and Form types
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: string;
}

export interface FormFieldError {
    field: string;
    message: string;
}

export interface LoadingState {
    isLoading: boolean;
    error?: string | null;
    lastUpdated?: Date;
}

export interface AsyncData<T> extends LoadingState {
    data: T | null;
}

// Notification and toast types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number; // milliseconds, 0 = permanent
    actions?: NotificationAction[];
    createdAt: Date;
}

export interface NotificationAction {
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
}

// Location and geography types
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Location {
    coordinates: Coordinates;
    address: string;
    city: string;
    district: string;
    ward: string;
    province: string;
}

export interface DeliveryZone {
    id: string;
    name: string;
    boundaries: Coordinates[];
    deliveryFee: number;
    estimatedTime: number; // minutes
    isActive: boolean;
}

// File upload types
export interface FileUpload {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    url?: string;
    error?: string;
}

export interface ImageUpload extends FileUpload {
    preview: string;
    width?: number;
    height?: number;
}

// Theme and UI customization
export interface Theme {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    fontFamily: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface UIPreferences {
    theme: Theme;
    language: 'vi' | 'en';
    currency: 'VND' | 'USD';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    showTooltips: boolean;
    reducedMotion: boolean;
}

// Analytics and tracking
export interface AnalyticsEvent {
    event: string;
    category: string;
    action: string;
    label?: string;
    value?: number;
    userId?: string;
    sessionId?: string;
    timestamp: Date;
    properties?: Record<string, unknown>;
}

export interface UserActivity {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
    ip: string;
    userAgent: string;
    timestamp: Date;
}

// Error handling
export interface AppError {
    code: string;
    message: string;
    details?: string;
    field?: string;
    statusCode?: number;
    timestamp: Date;
    userId?: string;
    sessionId?: string;
    requestId?: string;
}

export type ErrorBoundaryState = {
    hasError: boolean;
    error?: Error;
    errorInfo?: Record<string, unknown>;
};

// Feature flags and configuration
export interface FeatureFlag {
    key: string;
    enabled: boolean;
    rolloutPercentage?: number;
    userSegments?: string[];
    startDate?: Date;
    endDate?: Date;
}

export interface AppConfig {
    apiUrl: string;
    cdnUrl: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    features: Record<string, FeatureFlag>;
    analytics: {
        googleAnalytics?: string;
        facebookPixel?: string;
        hotjar?: string;
    };
    payments: {
        momo: boolean;
        zalopay: boolean;
        vnpay: boolean;
        cash: boolean;
    };
    delivery: {
        maxDistance: number; // km
        freeDeliveryThreshold: number; // VND
        baseFee: number; // VND
    };
}

// Utility types
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOf<T> = T[keyof T];

export type StringKeys<T> = Extract<keyof T, string>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;