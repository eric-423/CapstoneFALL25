"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Edit2,
  Ban,
  ShieldCheck,
  UserCheck,
  Eye,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminCard } from "../components/AdminCard";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { getAllUsers, type UserSearchRequest } from "@/apis/user.api";
import { banUser, unbanUser, type User } from "@/apis/admin-user.api";
import { getBranches, type Branch } from "@/apis/branch.api";
import { getRoles, type Role } from "@/apis/role.api";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { RolesManagementModal } from "./components/RolesManagementModal";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/utils/hooks/useAuth";
import { UserFormDialog } from "./components/UserFormDialog";

export default function UsersManagementPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "ban" | "unban" | null;
    userId: number;
    userName: string;
  }>({
    open: false,
    type: null,
    userId: 0,
    userName: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    verified: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [branchesData, rolesData] = await Promise.all([
          getBranches(),
          getRoles(),
        ]);
        setBranches(branchesData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    loadData();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const searchRequest: UserSearchRequest = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };
      if (debouncedSearchKeyword)
        searchRequest.keyword = debouncedSearchKeyword;
      if (roleFilter) searchRequest.role = roleFilter;
      if (statusFilter) {
        searchRequest.isBan = statusFilter === "inactive";
      }
      if (branchFilter) {
        const branchId = parseInt(branchFilter);
        if (!isNaN(branchId)) {
          searchRequest.branchId = branchId;
        }
      }

      const response = await getAllUsers(searchRequest);
      setUsers(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);

      // Calculate stats from ALL filtered results
      let allFilteredUsers = response.data.content;

      if (response.data.totalElements > response.data.content.length) {
        const statsRequest = {
          ...searchRequest,
          page: 0,
          size: response.data.totalElements,
        };
        const statsResponse = await getAllUsers(statsRequest);
        allFilteredUsers = statsResponse.data.content;
      }

      setStats({
        total: response.data.totalElements,
        active: allFilteredUsers.filter((u: User) => !u.isBan).length,
        banned: allFilteredUsers.filter((u: User) => u.isBan).length,
        verified: allFilteredUsers.filter(
          (u: User) => u.emailVerified || u.phoneVerified
        ).length,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchKeyword,
    roleFilter,
    statusFilter,
    branchFilter,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = () => {
    router.push("/admin/users/create");
  };

  const handleEditUser = (user: User) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleConfirmAction = async () => {
    try {
      setActionLoading(true);

      if (confirmDialog.type === "ban") {
        await banUser(confirmDialog.userId);
        toast.success(
          `Đã khóa tài khoản "${confirmDialog.userName}" thành công!`
        );
      } else if (confirmDialog.type === "unban") {
        await unbanUser(confirmDialog.userId);
        toast.success(
          `Đã mở khóa tài khoản "${confirmDialog.userName}" thành công!`
        );
      }

      await fetchUsers();
      setConfirmDialog({ open: false, type: null, userId: 0, userName: "" });
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

  const handleClearFilters = () => {
    setSearchKeyword("");
    setDebouncedSearchKeyword("");
    setRoleFilter("");
    setStatusFilter("");
    setBranchFilter("");
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortDirection("ASC");
    }
    setCurrentPage(0);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return (
        <div className="flex flex-col -space-y-1">
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
      );
    }
    return sortDirection === "ASC" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#78A243]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#78A243]" />
    );
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Quản lý người dùng"
        icon={Users}
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowRolesModal(true)}
              variant="outline"
              className="border-[#78A243] bg-[#78A243]/10 text-[#78A243] hover:bg-[#78A243]/20 font-semibold"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Quản lý vai trò
            </Button>
            <Button
              onClick={handleCreateUser}
              className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm người dùng
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AdminCard
          title="Tổng người dùng"
          value={stats.total}
          icon={Users}
          subtitle={
            debouncedSearchKeyword || roleFilter || statusFilter || branchFilter
              ? "Kết quả tìm kiếm"
              : "Tài khoản trong hệ thống"
          }
        />
        <AdminCard
          title="Đang hoạt động"
          value={stats.active}
          icon={UserCheck}
          subtitle={
            debouncedSearchKeyword || roleFilter || statusFilter
              ? "Trong kết quả"
              : "Tài khoản có thể đăng nhập"
          }
        />
        <AdminCard
          title="Đã khóa"
          value={stats.banned}
          icon={Ban}
          subtitle={
            debouncedSearchKeyword || roleFilter || statusFilter
              ? "Trong kết quả"
              : "Tài khoản bị vô hiệu hóa"
          }
        />
        <AdminCard
          title="Đã xác thực"
          value={stats.verified}
          icon={ShieldCheck}
          subtitle={
            debouncedSearchKeyword || roleFilter || statusFilter
              ? "Trong kết quả"
              : "Xác thực Email hoặc SĐT"
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchKeyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchKeyword(e.target.value)
              }
              className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
            />
            {searchKeyword && searchKeyword !== debouncedSearchKeyword && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#78A243]/40 border-t-[#78A243] rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <FilterDropdown
            label="Chọn vai trò"
            title="Lọc theo vai trò"
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value);
              setCurrentPage(0);
            }}
            items={roles.map((role) => ({
              value: role.name,
              label: role.name,
            }))}
          />
          <FilterDropdown
            label="Chọn trạng thái"
            title="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(0);
            }}
            items={[
              { value: "active", label: "Hoạt động" },
              { value: "inactive", label: "Đã khóa" },
            ]}
          />
          <FilterDropdown
            label="Chọn chi nhánh"
            title="Lọc theo chi nhánh"
            value={branchFilter}
            onChange={(value) => {
              setBranchFilter(value);
              setCurrentPage(0);
            }}
            items={branches.map((branch) => ({
              value: branch.id.toString(),
              label: branch.name,
            }))}
          />

          {(searchKeyword || roleFilter || statusFilter || branchFilter) && (
            <Button onClick={handleClearFilters} variant="ghost" size="sm">
              <X className="h-4 w-4 mr-1" />
              Xóa lọc
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-[#2D1E1A] font-medium whitespace-nowrap">
            Hiển thị:
          </label>
          <FilterDropdown
            label="Hiển thị"
            title="Số lượng hiển thị"
            value={pageSize.toString()}
            onChange={(value) => {
              setPageSize(parseInt(value));
              setCurrentPage(0);
            }}
            items={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
            showAllOption={false}
            className="w-[80px]"
          />
          <span className="text-sm text-[#2D1E1A]/80 whitespace-nowrap">
            Tổng:{" "}
            <span className="font-bold text-[#78A243]">{totalElements}</span>
          </span>
        </div>
      </div>
      <Card className="overflow-hidden py-0">
        {loading ? (
          <div className="p-12 text-center text-[#2D1E1A]/70">
            <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
            <p>Đang tải danh sách người dùng...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#2D1E1A]/70">
            <Users className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
            <p className="font-semibold">Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead className="bg-white border-b-2 border-grey-300">
                  <tr>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        ID
                        {getSortIcon("id")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("fullName")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Họ tên
                        {getSortIcon("fullName")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Email
                        {getSortIcon("email")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("phoneNumber")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        SĐT
                        {getSortIcon("phoneNumber")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Vai trò
                        {getSortIcon("role")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("branchId")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Chi nhánh
                        {getSortIcon("branchId")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort("isBan")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Trạng thái
                        {getSortIcon("isBan")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#78A243]/10">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#EBD187]/10 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-[#2D1E1A]">
                        {user.id}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#2D1E1A]">
                            {user.fullName}
                          </span>
                          {user.isBusy && (
                            <Badge className="bg-[#EBD187]/50 text-[#DA7339] border-[#DA7339]/30 text-xs w-fit mt-1">
                              Đang bận
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#2D1E1A]">
                            {user.email}
                          </span>
                          {user.emailVerified && (
                            <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#2D1E1A]">
                            {user.phoneNumber}
                          </span>
                          {user.phoneVerified && (
                            <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-[#DA7339]/20 text-[#DA7339] border-[#DA7339]/30 font-semibold">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2D1E1A]">
                        {branches.find((b) => b.id === user.branchId)?.name ||
                          "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isBan ? (
                          <Badge className="bg-red-100 text-red-700 border-red-300">
                            Đã khóa
                          </Badge>
                        ) : (
                          <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30">
                            Hoạt động
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {String(currentUser?.id) === String(user.id) ||
                          roles.find((r) => r.id === 1)?.name === user.role ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                              disabled
                              title={
                                String(currentUser?.id) === String(user.id)
                                  ? "Không thể xem chính mình"
                                  : roles.find((r) => r.id === 1)?.name ===
                                      user.role
                                    ? "Không thể xem Admin/Owner"
                                    : "Xem chi tiết"
                              }
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Link href={`/admin/users/${user.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                          <Button
                            onClick={() => handleEditUser(user)}
                            size="sm"
                            variant="outline"
                            className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                            disabled={
                              String(currentUser?.id) === String(user.id) ||
                              roles.find((r) => r.id === 1)?.name === user.role
                            }
                            title={
                              String(currentUser?.id) === String(user.id)
                                ? "Không thể chỉnh sửa chính mình"
                                : roles.find((r) => r.id === 1)?.name ===
                                    user.role
                                  ? "Không thể chỉnh sửa Admin/Owner"
                                  : "Chỉnh sửa"
                            }
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          {user.isBan ? (
                            <Button
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  type: "unban",
                                  userId: user.id,
                                  userName: user.fullName,
                                })
                              }
                              size="sm"
                              variant="outline"
                              className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                              disabled={
                                actionLoading ||
                                String(currentUser?.id) === String(user.id) ||
                                roles.find((r) => r.id === 1)?.name ===
                                  user.role
                              }
                              title={
                                String(currentUser?.id) === String(user.id)
                                  ? "Không thể mở khóa chính mình"
                                  : roles.find((r) => r.id === 1)?.name ===
                                      user.role
                                    ? "Không thể mở khóa Admin/Owner"
                                    : "Mở khóa"
                              }
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  type: "ban",
                                  userId: user.id,
                                  userName: user.fullName,
                                })
                              }
                              size="sm"
                              variant="outline"
                              className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                              disabled={
                                actionLoading ||
                                String(currentUser?.id) === String(user.id) ||
                                roles.find((r) => r.id === 1)?.name ===
                                  user.role
                              }
                              title={
                                String(currentUser?.id) === String(user.id)
                                  ? "Không thể khóa chính mình"
                                  : roles.find((r) => r.id === 1)?.name ===
                                      user.role
                                    ? "Không thể khóa Admin/Owner"
                                    : "Khóa tài khoản"
                              }
                            >
                              <Ban className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#2D1E1A]/80">
                    Trang{" "}
                    <span className="font-semibold">{currentPage + 1}</span> /{" "}
                    {totalPages} (Hiển thị {users.length} / {totalElements}{" "}
                    người dùng)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      variant="outline"
                      size="sm"
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={handleConfirmAction}
        title={
          confirmDialog.type === "ban" ? "Khóa tài khoản" : "Mở khóa tài khoản"
        }
        content={
          <span>
            Bạn có chắc chắn muốn{" "}
            {confirmDialog.type === "ban" ? "khóa" : "mở khóa"} tài khoản{" "}
            <span className="font-bold text-gray-900">
              {confirmDialog.userName}
            </span>
            ?
          </span>
        }
        alertMessage={
          confirmDialog.type === "ban"
            ? "Tài khoản bị khóa sẽ không thể đăng nhập vào hệ thống."
            : "Tài khoản sẽ có thể đăng nhập và sử dụng hệ thống bình thường."
        }
        confirmText={
          confirmDialog.type === "ban" ? "Khóa tài khoản" : "Mở khóa"
        }
        variant={confirmDialog.type === "ban" ? "destructive" : "success"}
        loading={actionLoading}
      />
      <RolesManagementModal
        open={showRolesModal}
        onOpenChange={setShowRolesModal}
        onRoleUpdated={fetchUsers}
      />
    </AdminPageLayout>
  );
}
