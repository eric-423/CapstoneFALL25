"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift, Percent, Calendar, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";
import {
  createPromotion,
  getPromotionTypes,
  type CreatePromotionData,
  type PromotionType,
} from "@/apis/promotion.api";

interface PromotionFormData {
  name: string;
  description: string;
  promotionType: string;
  value: string;
  minimumOrderValue: string;
  startDate: string;
  endDate: string;
  status: boolean;
}

interface PromotionTypeOption {
  value: string;
  label: string;
  color: string;
  promotionTypeId: number;
}

interface AddPromotionDialogProps {
  onSuccess?: () => void;
}

export function AddPromotionDialog({ onSuccess }: AddPromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotionTypes, setPromotionTypes] = useState<PromotionTypeOption[]>(
    []
  );
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  useBodyScrollLock(open);
  const [formData, setFormData] = useState<PromotionFormData>({
    name: "",
    description: "",
    promotionType: "",
    value: "",
    minimumOrderValue: "",
    startDate: "",
    endDate: "",
    status: true,
  });

  const [errors, setErrors] = useState<Partial<PromotionFormData>>({});
  const mapPromotionType = (type: PromotionType): PromotionTypeOption => {
    return {
      value: type.name,
      label: type.name,
      color: "[#FFFCF7]",
      promotionTypeId: type.id,
    };
  };

  useEffect(() => {
    if (open) {
      const fetchPromotionTypes = async () => {
        setIsLoadingTypes(true);
        try {
          const types = await getPromotionTypes();
          const mappedTypes = types.map(mapPromotionType);
          setPromotionTypes(mappedTypes);
        } catch (error) {
        } finally {
          setIsLoadingTypes(false);
        }
      };
      fetchPromotionTypes();
    }
  }, [open]);
  useEffect(() => {
    if (promotionTypes.length > 0 && !formData.promotionType) {
      setFormData((prev) => ({
        ...prev,
        promotionType: promotionTypes[0].value,
      }));
    }
  }, [promotionTypes, formData.promotionType]);

  const validateForm = () => {
    const newErrors: Partial<PromotionFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên khuyến mãi";
    if (!formData.description.trim())
      newErrors.description = "Vui lòng nhập mô tả";
    if (!formData.value) {
      newErrors.value = "Vui lòng nhập giá trị giảm giá";
    } else {
      if (Number(formData.value) <= 0) {
        newErrors.value = "Giá trị giảm phải lớn hơn 0";
      }
    }
    if (formData.minimumOrderValue && Number(formData.minimumOrderValue) < 0) {
      newErrors.minimumOrderValue = "Giá trị không được âm";
    }

    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const selectedType = promotionTypes.find(
        (t) => t.value === formData.promotionType
      );

      if (!selectedType) {
        toast.error("Vui lòng chọn loại khuyến mãi");
        setIsLoading(false);
        return;
      }

      const promotionData: CreatePromotionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        value: Number(formData.value),
        minimumOrderValue: formData.minimumOrderValue
          ? Number(formData.minimumOrderValue)
          : 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        promotionTypeId: selectedType.promotionTypeId,
      };

      await createPromotion(promotionData);
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Error creating promotion:", error);
      const errorMessage =
        error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          ("message" in error.response.data || "error" in error.response.data)
          ? (error.response.data as { message?: string; error?: string })
            .message ||
          (error.response.data as { message?: string; error?: string }).error
          : "Có lỗi xảy ra khi tạo khuyến mãi";
      toast.error(`${errorMessage || "Có lỗi xảy ra khi tạo khuyến mãi"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      promotionType: promotionTypes.length > 0 ? promotionTypes[0].value : "",
      value: "",
      minimumOrderValue: "",
      startDate: "",
      endDate: "",
      status: true,
    });
    setErrors({});
  };

  const handleInputChange = (
    field: keyof PromotionFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all">
          <Plus size={18} className="mr-2" />
          Thêm khuyến mãi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#78A243]/20 rounded-xl flex items-center justify-center">
              <Gift className="text-[#78A243]" size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#2D1E1A]">
                Thêm khuyến mãi mới
              </DialogTitle>
              <p className="text-sm text-[#2D1E1A]/60 mt-1">
                Tạo chương trình khuyến mãi cho khách hàng
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#2D1E1A] flex items-center gap-2">
              <Gift size={16} className="text-[#78A243]" />
              Tên khuyến mãi <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Giảm giá mùa hè, Khuyến mãi cuối năm..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`h-11 border-2 ${errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#78A243]"} focus:ring-[#78A243]/20 focus:ring-4 transition-all`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-medium">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#2D1E1A]">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-md border-2 ${errors.description ? "border-red-400" : "border-gray-200"} focus:border-[#78A243] focus:ring-[#78A243]/20 focus:ring-4 outline-none transition-all text-[#2D1E1A] placeholder:text-gray-400`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#2D1E1A]">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              {isLoadingTypes ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#78A243] border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-sm text-[#2D1E1A]/60">
                    Đang tải loại khuyến mãi...
                  </span>
                </div>
              ) : promotionTypes.length === 0 ? (
                <div className="text-center py-4 text-sm text-[#2D1E1A]/60">
                  Không có loại khuyến mãi nào
                </div>
              ) : (
                <Select
                  value={formData.promotionType}
                  onValueChange={(value) =>
                    handleInputChange("promotionType", value)
                  }
                >
                  <SelectTrigger className="w-full h-11 border-2 border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20 focus:ring-4 transition-all">
                    <SelectValue placeholder="Chọn loại giảm giá" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border-2 border-gray-200 shadow-lg z-[150]"
                    position="popper"
                  >
                    {promotionTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="cursor-pointer hover:bg-[#78A243]/10 focus:bg-[#78A243]/10"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <span className="font-semibold text-[#2D1E1A]">
                            {type.label}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D1E1A]">
                Trạng thái
              </label>
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-[#78A243]/50 transition-all bg-[#78A243]/5 h-11">
                <label
                  htmlFor="status"
                  className="text-sm font-semibold text-[#2D1E1A] cursor-pointer"
                >
                  Kích hoạt ngay
                </label>
                <button
                  type="button"
                  onClick={() => handleInputChange("status", !formData.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#78A243] focus:ring-offset-2 ${formData.status
                    ? "bg-[#78A243]"
                    : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${formData.status ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#2D1E1A] flex items-center gap-2">
                Giá trị giảm <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={`h-11 border-2 ${errors.value ? "border-red-400" : "border-gray-200"} focus:border-[#78A243]`}
              />
              {errors.value && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.value}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D1E1A]">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                placeholder="100000"
                value={formData.minimumOrderValue}
                onChange={(e) =>
                  handleInputChange("minimumOrderValue", e.target.value)
                }
                className="h-11 border-2 border-gray-200 focus:border-[#78A243]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D1E1A] flex items-center gap-2">
                <Calendar size={16} className="text-[#78A243]" />
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`h-11 border-2 ${errors.startDate ? "border-red-400" : "border-gray-200"} focus:border-[#78A243]`}
              />
              {errors.startDate && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D1E1A] flex items-center gap-2">
                <Calendar size={16} className="text-[#78A243]" />
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={`h-11 border-2 ${errors.endDate ? "border-red-400" : "border-gray-200"} focus:border-[#78A243]`}
              />
              {errors.endDate && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#78A243]/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={isLoading}
              className="flex-1 h-11 border-2 border-gray-300 bg-white !text-[#2D1E1A] hover:!bg-gray-100 hover:!text-[#2D1E1A] font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Thêm khuyến mãi
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
