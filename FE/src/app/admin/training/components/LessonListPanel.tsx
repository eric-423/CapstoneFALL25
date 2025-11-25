"use client";

import { Button } from "@/components/ui/button";
import { TrainingLesson } from "@/apis/trainning.api";

interface LessonListPanelProps {
    lessons: TrainingLesson[];
    loading: boolean;
    error: string | null;
    onViewDetail: (lessonId: number) => void;
}

export function LessonListPanel({
    lessons,
    loading,
    error,
    onViewDetail,
}: LessonListPanelProps) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                Đang tải danh sách bài học...
            </div>
        );
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    if (lessons.length === 0) {
        return (
            <p className="text-sm text-gray-500">Chưa có bài học nào cho khóa này.</p>
        );
    }

    return (
        <div className="space-y-3">
            {lessons.map((lesson) => (
                <div
                    key={lesson.id}
                    className="!bg-[#f8e4d4] mt-5 p-4 border border-gray-200 rounded-xl space-y-3 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => onViewDetail(lesson.id)}
                >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">{lesson.title}</p>
                            <p className="text-xs text-gray-500">
                                Thứ tự #{lesson.orderIndex} ·{" "}
                                {lesson.isActive ? "Đang hoạt động" : "Đã ẩn"}
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                            +{lesson.point} điểm
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {lesson.description}
                    </p>
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetail(lesson.id);
                            }}
                            className="text-primary border-primary hover:bg-primary transition-colors"
                        >
                            Xem chi tiết
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

