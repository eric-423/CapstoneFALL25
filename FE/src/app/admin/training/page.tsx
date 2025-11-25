"use client";

import { useState, useMemo, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

import { AdminGuard } from "@/components/guards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTraining } from "@/apis/trainning.api";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import { AddTrainingDialog } from "@/app/admin/training/components/AddTrainingDialog";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import {
  TrainingStatsCards,
  TrainingSearchAndFilter,
  TrainingCourseList,
  TrainingDetailDialog,
  AssignUserDialog,
} from "./components";
import { useTrainingData } from "./components/hook/useTrainingData";

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    training: TrainingCourse | null;
    isDeleting: boolean;
  }>({
    open: false,
    training: null,
    isDeleting: false,
  });
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(
    null
  );
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

  const handleViewTraining = (trainingId: number) => {
    setSelectedTrainingId(trainingId);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedTrainingId(null);
  };

  const openDeleteDialog = (training: TrainingCourse) => {
    setDeleteDialog({
      open: true,
      training,
      isDeleting: false,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      training: null,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.training || deleteDialog.isDeleting) {
      return;
    }

    try {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
      const payload = await deleteTraining(deleteDialog.training.id);
      const message =
        payload &&
          typeof payload === "object" &&
          "desc" in payload &&
          typeof payload.desc === "string"
          ? payload.desc
          : "Xoá khóa đào tạo thành công";
      toast.success(message, { toastId: `delete-training-${deleteDialog.training.id}` });
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
      toast.error(message, { toastId: `delete-training-error-${deleteDialog.training.id}` });
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
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
      refetch();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, refetch]);

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Quản Lý Khóa Đào Tạo"
          description="Tạo và quản lý khóa học cho nhân viên"
          icon={GraduationCap}
          actions={
            <AddTrainingDialog onSuccess={() => setShouldRefetch(true)} />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TrainingCourseList
            courses={filteredCourses}
            isLoading={isLoadingTrainings}
            onView={handleViewTraining}
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

        <TrainingDetailDialog
          open={detailDialogOpen}
          trainingId={selectedTrainingId}
          onClose={handleCloseDetailDialog}
          onRefetch={() => {
            setShouldRefetch(true);
            refetch();
          }}
        />

        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open: boolean) => (open ? null : closeDeleteDialog())}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xoá khóa đào tạo</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xoá khóa{" "}
                <span className="font-semibold text-primary">
                  {deleteDialog.training?.name ?? ""}
                </span>
                ? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={closeDeleteDialog}
                disabled={deleteDialog.isDeleting}
              >
                Huỷ
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleteDialog.isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {deleteDialog.isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Xoá ngay"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
