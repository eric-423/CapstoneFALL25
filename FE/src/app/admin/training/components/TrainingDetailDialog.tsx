"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TrainingCourse } from "@/utils/types/training.type";
import { TrainingLesson } from "@/apis/trainning.api";
import {
    getTrainningById,
    getTrainingUsers,
} from "@/apis/trainning.api";
import { extractTrainingDetail, mapTrainingCourse } from "../utils/trainingUtils";
import { LessonListPanel } from "./LessonListPanel";
import { LessonDetailPanel } from "./LessonDetailPanel";
import { LessonFormDialog } from "./LessonFormDialog";
import { useLessons, useLessonDetail } from "./hook/useLessons";

interface TrainingDetailDialogProps {
    open: boolean;
    trainingId: number | null;
    onClose: () => void;
    onRefetch?: () => void;
}

const TRAINING_LESSON_PAGE_SIZE = 5;

const detailStatsConfig = (training: TrainingCourse, userCount: number = 0) => [
    { label: "Điểm khóa", value: training.point ?? 0 },
    { label: "Bài học", value: training.lessonCount ?? 0 },
    {
        label: "Tổng điểm bài",
        value: training.totalLessonPoint ?? training.point ?? 0,
    },
    { label: "Học viên", value: userCount, isClickable: true },
];

export function TrainingDetailDialog({
    open,
    trainingId,
    onClose,
}: TrainingDetailDialogProps) {
    const [training, setTraining] = useState<TrainingCourse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trainingUsersCount, setTrainingUsersCount] = useState<number>(0);
    const [lessonPanelView, setLessonPanelView] = useState<"list" | "detail">(
        "list"
    );
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
    const [lessonCreateDialogOpen, setLessonCreateDialogOpen] = useState(false);
    const [lessonEditMode, setLessonEditMode] = useState<{
        open: boolean;
        lesson: TrainingLesson | null;
    }>({
        open: false,
        lesson: null,
    });
    const [lessonsPagination, setLessonsPagination] = useState({
        page: 0,
        size: TRAINING_LESSON_PAGE_SIZE,
        includeDeleted: true,
    });
    const [lessonsRefreshKey, setLessonsRefreshKey] = useState(0);

    const { lessonsData, loading: lessonsLoading, error: lessonsError } =
        useLessons(trainingId, lessonsPagination, lessonsRefreshKey);

    const {
        lesson: lessonDetail,
        loading: lessonDetailLoading,
        error: lessonDetailError,
    } = useLessonDetail(selectedLessonId);

    useEffect(() => {
        if (open && trainingId) {
            const fetchTraining = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const payload = await getTrainningById(trainingId);
                    const trainingItem = extractTrainingDetail(payload);

                    if (!trainingItem) {
                        throw new Error("Không tìm thấy dữ liệu khóa đào tạo");
                    }

                    const mappedTraining = mapTrainingCourse(trainingItem);
                    setTraining(mappedTraining);

                    try {
                        const usersResponse = await getTrainingUsers(trainingId);
                        setTrainingUsersCount(usersResponse.data?.length || 0);
                    } catch (usersError) {
                        console.error("Failed to fetch training users:", usersError);
                        setTrainingUsersCount(0);
                    }
                } catch (err) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Không thể tải chi tiết khóa đào tạo";
                    setError(message);
                } finally {
                    setLoading(false);
                }
            };
            fetchTraining();
        } else {
            setTraining(null);
            setLessonPanelView("list");
            setSelectedLessonId(null);
        }
    }, [open, trainingId]);

    const handleViewLessonDetail = (lessonId: number) => {
        setSelectedLessonId(lessonId);
        setLessonPanelView("detail");
    };

    const handleBackToList = () => {
        setLessonPanelView("list");
        setSelectedLessonId(null);
    };

    const handleOpenLessonCreate = () => {
        setLessonCreateDialogOpen(true);
    };

    const handleOpenLessonEdit = (lesson: TrainingLesson) => {
        setLessonEditMode({ open: true, lesson });
    };

    const handleLessonsPageChange = (direction: "prev" | "next") => {
        setLessonsPagination((prev) => {
            const totalPages = lessonsData.totalPages;
            const nextPage = direction === "next" ? prev.page + 1 : prev.page - 1;

            if (nextPage < 0) return prev;
            if (totalPages > 0 && nextPage >= totalPages) return prev;

            return { ...prev, page: nextPage };
        });
    };

    const toggleIncludeDeletedLessons = () => {
        setLessonsPagination((prev) => ({
            ...prev,
            includeDeleted: !prev.includeDeleted,
            page: 0,
        }));
        setLessonPanelView("list");
    };

    const triggerLessonsReload = () => {
        setLessonsRefreshKey((prev) => prev + 1);
    };

    const hasPrevLessonPage = lessonsPagination.page > 0;
    const hasNextLessonPage =
        lessonsData.totalPages > 0
            ? lessonsPagination.page < lessonsData.totalPages - 1
            : false;
    const lessonPageDisplay =
        lessonsData.totalElements === 0 ? 0 : lessonsPagination.page + 1;
    const lessonTotalPageDisplay =
        lessonsData.totalPages > 0
            ? lessonsData.totalPages
            : lessonsData.totalElements > 0
                ? 1
                : 0;

    const detailStats = training
        ? detailStatsConfig(training, trainingUsersCount)
        : [];

    return (
        <>
            <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="!bg-[#fbdcc5] w-[97vw] max-w-[97vw] sm:!max-w-[92vw] lg:!max-w-[75vw] xl:!max-w-[65vw] max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle>Chi tiết khóa đào tạo</DialogTitle>
                    </DialogHeader>

                    {loading && (
                        <div className="flex items-center justify-center py-10 text-gray-500">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mr-3" />
                            Đang tải dữ liệu...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="py-6 text-center text-red-500 font-semibold">
                            {error}
                        </div>
                    )}

                    {!loading && !error && training && (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {training.name}
                                    </h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${training.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {training.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {training.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {detailStats.map((stat) => (
                                    <Card
                                        key={stat.label}
                                        className={`p-4 border border-gray-100 shadow-none ${stat.isClickable
                                            ? "hover:border-orange-300 hover:shadow-sm transition-all"
                                            : ""
                                            }`}
                                    >
                                        <p className="text-xs uppercase text-gray-500 font-semibold">
                                            {stat.label}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                            {stat.isClickable && training && (
                                                <Link
                                                    href={`/admin/training/${training.id}/users`}
                                                    className="ml-2 p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 hover:text-orange-700 transition-colors"
                                                    title="Xem danh sách học viên"
                                                >
                                                    <ArrowRight size={18} />
                                                </Link>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex align-center gap-2">
                                <p className="text-xs uppercase text-gray-500 font-semibold">
                                    Vai trò được gán:
                                </p>
                                <p className="text-xs uppercase text-primary font-semibold">
                                    {training.roleName}
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-4">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            Bài học của khóa
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Tổng cộng {lessonsData.totalElements} bài học
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleOpenLessonCreate}
                                            disabled={!training}
                                            className="bg-primary text-white shadow-sm hover:shadow-md"
                                        >
                                            <Plus size={14} className="mr-1" />
                                            Thêm bài học
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={toggleIncludeDeletedLessons}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${lessonsPagination.includeDeleted
                                                ? "border-orange-300 text-orange-600 bg-orange-50"
                                                : "border-gray-200 text-gray-500 bg-white"
                                                }`}
                                        >
                                            {lessonsPagination.includeDeleted
                                                ? "Hiện bài đang ẩn"
                                                : "Hiển thị bài đang hoạt động"}
                                        </button>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <button
                                                type="button"
                                                onClick={() => handleLessonsPageChange("prev")}
                                                disabled={!hasPrevLessonPage || lessonsLoading}
                                                className="px-2 py-1 border rounded-md disabled:opacity-40"
                                            >
                                                Trước
                                            </button>
                                            <span>
                                                Trang {lessonPageDisplay}/{lessonTotalPageDisplay}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleLessonsPageChange("next")}
                                                disabled={!hasNextLessonPage || lessonsLoading}
                                                className="px-2 py-1 border rounded-md disabled:opacity-40"
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {lessonPanelView === "list" ? (
                                    <LessonListPanel
                                        lessons={lessonsData.items}
                                        loading={lessonsLoading}
                                        error={lessonsError}
                                        onViewDetail={handleViewLessonDetail}
                                    />
                                ) : (
                                    <LessonDetailPanel
                                        lesson={lessonDetail}
                                        loading={lessonDetailLoading}
                                        error={lessonDetailError}
                                        onBack={handleBackToList}
                                        onEdit={handleOpenLessonEdit}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <LessonFormDialog
                open={lessonCreateDialogOpen || lessonEditMode.open}
                mode={lessonEditMode.open ? "edit" : "create"}
                lesson={lessonEditMode.lesson ?? undefined}
                
                training={training}
                totalLessons={lessonsData.totalElements}
                onClose={() => {
                    if (lessonEditMode.open) {
                        setLessonEditMode({ open: false, lesson: null });
                    } else {
                        setLessonCreateDialogOpen(false);
                    }
                }}
                onSuccess={() => {
                    triggerLessonsReload();
                    if (lessonPanelView === "detail" && lessonEditMode.open) {
                        setLessonPanelView("list");
                    }
                    if (lessonEditMode.open) {
                        setLessonEditMode({ open: false, lesson: null });
                    } else {
                        setLessonCreateDialogOpen(false);
                    }
                }}
            />
        </>
    );
}

