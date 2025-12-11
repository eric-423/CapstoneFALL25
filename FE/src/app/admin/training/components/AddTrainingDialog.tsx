"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Users, X, CheckCircle } from "lucide-react";

import {
  createTraining,
  CreateTrainingPayload,
  updateTraining,
} from "@/apis/trainning.api";
import { Role, getRoles } from "@/apis/role.api";
import { TrainingCourse } from "@/utils/types/training.type";
import { toast } from "react-toastify";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";

interface TrainingFormData {
  name: string;
  note: string;
  point: string;
  isActive: boolean;
  roleId: number | "";
}

interface AddTrainingDialogProps {
  onSuccess?: () => void;
  trigger?: ReactNode;
  mode?: "create" | "edit";
  training?: TrainingCourse | null;
}

const INITIAL_FORM: TrainingFormData = {
  name: "",
  note: "",
  point: "",
  isActive: true,
  roleId: "",
};

export function AddTrainingDialog({
  onSuccess,
  trigger,
  mode = "create",
  training = null,
}: AddTrainingDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useBodyScrollLock(open);
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

  const isEditMode = mode === "edit" && Boolean(training);

  useEffect(() => {
    if (open && isEditMode && training) {
      setFormData({
        name: training.name ?? "",
        note: training.note ?? training.description ?? "",
        point:
          training.point !== undefined && training.point !== null
            ? String(training.point)
            : "",
        isActive: training.isActive ?? true,
        roleId: training.roleId ?? "",
      });
    }

    if (!open && !isEditMode) {
      resetForm();
    }
  }, [open, isEditMode, training]);

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

      if (isEditMode && training) {
        await updateTraining(training.id, payload);
        toast.success("Cập nhật khóa đào tạo thành công!", {
          toastId: `update-training-${training.id}`,
        });
      } else {
        await createTraining(payload);
        toast.success("Tạo khóa đào tạo mới thành công!", {
          toastId: "create-training",
        });
      }

      setOpen(false);
      resetForm();
      console.log("Training created successfully, calling onSuccess callback");
      onSuccess?.();
    } catch (error) {
      const serverDesc =
        (error as { response?: { data?: { desc?: string; error?: string } } })
          ?.response?.data?.desc ||
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        (error instanceof Error
          ? error.message
          : isEditMode
            ? "Không thể cập nhật khóa đào tạo"
            : "Không thể tạo khóa đào tạo");
      toast.error(serverDesc, {
        toastId: `training-error-${isEditMode ? "edit" : "create"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  const dialogTitle = isEditMode
    ? "Cập nhật Khóa Đào Tạo"
    : "Tạo Khóa Đào Tạo Mới";

  const dialogTrigger = trigger ?? (
    <Button className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all font-semibold">
      <Plus size={18} className="mr-2" />
      Tạo Khóa Đào Tạo
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{dialogTrigger}</div>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl [&>button]:hidden">
        <div className="bg-[#78A243] p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              {dialogTitle}
            </DialogTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <GraduationCap size={14} className="text-[#78A243]" />
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
              <p className="text-xs text-red-600 font-medium">{errors.name}</p>
            )}
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
              <p className="text-xs text-red-600 font-medium">{errors.note}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Điểm khóa học <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập điểm khóa học (ví dụ: 100)"
              type="number"
              min={1}
              value={formData.point}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, point: e.target.value }))
              }
              className={`w-full px-4 py-3 border-2 ${errors.point ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none`}
            />
            {errors.point && (
              <p className="text-xs text-red-600 font-medium">{errors.point}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Users size={14} className="text-[#78A243]" />
              Vai trò áp dụng <span className="text-red-500">*</span>
            </label>
            <select
              id="training-role"
              aria-label="Chọn vai trò áp dụng"
              value={formData.roleId === "" ? "" : String(formData.roleId)}
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

          <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3">
            <div>
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
                setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
              }
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${formData.isActive ? "translate-x-5" : "translate-x-1"}`}
              />
            </button>
          </div>
          <div className="bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 mt-6 p-4 flex gap-3 justify-end rounded-b-2xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
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
                  {isEditMode ? "Cập nhật" : "Tạo mới"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
