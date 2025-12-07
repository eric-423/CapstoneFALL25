"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table as TableIcon,
  ArrowLeft,
  Building,
  Users,
  FileText,
  X,
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
  AdminPageLayout,
  AdminPageHeader,
} from "../../components/AdminPageLayout";
import { createTable, type CreateTableRequest } from "@/apis/table.api";
import { getBranches, type Branch } from "@/apis/branch.api";

export default function AddTablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

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
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const data = await getBranches();
        setBranches(data);
        if (data.length > 0) {
          setFormData((prev) => {
            if (prev.branchId === 0) {
              return { ...prev, branchId: data[0].id };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        toast.error("Không thể tải danh sách chi nhánh!");
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

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
      await createTable(formData);
      toast.success("Thêm bàn ăn thành công!");
      router.push("/admin/tables");
    } catch (error) {
      console.error("Failed to create table:", error);
      let errorMessage = "Không thể thêm bàn ăn. Vui lòng thử lại!";
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
    <AdminPageLayout>
      <AdminPageHeader
        title="Thêm bàn ăn mới"
        icon={TableIcon}
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/tables")}
            className="text-[#2D1E1A] border-[#78A243]/30 hover:bg-[#78A243]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <Card className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

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
                disabled={loading}
              />
            </div>
            {errors.seat && (
              <p className="text-xs text-red-600 font-medium">{errors.seat}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchId" className="text-[#2D1E1A] font-semibold">
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
                  disabled={loading}
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
                      <SelectItem key={branch.id} value={branch.id.toString()}>
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#2D1E1A] font-semibold">Trạng thái</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleInputChange("isActive", !formData.isActive)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#78A243] focus:ring-offset-2 ${
                  formData.isActive ? "bg-[#78A243]" : "bg-gray-300"
                }`}
                disabled={loading}
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

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/tables")}
              className="flex-1 border-gray-300 text-[#2D1E1A] hover:bg-gray-50"
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <TableIcon className="h-4 w-4 mr-2" />
                  Thêm bàn ăn
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </AdminPageLayout>
  );
}
