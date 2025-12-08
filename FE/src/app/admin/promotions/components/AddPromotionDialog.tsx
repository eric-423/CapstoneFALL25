"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift, Calendar, Plus, X } from "lucide-react";
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
  availablePromotionTypes?: PromotionType[];
}

export function AddPromotionDialog({
  onSuccess,
  availablePromotionTypes,
}: AddPromotionDialogProps) {
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
      value: String(type.id),
      label: type.name,
      color: "[#FFFCF7]",
      promotionTypeId: type.id,
    };
  };

  useEffect(() => {
    if (!open) return;

    if (availablePromotionTypes !== undefined) {
      setPromotionTypes(availablePromotionTypes.map(mapPromotionType));
      setIsLoadingTypes(false);
      return;
    }

    const fetchPromotionTypes = async () => {
      setIsLoadingTypes(true);
      try {
        const types = await getPromotionTypes();
        const mappedTypes = types.map(mapPromotionType);
        setPromotionTypes(mappedTypes);
      } catch {
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchPromotionTypes();
  }, [open, availablePromotionTypes]);
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
    if (!isFreeShipping()) {
      if (!formData.value) {
        newErrors.value = "Vui lòng nhập giá trị giảm giá";
      } else {
        if (Number(formData.value) <= 0) {
          newErrors.value = "Giá trị giảm phải lớn hơn 0";
        }
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
      const promotionTypeId = Number(formData.promotionType);
      const selectedType = promotionTypes.find(
        (t) => t.promotionTypeId === promotionTypeId
      );

      if (!selectedType) {
        toast.error("Vui lòng chọn loại khuyến mãi");
        setIsLoading(false);
        return;
      }

      const promotionData: CreatePromotionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        value: isFreeShipping() ? 0 : Number(formData.value),
        minimumOrderValue: formData.minimumOrderValue
          ? Number(formData.minimumOrderValue)
          : 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        promotionTypeId: promotionTypeId,
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

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return Number(numericValue).toLocaleString("vi-VN");
  };

  const parseNumber = (value: string): string => {
    return value.replace(/\D/g, "");
  };
  const isFreeShipping = () => {
    if (!formData.promotionType) return false;
    const selectedType = promotionTypes.find(
      (t) => t.value === formData.promotionType
    );
    return selectedType?.label?.toLowerCase().includes("vận chuyển") || false;
  };

  const handleInputChange = (
    field: keyof PromotionFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === "promotionType") {
      const selectedType = promotionTypes.find(
        (t) => t.value === String(value)
      );
      if (selectedType?.label?.toLowerCase().includes("vận chuyển")) {
        setFormData((prev) => ({ ...prev, value: "" }));
      }
    }
  };

  const handleNumberInputChange = (
    field: keyof PromotionFormData,
    value: string
  ) => {
    const numericValue = parseNumber(value);
    handleInputChange(field, numericValue);
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
      >
        <Plus size={18} className="mr-2" />
        Thêm khuyến mãi
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
      >
        <Plus size={18} className="mr-2" />
        Thêm khuyến mãi
      </Button>

      <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <Card className="w-full max-w-[600px] bg-white shadow-2xl rounded-2xl border-0 overflow-hidden flex flex-col max-h-[95vh] py-0">
          <div className="bg-[#78A243] p-4 flex items-center justify-between z-10 shadow-lg shrink-0">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Thêm khuyến mãi mới
                </h2>
                <p className="text-sm text-white/80">
                  Tạo chương trình khuyến mãi cho khách hàng
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1E1A] flex items-center gap-2">
                  <Gift size={16} className="text-[#78A243]" />
                  Mã khuyến mãi <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Giảm giá mùa hè, Khuyến mãi cuối năm..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`h-11 border-2 ${errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#78A243]"} focus:ring-[#78A243]/20 focus:ring-4 transition-all`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1E1A]">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
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
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1E1A]">
                    Loại giảm giá <span className="text-red-500">*</span>
                  </label>
                  {!availablePromotionTypes && isLoadingTypes ? (
                    <div className="flex items-center justify-center h-11">
                      <div className="w-5 h-5 border-2 border-[#78A243] border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-[#2D1E1A]/60">
                        Đang tải...
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
                            <span className="font-semibold text-[#2D1E1A]">
                              {type.label}
                            </span>
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
                  <div className="flex items-center justify-between px-3 rounded-lg border-2 border-gray-200 hover:border-[#78A243]/50 transition-all bg-[#78A243]/5 h-11">
                    <label
                      htmlFor="status"
                      className="text-sm font-semibold text-[#2D1E1A] cursor-pointer"
                    >
                      Kích hoạt ngay
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange("status", !formData.status)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#78A243] focus:ring-offset-2 ${formData.status ? "bg-[#78A243]" : "bg-gray-300"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${formData.status ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`grid gap-4 ${isFreeShipping() ? "grid-cols-1" : "grid-cols-2"}`}
              >
                {!isFreeShipping() && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#2D1E1A]">
                      Giá trị giảm <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.value}
                      onChange={(e) =>
                        handleInputChange("value", e.target.value)
                      }
                      className={`h-11 border-2 ${errors.value ? "border-red-400" : "border-gray-200"} focus:border-[#78A243]`}
                    />
                    {errors.value && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.value}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1E1A]">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <Input
                    type="text"
                    placeholder="100,000"
                    value={
                      formData.minimumOrderValue
                        ? formatNumber(formData.minimumOrderValue)
                        : ""
                    }
                    onChange={(e) =>
                      handleNumberInputChange(
                        "minimumOrderValue",
                        e.target.value
                      )
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
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className={`h-11 border-2 ${errors.endDate ? "border-red-400" : "border-gray-200"} focus:border-[#78A243]`}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 p-4 flex gap-2 justify-end shadow-lg shrink-0">
            <Button
              type="button"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={isLoading}
              variant="outline"
              className="px-4 py-2 text-sm border border-[#78A243]/30 hover:bg-[#78A243]/5 font-semibold text-[#2D1E1A]"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-1.5" />
                  Thêm mới
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
