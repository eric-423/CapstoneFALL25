"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Package,
  Plus,
  Warehouse as WarehouseIcon,
  AlertTriangle,
  Search,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ManagerGuard } from "@/components/guards";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";
import { Card } from "@/components/ui/card";
import {
  getWarehouseMaterials,
  getMaterials,
  type WarehouseMaterial,
  type Material,
} from "@/apis/material.api";
import { AddMaterialDialog } from "./[warehouseId]/materials/components/AddMaterialDialog";
import { getCookie } from "@/utils/cookies.client";

const PAGE_SIZE = 10;

export default function WarehousesPage() {
  const [branchId, setBranchId] = useState<number | null>(null);
  const [warehouseMaterials, setWarehouseMaterials] = useState<
    WarehouseMaterial[]
  >([]);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("materialName");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  useEffect(() => {
    const branchIdFromCookie = getCookie("branchId");
    if (branchIdFromCookie) {
      setBranchId(parseInt(branchIdFromCookie));
    } else {
      toast.error("Không tìm thấy branchId trong cookie!");
      setLoading(false);
    }
  }, []);

  const fetchWarehouseMaterials = useCallback(async () => {
    if (!branchId) return;

    try {
      setLoading(true);
      const [warehouseData, allMaterialsResponse] = await Promise.all([
        getWarehouseMaterials(branchId),
        getMaterials({ size: 1000 }),
      ]);
      setWarehouseMaterials(warehouseData);
      setAllMaterials(allMaterialsResponse.data.content);
      setPage(1);
    } catch (error) {
      console.error("fetchWarehouseMaterials error:", error);
      toast.error("Không thể tải danh sách nguyên liệu!");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchWarehouseMaterials();
    }
  }, [branchId, fetchWarehouseMaterials]);

  const handleAddMaterials = () => {
    setShowAddDialog(true);
  };

  const handleAddSuccess = () => {
    fetchWarehouseMaterials();
  };

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = [...warehouseMaterials];

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.materialName?.toLowerCase().includes(keyword) ||
          m.materialId.toString().includes(keyword) ||
          m.materialTypeName?.toLowerCase().includes(keyword)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((m) => m.materialTypeName === typeFilter);
    }

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "materialName":
          aValue = a.materialName || "";
          bValue = b.materialName || "";
          break;
        case "materialTypeName":
          aValue = a.materialTypeName || "";
          bValue = b.materialTypeName || "";
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "threshold":
          aValue = a.threshold;
          bValue = b.threshold;
          break;
        case "status":
          const aStatus = a.quantity < a.threshold ? 0 : 1;
          const bStatus = b.quantity < b.threshold ? 0 : 1;
          aValue = aStatus;
          bValue = bStatus;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "ASC" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "ASC" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [warehouseMaterials, searchKeyword, typeFilter, sortBy, sortDirection]);

  const totalMaterials = filteredAndSortedMaterials.length;
  const lowStockMaterials = filteredAndSortedMaterials.filter(
    (m) => m.quantity < m.threshold
  ).length;
  const totalQuantity = filteredAndSortedMaterials.reduce(
    (sum, m) => sum + m.quantity,
    0
  );

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    warehouseMaterials.forEach((m) => {
      if (m.materialTypeName) {
        types.add(m.materialTypeName);
      }
    });
    return Array.from(types).sort();
  }, [warehouseMaterials]);

  const totalPages =
    filteredAndSortedMaterials.length === 0
      ? 1
      : Math.ceil(filteredAndSortedMaterials.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedMaterials = filteredAndSortedMaterials.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );
  const displayStart =
    filteredAndSortedMaterials.length === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(
    startIndex + PAGE_SIZE,
    filteredAndSortedMaterials.length
  );

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortDirection("ASC");
    }
    setPage(1);
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

  const handleClearFilters = () => {
    setSearchKeyword("");
    setTypeFilter("");
    setPage(1);
  };

  if (loading) {
    return (
      <ManagerGuard>
        <AdminPageLayout>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#78A243] rounded-full animate-spin mb-4"></div>
            <p className="text-[#2D1E1A]/70">Đang tải dữ liệu...</p>
          </div>
        </AdminPageLayout>
      </ManagerGuard>
    );
  }

  return (
    <ManagerGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Kho & Nguyên liệu"
          icon={WarehouseIcon}
          actions={
            <Button
              onClick={handleAddMaterials}
              className="bg-[#EC6426] hover:bg-[#EC6426]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nguyên liệu
            </Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <AdminCard
            title="Tổng nguyên liệu"
            value={totalMaterials}
            icon={Package}
            subtitle="Tổng số loại trong kho"
          />
          <AdminCard
            title="Sắp hết hàng"
            value={lowStockMaterials}
            icon={AlertTriangle}
            subtitle="Nguyên liệu dưới ngưỡng"
          />
          <AdminCard
            title="Tổng số lượng"
            value={Math.round(totalQuantity).toLocaleString("vi-VN")}
            icon={Package}
            subtitle="Tổng số lượng tồn kho"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
              <Input
                placeholder="Tìm kiếm nguyên liệu..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
              />
            </div>
            {uniqueTypes.length > 0 && (
              <FilterDropdown
                label="Tất cả loại"
                title="Lọc theo loại"
                value={typeFilter}
                onChange={(value) => {
                  setTypeFilter(value);
                  setPage(1);
                }}
                items={uniqueTypes.map((type) => ({
                  value: type,
                  label: type,
                }))}
                className="w-[150px]"
              />
            )}
            {(searchKeyword || typeFilter) && (
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
              value={PAGE_SIZE.toString()}
              onChange={() => {
                setPage(1);
              }}
              items={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
              ]}
              showAllOption={false}
              className="w-[80px]"
            />
            <span className="text-sm text-[#2D1E1A]/80 whitespace-nowrap">
              Tổng:{" "}
              <span className="font-bold text-[#78A243]">
                {filteredAndSortedMaterials.length}
              </span>
            </span>
          </div>
        </div>

        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-white border-b-2 border-gray-300">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("materialName")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Nguyên liệu
                      {getSortIcon("materialName")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("materialTypeName")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Loại
                      {getSortIcon("materialTypeName")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Tồn kho
                      {getSortIcon("quantity")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("threshold")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Ngưỡng
                      {getSortIcon("threshold")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Trạng thái
                      {getSortIcon("status")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#78A243]/10">
                {paginatedMaterials.map((material) => {
                  const isLowStock = material.quantity < material.threshold;
                  const stockPercentage =
                    (material.quantity / material.threshold) * 100;

                  return (
                    <tr
                      key={material.materialId}
                      className="hover:bg-[#EBD187]/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-brown">
                              {material.materialName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {material.materialId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-[#EC6426]/10 text-[#EC6426] border-[#EC6426]/30">
                          {material.materialTypeName}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#EC6426]">
                            {material.quantity} {material.unit}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                stockPercentage >= 100
                                  ? "bg-[#78A243]"
                                  : stockPercentage >= 50
                                    ? "bg-[#EBD187]"
                                    : "bg-[#DA7339]"
                              }`}
                              style={{
                                width: `${Math.min(stockPercentage, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[#2D1E1A]">
                          {material.threshold} {material.unit}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {isLowStock ? (
                          <Badge className="bg-[#EBD187]/30 text-[#DA7339] border-[#DA7339]/30">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Sắp hết ({Math.round(stockPercentage)}%)
                          </Badge>
                        ) : (
                          <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30">
                            Đủ hàng ({Math.round(stockPercentage)}%)
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedMaterials.length > 0 && (
            <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#2D1E1A]/80">
                  Hiển thị {displayStart} - {displayEnd} /{" "}
                  {filteredAndSortedMaterials.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                  >
                    Trước
                  </Button>
                  <div className="text-sm font-semibold text-[#2D1E1A]">
                    {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </div>
          )}

          {filteredAndSortedMaterials.length === 0 && (
            <div className="p-12 text-center text-[#2D1E1A]/70">
              <Package className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
              <p className="font-semibold">Kho chưa có nguyên liệu nào</p>
              <Button
                onClick={handleAddMaterials}
                variant="outline"
                className="mt-4 border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm nguyên liệu đầu tiên
              </Button>
            </div>
          )}
        </Card>

        {branchId && (
          <AddMaterialDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            warehouseId={branchId}
            availableMaterials={allMaterials}
            onSuccess={handleAddSuccess}
          />
        )}
      </AdminPageLayout>
    </ManagerGuard>
  );
}
