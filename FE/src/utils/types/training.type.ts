export type StaffRole = 'CHEF' | 'BRANCH_MANAGER' | 'STAFF' | 'WAITER' | 'SHIPPER' | 'ALL';

export interface TrainingCourse {
    id: number;
    name: string;
    description: string;
    recipeId?: number;
    recipeName?: string;
    assignedRoles: StaffRole[];
    videoUrl?: string; // YouTube link or upload
    documentUrl?: string; // PDF link
    duration: number; // in minutes
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt?: string;
    createdAt: string;
    enrolledCount: number;
    completedCount: number;
    thumbnail?: string;
}

export interface TrainingCourseFormData {
    name: string;
    description: string;
    recipeId?: number;
    assignedRoles: StaffRole[];
    videoUrl?: string;
    documentUrl?: string;
    duration: number;
    thumbnail?: string;
}

export interface TrainingStats {
    totalCourses: number;
    publishedCourses: number;
    totalEnrolled: number;
    avgCompletionRate: number;
}
