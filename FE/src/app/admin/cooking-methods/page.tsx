"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Flame,
  Plus,
  Edit2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import {
  getCookingMethods,
  type CookingMethod,
  type CookingMethodSearchParams,
} from "@/apis/cooking-method.api";
import { CookingMethodFormDialog } from "./components/CookingMethodFormDialog";
import { CookingMethodNutrientForm } from "./components/CookingMethodNutrientForm";
import { Beaker } from "lucide-react";
import { FilterDropdown } from "@/components/common/FilterDropdown";

export default function CookingMethodsPage() {
  const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  // Dialog states
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<CookingMethod | null>(
    null
  );

  // Nutrient Dialog states
  const [showNutrientDialog, setShowNutrientDialog] = useState(false);
  const [nutrientMethod, setNutrientMethod] = useState<CookingMethod | null>(
    null
  );

  const fetchCookingMethods = useCallback(async () => {
    try {
      setLoading(true);

      const searchRequest: CookingMethodSearchParams = {
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };

      const response = await getCookingMethods(searchRequest);
      setCookingMethods(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch cooking methods:", error);
      toast.error("Không thể tải danh sách phương pháp nấu!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, sortBy, sortDirection]);

  useEffect(() => {
    fetchCookingMethods();
  }, [fetchCookingMethods]);

  const handleCreate = () => {
    setEditingMethod(null);
    setShowFormDialog(true);
  };

  const handleEdit = (method: CookingMethod) => {
    setEditingMethod(method);
    setShowFormDialog(true);
  };

  const handleFormSuccess = () => {
    fetchCookingMethods();
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

  if (loading && cookingMethods.length === 0) {
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
        title="Quản lý Phương pháp nấu"
        description="Danh mục các phương pháp chế biến món ăn"
        icon={Flame}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm phương pháp
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
            <Input
              placeholder="Tìm kiếm phương pháp..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
            />
          </div>
        </div>

        {/* Page Size */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#2D1E1A] font-medium whitespace-nowrap">
            Hiển thị:
          </label>
          <FilterDropdown
            label={`${pageSize}`}
            value={pageSize.toString()}
            onChange={(value) => {
              const nextSize = parseInt(value || "10");
              setPageSize(nextSize);
              setCurrentPage(0);
            }}
            items={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
            showAllOption={false}
            className="w-[96px]"
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
                  className="px-6 py-4 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Tên phương pháp
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Mô tả
                    {getSortIcon("description")}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-[#2D1E1A]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#78A243]/10">
              {cookingMethods.map((method) => (
                <tr
                  key={method.id}
                  className="hover:bg-[#EBD187]/10 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#2D1E1A]">
                        {method.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#2D1E1A]/80">
                      {method.description}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleEdit(method)}
                        size="sm"
                        variant="outline"
                        className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setNutrientMethod(method);
                          setShowNutrientDialog(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                        title="Quản lý dinh dưỡng"
                      >
                        <Beaker className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cookingMethods.length === 0 && !loading && (
          <div className="text-center py-12">
            <Flame className="h-12 w-12 text-[#78A243]/30 mx-auto mb-3" />
            <p className="text-[#2D1E1A]/70">
              Không tìm thấy dữ liệu phương pháp nấu
            </p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#2D1E1A]/80">
                Trang <span className="font-semibold">{currentPage + 1}</span> /{" "}
                {totalPages}
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

      <CookingMethodFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        cookingMethod={editingMethod}
        onSuccess={handleFormSuccess}
      />

      <CookingMethodNutrientForm
        open={showNutrientDialog}
        onOpenChange={setShowNutrientDialog}
        cookingMethodId={nutrientMethod?.id || null}
        cookingMethodName={nutrientMethod?.name || ""}
      />
    </AdminPageLayout>
  );
}
