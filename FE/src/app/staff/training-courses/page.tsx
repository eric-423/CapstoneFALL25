"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
        // Ưu tiên userTrainingId, nếu không có thì fallback sang id/trainingId (cho staff/chef)
        userTrainingId: toNumber(
            item.userTrainingId ?? item.userIdTraining ?? item.id ?? item.trainingId ?? 0
        ),
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

interface CourseCardProps {
    course: TrainingCardData;
}

const CourseCard = ({ course }: CourseCardProps) => {
    const router = useRouter();

    const statusInfo =
        STATUS_CONFIG[course.status as keyof typeof STATUS_CONFIG] ?? {
            label: "Trạng thái khác",
            className: "bg-slate-100 text-slate-600 border-slate-200",
        };

    return (
        <article className="flex h-full flex-col gap-5 rounded-[24px] border border-[#F97316]/25 bg-white px-5 py-6 shadow-[0_20px_30px_rgba(236,100,38,0.25)]">
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Khóa học
                            </p>
                            <h3 className="text-xl font-semibold text-slate-900">
                                {course.name}
                            </h3>
                        </div>
                        <Badge
                            variant="secondary"
                            className={cn("rounded-full border px-3", statusInfo.className)}
                        >
                            {statusInfo.label}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(course.lastUpdated)}
                        </span>
                        <span className="hidden text-slate-300 sm:inline">•</span>
                        <span className="flex items-center gap-1">
                            <BookOpenCheck className="h-3.5 w-3.5" />
                            {course.totalLessons || "?"} bài học
                        </span>
                    </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>
            </div>

            <div className="grid gap-1 sm:grid-cols-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white/80 border border-white px-4 py-3 flex flex-col items-center text-center">
                    <Medal className="w-4 h-4 text-[#F97316]" />
                    <span className="text-xs text-slate-500 mt-1">Điểm</span>
                    <strong className="text-base text-slate-900">{course.point}</strong>
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

            <div className="space-y-3">
                <div>
                    <div className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                        <span>Tiến độ khóa học</span>
                        <span>{Math.round(course.progress)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/50 border border-white overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#F97316] transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                        ></div>
                    </div>
                </div>
                <Button
                    className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
                    onClick={() => router.push(`/training/${course.userTrainingId}`)}
                >
                    <BookOpenCheck className="w-4 h-4 mr-2" />
                    Vào bài học
                </Button>
            </div>
        </article>
    );
};

export default function StaffTrainingCoursesPage() {
    const [statusFilter, setStatusFilter] = useState<TrainingStatusFilter>("ALL");

    const { data, isLoading, isFetching, error, refetch } =
        useQuery<TrainingResponse>({
            queryKey: ["manager-training-courses", statusFilter],
            queryFn: async () =>
                (await getMyTrainning(
                    statusFilter === "ALL" ? undefined : statusFilter
                )) as TrainingResponse,
            staleTime: 60_000,
        });

    const courses = useMemo<TrainingCardData[]>(() => {
        const rootPayload = data?.data ?? data;
        return unwrapTrainingItems(rootPayload).map(normalizeTraining);
    }, [data]);

    const sortedCourses = useMemo(
        () =>
            [...courses].sort((a, b) => {
                if (a.progress === b.progress) {
                    return (
                        (b.lastUpdated?.localeCompare(a.lastUpdated ?? "") ?? 0) ||
                        b.id - a.id
                    );
                }
                return b.progress - a.progress;
            }),
        [courses]
    );

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Không thể tải danh sách khóa học.";

    return (
        <div className="space-y-6 px-2 sm:px-4 max-w-6xl mx-auto">
            <div className="rounded-3xl bg-[#EC6426] text-white p-6 sm:p-8 shadow-xl">
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
                <div className="w-full overflow-x-auto pb-2">
                    <div className="flex w-full gap-2 min-w-max">
                        {STATUS_TABS.map((tab) => (
                            <Button
                                key={tab.value}
                                variant={statusFilter === tab.value ? "default" : "outline"}
                                className={cn(
                                    "rounded-full px-4 shrink-0",
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
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {sortedCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}
