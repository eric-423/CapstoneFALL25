"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Users, X, CheckCircle, ArrowLeft } from "lucide-react";
import { createTraining, CreateTrainingPayload } from "@/apis/trainning.api";
import { Role, getRoles } from "@/apis/role.api";
import { toast } from "react-toastify";
import { AdminGuard } from "@/components/guards";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../../components/AdminPageLayout";

interface TrainingFormData {
  name: string;
  note: string;
  point: string;
  isActive: boolean;
  roleId: number | "";
}

const INITIAL_FORM: TrainingFormData = {
  name: "",
  note: "",
  point: "",
  isActive: true,
  roleId: "",
};

export default function CreateTrainingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [formData, setFormData] = useState<TrainingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim())
      newErrors.name = "Vui lòng nhập tên khóa đào tạo";
    if (!formData.note.trim()) newErrors.note = "Vui lòng nhập mô tả";
    if (!formData.point.trim()) {
      newErrors.point = "Vui lòng nhập điểm khóa";
    } else if (
      Number.isNaN(Number(formData.point)) ||
      Number(formData.point) <= 0
    ) {
      newErrors.point = "Điểm khóa phải là số lớn hơn 0";
    }
    if (formData.roleId === "") newErrors.roleId = "Vui lòng chọn vai trò";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: CreateTrainingPayload = {
      name: formData.name.trim(),
      note: formData.note.trim(),
      point: Number(formData.point),
      isActive: formData.isActive,
      roleId: Number(formData.roleId),
    };

    try {
      setIsLoading(true);
      await createTraining(payload);
      toast.success("Tạo khóa đào tạo mới thành công!", {
        toastId: "create-training",
      });
      router.push("/admin/training");
    } catch (error) {
      const serverDesc =
        (error as { response?: { data?: { desc?: string; error?: string } } })
          ?.response?.data?.desc ||
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        (error instanceof Error ? error.message : "Không thể tạo khóa đào tạo");
      toast.error(serverDesc, {
        toastId: "training-error-create",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Tạo Khóa Đào Tạo Mới"
          description="Điền thông tin để tạo khóa đào tạo mới"
          icon={GraduationCap}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-2 border-gray-300 hover:bg-gray-100 font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          }
        />

        <div className="w-full mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex col-span-2 align-center justify-between gap-3">
                <div className="w-1/2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    Tên khóa đào tạo <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="VD: Cách làm món Phở, Quy trình phục vụ bàn..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`w-full px-4 py-3 border-2 ${errors.name ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    Điểm khóa học <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Nhập điểm khóa học (ví dụ: 100)"
                    type="number"
                    min={1}
                    value={formData.point}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        point: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 border-2 ${errors.point ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none`}
                  />
                  {errors.point && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.point}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Mô tả chi tiết về nội dung và mục tiêu khóa đào tạo..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  rows={3}
                  className={`w-full px-4 py-3 border-2 ${errors.note ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none outline-none`}
                />
                {errors.note && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.note}
                  </p>
                )}
              </div>

              <div className="flex col-span-2 align-center gap-3">
                <div className="w-1/2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Users size={14} className="text-[#78A243]" />
                    Vai trò áp dụng <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="training-role"
                    aria-label="Chọn vai trò áp dụng"
                    value={
                      formData.roleId === "" ? "" : String(formData.roleId)
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        roleId: e.target.value ? Number(e.target.value) : "",
                      }))
                    }
                    disabled={isLoadingRoles}
                    className={`w-full px-4 py-3 border-2 ${errors.roleId ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none bg-white`}
                  >
                    <option value="">
                      {isLoadingRoles ? "Đang tải vai trò..." : "Chọn vai trò"}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.roleId}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Chọn vai trò mà khóa đào tạo này áp dụng
                  </p>
                </div>

                <div className="flex items-center justify-start px-4 py-3">
                  <div className="w-1/2">
                    <p className="text-sm font-semibold text-gray-700">
                      Kích hoạt khóa học
                    </p>
                    <p className="text-xs text-gray-500">
                      Cho phép nhân viên thấy khóa này sau khi tạo
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={
                      formData.isActive ? "Tắt khóa học" : "Kích hoạt khóa học"
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-[#78A243]" : "bg-gray-300"}`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${formData.isActive ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>

              <div className="relative top-10 right-0 flex gap-3 justify-end mb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tạo mới
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </AdminPageLayout>
    </AdminGuard>
  );
}
