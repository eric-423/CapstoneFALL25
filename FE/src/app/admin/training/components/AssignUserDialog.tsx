"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAvailableUsersForTraining,
  AssignUserToTraining,
  type GetUsersByRoleResponse,
} from "@/apis/trainning.api";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import { toast } from "react-toastify";

interface AssignUserDialogProps {
  open: boolean;
  trainingId: number | null;
  training: TrainingCourse | null;
  onClose: () => void;
  onSuccess: () => void;
  getRoleText: (role: StaffRole) => string;
}

export function AssignUserDialog({
  open,
  trainingId,
  training,
  onClose,
  onSuccess,
  getRoleText,
}: AssignUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<
    GetUsersByRoleResponse["data"]["content"]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (open && trainingId) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          const response = await getAvailableUsersForTraining(trainingId);
          const users = response?.data?.content || [];
          setAvailableUsers(Array.isArray(users) ? users : []);
        } catch (error) {
          console.log("Failed to fetch available users:", error);
          setAvailableUsers([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    } else {
      setAvailableUsers([]);
      setSelectedUserIds(new Set());
    }
  }, [open, trainingId]);

  const handleAssign = async () => {
    if (!trainingId || selectedUserIds.size === 0) {
      toast.warning("Vui lòng chọn ít nhất một học viên!", { toastId: "assign-warning-no-users" });
      return;
    }

    if (!training) {
      toast.error("Không tìm thấy thông tin khóa đào tạo!", { toastId: "assign-error-no-training" });
      return;
    }

    try {
      setLoading(true);
      const roleId = training.roleId || 1;
      type UserWithBranch = {
        data?: { id: number; branchId?: number };
        id?: number;
        branchId?: number;
      };

      const selectedUsersData = (availableUsers || []).filter((u) => {
        const user = u as UserWithBranch;
        const uid = user?.data?.id || user?.id;
        return uid && selectedUserIds.has(uid);
      }) as UserWithBranch[];
      const usersByBranch = new Map<number, number[]>();

      for (const userId of selectedUserIds) {
        const userData = selectedUsersData.find((u) => {
          const user = u as UserWithBranch;
          const uid = user?.data?.id || user?.id;
          return uid === userId;
        }) as UserWithBranch | undefined;
        const branchId =
          userData?.data?.branchId || userData?.branchId || 1;

        if (!usersByBranch.has(branchId)) {
          usersByBranch.set(branchId, []);
        }
        usersByBranch.get(branchId)!.push(userId);
      }

      for (const [branchId, userIds] of usersByBranch) {
        await AssignUserToTraining(trainingId, userIds, branchId, roleId);
      }

      toast.success(
        `Đã thêm ${selectedUserIds.size} học viên vào khóa đào tạo thành công!`,
        { toastId: `assign-users-${trainingId}` }
      );
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
          : "Không thể thêm học viên vào khóa đào tạo!");
      toast.error(serverDesc, { toastId: `assign-error-${trainingId}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm học viên vào khóa đào tạo</DialogTitle>
          <DialogDescription>
            {training && (
              <span>
                Chọn học viên cho khóa: <strong>{training.name}</strong>
                {training.assignedRoles &&
                  training.assignedRoles.length > 0 && (
                    <span className="ml-2">
                      (Vai trò:{" "}
                      {training.assignedRoles
                        .map((role) => getRoleText(role))
                        .join(", ")}
                      )
                    </span>
                  )}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-gray-600">Đang tải danh sách học viên...</span>
          </div>
        ) : !availableUsers || availableUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Users size={48} className="mx-auto mb-3 text-gray-400" />
            <p>
              Không tìm thấy học viên phù hợp với vai trò của khóa đào tạo này.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto rounded-lg p-4 space-y-2">
              {(availableUsers || []).map((userItem) => {
                type UserWithData = {
                  data?: {
                    id: number;
                    fullName?: string;
                    email?: string;
                    phone?: string;
                  };
                  id?: number;
                  fullName?: string;
                  email?: string;
                  phone?: string;
                };
                const user = userItem as UserWithData;
                const userId = user?.data?.id || user?.id;
                if (!userId) return null;

                const isSelected = selectedUserIds.has(userId);
                const fullName =
                  user?.data?.fullName ||
                  user?.fullName ||
                  `User #${userId}`;
                const email = user?.data?.email || user?.email || "";
                const phone = user?.data?.phone || user?.phone || "";

                return (
                  <div
                    key={userId}
                    onClick={() => {
                      const newSelected = new Set(selectedUserIds);
                      if (isSelected) {
                        newSelected.delete(userId);
                      } else {
                        newSelected.add(userId);
                      }
                      setSelectedUserIds(newSelected);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "border-brown-200 hover:border-orange-300 hover:bg-brown-50"
                    }`}
                  >
                    <Input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const newSelected = new Set(selectedUserIds);
                        if (isSelected) {
                          newSelected.delete(userId);
                        } else {
                          newSelected.add(userId);
                        }
                        setSelectedUserIds(newSelected);
                      }}
                      className="w-5 h-5 border-radius-10 text-orange-500 border-orange-300 rounded focus:ring-orange-500 focus:ring-2 focus:border-radius-10 cursor-pointer accent-orange-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {fullName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {email} {phone && `• ${phone}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Đã chọn:{" "}
                <strong className="text-orange-600">
                  {selectedUserIds.size}
                </strong>{" "}
                học viên
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleAssign}
                  disabled={loading || selectedUserIds.size === 0}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Thêm{" "}
                      {selectedUserIds.size > 0
                        ? `${selectedUserIds.size} `
                        : ""}
                      học viên
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

