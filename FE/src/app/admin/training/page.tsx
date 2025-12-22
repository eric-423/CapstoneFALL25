"use client";

import { useState, useMemo, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

import { AdminGuard } from "@/components/guards";
import { deleteTraining } from "@/apis/trainning.api";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import {
  TrainingStatsCards,
  TrainingSearchAndFilter,
  TrainingCourseList,
  AssignUserDialog,
  AddTrainingDialog,
} from "./components";
import { useTrainingData } from "./components/hook/useTrainingData";
import { useBodyScrollLock } from "../components/useBodyScrollLock";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function TrainingPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    training: TrainingCourse | null;
  }>({
    open: false,
    training: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [assignUserDialog, setAssignUserDialog] = useState<{
    open: boolean;
    trainingId: number | null;
  }>({
    open: false,
    trainingId: null,
  });
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(
    null
  );
  useBodyScrollLock(assignUserDialog.open || confirmDialog.open);

  const {
    filteredCourses: allFilteredCourses,
    statuses,
    totalCourses,
    activeCourses,
    totalLessons,
    totalLessonPoints,
    isLoadingTrainings,
    isFetchingTrainings,
    refetch,
  } = useTrainingData(searchQuery);

  const filteredCourses = useMemo(() => {
    if (selectedStatus === "all") return allFilteredCourses;
    return allFilteredCourses.filter(
      (course) => course.status === selectedStatus
    );
  }, [allFilteredCourses, selectedStatus]);

  const getRoleColor = (role: StaffRole) => {
    const colors: Record<StaffRole, string> = {
      CHEF: "from-orange-500 to-red-500",
      BRANCH_MANAGER: "from-blue-500 to-cyan-500",
      STAFF: "from-green-500 to-emerald-500",
      WAITER: "from-green-500 to-teal-500",
      SHIPPER: "from-purple-500 to-pink-500",
      ALL: "from-purple-500 to-indigo-500",
    };
    return colors[role];
  };

  const getRoleText = (role: StaffRole) => {
    const text: Record<StaffRole, string> = {
      CHEF: "Bếp trưởng",
      BRANCH_MANAGER: "Quản lý",
      STAFF: "Nhân viên",
      WAITER: "Phục vụ",
      SHIPPER: "Giao hàng",
      ALL: "Tất cả",
    };
    return text[role];
  };

  const openDeleteDialog = (training: TrainingCourse) => {
    setConfirmDialog({
      open: true,
      training,
    });
  };

  const closeDeleteDialog = () => {
    setConfirmDialog({
      open: false,
      training: null,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.training || deleteLoading) {
      return;
    }

    try {
      setDeleteLoading(true);
      const payload = await deleteTraining(confirmDialog.training.id);
      const message =
        payload &&
          typeof payload === "object" &&
          "desc" in payload &&
          typeof payload.desc === "string"
          ? payload.desc
          : "Xoá khóa đào tạo thành công";
      toast.success(message, {
        toastId: `delete-training-${confirmDialog.training.id}`,
      });
      setShouldRefetch(true);
      refetch();
      closeDeleteDialog();
    } catch (error) {
      const serverDesc =
        (error as { response?: { data?: { desc?: string; error?: string } } })
          ?.response?.data?.desc ||
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error;
      const message =
        serverDesc ||
        (error instanceof Error ? error.message : "Xoá khóa đào tạo thất bại");
      console.error(message);
      toast.error(message, {
        toastId: `delete-training-error-${confirmDialog.training.id}`,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenAssignUserDialog = async (course: TrainingCourse) => {
    setSelectedCourse(course);
    setAssignUserDialog({
      open: true,
      trainingId: course.id,
    });
  };

  const handleCloseAssignUserDialog = () => {
    setAssignUserDialog({
      open: false,
      trainingId: null,
    });
    setSelectedCourse(null);
  };

  const handleAssignUserSuccess = () => {
    setShouldRefetch(true);
  };

  useEffect(() => {
    if (shouldRefetch) {
      refetch().then(() => {
        setShouldRefetch(false);
      });
    }
  }, [shouldRefetch, refetch]);

  useEffect(() => {
    const refetchParam = searchParams.get("refetch");
    if (refetchParam === "true") {
      refetch().then(() => {
        // Refetch completed
      });
      window.history.replaceState({}, "", "/admin/training");
    }
  }, [searchParams, refetch]);

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Quản Lý Khóa Đào Tạo"
          description="Tạo và quản lý khóa học cho nhân viên"
          icon={GraduationCap}
          actions={
            <>
              <AddTrainingDialog
                onSuccess={async () => {
                  setShouldRefetch(true);
                  await refetch();
                }}
              />
            </>
          }
        />

        <TrainingStatsCards
          totalCourses={totalCourses}
          activeCourses={activeCourses}
          totalLessons={totalLessons}
          totalLessonPoints={totalLessonPoints}
        />

        <TrainingSearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          statuses={statuses}
          onRefetch={refetch}
          isFetching={isFetchingTrainings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-4">
          <TrainingCourseList
            courses={filteredCourses}
            isLoading={isLoadingTrainings}
            onView={() => { }}
            onDelete={openDeleteDialog}
            onAssignUsers={handleOpenAssignUserDialog}
            onRefetch={() => {
              setShouldRefetch(true);
              refetch();
            }}
            isFetching={isFetchingTrainings}
            getRoleColor={getRoleColor}
            getRoleText={getRoleText}
          />
        </div>

        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => !open && closeDeleteDialog()}
          title="Xoá khóa đào tạo"
          content={`Bạn có chắc chắn muốn xoá khóa "${confirmDialog.training?.name ?? ""}"? Hành động này không thể hoàn tác.`}
          confirmText="Xoá ngay"
          cancelText="Huỷ"
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
          variant="destructive"
        />

        <AssignUserDialog
          open={assignUserDialog.open}
          trainingId={assignUserDialog.trainingId}
          training={selectedCourse}
          onClose={handleCloseAssignUserDialog}
          onSuccess={handleAssignUserSuccess}
          getRoleText={getRoleText}
        />
      </AdminPageLayout>
    </AdminGuard>
  );
}
