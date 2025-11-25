import { TrainingResponse } from "@/apis/trainning.api";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";

type RoleLike =
  | string
  | {
      name?: string;
      role?: string;
      code?: string;
      roleName?: string;
      roleCode?: string;
    };

interface RecipeInfo {
  id?: number;
  name?: string;
}

export interface TrainingApiItem {
  id?: number;
  trainingId?: number;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  note?: string;
  recipeId?: number;
  recipe?: RecipeInfo | null;
  recipeName?: string;
  assignedRoles?: RoleLike[];
  trainingRoles?: RoleLike[];
  trainingRoleResponses?: RoleLike[];
  roles?: RoleLike[];
  roleName?: string;
  roleId?: number;
  videoUrl?: string;
  video?: string;
  videos?: { url?: string }[];
  documentUrl?: string;
  documents?: { url?: string }[];
  duration?: number;
  durationMinutes?: number;
  estimatedDuration?: number;
  lessonCount?: number;
  totalLessonPoint?: number;
  sumLessonPoint?: number;
  totalLessons?: number;
  status?: string;
  isActive?: boolean;
  publishedAt?: string;
  updateDate?: string;
  createdAt?: string;
  enrolledCount?: number;
  totalEnrolled?: number;
  userTrainings?: unknown[];
  completedCount?: number;
  totalCompleted?: number;
  thumbnail?: string;
  thumbnailUrl?: string;
  coverImage?: string;
  point?: number;
  basePoint?: number;
  trainingRoleId?: number;
  role?: {
    id?: number;
    roleId?: number;
    name?: string;
    roleName?: string;
  } | null;
}

const normalizeRole = (role?: string): StaffRole => {
  if (!role) return "ALL";
  const normalized = role.toUpperCase();
  if (normalized.includes("CHEF") || normalized.includes("KITCHEN"))
    return "CHEF";
  if (normalized.includes("MANAGER")) return "BRANCH_MANAGER";
  if (normalized.includes("WAITER") || normalized.includes("SERVICE"))
    return "WAITER";
  if (normalized.includes("SHIP")) return "SHIPPER";
  if (normalized.includes("STAFF")) return "STAFF";
  return "ALL";
};

const isStaffRole = (
  role: StaffRole | undefined
): role is StaffRole => Boolean(role);

const mapBackendStatusToCourseStatus = (
  status?: string,
  isActive?: boolean
): TrainingCourse["status"] => {
  const normalized = status?.toUpperCase();
  if (normalized === "PUBLISHED" || normalized === "ACTIVE")
    return "PUBLISHED";
  if (normalized === "ARCHIVED" || normalized === "INACTIVE")
    return "ARCHIVED";
  if (normalized === "DRAFT") return "DRAFT";
  if (typeof isActive === "boolean") {
    return isActive ? "PUBLISHED" : "ARCHIVED";
  }
  return "DRAFT";
};

type TrainingListPayload = {
  content?: TrainingApiItem[];
  data?: TrainingApiItem[];
  items?: TrainingApiItem[];
};

export const extractTrainingList = (
  response?: TrainingResponse | null
): TrainingApiItem[] => {
  if (!response) return [];
  const dataLayer = response.data as
    | TrainingListPayload
    | TrainingApiItem[]
    | null
    | undefined;
  if (!dataLayer) return [];
  if (Array.isArray(dataLayer)) return dataLayer;
  if (Array.isArray(dataLayer.content)) return dataLayer.content;
  if (Array.isArray(dataLayer.data)) return dataLayer.data;
  if (Array.isArray(dataLayer.items)) return dataLayer.items;
  return [];
};

export const extractTrainingDetail = (payload: unknown): TrainingApiItem | null => {
  if (!payload || typeof payload !== "object") return null;
  const possible = payload as { data?: TrainingApiItem | null };
  if (possible.data) {
    return possible.data;
  }
  return payload as TrainingApiItem;
};

export const mapTrainingCourse = (item: TrainingApiItem): TrainingCourse => {
  let rawRoles: RoleLike[] = [];

  if (Array.isArray(item.assignedRoles)) {
    rawRoles = item.assignedRoles;
  } else if (Array.isArray(item.trainingRoles)) {
    rawRoles = item.trainingRoles;
  } else if (Array.isArray(item.trainingRoleResponses)) {
    rawRoles = item.trainingRoleResponses;
  } else if (Array.isArray(item.roles)) {
    rawRoles = item.roles;
  }

  if (!rawRoles.length && (item.roleName || item.roleId)) {
    rawRoles = [item.roleName || `ROLE_${item.roleId}`];
  }

  const normalizedRoles = rawRoles
    .map((role) =>
      normalizeRole(
        typeof role === "string"
          ? role
          : role?.name ||
            role?.role ||
            role?.code ||
            role?.roleName ||
            role?.roleCode
      )
    )
    .filter(isStaffRole);

  const derivedRoles: StaffRole[] = normalizedRoles.length
    ? normalizedRoles
    : ["ALL"];

  return {
    id: Number(item.id ?? item.trainingId ?? Date.now()),
    name: item.name ?? item.title ?? "Khóa đào tạo",
    description:
      item.description ?? item.summary ?? item.note ?? "Chưa có mô tả",
    note: item.note ?? item.description ?? undefined,
    recipeId: item.recipeId ?? item.recipe?.id,
    recipeName: item.recipeName ?? item.recipe?.name,
    assignedRoles: derivedRoles,
    videoUrl: item.videoUrl ?? item.video ?? item.videos?.[0]?.url,
    documentUrl: item.documentUrl ?? item.documents?.[0]?.url,
    duration: Number(
      item.duration ??
        item.durationMinutes ??
        item.estimatedDuration ??
        item.lessonCount ??
        item.totalLessonPoint ??
        0
    ),
    status: mapBackendStatusToCourseStatus(item.status, item.isActive),
    publishedAt: item.publishedAt ?? item.updateDate ?? item.createdAt,
    createdAt: item.createdAt ?? new Date().toISOString(),
    enrolledCount: Number(
      item.enrolledCount ??
        item.totalEnrolled ??
        item.totalLessonPoint ??
        item.lessonCount ??
        item.userTrainings?.length ??
        0
    ),
    completedCount: Number(
      item.completedCount ?? item.totalCompleted ?? item.lessonCount ?? 0
    ),
    thumbnail:
      item.thumbnail ?? item.thumbnailUrl ?? item.coverImage ?? undefined,
    point: Number(item.point ?? item.basePoint ?? 0),
    lessonCount: Number(item.lessonCount ?? item.totalLessons ?? 0),
    totalLessonPoint: Number(
      item.totalLessonPoint ?? item.sumLessonPoint ?? item.point ?? 0
    ),
    roleId:
      Number(
        item.roleId ??
          item.role?.id ??
          item.role?.roleId ??
          item.trainingRoleId ??
          0
      ) || undefined,
    roleName:
      item.roleName ?? item.role?.name ?? item.role?.roleName ?? undefined,
    isActive: typeof item.isActive === "boolean" ? item.isActive : undefined,
  };
};

