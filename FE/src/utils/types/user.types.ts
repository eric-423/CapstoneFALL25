// User Management Types & Interfaces

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

export type UserStatus = 'active' | 'inactive' | 'locked' | 'invited' | 'pending';

export interface BranchRole {
    branchId: string;
    branchName: string;
    role: UserRole;
    assignedAt: string;
    assignedBy?: string;
}

export interface TrainingProgress {
    programId: string;
    programName: string;
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'expired';
    lastAccessed?: string;
    certificateIssued?: boolean;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'password_change' | 'role_change' | 'status_change';
    performedBy: string;
    performedByName: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;

    // Role & Permissions
    primaryRole: UserRole;
    branchRoles?: BranchRole[]; // Per-branch role binding

    // Status
    status: UserStatus;
    statusChangedAt?: string;
    statusChangedBy?: string;

    // Security
    lastLogin?: string;
    lastPasswordChange?: string;
    twoFactorEnabled: boolean;
    failedLoginAttempts?: number;
    lockedUntil?: string;

    // Training
    trainingProgress?: TrainingProgress[];
    trainingCompletionRate?: number;
    certificatesEarned?: number;

    // Metadata
    createdAt: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    invitedAt?: string;
    invitedBy?: string;

    // Contact
    address?: string;
    emergencyContact?: string;

    // Notes
    notes?: string;
}

export interface UserFilters {
    role?: UserRole;
    status?: UserStatus;
    branch?: string;
    hasTraining?: boolean;
    has2FA?: boolean;
}

export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
}

export interface UserDetailResponse {
    user: User;
    auditLogs: AuditLogEntry[];
    permissions: string[];
}
