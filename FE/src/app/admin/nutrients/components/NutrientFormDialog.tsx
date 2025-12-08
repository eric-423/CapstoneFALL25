"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createNutrient,
  updateNutrient,
  type Nutrient,
} from "@/apis/nutrient.api";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";

interface NutrientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nutrient: Nutrient | null;
  onSuccess: () => void;
}

export function NutrientFormDialog({
  open,
  onOpenChange,
  nutrient,
  onSuccess,
}: NutrientFormDialogProps) {
  const [loading, setLoading] = useState(false);
  useBodyScrollLock(open);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    unit: "",
    energyPerUnit: "",
  });

  useEffect(() => {
    if (nutrient) {
      setFormData({
        name: nutrient.name,
        code: nutrient.code,
        unit: nutrient.unit,
        energyPerUnit: nutrient.energyPerUnit.toString(),
      });
    } else {
      setFormData({
        name: "",
        code: "",
        unit: "",
        energyPerUnit: "",
      });
    }
  }, [nutrient, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.unit.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const energyPerUnit = parseFloat(formData.energyPerUnit);

    if (isNaN(energyPerUnit) || energyPerUnit < 0) {
      toast.error("Năng lượng không hợp lệ!");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        unit: formData.unit.trim(),
        energyPerUnit,
      };

      if (nutrient) {
        await updateNutrient(nutrient.id, requestData);
        toast.success("Cập nhật dinh dưỡng thành công!");
      } else {
        await createNutrient(requestData);
        toast.success("Thêm dinh dưỡng thành công!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save nutrient:", error);
      toast.error("Không thể lưu dinh dưỡng!");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl border-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#78A243] p-4 flex items-center justify-between z-10 shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {nutrient ? "Chỉnh sửa dinh dưỡng" : "Thêm dinh dưỡng mới"}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1"
              >
                Tên dinh dưỡng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Protein, Fat..."
                className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                disabled={loading}
              />
            </div>

            {/* Mã dinh dưỡng */}
            <div className="space-y-1.5">
              <Label
                htmlFor="code"
                className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1"
              >
                Mã dinh dưỡng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: PRO, FAT..."
                className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Đơn vị */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="unit"
                  className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1"
                >
                  Đơn vị <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="VD: g, mg..."
                  className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                  disabled={loading}
                />
              </div>

              {/* Năng lượng */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="energyPerUnit"
                  className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1"
                >
                  Năng lượng (kcal) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="energyPerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.energyPerUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, energyPerUnit: e.target.value })
                  }
                  placeholder="VD: 4"
                  className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex gap-2 justify-end shadow-lg shrink-0">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            variant="outline"
            className="px-4 py-2 text-sm border border-[#78A243]/30 hover:bg-[#78A243]/5 font-semibold text-[#2D1E1A]"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                Đang lưu...
              </>
            ) : nutrient ? (
              "Cập nhật"
            ) : (
              "Thêm mới"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
