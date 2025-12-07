"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User as UserIcon,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  FileText,
  History,
  Edit,
  Ban,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../../components/AdminPageLayout";
import {
  getUserById,
  getUserRoleHistory,
  banUser,
  unbanUser,
  type User,
  type RoleHistory,
} from "@/apis/admin-user.api";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import Link from "next/link";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.userId as string);

  const [user, setUser] = useState<User | null>(null);
  const [roleHistory, setRoleHistory] = useState<RoleHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "ban" | "unban" | null;
  }>({ open: false, type: null });

  const fetchUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Không thể tải thông tin người dùng!");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchRoleHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const data = await getUserRoleHistory(userId);
      setRoleHistory(data);
    } catch (error) {
      console.error("Failed to fetch role history:", error);
      toast.error("Không thể tải lịch sử vai trò!");
    } finally {
      setLoadingHistory(false);
    }
  }, [userId]);

  const handleConfirmAction = async () => {
    try {
      setActionLoading(true);

      if (confirmDialog.type === "ban") {
        await banUser(userId);
        toast.success("Đã khóa tài khoản người dùng!");
        fetchUserDetail();
      } else if (confirmDialog.type === "unban") {
        await unbanUser(userId);
        toast.success("Đã mở khóa tài khoản người dùng!");
        fetchUserDetail();
      }

      setConfirmDialog({ open: false, type: null });
    } catch (error) {
      console.error("Failed to perform action:", error);
      const errorMessages = {
        ban: "Không thể khóa tài khoản!",
        unban: "Không thể mở khóa tài khoản!",
      };
      toast.error(
        `${confirmDialog.type ? errorMessages[confirmDialog.type] : "Có lỗi xảy ra!"}`
      );
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
    fetchRoleHistory();
  }, [fetchUserDetail, fetchRoleHistory]);

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin"></div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!user) {
    return (
      <AdminPageLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">Không tìm thấy người dùng</p>
          <Link href="/admin/users">
            <Button className="mt-4">Quay lại danh sách</Button>
          </Link>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title={user.fullName}
        description={`ID: ${user.id} • ${user.email}`}
        icon={UserIcon}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/admin/users/${userId}/edit`)}
              disabled={actionLoading}
              className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            {user.isBan ? (
              <Button
                onClick={() => setConfirmDialog({ open: true, type: "unban" })}
                disabled={actionLoading}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Mở khóa
              </Button>
            ) : (
              <Button
                onClick={() => setConfirmDialog({ open: true, type: "ban" })}
                disabled={actionLoading}
                variant="outline"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                <Ban className="h-4 w-4 mr-2" />
                Khóa
              </Button>
            )}
            <Link href="/admin/users">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
          </div>
        }
      />
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Badge
            className={`${user.isBan ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"}`}
          >
            {user.isBan ? (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Đã khóa
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Hoạt động
              </>
            )}
          </Badge>
          {user.emailVerified && (
            <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30">
              <Mail className="h-3 w-3 mr-1" />
              Email đã xác thực
            </Badge>
          )}
          {user.phoneVerified && (
            <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30">
              <Phone className="h-3 w-3 mr-1" />
              SĐT đã xác thực
            </Badge>
          )}
          {user.isBusy && (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
              <Clock className="h-3 w-3 mr-1" />
              Đang bận
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#2D1E1A] border-b pb-2">
              Thông tin cá nhân
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Họ và tên</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {user.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Ngày sinh</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {user.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {user.address || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {user.note && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Ghi chú</p>
                    <p className="text-sm font-semibold text-[#2D1E1A]">
                      {user.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#2D1E1A] border-b pb-2">
              Thông tin tài khoản
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Vai trò hiện tại</p>
                  <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30 font-semibold mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Điểm thành viên</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {user.memberPoint.toLocaleString("vi-VN")} điểm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-semibold text-[#2D1E1A]">
                    {new Date(user.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {user.memberAssociationName && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Hội viên</p>
                    <p className="text-sm font-semibold text-[#2D1E1A]">
                      {user.memberAssociationName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Lịch sử vai trò - 3 cột */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-bold text-[#2D1E1A] flex items-center gap-2">
              <History className="h-5 w-5 text-[#78A243]" />
              Lịch sử vai trò
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Theo dõi các thay đổi vai trò và chi nhánh của người dùng
            </p>
          </div>

          {loadingHistory ? (
            <div className="p-12 text-center text-gray-500">
              <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
              <p>Đang tải lịch sử vai trò...</p>
            </div>
          ) : roleHistory.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <History className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="font-semibold">Chưa có lịch sử vai trò</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleHistory
                  .slice()
                  .reverse()
                  .map((history) => (
                    <div
                      key={history.id}
                      className={`rounded-xl p-4 border-2 transition-all ${
                        history.isActive
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md"
                          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={`${
                              history.isActive
                                ? "bg-green-600 text-white border-green-700"
                                : "bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30"
                            } font-semibold`}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {history.roleName}
                          </Badge>
                          {history.isActive && (
                            <Badge className="bg-white text-green-700 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Hiện tại
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 font-mono">
                          #{history.id}
                        </span>
                      </div>

                      {history.branchName && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 bg-white/50 rounded-lg p-2 border border-gray-200">
                          <Building className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">
                            {history.branchName}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="font-medium">Bắt đầu:</span>
                          <span>
                            {new Date(history.startDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        {history.endDate && (
                          <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 text-red-600" />
                            <span className="font-medium">Kết thúc:</span>
                            <span>
                              {new Date(history.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Card>
      </div>
      {confirmDialog.type && (
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog({ open, type: null })}
          onConfirm={handleConfirmAction}
          title={
            confirmDialog.type === "ban"
              ? "Khóa tài khoản"
              : "Mở khóa tài khoản"
          }
          content={`Bạn có chắc chắn muốn ${confirmDialog.type === "ban" ? "khóa" : "mở khóa"} tài khoản "${user.fullName}" không?`}
          variant={confirmDialog.type === "ban" ? "destructive" : "success"}
          loading={actionLoading}
        />
      )}
    </AdminPageLayout>
  );
}
