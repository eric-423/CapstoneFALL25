"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AlertCircle,
  BookOpenCheck,
  Clock,
  Loader2,
  Medal,
  RefreshCw,
} from "lucide-react";

import {
  getMyTrainning,
  enrollCourse,
  type MyTrainingStatus,
  type TrainingResponse,
} from "@/apis/trainning.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/lib/utils";

type TrainingStatusFilter = MyTrainingStatus;
const STATUS_CONFIG: Record<
  Exclude<TrainingStatusFilter, "ALL">,
  { label: string; className: string }
> = {
  NOT_STARTED: {
    label: "Chưa bắt đầu",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  IN_PROGRESS: {
    label: "Đang học",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-green-100 text-green-700 border-green-200",
  },
};

interface TrainingCardData {
  id: number;
  trainingId: number;
  userTrainingId: number;
  name: string;
  description: string;
  point: number;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  status: string;
  thumbnail?: string;
  lastUpdated?: string;
}

const STATUS_TABS: { label: string; value: TrainingStatusFilter }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: STATUS_CONFIG.NOT_STARTED.label, value: "NOT_STARTED" },
  { label: STATUS_CONFIG.IN_PROGRESS.label, value: "IN_PROGRESS" },
  { label: STATUS_CONFIG.COMPLETED.label, value: "COMPLETED" },
];

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const unwrapTrainingItems = (payload: unknown): Record<string, unknown>[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (typeof payload !== "object") return [];

  const container = payload as Record<string, unknown>;

  if (Array.isArray(container.data)) {
    return container.data as Record<string, unknown>[];
  }

  const nestedKeys = [
    "content",
    "items",
    "records",
    "results",
    "list",
    "trainings",
  ];
  for (const key of nestedKeys) {
    const value = container[key];
    if (Array.isArray(value)) {
      return value as Record<string, unknown>[];
    }
  }

  if (container.data && typeof container.data === "object") {
    return unwrapTrainingItems(container.data);
  }
  return [];
};

const normalizeTraining = (item: Record<string, unknown>): TrainingCardData => {
  const trainingId = toNumber(item.trainingId ?? item.courseId ?? 0);
  const userTrainingId = toNumber(
    item.userTrainingId ?? item.id ?? item.userIdTraining ?? 0
  );
  const id = trainingId || userTrainingId || Date.now();
  const totalLessons = toNumber(
    item.lessonCount ??
      item.totalLessons ??
      item.lessonTotal ??
      item.totalLesson ??
      item.lessonsCount ??
      (Array.isArray(item.lessons) ? item.lessons.length : 0)
  );
  const completedLessons = Math.min(
    totalLessons,
    toNumber(
      item.completedLessons ??
        item.lessonCompleted ??
        item.finishedLessons ??
        item.completedLessonCount ??
        item.progressLesson ??
        0
    )
  );

  const derivedProgressFromFields = (() => {
    const raw =
      item.progress ??
      item.progressPercent ??
      item.completionRate ??
      item.completion ??
      item.progression ??
      null;
    if (raw === null || raw === undefined) return NaN;
    let numeric = Number(raw);
    if (!Number.isFinite(numeric)) return NaN;
    if (numeric <= 1) {
      numeric *= 100;
    }
    return numeric;
  })();

  const derivedProgressFromLessons =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : NaN;

  const pointTotal = toNumber(
    item.trainingPoint ??
      item.point ??
      item.totalPoint ??
      item.totalLessonPoint ??
      0
  );
  const pointCompleted = toNumber(
    item.completedPoint ?? item.earnedPoint ?? item.pointAchieved ?? 0
  );
  const derivedProgressFromPoints =
    pointTotal > 0 ? (pointCompleted / pointTotal) * 100 : NaN;

  const progress = clamp(
    Number.isFinite(derivedProgressFromFields)
      ? derivedProgressFromFields
      : Number.isFinite(derivedProgressFromLessons)
        ? derivedProgressFromLessons
        : Number.isFinite(derivedProgressFromPoints)
          ? derivedProgressFromPoints
          : 0
  );

  const description =
    (typeof item.description === "string" && item.description) ||
    (typeof item.note === "string" && item.note) ||
    "Chưa có mô tả cho khóa học này.";

  const status =
    String(item.status ?? item.trainingStatus ?? "ACTIVE").toUpperCase() ||
    "ACTIVE";

  const lastUpdated =
    (typeof item.updatedAt === "string" && item.updatedAt) ||
    (typeof item.modifiedAt === "string" && item.modifiedAt) ||
    (typeof item.completedAt === "string" && item.completedAt) ||
    (typeof item.assignedAt === "string" && item.assignedAt) ||
    undefined;

  return {
    id,
    trainingId,
    userTrainingId,
    name:
      (typeof item.name === "string" && item.name) ||
      (typeof item.trainingName === "string" && item.trainingName) ||
      "Khóa đào tạo",
    description,
    point: pointTotal,
    totalLessons,
    completedLessons,
    progress,
    status,
    thumbnail:
      (typeof item.thumbnail === "string" && item.thumbnail) ||
      (typeof item.thumbnailUrl === "string" && item.thumbnailUrl) ||
      (typeof item.coverImage === "string" && item.coverImage) ||
      undefined,
    lastUpdated,
  };
};

const formatDate = (value?: string) => {
  if (!value) return "Chưa cập nhật";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function ManagerTrainingCoursesPage() {
  const [statusFilter, setStatusFilter] = useState<TrainingStatusFilter>("ALL");
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<TrainingResponse>({
      queryKey: ["manager-training-courses", statusFilter],
      queryFn: async () =>
        (await getMyTrainning(
          statusFilter === "ALL" ? undefined : statusFilter
        )) as TrainingResponse,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      refetchInterval: 60_000,
      retry: 2,
    });

  const enrollMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      setEnrollingCourseId(null);
      queryClient.invalidateQueries({
        queryKey: ["manager-training-courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-trainings"],
      });
      toast.success("Đăng ký khóa học thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      refetch();
    },
    onError: (error: Error) => {
      setEnrollingCourseId(null);
      toast.error(
        error.message || "Không thể đăng ký khóa học. Vui lòng thử lại!",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    },
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  const courses = useMemo<TrainingCardData[]>(() => {
    const rootPayload = data?.data ?? data;
    return unwrapTrainingItems(rootPayload).map(normalizeTraining);
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (statusFilter === "ALL") {
      return courses;
    }
    return courses.filter((course) => {
      const courseStatus = course.status.toUpperCase();
      return courseStatus === statusFilter.toUpperCase();
    });
  }, [courses, statusFilter]);

  const sortedCourses = useMemo<TrainingCardData[]>(
    () =>
      [...filteredCourses].sort((a, b) => {
        if (a.progress === b.progress) {
          return (
            (b.lastUpdated?.localeCompare(a.lastUpdated ?? "") ?? 0) ||
            b.id - a.id
          );
        }
        return b.progress - a.progress;
      }),
    [filteredCourses]
  );

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Không thể tải danh sách khóa học.";

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="rounded-2xl sm:rounded-3xl bg-orange-500 text-white p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-white/70 mb-1">
              Khóa học của tôi
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight sm:leading-snug">
              Nâng cao kỹ năng mỗi ngày
            </h1>
          </div>
          <div className="bg-white/15 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 backdrop-blur shrink-0 mt-2 sm:mt-0">
            <BookOpenCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-white/70 whitespace-nowrap">
                Khóa học đang theo học
              </p>
              <p className="text-xl sm:text-2xl font-semibold whitespace-nowrap">
                {courses.length.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex-1 overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
              {STATUS_TABS.map((tab) => (
                <Button
                  key={tab.value}
                  variant={statusFilter === tab.value ? "default" : "outline"}
                  className={cn(
                    "rounded-full px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap shrink-0",
                    statusFilter === tab.value
                      ? "bg-[#EC6426] hover:bg-[#EC6426]/90 text-white border-[#EC6426]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setStatusFilter(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 shrink-0"
            onClick={async () => {
              await refetch();
              toast.info("Đã làm mới danh sách khóa học", {
                position: "top-right",
                autoClose: 2000,
              });
            }}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("w-4 h-4 sm:mr-2", isFetching && "animate-spin")}
            />
            <span className="hidden sm:inline">Tải lại</span>
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-full flex-col gap-4 sm:gap-5 rounded-2xl sm:rounded-[24px] border border-gray-200 bg-white px-4 sm:px-5 py-4 sm:py-6 shadow-sm animate-pulse"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-3 w-16 sm:w-20 bg-gray-200 rounded" />
                      <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded" />
                    </div>
                    <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded" />
                    <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="rounded-xl sm:rounded-2xl bg-gray-100 px-2 sm:px-4 py-2 sm:py-3 space-y-1 sm:space-y-2"
                  >
                    <div className="h-3 sm:h-4 w-3 sm:w-4 bg-gray-200 rounded mx-auto" />
                    <div className="h-2 sm:h-3 w-10 sm:w-12 bg-gray-200 rounded mx-auto" />
                    <div className="h-4 sm:h-5 w-6 sm:w-8 bg-gray-200 rounded mx-auto" />
                  </div>
                ))}
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="h-2 sm:h-3 w-full bg-gray-200 rounded-full" />
                <div className="h-10 sm:h-12 w-full bg-gray-200 rounded-lg sm:rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 p-3 sm:p-4 flex items-start gap-2 sm:gap-3 text-red-700">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base">Có lỗi xảy ra</p>
            <p className="text-xs sm:text-sm mt-0.5 break-words">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && sortedCourses.length === 0 && (
        <div className="rounded-xl sm:rounded-2xl border border-dashed border-gray-200 bg-white p-6 sm:p-8 md:p-10 text-center space-y-2 sm:space-y-3">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EC6426]/10 text-[#EC6426] flex items-center justify-center">
            <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 px-2">
            Chưa có khóa học nào
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto px-4 leading-relaxed">
            Khi bạn được giao khóa đào tạo mới, chúng sẽ xuất hiện tại đây để
            bạn có thể bắt đầu học ngay lập tức.
          </p>
        </div>
      )}

      {!isLoading && !error && sortedCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedCourses.map((course) => {
            const statusInfo = STATUS_CONFIG[
              course.status as keyof typeof STATUS_CONFIG
            ] ?? {
              label: "Trạng thái khác",
              className: "bg-slate-100 text-slate-600 border-slate-200",
            };
            return (
              <div
                key={course.id}
                className="flex h-full flex-col gap-4 sm:gap-5 rounded-2xl sm:rounded-[24px] border border-[#F97316]/25 bg-white px-4 sm:px-5 py-4 sm:py-6 shadow-[0_20px_30px_rgba(236,100,38,0.25)] hover:shadow-[0_25px_40px_rgba(236,100,38,0.35)] transition-shadow duration-300"
              >
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5 sm:mb-1">
                          Khóa học
                        </p>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight line-clamp-2">
                          {course.name}
                        </h3>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs shrink-0",
                          statusInfo.className
                        )}
                      >
                        <span className="line-clamp-1">{statusInfo.label}</span>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {formatDate(course.lastUpdated)}
                        </span>
                      </span>
                      <span className="hidden text-slate-300 sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <BookOpenCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        <span>{course.totalLessons || "?"} bài học</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm text-slate-700">
                  <div className="rounded-xl sm:rounded-2xl bg-white/80 border border-white px-2 sm:px-4 py-2 sm:py-3 flex flex-col items-center text-center">
                    <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Điểm
                    </span>
                    <strong className="text-sm sm:text-base text-slate-900 mt-0.5 sm:mt-1">
                      {course.point}
                    </strong>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-white/80 border border-white px-2 sm:px-4 py-2 sm:py-3 flex flex-col items-center text-center">
                    <BookOpenCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Bài học
                    </span>
                    <strong className="text-sm sm:text-base text-slate-900 mt-0.5 sm:mt-1">
                      {course.completedLessons}/{course.totalLessons || "?"}
                    </strong>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-white/80 border border-white px-2 sm:px-4 py-2 sm:py-3 flex flex-col items-center text-center">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Tiến độ
                    </span>
                    <strong className="text-sm sm:text-base text-slate-900 mt-0.5 sm:mt-1">
                      {Math.round(course.progress)}%
                    </strong>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                      <span>Tiến độ khóa học</span>
                      <span>{Math.round(course.progress)}%</span>
                    </div>
                    <div className="h-2 sm:h-3 rounded-full bg-white/50 border border-white overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F97316] transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {course.status === "NOT_STARTED" ? (
                    <Button
                      onClick={() => {
                        setEnrollingCourseId(course.id);
                        enrollMutation.mutate(course.id);
                      }}
                      disabled={enrollingCourseId === course.id}
                      className="w-full bg-gradient-to-r from-[#F97316] to-[#EC6426] hover:from-[#EC6426] hover:to-[#F97316] text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollingCourseId === course.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                          <span>Đang đăng ký...</span>
                        </>
                      ) : (
                        "Đăng ký khóa học"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (!course.trainingId || course.trainingId === 0) {
                          toast.error(
                            "Không thể vào bài học. Vui lòng thử lại sau!",
                            {
                              position: "top-right",
                              autoClose: 3000,
                            }
                          );
                          return;
                        }
                        const url = `/training/${course.trainingId}${course.userTrainingId ? `?userTrainingId=${course.userTrainingId}` : ""}`;
                        router.push(url);
                      }}
                      className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300"
                    >
                      <BookOpenCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      Vào bài học
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
