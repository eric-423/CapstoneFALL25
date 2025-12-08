"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table as TableIcon,
  Plus,
  Edit2,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  Search,
  Users,
  X,
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
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { getBranches, type Branch, getTablesByBranch } from "@/apis/branch.api";
import {
  type TableData,
  deactivateTable,
  activateTable,
} from "@/apis/table.api";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableFormDialog } from "./components/TableFormDialog";

export default function TablesManagementPage() {
  const router = useRouter();
  const [tables, setTables] = useState<TableData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    tableId: number;
    tableName: string;
  }>({
    open: false,
    tableId: 0,
    tableName: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [editingTableId, setEditingTableId] = useState<number | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      toast.error("Không thể tải danh sách chi nhánh!");
    }
  }, []);

  const fetchTables = useCallback(async () => {
    if (branches.length === 0 && !branchFilter) {
      return;
    }

    try {
      setLoading(true);
      let allTables: TableData[] = [];

      if (branchFilter) {
        const branchId = parseInt(branchFilter);
        if (!isNaN(branchId)) {
          const branchTables = await getTablesByBranch(branchId);
          allTables = Array.isArray(branchTables) ? branchTables : [];
        }
      } else {
        const tablesPromises = branches.map((branch) =>
          getTablesByBranch(branch.id).catch((err) => {
            console.error(
              `Failed to fetch tables for branch ${branch.id}:`,
              err
            );
            return [];
          })
        );
        const tablesResults = await Promise.all(tablesPromises);
        allTables = tablesResults.flat();
      }

      const uniqueTables = allTables
        .filter((table) => table && table.id)
        .filter(
          (table, index, self) =>
            index === self.findIndex((t) => t.id === table.id)
        );

      setTables(uniqueTables);
    } catch (error) {
      console.error("Failed to fetch tables:", error);
      toast.error("Không thể tải danh sách bàn ăn!");
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [branchFilter, branches]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleClearFilters = () => {
    setSearchKeyword("");
    setBranchFilter("");
    setStatusFilter("");
  };

  const handleDeactivateTable = (tableId: number, tableName: string) => {
    setConfirmDialog({
      open: true,
      tableId,
      tableName,
    });
  };

  const handleActivateTable = async (tableId: number, tableName: string) => {
    try {
      setActionLoading(true);
      await activateTable(tableId);
      toast.success(`Đã kích hoạt bàn "${tableName}" thành công!`);
      await fetchTables();
    } catch (error) {
      console.error("Failed to activate table:", error);
      let errorMessage = "Không thể kích hoạt bàn. Vui lòng thử lại!";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object"
      ) {
        const errorData = error.response.data as {
          desc?: string;
          message?: string;
          error?: string;
        };
        if (errorData.desc) {
          errorMessage = errorData.desc;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    try {
      setActionLoading(true);
      await deactivateTable(confirmDialog.tableId);
      toast.success(
        `Đã vô hiệu hóa bàn "${confirmDialog.tableName}" thành công!`
      );
      await fetchTables();
      setConfirmDialog({
        open: false,
        tableId: 0,
        tableName: "",
      });
    } catch (error) {
      console.error("Failed to deactivate table:", error);
      let errorMessage = "Không thể vô hiệu hóa bàn. Vui lòng thử lại!";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object"
      ) {
        const errorData = error.response.data as {
          desc?: string;
          message?: string;
          error?: string;
        };
        if (errorData.desc) {
          errorMessage = errorData.desc;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTables = tables.filter((table) => {
    const matchesKeyword =
      !searchKeyword ||
      table.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      table.note?.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && table.isActive) ||
      (statusFilter === "inactive" && !table.isActive);

    return matchesKeyword && matchesStatus;
  });

  const stats = {
    total: filteredTables.length,
    active: filteredTables.filter((t) => t.isActive).length,
    inactive: filteredTables.filter((t) => !t.isActive).length,
    withOrders: filteredTables.filter((t) => t.currentOrder !== null).length,
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Quản lý bàn ăn"
        icon={TableIcon}
        actions={
          <Button
            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
            onClick={() => setShowTableDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm bàn ăn
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AdminCard
          title="Tổng số bàn"
          value={stats.total}
          icon={TableIcon}
          subtitle={
            branchFilter || searchKeyword || statusFilter
              ? "Kết quả tìm kiếm"
              : "Bàn trong hệ thống"
          }
        />
        <AdminCard
          title="Đang hoạt động"
          value={stats.active}
          icon={CheckCircle}
          subtitle={
            branchFilter || searchKeyword || statusFilter
              ? "Trong kết quả"
              : "Bàn có thể sử dụng"
          }
        />
        <AdminCard
          title="Ngừng hoạt động"
          value={stats.inactive}
          icon={XCircle}
          subtitle={
            branchFilter || searchKeyword || statusFilter
              ? "Trong kết quả"
              : "Bàn tạm đóng"
          }
        />
        <AdminCard
          title="Có đơn hàng"
          value={stats.withOrders}
          icon={Users}
          subtitle={
            branchFilter || searchKeyword || statusFilter
              ? "Trong kết quả"
              : "Bàn đang phục vụ"
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
            <input
              type="text"
              placeholder="Tìm theo tên bàn, ghi chú..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full max-w-[300px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
            />
          </div>
          <FilterDropdown
            label="Tất cả chi nhánh"
            title="Lọc theo chi nhánh"
            value={branchFilter}
            onChange={(value) => setBranchFilter(value)}
            items={branches.map((branch) => ({
              value: branch.id.toString(),
              label: branch.name,
            }))}
          />
          <FilterDropdown
            label="Tất cả trạng thái"
            title="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            items={[
              { value: "active", label: "Đang hoạt động" },
              { value: "inactive", label: "Ngừng hoạt động" },
            ]}
          />

          {(searchKeyword || branchFilter || statusFilter) && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              size="sm"
              className="text-[#2D1E1A]/70 hover:text-[#2D1E1A] hover:bg-[#EBD187]/30"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa lọc
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-[#2D1E1A]/70">
            <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
            <p>Đang tải danh sách bàn ăn...</p>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#2D1E1A]/70">
            <TableIcon className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
            <p className="font-semibold">Không tìm thấy bàn ăn nào</p>
          </div>
        ) : (
          filteredTables.map((table) => (
            <Card
              key={table.id}
              className="p-4 hover:shadow-lg transition-all border-2 hover:border-[#78A243]/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#78A243]/20 rounded-lg flex items-center justify-center">
                    <TableIcon className="h-5 w-5 text-[#78A243]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2D1E1A]">{table.name}</h3>
                    <p className="text-xs text-gray-500">
                      {branches.find((b) => b.id === table.branchId)?.name ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    table.isActive
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }
                >
                  {table.isActive ? (
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
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#2D1E1A]">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Số chỗ: {table.seat}</span>
                </div>
                {table.note && (
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {table.note}
                  </div>
                )}
                {table.currentOrder && (
                  <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30">
                    Có đơn hàng
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                  onClick={() => {
                    setEditingTableId(table.id);
                    setShowTableDialog(true);
                  }}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`flex-1 ${
                    table.isActive
                      ? "text-red-600 border-red-300 hover:bg-red-50"
                      : "text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                  }`}
                  disabled={actionLoading}
                  onClick={() => {
                    if (table.isActive) {
                      handleDeactivateTable(table.id, table.name);
                    } else {
                      handleActivateTable(table.id, table.name);
                    }
                  }}
                >
                  {table.isActive ? (
                    <>
                      <PowerOff className="h-3 w-3 mr-1" />
                      Tắt
                    </>
                  ) : (
                    <>
                      <Power className="h-3 w-3 mr-1" />
                      Bật
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={handleConfirmDeactivate}
        title="Vô hiệu hóa bàn ăn"
        content={
          <span>
            Bạn có chắc chắn muốn vô hiệu hóa bàn{" "}
            <span className="font-bold text-gray-900">
              &quot;{confirmDialog.tableName}&quot;
            </span>
            ?
          </span>
        }
        alertMessage="Bàn đã vô hiệu hóa sẽ không thể sử dụng cho đơn hàng mới."
        confirmText="Vô hiệu hóa"
        variant="destructive"
        loading={actionLoading}
      />

      <TableFormDialog
        open={showTableDialog}
        onOpenChange={setShowTableDialog}
        onSuccess={() => {
          fetchTables();
        }}
      />
    </AdminPageLayout>
  );
}
