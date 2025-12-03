"use client";

import { useState, useEffect } from "react";
import { BookOpen, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    TrainingLesson,
    createLesson,
    updateLesson,
    CreateLessonPayload,
} from "@/apis/trainning.api";
import { TrainingCourse } from "@/utils/types/training.type";
import { uploadMediaToSupabase } from "@/components/common/upFileToSupabase";
import { ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";

const TRAINING_MEDIA_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_TRAINING_BUCKET;

interface LessonFormDialogProps {
    open: boolean;
    mode: "create" | "edit";
    lesson?: TrainingLesson | null;
    training: TrainingCourse | null;
    totalLessons: number;
    onClose: () => void;
    onSuccess: () => void;
}

export function LessonFormDialog({
    open,
    mode,
    lesson,
    training,
    totalLessons,
    onClose,
    onSuccess,
}: LessonFormDialogProps) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        content: "",
        videoUrl: "",
        point: "",
        orderIndex: "",
        isActive: true,
    });
    const [fileVideo, setFileVideo] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);

    useEffect(() => {
        if (open && mode === "edit" && lesson) {
            setForm({
                title: lesson.title ?? "",
                description: lesson.description ?? "",
                content: lesson.content ?? "",
                videoUrl: lesson.videoUrl ?? "",
                point: lesson.point !== undefined ? String(lesson.point) : "",
                orderIndex:
                    lesson.orderIndex !== undefined ? String(lesson.orderIndex) : "",
                isActive: lesson.isActive ?? true,
            });
        } else if (open && mode === "create") {
            setForm({
                title: "",
                description: "",
                content: "",
                videoUrl: "",
                point: "",
                orderIndex: String(totalLessons + 1 || 1),
                isActive: true,
            });
        }
        setFileVideo(null);
        setErrors({});
    }, [open, mode, lesson, totalLessons]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.title.trim())
            newErrors.title = "Vui lòng nhập tiêu đề bài học";
        if (!form.description.trim())
            newErrors.description = "Vui lòng nhập mô tả ngắn";
        if (!form.content.trim())
            newErrors.content = "Vui lòng nhập nội dung bài học";
        if (!form.point.trim()) {
            newErrors.point = "Vui lòng nhập điểm bài học";
        } else {
            const numericPoint = Number(form.point);
            const coursePointLimit =
                typeof training?.point === "number" ? training.point : undefined;
            const currentLessonPointSum =
                typeof training?.totalLessonPoint === "number"
                    ? training.totalLessonPoint
                    : 0;
            const editingLessonPoint =
                mode === "edit" && typeof lesson?.point === "number"
                    ? lesson.point
                    : 0;
            const usedPointWithoutCurrent = Math.max(
                0,
                currentLessonPointSum - editingLessonPoint
            );
            const remainingPointBudget =
                typeof coursePointLimit === "number"
                    ? Math.max(0, coursePointLimit - usedPointWithoutCurrent)
                    : undefined;

            if (Number.isNaN(numericPoint) || numericPoint <= 0) {
                newErrors.point = "Điểm phải lớn hơn 0";
            } else if (
                typeof coursePointLimit === "number" &&
                coursePointLimit > 0 &&
                numericPoint > coursePointLimit
            ) {
                newErrors.point = `Điểm bài học không được vượt quá điểm khóa`;
            } else if (
                typeof remainingPointBudget === "number" &&
                numericPoint > remainingPointBudget
            ) {
                newErrors.point = `Tổng điểm bài học vượt quá giới hạn khóa học`;
            }
        }
        if (!form.orderIndex.trim()) {
            newErrors.orderIndex = "Vui lòng nhập thứ tự bài học";
        } else if (
            Number.isNaN(Number(form.orderIndex)) ||
            Number(form.orderIndex) <= 0
        ) {
            newErrors.orderIndex = "Thứ tự phải lớn hơn 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!training) return;
        if (!validate()) return;

        const MAX_SIZE = 50 * 1024 * 1024;
        if (fileVideo && fileVideo.size > MAX_SIZE) {
            setErrors({ video: "File không được vượt quá 50MB" });
            return;
        }

        if (fileVideo) {
            const hasDiacritics = /[^\x00-\x7F]/.test(fileVideo.name);
            if (hasDiacritics) {
                setErrors({
                    video: "Tên file không được chứa dấu. Vui lòng đổi tên không dấu.",
                });
                return;
            }
        }

        setErrors({});
        setLoading(true);

        let videoUrl = form.videoUrl?.trim() ?? "";

        if (fileVideo) {
            const bucketName = TRAINING_MEDIA_BUCKET;
            if (!bucketName) {
                setErrors({
                    form: "Chưa cấu hình bucket Supabase. Vui lòng kiểm tra biến môi trường.",
                });
                setLoading(false);
                return;
            }

            try {
                const uploadResult = await uploadMediaToSupabase({
                    bucket: bucketName,
                    file: fileVideo,
                    fileName: fileVideo.name,
                });
                videoUrl = uploadResult.publicUrl;
            } catch (uploadError) {
                if (
                    uploadError instanceof Error &&
                    uploadError.message.includes("The resource already exists")
                ) {
                    setErrors({
                        form: "File này đã tồn tại. Không thể up file",
                    });
                    setLoading(false);
                    return;
                } else {
                    setErrors({
                        form: "Không thể tải file. Vui lòng thử lại.",
                    });
                    setLoading(false);
                    return;
                }
            }
        }

        const payload: CreateLessonPayload = {
            title: form.title.trim(),
            description: form.description.trim(),
            content: form.content.trim(),
            videoUrl: videoUrl,
            point: Number(form.point),
            orderIndex: Number(form.orderIndex),
            trainingId: training.id,
            isActive: form.isActive,
        };

        try {
            if (mode === "edit" && lesson) {
                await updateLesson(lesson.id, payload);
                toast.success("Cập nhật bài học thành công!", { toastId: `update-lesson-${lesson.id}` });
            } else {
                await createLesson(training.id, payload);
                toast.success("Tạo bài học mới thành công!", { toastId: "create-lesson" });
            }
            onSuccess();
            onClose();
        } catch (error) {
            const serverDesc =
                (error as { response?: { data?: { desc?: string; error?: string } } })
                    ?.response?.data?.desc ||
                (error as { response?: { data?: { error?: string } } })?.response?.data
                    ?.error ||
                (error instanceof Error
                    ? error.message
                    : mode === "edit"
                        ? "Không thể cập nhật bài học"
                        : "Không thể tạo bài học mới");
            toast.error(serverDesc, { toastId: `lesson-error-${mode}` });
            setErrors({ form: serverDesc });
        } finally {
            setLoading(false);
            setFileVideo(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl [&>button]:hidden z-[111] flex flex-col"
                overlayClassName="z-[110]"
            >
                {/* Header - Fixed */}
                <div className="bg-[#78A243] p-5 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">
                                {mode === "edit" ? "Cập nhật bài học" : "Thêm bài học mới"}
                            </DialogTitle>
                            <p className="text-sm text-white/80 mt-0.5">
                                Khóa: <strong>{training?.name}</strong>
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={loading}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {errors.form && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-semibold">{errors.form}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Tên bài học"
                                value={form.title}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, title: e.target.value }))
                                }
                                className={`w-full px-4 py-3 border-2 ${errors.title ? "border-red-400" : "border-gray-200"
                                    } rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none`}
                            />
                            {errors.title && (
                                <p className="text-xs text-red-600 font-medium">{errors.title}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Điểm bài học <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={form.point}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, point: e.target.value }))
                                }
                                className={`w-full px-4 py-3 border-2 ${errors.point ? "border-red-400" : "border-gray-200"
                                    } rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none`}
                            />
                            {errors.point && (
                                <p className="text-xs text-red-600 font-medium">{errors.point}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Thứ tự <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={form.orderIndex}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, orderIndex: e.target.value }))
                                }
                                className={`w-full px-4 py-3 border-2 ${errors.orderIndex ? "border-red-400" : "border-gray-200"
                                    } rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none`}
                            />
                            {errors.orderIndex && (
                                <p className="text-xs text-red-600 font-medium">{errors.orderIndex}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Trạng thái
                            </label>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    aria-label={
                                        form.isActive ? "Ẩn bài học" : "Kích hoạt bài học"
                                    }
                                    type="button"
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? "bg-[#78A243]" : "bg-gray-300"
                                        }`}
                                    onClick={() =>
                                        setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                                    }
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                                <span className="text-sm text-gray-600">
                                    {form.isActive ? "Đang hoạt động" : "Đã ẩn"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Mô tả ngắn <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Mô tả ngắn gọn nội dung bài học"
                            className={`w-full px-4 py-3 border-2 ${errors.description ? "border-red-400" : "border-gray-200"
                                } rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none outline-none`}
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                        />
                        {errors.description && (
                            <p className="text-xs text-red-600 font-medium">{errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Nội dung chi tiết <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={6}
                            placeholder="Nhập nội dung chi tiết của bài học..."
                            className={`w-full px-4 py-3 border-2 ${errors.content ? "border-red-400" : "border-gray-200"
                                } rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none outline-none`}
                            value={form.content}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, content: e.target.value }))
                            }
                        />
                        {errors.content && (
                            <p className="text-xs text-red-600 font-medium">{errors.content}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor={`lesson-video-input-${mode}`}
                        >
                            Video bài học
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            id={`lesson-video-input-${mode}`}
                            aria-label="Tải video bài học"
                            onChange={(e) => setFileVideo(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm text-gray-700 border-2 border-gray-200 rounded-xl cursor-pointer focus:border-[#78A243] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#78A243] file:text-white hover:file:bg-[#78A243]/90"
                        />
                        {fileVideo && (
                            <p className="text-xs text-gray-500">Đã chọn: {fileVideo.name}</p>
                        )}
                        {!fileVideo && mode === "edit" && form.videoUrl && (
                            <div className="flex items-center gap-2">
                                <a
                                    href={form.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#78A243] underline-offset-4 hover:underline inline-flex items-center gap-1"
                                >
                                    Xem video hiện tại
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        )}
                        {!fileVideo && mode === "create" && (
                            <p className="text-xs text-gray-500">
                                Upload video để hệ thống tự tạo đường dẫn Supabase.
                            </p>
                        )}
                        {errors.video && (
                            <p className="text-xs text-red-600 font-medium">{errors.video}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 mt-6 p-4 flex gap-3 justify-end rounded-b-2xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                            disabled={loading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {mode === "edit" ? "Cập nhật" : "Tạo bài học"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

