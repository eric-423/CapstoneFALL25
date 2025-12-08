"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Ruler,
  Beaker,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";
import { MaterialFormDialog } from "./components/MaterialFormDialog";
import { MaterialTypesManagerDialog } from "./components/MaterialTypesManagerDialog";
import { UnitsManagerDialog } from "./components/UnitsManagerDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import {
  Material,
  MaterialSearchRequest,
  getMaterials,
  deleteMaterial,
} from "@/apis/material.api";
import { getUnits, type Unit } from "@/apis/unit.api";
import { MaterialNutrientForm } from "./components/MaterialNutrientForm";

export default function MaterialsPage() {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showNutrientDialog, setShowNutrientDialog] = useState(false);
  const [nutrientMaterial, setNutrientMaterial] = useState<Material | null>(
    null
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [includeDeleted] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  // Dialog states
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Confirm dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(
    null
  );

  // Material types manager dialog
  const [showTypesManager, setShowTypesManager] = useState(false);
  // Units manager dialog
  const [showUnitsManager, setShowUnitsManager] = useState(false);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);

      const searchRequest: MaterialSearchRequest = {
        includeDeleted,
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };

      const [materialsResponse, unitsResponse] = await Promise.all([
        getMaterials(searchRequest),
        getUnits(),
      ]);

      setMaterials(materialsResponse.data.content);
      setTotalElements(materialsResponse.data.totalElements);
      setTotalPages(materialsResponse.data.totalPages);
      setUnits(unitsResponse);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, [includeDeleted, currentPage, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleCreate = () => {
    setEditingMaterial(null);
    setShowFormDialog(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowFormDialog(true);
  };

  const handleDeleteClick = (material: Material) => {
    setDeletingMaterial(material);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMaterial) return;

    try {
      setActionLoading(true);
      await deleteMaterial(deletingMaterial.id);
      toast.success(`Đã xóa nguyên liệu "${deletingMaterial.name}"!`);
      await fetchMaterials();
      setShowConfirmDialog(false);
      setDeletingMaterial(null);
    } catch (error) {
      // console.error('Failed to delete material:', error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể xóa nguyên liệu!";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchMaterials();
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate statistics (from current page only as we don't have total stats from API)
  const totalMaterialsCount = totalElements;
  const materialTypes = new Set(materials.map((m) => m.materialTypeName)).size;

  // Filter materials (client-side filter for search and type)
  const filteredMaterials = materials.filter((material) => {
    const matchesKeyword =
      !searchKeyword ||
      material.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      material.materialTypeName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

    const matchesType = !typeFilter || material.materialTypeName === typeFilter;

    return matchesKeyword && matchesType;
  });

  // Get unique material types for filter
  const uniqueTypes = Array.from(
    new Set(materials.map((m) => m.materialTypeName))
  ).sort();

  // Helper to get unit name
  const getUnitName = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? `${unit.name} (${unit.symbols})` : `ID: ${unitId}`;
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

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#78A243] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Quản lý nguyên liệu"
        icon={Package}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => setShowUnitsManager(true)}
              variant="outline"
              className="border-[#78A243] bg-[#78A243]/10 text-[#78A243] hover:bg-[#78A243]/20 font-semibold"
            >
              <Ruler className="h-4 w-4 mr-2" />
              Quản lý đơn vị
            </Button>
            <Button
              onClick={() => setShowTypesManager(true)}
              variant="outline"
              className="border-[#78A243] bg-[#78A243]/10 text-[#78A243] hover:bg-[#78A243]/20 font-semibold"
            >
              <Tag className="h-4 w-4 mr-2" />
              Quản lý loại nguyên liệu
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nguyên liệu
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <AdminCard
          title="Tổng nguyên liệu"
          value={totalMaterialsCount.toString()}
          icon={Package}
          subtitle="Tổng số loại trong kho"
        />
        <AdminCard
          title="Loại nguyên liệu"
          value={materialTypes.toString()}
          icon={Package}
          subtitle="Số loại nguyên liệu khác nhau"
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
          <FilterDropdown
            label="Tất cả loại"
            title="Lọc theo loại"
            value={typeFilter}
            onChange={(value) => setTypeFilter(value)}
            items={uniqueTypes.map((type) => ({
              value: type,
              label: type,
            }))}
            className="w-[120px]"
          />
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

      <div className="bg-white rounded-xl border border-[#78A243]/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b-2 border-grey-300">
              <tr>
                <th
                  className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1.5">
                    Nguyên liệu
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("materialTypeName")}
                >
                  <div className="flex items-center gap-1.5">
                    Loại
                    {getSortIcon("materialTypeName")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("quantity")}
                >
                  <div className="flex items-center gap-1.5">
                    Tổng tồn kho
                    {getSortIcon("quantity")}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-[#2D1E1A]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#78A243]/10">
              {filteredMaterials.map((material) => {
                return (
                  <tr
                    key={material.id}
                    className="hover:bg-[#EBD187]/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-[#2D1E1A]">
                            {material.name}
                          </p>
                          <p className="text-xs text-[#2D1E1A]/60">
                            ID: {material.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-[#EBD187]/50 text-[#DA7339] border-[#DA7339]/30">
                        {material.materialTypeName}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#2D1E1A]">
                        {material.quantity} {getUnitName(material.unitId)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleEdit(material)}
                          size="sm"
                          variant="outline"
                          className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                          disabled={actionLoading}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => {
                            setNutrientMaterial(material);
                            setShowNutrientDialog(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                          disabled={actionLoading}
                          title="Quản lý dinh dưỡng"
                        >
                          <Beaker className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(material)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={actionLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-[#78A243]/30 mx-auto mb-3" />
            <p className="text-[#2D1E1A]/70">Không tìm thấy nguyên liệu nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#2D1E1A]/80">
                Trang <span className="font-semibold">{currentPage + 1}</span> /{" "}
                {totalPages} (Hiển thị {filteredMaterials.length} /{" "}
                {totalElements} nguyên liệu)
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  variant="outline"
                  size="sm"
                  className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  variant="outline"
                  size="sm"
                  className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MaterialFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        material={editingMaterial}
        onSuccess={handleFormSuccess}
      />

      <MaterialNutrientForm
        open={showNutrientDialog}
        onOpenChange={(open) => {
          setShowNutrientDialog(open);
          if (!open) setNutrientMaterial(null);
        }}
        materialId={nutrientMaterial?.id ?? null}
        materialName={nutrientMaterial?.name ?? ""}
        onSuccess={fetchMaterials}
      />

      <MaterialTypesManagerDialog
        open={showTypesManager}
        onOpenChange={setShowTypesManager}
      />

      <UnitsManagerDialog
        open={showUnitsManager}
        onOpenChange={setShowUnitsManager}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Xóa nguyên liệu"
        content={`Bạn có chắc chắn muốn xóa nguyên liệu "${deletingMaterial?.name}" không? Hành động này không thể hoàn tác.`}
        variant="destructive"
        loading={actionLoading}
      />
    </AdminPageLayout>
  );
}
