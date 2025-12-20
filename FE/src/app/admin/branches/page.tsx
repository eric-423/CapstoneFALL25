"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Building,
  Plus,
  Edit2,
  MapPin,
  Phone,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  Search,
  Crown,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";
import {
  getBranchStatistics,
  activateBranch,
  deactivateBranch,
  type BranchStatistics,
  type BranchDetail,
} from "@/apis/branch.api";
import { BranchFormDialog } from "./components/BranchFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FilterDropdown } from "@/components/common/FilterDropdown";

export default function BranchesManagementPage() {
  const [statistics, setStatistics] = useState<BranchStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  // Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDetail | null>(null);

  // Confirm dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmType, setConfirmType] = useState<"activate" | "deactivate">(
    "activate"
  );
  const [selectedBranch, setSelectedBranch] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBranchStatistics();
      setStatistics(data);
    } catch (error) {
      console.error("Failed to fetch branch statistics:", error);
      toast.error("Không thể tải danh sách chi nhánh!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleCreateBranch = () => {
    setEditingBranch(null);
    setShowDialog(true);
  };

  const handleEditBranch = (branch: BranchDetail) => {
    setEditingBranch(branch);
    setShowDialog(true);
  };

  const handleActivate = (branchId: number, branchName: string) => {
    setSelectedBranch({ id: branchId, name: branchName });
    setConfirmType("activate");
    setShowConfirmDialog(true);
  };

  const handleDeactivate = (branchId: number, branchName: string) => {
    setSelectedBranch({ id: branchId, name: branchName });
    setConfirmType("deactivate");
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedBranch) return;

    try {
      setActionLoading(true);

      if (confirmType === "activate") {
        await activateBranch(selectedBranch.id);
        toast.success(`Đã kích hoạt chi nhánh "${selectedBranch.name}"!`);
      } else {
        await deactivateBranch(selectedBranch.id);
        toast.success(`Đã vô hiệu hóa chi nhánh "${selectedBranch.name}"!`);
      }

      await fetchStatistics();
      setShowConfirmDialog(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error("Failed to perform action:", error);
      toast.error(
        `Không thể ${confirmType === "activate" ? "kích hoạt" : "vô hiệu hóa"} chi nhánh!`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    fetchStatistics();
  };

  const handleClearFilters = () => {
    setSearchKeyword("");
    setStatusFilter("");
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortDirection("ASC");
    }
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

  // Filter and sort branches
  const filteredBranches = (() => {
    const filtered =
      statistics?.branches.filter((branch) => {
        const matchesKeyword =
          !searchKeyword ||
          branch.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          branch.phoneNumber.includes(searchKeyword);

        const matchesStatus =
          !statusFilter ||
          (statusFilter === "active" && branch.isActive) ||
          (statusFilter === "inactive" && !branch.isActive);

        return matchesKeyword && matchesStatus;
      }) || [];

    // Sort branches
    return [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "address":
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
          break;
        case "phoneNumber":
          aValue = a.phoneNumber;
          bValue = b.phoneNumber;
          break;
        case "isActive":
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        case "id":
        default:
          aValue = a.id;
          bValue = b.id;
          break;
      }

      if (aValue < bValue) {
        return sortDirection === "ASC" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "ASC" ? 1 : -1;
      }
      return 0;
    });
  })();

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Quản lý chi nhánh"
        icon={Building}
        actions={
          <Button
            onClick={handleCreateBranch}
            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm chi nhánh
          </Button>
        }
      />

      {/* Stats */}
      {statistics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminCard
            title="Tổng chi nhánh"
            value={statistics.totalBranches}
            icon={Building}
            subtitle="Chi nhánh trong hệ thống"
          />
          <AdminCard
            title="Đang hoạt động"
            value={statistics.activeBranches}
            icon={CheckCircle}
            subtitle="Chi nhánh đang mở cửa"
          />
          <AdminCard
            title="Ngừng hoạt động"
            value={statistics.inactiveBranches}
            icon={XCircle}
            subtitle="Chi nhánh tạm đóng"
          />
          <AdminCard
            title="Chi nhánh chính"
            value={statistics.parentBranches}
            icon={Crown}
            subtitle="Chi nhánh cấp cao"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
            <input
              type="text"
              placeholder="Tìm theo tên, địa chỉ, số điện thoại..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full max-w-[300px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
            />
          </div>
          <FilterDropdown
            label="Tất cả trạng thái"
            title="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            items={[
              { value: "active", label: "Đang hoạt động" },
              { value: "inactive", label: "Ngừng hoạt động" },
            ]}
            className="w-[180px]"
          />

          {(searchKeyword || statusFilter) && (
            <Button onClick={handleClearFilters} variant="ghost" size="sm">
              <X className="h-4 w-4 mr-1" />
              Xóa lọc
            </Button>
          )}
        </div>
      </div>

      {/* Branches Table */}
      <Card className="overflow-hidden py-0">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
            <p>Đang tải danh sách chi nhánh...</p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Building className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
            <p className="font-semibold">Không tìm thấy chi nhánh nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b-2 border-grey-300">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Chi nhánh
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("address")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Địa chỉ
                      {getSortIcon("address")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("phoneNumber")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Số điện thoại
                      {getSortIcon("phoneNumber")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("isActive")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Trạng thái
                      {getSortIcon("isActive")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-[#2D1E1A]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#78A243]/10">
                {filteredBranches.map((branch) => (
                  <tr
                    key={branch.id}
                    className="hover:bg-[#EBD187]/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[#2D1E1A]">
                              {branch.name}
                            </p>
                            {branch.isParent && (
                              <Badge className="bg-[#EBD187]/50 text-[#DA7339] border-[#DA7339]/30">
                                <Crown className="h-3 w-3 mr-1" />
                                Chính
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            ID: {branch.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#2D1E1A] line-clamp-2">
                          {branch.address}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-[#2D1E1A]">
                          {branch.phoneNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${branch.isActive
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                          }`}
                      >
                        {branch.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Ngừng
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleEditBranch(branch)}
                          size="sm"
                          variant="outline"
                          className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                          disabled={actionLoading}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        {branch.isActive ? (
                          <Button
                            onClick={() =>
                              handleDeactivate(branch.id, branch.name)
                            }
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={actionLoading}
                          >
                            <PowerOff className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              handleActivate(branch.id, branch.name)
                            }
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            disabled={actionLoading}
                          >
                            <Power className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <BranchFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        branch={editingBranch}
        onSuccess={handleDialogSuccess}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmAction}
        title={
          confirmType === "activate"
            ? "Kích hoạt chi nhánh"
            : "Vô hiệu hóa chi nhánh"
        }
        content={
          <span>
            Bạn có chắc chắn muốn{" "}
            {confirmType === "activate" ? "kích hoạt" : "vô hiệu hóa"} chi nhánh{" "}
            <span className="font-bold text-gray-900">
              {selectedBranch?.name}
            </span>
            ?
          </span>
        }
        alertMessage={
          confirmType === "activate"
            ? "Chi nhánh sẽ bắt đầu hoạt động và có thể nhận đơn hàng."
            : "Chi nhánh sẽ tạm ngừng hoạt động và không thể nhận đơn hàng mới."
        }
        confirmText={confirmType === "activate" ? "Kích hoạt" : "Vô hiệu hóa"}
        variant={confirmType === "activate" ? "success" : "destructive"}
        loading={actionLoading}
      />
    </AdminPageLayout>
  );
}
