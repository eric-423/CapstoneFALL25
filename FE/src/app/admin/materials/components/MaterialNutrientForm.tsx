"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getNutrients, type Nutrient } from "@/apis/nutrient.api";
import {
  getMaterialNutrients,
  updateManyMaterialNutrients,
  type MaterialNutrientRequest,
} from "@/apis/material-nutrient.api";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";
import { AdminSelect } from "../../components/AdminSelect";

interface MaterialNutrientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialId: number | null;
  materialName: string;
  onSuccess: () => void;
}

interface NutrientRow {
  nutrientId: string;
  amountPer100Unit: string;
}

export function MaterialNutrientForm({
  open,
  onOpenChange,
  materialId,
  materialName,
  onSuccess,
}: MaterialNutrientFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [rows, setRows] = useState<NutrientRow[]>([]);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open || !materialId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [nutrientsRes, materialNutrients] = await Promise.all([
          getNutrients({ size: 1000 }),
          getMaterialNutrients({ materialId, size: 1000 }),
        ]);
        setNutrients(nutrientsRes.content);
        setRows(
          materialNutrients.content.map((item) => ({
            nutrientId: item.nutrientId.toString(),
            amountPer100Unit: item.amountPer100Unit.toString(),
          }))
        );
      } catch (error) {
        console.error("Failed to load nutrients:", error);
        toast.error("Không thể tải dinh dưỡng cho nguyên liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [open, materialId]);

  const handleAddRow = () => {
    setRows((prev) => [...prev, { nutrientId: "", amountPer100Unit: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof NutrientRow,
    value: string
  ) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    if (!materialId) return;

    const payload: MaterialNutrientRequest[] = [];
    for (const row of rows) {
      if (!row.nutrientId) continue;
      const amount = parseFloat(row.amountPer100Unit);
      if (isNaN(amount) || amount < 0) {
        toast.error("Hàm lượng phải là số không âm");
        return;
      }
      payload.push({
        nutrientId: parseInt(row.nutrientId),
        amountPer100Unit: amount,
        state: "NEW",
      });
    }

    try {
      setSaving(true);
      await updateManyMaterialNutrients(materialId, payload);
      toast.success("Đã cập nhật dinh dưỡng nguyên liệu");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save material nutrients:", error);
      toast.error("Không thể lưu dinh dưỡng");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#78A243]/20 bg-[#78A243]/10">
          <DialogTitle className="text-lg font-semibold text-[#2D1E1A]">
            Quản lý dinh dưỡng · {materialName || "Nguyên liệu"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg border border-[#78A243]/20 bg-[#FFFCF7]"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#2D1E1A]">
                      Chất dinh dưỡng
                    </label>
                    <AdminSelect
                      value={row.nutrientId}
                      onValueChange={(value) =>
                        handleChange(index, "nutrientId", value)
                      }
                      placeholder="Chọn dinh dưỡng"
                      options={nutrients.map((nutrient) => ({
                        value: nutrient.id.toString(),
                        label: nutrient.name,
                      }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#2D1E1A]">
                      Hàm lượng / 100 đơn vị
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={row.amountPer100Unit}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "amountPer100Unit",
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className="border-[#78A243]/30 focus:ring-[#78A243]/20"
                        min={0}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveRow(index)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddRow}
                className="border-dashed border-[#78A243]/40 text-[#78A243] hover:bg-[#78A243]/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm thành phần dinh dưỡng
              </Button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#78A243]/20 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
