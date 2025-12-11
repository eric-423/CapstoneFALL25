"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  GraduationCap,
  X,
  Award,
  BookOpen,
  Star,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrainingCourse } from "@/utils/types/training.type";
import { TrainingLesson } from "@/apis/trainning.api";
import { getTrainningById, getTrainingUsers } from "@/apis/trainning.api";
import {
  extractTrainingDetail,
  mapTrainingCourse,
} from "../utils/trainingUtils";
import { LessonListPanel } from "../components/LessonListPanel";
import { LessonDetailPanel } from "../components/LessonDetailPanel";
import { LessonFormDialog } from "../components/LessonFormDialog";
import { useLessons, useLessonDetail } from "../components/hook/useLessons";
import { AdminGuard } from "@/components/guards";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../../components/AdminPageLayout";
import { toast } from "react-toastify";

const TRAINING_LESSON_PAGE_SIZE = 5;

const detailStatsConfig = (training: TrainingCourse, userCount: number = 0) => [
  { label: "Điểm khóa", value: training.point ?? 0, icon: Award },
  { label: "Bài học", value: training.lessonCount ?? 0, icon: BookOpen },
  {
    label: "Tổng điểm bài",
    value: training.totalLessonPoint ?? training.point ?? 0,
    icon: Star,
  },
  { label: "Học viên", value: userCount, isClickable: true, icon: Users },
];

export default function TrainingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const trainingId = Number(params.id);
  const [training, setTraining] = useState<TrainingCourse | null>(null);
  const [loading, setLoading] = useState(true);
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
    includeDeleted: false,
  });
  const [lessonsRefreshKey, setLessonsRefreshKey] = useState(0);

  const {
    lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useLessons(trainingId, lessonsPagination, lessonsRefreshKey);

  const filteredLessons = useMemo(() => {
    return lessonsData.items.filter((lesson) =>
      lessonsPagination.includeDeleted
        ? lesson.isActive === false
        : lesson.isActive !== false
    );
  }, [lessonsData.items, lessonsPagination.includeDeleted]);

  const {
    lesson: lessonDetail,
    loading: lessonDetailLoading,
    error: lessonDetailError,
  } = useLessonDetail(selectedLessonId);

  useEffect(() => {
    if (!trainingId || isNaN(trainingId)) {
      toast.error("ID khóa đào tạo không hợp lệ");
      router.push("/admin/training");
      return;
    }

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
        toast.error(message);
        router.push("/admin/training");
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, [trainingId, router, lessonsRefreshKey]);

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

  const handleBack = () => {
    router.back();
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

  if (loading) {
    return (
      <AdminGuard>
        <AdminPageLayout>
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              <span>Đang tải chi tiết khóa đào tạo...</span>
            </div>
          </div>
        </AdminPageLayout>
      </AdminGuard>
    );
  }

  if (error) {
    return (
      <AdminGuard>
        <AdminPageLayout>
          <div className="flex flex-col items-center justify-center py-16">
            <X className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </AdminPageLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Chi tiết khóa đào tạo"
          description={training?.name || "Thông tin chi tiết khóa đào tạo"}
          icon={GraduationCap}
          actions={
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-2 border-gray-300 hover:bg-gray-100 font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          }
        />

        {training && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-[#2D1E1A]">
                  {training.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${training.isActive
                    ? "bg-[#78A243]/10 text-[#78A243]"
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
              {detailStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className={`p-4 border-2 border-[#78A243]/20 shadow-none ${stat.isClickable
                      ? "hover:border-[#78A243] hover:shadow-sm transition-all"
                      : ""
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent size={14} className="text-[#78A243]" />
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        {stat.label}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-[#2D1E1A]">
                        {stat.value}
                      </p>
                      {stat.isClickable && training && (
                        <Link
                          href={`/admin/training/${training.id}/users`}
                          className="ml-2 p-1.5 rounded-lg hover:bg-[#78A243]/10 text-[#78A243] hover:text-[#78A243] transition-colors"
                          title="Xem danh sách học viên"
                        >
                          <ArrowRight size={18} />
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex align-center gap-2 px-4 py-2 rounded-lg w-[500px]">
              <p className="text-xs uppercase text-gray-500 font-semibold">
                Vai trò được gán:
              </p>
              <p className="text-xs uppercase text-[#78A243] font-bold">
                {training.roleName}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    Bài học của khóa
                  </p>
                  <p className="text-xs text-gray-500">
                    Hiển thị {filteredLessons.length} /{" "}
                    {lessonsData.totalElements} bài học
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleOpenLessonCreate}
                    disabled={!training}
                    className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-sm hover:shadow-md"
                  >
                    <Plus size={14} className="mr-1" />
                    Thêm bài học
                  </Button>
                  <button
                    type="button"
                    onClick={toggleIncludeDeletedLessons}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${lessonsPagination.includeDeleted
                      ? "border-gray-200 text-gray-500 bg-white"
                      : "border-[#78A243] text-[#78A243] bg-[#78A243]/10"
                      }`}
                  >
                    {lessonsPagination.includeDeleted
                      ? "Bài học đang ẩn"
                      : "Bài học đang hoạt động"}
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => handleLessonsPageChange("prev")}
                      disabled={!hasPrevLessonPage || lessonsLoading}
                      className="px-2 py-1 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
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
                      className="px-2 py-1 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>

              {lessonPanelView === "list" ? (
                <LessonListPanel
                  lessons={filteredLessons}
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
      </AdminPageLayout>
    </AdminGuard>
  );
}
