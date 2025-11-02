// User Management Types & Interfaces - Updated to match Backend Schema

export type UserRole = 'ADMIN' | 'MANAGER' | 'CHEF' | 'WAITER' | 'SHIPPER' | 'CUSTOMER';

// Backend uses isActive and isBan flags instead of status enum
export interface UserStatus {
    isActive: boolean;
    isBan: boolean;
}

// Role History - Backend table: user_role_history
export interface RoleHistory {
    id: number;
    roleId: number;
    roleName: string;
    userId: number;
    branchId?: number;
    branchName?: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
}

// Training - Backend table: trainings
export interface Training {
    trainingId: number;
    name: string;
    note?: string;
    point: number;
    createDate: string;
    updateDate?: string;
}

// Lesson - Backend table: lessons
export interface Lesson {
    id: number;
    trainingId: number;
    title: string;
    content: string;
    description?: string;
    point: number;
    refLink?: string;
    roleId?: number;
}

// User Training Enrollment - Backend table: user_training
export interface UserTraining {
    id: number;
    userId: number;
    trainingId: number;
    trainingName: string;
    enrollDate: string;
    point: number;
    isPassed: boolean;
    lessonsProgress?: UserLessonProgress[];
}

// User Lesson Progress - Backend table: user_lesson_progress
export interface UserLessonProgress {
    id: number;
    userTrainingId: number;
    lessonId: number;
    lessonTitle: string;
    point: number;
    isPassed: boolean;
    startDate: string;
}

// Computed training stats
export interface TrainingStats {
    totalEnrolled: number;
    totalCompleted: number;
    totalPoints: number;
    completionRate: number;
    inProgressCount: number;
}

// Audit Log Entry for tracking user actions
export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'password_change' | 'role_change' | 'status_change' | 'ban' | 'unban';
    performedBy: string;
    performedByName: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
}

// Main User Entity - Backend table: users
export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string; // Never sent to frontend in real scenario
    dateOfBirth?: string;
    address?: string;
    note?: string;

    // Status flags
    isActive: boolean;
    isBan: boolean;

    // Verification
    emailVerified: boolean;
    phoneVerified: boolean;

    // Member info
    memberPoint: number;
    memberRank?: number;

    // Timestamps
    createdAt: string;

    // Relations (populated from other tables)
    roleHistories?: RoleHistory[];
    currentRole?: RoleHistory; // Most recent active role
    trainings?: UserTraining[];
    trainingStats?: TrainingStats;
}

// Filters for user list
export interface UserFilters {
    role?: UserRole;
    branchId?: number;
    isActive?: boolean;
    isBan?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    hasTraining?: boolean;
    memberRankMin?: number;
    memberRankMax?: number;
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
}

// API Response types
export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
}

export interface UserDetailResponse {
    user: User;
    roleHistories: RoleHistory[];
    trainings: UserTraining[];
    auditLogs: AuditLogEntry[];
}

// Form data for creating/updating users
export interface UserFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    dateOfBirth?: string;
    address?: string;
    note?: string;
    isActive: boolean;
    roleId: number;
    branchId?: number;
}
