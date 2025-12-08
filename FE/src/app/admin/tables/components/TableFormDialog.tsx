"use client";

import React, { useState, useEffect } from "react";
import {
  Table as TableIcon,
  Building,
  Users,
  FileText,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createTable,
  updateTable,
  getTableById,
  type CreateTableRequest,
  type UpdateTableRequest,
} from "@/apis/table.api";
import { getBranches, type Branch } from "@/apis/branch.api";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";

interface TableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  tableId?: number | null;
}

export function TableFormDialog({
  open,
  onOpenChange,
  onSuccess,
  tableId,
}: TableFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  useBodyScrollLock(open);

  const [formData, setFormData] = useState<CreateTableRequest>({
    name: "",
    isActive: true,
    seat: 2,
    note: "",
    branchId: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTableRequest, string>>
  >({});

  useEffect(() => {
    if (open) {
      const fetchBranches = async () => {
        try {
          setLoadingBranches(true);
          const data = await getBranches();
          setBranches(data);
          if (data.length > 0 && !tableId) {
            setFormData((prev) => ({
              ...prev,
              branchId: prev.branchId === 0 ? data[0].id : prev.branchId,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch branches:", error);
          toast.error("Không thể tải danh sách chi nhánh!");
        } finally {
          setLoadingBranches(false);
        }
      };

      const fetchTableData = async () => {
        if (tableId) {
          try {
            setLoadingTable(true);
            const tableData = await getTableById(tableId.toString());
            setFormData({
              name: tableData.name,
              isActive: tableData.isActive,
              seat: tableData.seat,
              note: tableData.note || "",
              branchId: tableData.branchId,
            });
          } catch (error) {
            console.error("Failed to fetch table data:", error);
            toast.error("Không thể tải thông tin bàn!");
            onOpenChange(false);
          } finally {
            setLoadingTable(false);
          }
        }
      };

      fetchBranches();
      fetchTableData();
    } else {
      setFormData({
        name: "",
        isActive: true,
        seat: 2,
        note: "",
        branchId: 0,
      });
      setErrors({});
    }
  }, [open, tableId, onOpenChange]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTableRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên bàn là bắt buộc";
    }

    if (formData.seat < 1) {
      newErrors.seat = "Số chỗ ngồi phải lớn hơn 0";
    }

    if (formData.branchId === 0) {
      newErrors.branchId = "Vui lòng chọn chi nhánh";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      if (tableId) {
        // Update existing table
        const updateData: UpdateTableRequest = {
          id: tableId,
          ...formData,
        };
        await updateTable(tableId, updateData);
        toast.success("Cập nhật bàn ăn thành công!");
      } else {
        // Create new table
        await createTable(formData);
        toast.success("Thêm bàn ăn thành công!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${tableId ? "update" : "create"} table:`, error);
      let errorMessage = `Không thể ${tableId ? "cập nhật" : "thêm"} bàn ăn. Vui lòng thử lại!`;
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
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateTableRequest,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl [&>button]:hidden">
        <div className="bg-[#78A243] p-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <TableIcon className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              {tableId ? "Sửa thông tin bàn ăn" : "Thêm bàn ăn mới"}
            </DialogTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading || loadingTable}
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow overflow-hidden"
        >
          {loadingTable ? (
            <div className="flex-grow flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#2D1E1A]/70">Đang tải thông tin bàn...</p>
              </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50 space-y-6">
              {/* Tên bàn */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#2D1E1A] font-semibold">
                  Tên bàn <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <TableIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ví dụ: Bàn 1, Bàn VIP, Bàn 2 người..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 h-11 ${
                      errors.name ? "border-red-400" : "border-gray-200"
                    } focus:border-[#78A243] focus:ring-[#78A243]/20`}
                    disabled={loading || loadingTable}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Số chỗ ngồi */}
              <div className="space-y-2">
                <Label htmlFor="seat" className="text-[#2D1E1A] font-semibold">
                  Số chỗ ngồi <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="seat"
                    type="number"
                    min="1"
                    placeholder="Nhập số chỗ ngồi"
                    value={formData.seat}
                    onChange={(e) =>
                      handleInputChange("seat", parseInt(e.target.value) || 0)
                    }
                    className={`pl-10 h-11 ${
                      errors.seat ? "border-red-400" : "border-gray-200"
                    } focus:border-[#78A243] focus:ring-[#78A243]/20`}
                    disabled={loading || loadingTable}
                  />
                </div>
                {errors.seat && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.seat}
                  </p>
                )}
              </div>

              {/* Chi nhánh */}
              <div className="space-y-2">
                <Label
                  htmlFor="branchId"
                  className="text-[#2D1E1A] font-semibold"
                >
                  Chi nhánh <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  {loadingBranches ? (
                    <div className="flex items-center justify-center h-11 border-2 border-gray-200 rounded-md">
                      <div className="w-5 h-5 border-2 border-[#78A243] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Select
                      value={formData.branchId.toString()}
                      onValueChange={(value) =>
                        handleInputChange("branchId", parseInt(value))
                      }
                      disabled={loading || loadingTable}
                    >
                      <SelectTrigger
                        className={`pl-10 h-11 ${
                          errors.branchId ? "border-red-400" : "border-gray-200"
                        } focus:border-[#78A243] focus:ring-[#78A243]/20`}
                      >
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id.toString()}
                          >
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {errors.branchId && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.branchId}
                  </p>
                )}
              </div>

              {/* Ghi chú */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-[#2D1E1A] font-semibold">
                  Ghi chú
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="note"
                    placeholder="Nhập ghi chú về bàn (tùy chọn)"
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    rows={3}
                    className="pl-10 border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20"
                    disabled={loading || loadingTable}
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div className="space-y-2">
                <Label className="text-[#2D1E1A] font-semibold">
                  Trạng thái
                </Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("isActive", !formData.isActive)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#78A243] focus:ring-offset-2 ${
                      formData.isActive ? "bg-[#78A243]" : "bg-gray-300"
                    }`}
                    disabled={loading || loadingTable}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-[#2D1E1A]">
                    {formData.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-2xl flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || loadingTable}
              className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              disabled={loading || loadingTable}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {tableId ? "Cập nhật" : "Thêm bàn ăn"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
