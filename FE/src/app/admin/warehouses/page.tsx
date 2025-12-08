"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Warehouse as WarehouseIcon,
  Plus,
  Edit2,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  Utensils,
  Package,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";
import { getWarehouses, type Warehouse } from "@/apis/material.api";
import { getBranches, type Branch } from "@/apis/branch.api";
import { WarehouseFormDialog } from "./components/WarehouseFormDialog";
import { useRouter } from "next/navigation";

export default function WarehousesPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [initialBranchId, setInitialBranchId] = useState<number | undefined>(
    undefined
  );
  const [initialAddress, setInitialAddress] = useState<string | undefined>(
    undefined
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [warehousesData, branchesData] = await Promise.all([
        getWarehouses(),
        getBranches(),
      ]);
      setWarehouses(warehousesData);
      setBranches(branchesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingWarehouse(null);
    setInitialBranchId(undefined);
    setInitialAddress(undefined);
    setShowFormDialog(true);
  };

  const handleQuickCreate = (branch: Branch) => {
    setEditingWarehouse(null);
    setInitialBranchId(branch.id);
    setInitialAddress(branch.address);
    setShowFormDialog(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setInitialBranchId(undefined);
    setInitialAddress(undefined);
    setShowFormDialog(true);
  };

  const handleViewMaterials = (warehouseId: number) => {
    router.push(`/admin/warehouses/${warehouseId}/materials`);
  };

  const handleViewUtensils = (warehouseId: number) => {
    router.push(`/admin/warehouses/${warehouseId}/utensils`);
  };

  const handleFormSuccess = () => {
    fetchData();
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

  const sortedWarehouses = [...warehouses].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "address":
        aValue = a.address.toLowerCase();
        bValue = b.address.toLowerCase();
        break;
      case "branchName":
        aValue = a.branchName.toLowerCase();
        bValue = b.branchName.toLowerCase();
        break;
      case "isActive":
        aValue = a.isActive === true ? 1 : a.isActive === false ? 0 : -1;
        bValue = b.isActive === true ? 1 : b.isActive === false ? 0 : -1;
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

  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter((w) => w.isActive === true).length;
  const inactiveWarehouses = warehouses.filter(
    (w) => w.isActive === false
  ).length;

  const branchesWithoutWarehouse = branches.filter(
    (b) => !warehouses.some((w) => w.branchId === b.id)
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Quản lý kho"
        icon={WarehouseIcon}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm kho
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <AdminCard
          title="Tổng số kho"
          value={totalWarehouses}
          icon={WarehouseIcon}
        />
        <AdminCard
          title="Đang hoạt động"
          value={activeWarehouses}
          icon={CheckCircle}
        />
        <AdminCard
          title="Ngừng hoạt động"
          value={inactiveWarehouses}
          icon={XCircle}
        />
      </div>

      {branchesWithoutWarehouse.length > 0 && !loading && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Chi nhánh chưa có kho ({branchesWithoutWarehouse.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {branchesWithoutWarehouse.map((branch) => (
              <div
                key={branch.id}
                className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{branch.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    {branch.address}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleQuickCreate(branch)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Tạo kho ngay
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border-2 border-[#78A243]/20 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b-2 border-grey-300">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("address")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Kho
                      {getSortIcon("address")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("branchName")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Chi nhánh
                      {getSortIcon("branchName")}
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
                  <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#78A243]/10">
                {sortedWarehouses.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    className="hover:bg-[#EBD187]/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <p className="font-semibold text-[#2D1E1A]">
                              {warehouse.address}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {warehouse.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <p className="font-semibold text-[#2D1E1A]">
                            {warehouse.branchName}
                          </p>
                        </div>
                        <p className="text-sm text-[#2D1E1A]/70 line-clamp-2">
                          {warehouse.branchAddress}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {warehouse.isActive === true ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoạt động
                        </Badge>
                      ) : warehouse.isActive === false ? (
                        <Badge className="bg-red-100 text-red-700 border-red-300">
                          <XCircle className="h-3 w-3 mr-1" />
                          Ngừng
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                          Không rõ
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleViewMaterials(warehouse.id)}
                          size="sm"
                          variant="outline"
                          className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                        >
                          <Package className="h-3 w-3 mr-1" />
                        </Button>
                        <Button
                          onClick={() => handleViewUtensils(warehouse.id)}
                          size="sm"
                          variant="outline"
                          className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                        >
                          <Utensils className="h-3 w-3 mr-1" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(warehouse)}
                          size="sm"
                          variant="outline"
                          className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {warehouses.length === 0 && (
              <div className="text-center py-12">
                <WarehouseIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có kho nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      <WarehouseFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        warehouse={editingWarehouse}
        onSuccess={handleFormSuccess}
        initialBranchId={initialBranchId}
        initialAddress={initialAddress}
        existingBranchIds={warehouses.map((w) => w.branchId)}
        branches={branches}
        warehouses={warehouses}
      />
    </AdminPageLayout>
  );
}
