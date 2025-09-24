// User and Customer types for Cơm Tấm customer portal
export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    preferences?: UserPreferences;
    loyalty?: LoyaltyInfo;
    addresses: Address[];
    defaultAddressId?: string;
    isVerified: boolean;
    createdAt: Date;
    lastLoginAt?: Date;
}

export interface UserPreferences {
    language: 'vi' | 'en';
    currency: 'VND' | 'USD';
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        promotions: boolean;
        orderUpdates: boolean;
    };
    dietary: {
        isVegetarian: boolean;
        isVegan: boolean;
        isGlutenFree: boolean;
        allergens: string[];
    };
    spicyTolerance?: 1 | 2 | 3 | 4 | 5;
}

export interface LoyaltyInfo {
    level: 'bronze' | 'silver' | 'gold' | 'diamond';
    points: number;
    totalSpent: number;
    nextLevelPoints?: number;
    benefits: string[];
}

export interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    label?: string; // "Nhà riêng", "Văn phòng"
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    ward: string; // Phường/Xã
    district: string; // Quận/Huyện
    city: string; // Thành phố
    province: string; // Tỉnh/Thành phố
    postalCode?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    deliveryInstructions?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
}

// Authentication types
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    marketingConsent?: boolean;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface OTPVerification {
    phone: string;
    otp: string;
    type: 'register' | 'login' | 'forgot_password' | 'phone_verification';
}

export interface PasswordReset {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

// Profile update types
export interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    avatar?: File | string;
    preferences?: Partial<UserPreferences>;
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Social login types
export interface SocialLoginProvider {
    provider: 'google' | 'facebook' | 'apple';
    accessToken: string;
    idToken?: string;
}

// User session and auth state
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface UserSession {
    id: string;
    userId: string;
    deviceInfo: {
        userAgent: string;
        ip: string;
        location?: string;
    };
    createdAt: Date;
    lastActiveAt: Date;
    isActive: boolean;
}