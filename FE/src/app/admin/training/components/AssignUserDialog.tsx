"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getAvailableUsersForTraining,
  AssignUserToTraining,
  type GetUsersByRoleResponse,
} from "@/apis/trainning.api";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import { toast } from "react-toastify";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";

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
  useBodyScrollLock(open);

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

  const handleSelectAll = () => {
    type UserWithData = {
      data?: { id: number };
      id?: number;
    };

    const allUserIds = (availableUsers || [])
      .map((userItem) => {
        const user = userItem as UserWithData;
        return user?.data?.id || user?.id;
      })
      .filter((id): id is number => id !== undefined && id !== null);

    const allSelected = allUserIds.every((id) => selectedUserIds.has(id));

    if (allSelected) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(allUserIds));
    }
  };

  const handleAssign = async () => {
    if (!trainingId || selectedUserIds.size === 0) {
      toast.warning("Vui lòng chọn ít nhất một học viên!", {
        toastId: "assign-warning-no-users",
      });
      return;
    }

    if (!training) {
      toast.error("Không tìm thấy thông tin khóa đào tạo!", {
        toastId: "assign-error-no-training",
      });
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
        const branchId = userData?.data?.branchId || userData?.branchId || 1;

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
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl [&>button]:hidden">
        {/* Header */}
        <div className="bg-[#78A243] p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Thêm học viên vào khóa đào tạo
              </DialogTitle>
              {training && (
                <p className="text-sm text-white/80 mt-0.5">
                  Khóa: <strong>{training.name}</strong>
                  {training.assignedRoles &&
                    training.assignedRoles.length > 0 && (
                      <span className="ml-2">
                        (
                        {training.assignedRoles
                          .map((role) => getRoleText(role))
                          .join(", ")}
                        )
                      </span>
                    )}
                </p>
              )}
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

        <div className="p-6">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-[#78A243] border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-gray-600">
                Đang tải danh sách học viên...
              </span>
            </div>
          ) : !availableUsers || availableUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Users size={48} className="mx-auto mb-3 text-gray-400" />
              <p>
                Không tìm thấy học viên phù hợp với vai trò của khóa đào tạo
                này.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[400px] overflow-y-auto rounded-lg p-4 space-y-2 bg-gray-50">
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
                    user?.data?.fullName || user?.fullName || `User #${userId}`;
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
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all bg-white ${isSelected
                          ? "border-[#78A243] bg-[#78A243]/5"
                          : "border-gray-200 hover:border-[#78A243]/50 hover:bg-[#78A243]/5"
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
                        className="w-5 h-5 text-[#78A243] border-[#78A243]/30 rounded focus:ring-[#78A243] focus:ring-2 cursor-pointer accent-[#78A243]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#2D1E1A] truncate">
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
              <div className="bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 mt-6 p-4 flex items-center justify-between rounded-b-2xl">
                <p className="text-sm text-gray-600">
                  Đã chọn:{" "}
                  <strong className="text-[#78A243]">
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
                    className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="flex bg-[#78A243] items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:text-white hover:bg-[#78A243]/70 rounded-lg transition-colors"
                    >
                      {(() => {
                        type UserWithData = {
                          data?: { id: number };
                          id?: number;
                        };
                        const allUserIds = (availableUsers || [])
                          .map((userItem) => {
                            const user = userItem as UserWithData;
                            return user?.data?.id || user?.id;
                          })
                          .filter(
                            (id): id is number =>
                              id !== undefined && id !== null
                          );
                        const allSelected =
                          allUserIds.length > 0 &&
                          allUserIds.every((id) => selectedUserIds.has(id));
                        return allSelected ? (
                          <>Bỏ chọn tất cả</>
                        ) : (
                          <>Chọn tất cả</>
                        );
                      })()}
                    </button>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAssign}
                    disabled={loading || selectedUserIds.size === 0}
                    className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
