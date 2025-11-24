"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const GRADIENTS = [
  "from-[#F8A91F] via-[#F97316] to-[#EC6426]",
  "from-[#6366F1] via-[#8B5CF6] to-[#C084FC]",
  "from-[#0EA5E9] via-[#14B8A6] to-[#22D3EE]",
  "from-[#D946EF] via-[#EC4899] to-[#FB7185]",
  "from-[#22C55E] via-[#16A34A] to-[#0D9488]",
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
  const id = toNumber(
    item.trainingId ?? item.id ?? item.courseId ?? Date.now()
  );
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
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<TrainingResponse>({
      queryKey: ["manager-training-courses", statusFilter],
      queryFn: async () =>
        (await getMyTrainning(
          statusFilter === "ALL" ? undefined : statusFilter
        )) as TrainingResponse,
      staleTime: 60_000,
    });

  const enrollMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["manager-training-courses"],
      });
      refetch();
    },
  });

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

  const sortedCourses = useMemo(
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
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-[#EC6426] via-[#F97316] to-[#F8A91F] text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/70 mb-1">
              Khóa học của tôi
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
              Nâng cao kỹ năng mỗi ngày
            </h1>
            <p className="text-white/80 mt-2 max-w-2xl text-sm sm:text-base">
              Theo dõi tiến độ các khóa đào tạo được giao và tiếp tục hành trình
              học tập của bạn ngay trong một nơi duy nhất.
            </p>
          </div>
          <div className="bg-white/15 px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur">
            <BookOpenCheck className="w-8 h-8 text-white" />
            <div>
              <p className="text-xs text-white/70">Khóa học đang theo học</p>
              <p className="text-2xl font-semibold">
                {courses.length.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              className={cn(
                "rounded-full px-4",
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
        <Button
          variant="ghost"
          className="self-start sm:self-auto text-gray-600 hover:text-gray-900"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")}
          />
          Tải lại
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16">
          <Loader2 className="w-6 h-6 text-[#EC6426] animate-spin mb-3" />
          <p className="text-sm text-gray-500">
            Đang tải danh sách khóa học...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Có lỗi xảy ra</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && sortedCourses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#EC6426]/10 text-[#EC6426] flex items-center justify-center">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Chưa có khóa học nào
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Khi bạn được giao khóa đào tạo mới, chúng sẽ xuất hiện tại đây để
            bạn có thể bắt đầu học ngay lập tức.
          </p>
        </div>
      )}

      {!isLoading && !error && sortedCourses.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {sortedCourses.map((course, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length];
            const statusInfo = STATUS_CONFIG[
              course.status as keyof typeof STATUS_CONFIG
            ] ?? {
              label: "Trạng thái khác",
              className: "bg-slate-100 text-slate-600 border-slate-200",
            };
            return (
              <div
                key={course.id}
                className="rounded-[24px] border border-[#F97316]/25 bg-gradient-to-br from-[#FFEFE5] via-[#FFE1CC] to-[#FFD3B3] px-4 py-5 shadow-[0_20px_30px_rgba(236,100,38,0.25)] flex flex-col gap-4 w-full max-w-[420px]"
              >
                <div className="rounded-[20px] bg-white/95 border border-[#FFE0C7] px-4 py-5 shadow-inner flex flex-col items-center text-center gap-3">
                  <div className="w-24 h-24 rounded-[26px] bg-gradient-to-br from-white to-[#FFF3E9] border-4 border-[#FFD2AE] shadow-[inset_0_6px_12px_rgba(236,100,38,0.18)] flex items-center justify-center">
                    <div
                      className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold text-white",
                        gradient
                      )}
                    >
                      {course.name.slice(0, 1).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#3B82F6] font-semibold tracking-wide uppercase">
                      Multiple educators
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1">
                      {course.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 uppercase">
                      Learning Path
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full border px-3",
                        statusInfo.className
                      )}
                    >
                      {statusInfo.label}
                    </Badge>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      {formatDate(course.lastUpdated)}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-700">
                  <div className="rounded-2xl bg-white/80 border border-white px-4 py-3 flex flex-col items-center text-center">
                    <Medal className="w-4 h-4 text-[#F97316]" />
                    <span className="text-xs text-slate-500 mt-1">Điểm</span>
                    <strong className="text-base text-slate-900">
                      {course.point}
                    </strong>
                  </div>
                  <div className="rounded-2xl bg-white/80 border border-white px-4 py-3 flex flex-col items-center text-center">
                    <BookOpenCheck className="w-4 h-4 text-[#F97316]" />
                    <span className="text-xs text-slate-500 mt-1">Bài học</span>
                    <strong className="text-base text-slate-900">
                      {course.completedLessons}/{course.totalLessons || "?"}
                    </strong>
                  </div>
                  <div className="rounded-2xl bg-white/80 border border-white px-4 py-3 flex flex-col items-center text-center">
                    <Clock className="w-4 h-4 text-[#F97316]" />
                    <span className="text-xs text-slate-500 mt-1">Tiến độ</span>
                    <strong className="text-base text-slate-900">
                      {Math.round(course.progress)}%
                    </strong>
                  </div>
                </div>

                {course.status === "NOT_STARTED" ? (
                  <div className="mt-auto">
                    <Button
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#F97316] to-[#EC6426] hover:from-[#EC6426] hover:to-[#F97316] text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang đăng ký...
                        </>
                      ) : (
                        "Đăng ký khóa học"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 mt-auto">
                    <div>
                      <div className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                        <span>Learning Path Progress</span>
                        <span>{Math.round(course.progress)}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/50 border border-white overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EC6426] transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/training/${course.id}`)}
                      className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
                    >
                      <BookOpenCheck className="w-4 h-4 mr-2" />
                      Vào bài học
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
