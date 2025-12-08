"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addMaterialsToWarehouse, type Material } from "@/apis/material.api";
import ExcelJS from "exceljs";

interface ImportMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: number;
  availableMaterials: Material[];
  existingMaterialIds: number[];
  onSuccess: () => void;
}

interface ImportRow {
  materialName: string;
  quantity: number | null;
  threshold: number | null;
  materialId: number | null;
  errors: string[];
  isValid: boolean;
}

export function ImportMaterialDialog({
  open,
  onOpenChange,
  warehouseId,
  availableMaterials,
  existingMaterialIds,
  onSuccess,
}: ImportMaterialDialogProps) {
  const [loading, setLoading] = useState(false);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter materials not in warehouse
  const selectableMaterials = availableMaterials.filter(
    (m) => !existingMaterialIds.includes(m.id)
  );

  const handleDownloadTemplate = async () => {
    try {
      // Create workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Nguyên liệu");

      // Set columns
      worksheet.columns = [
        { header: "Nguyên liệu", key: "material", width: 30 },
        { header: "Số lượng", key: "quantity", width: 15 },
        { header: "Ngưỡng cảnh báo", key: "threshold", width: 20 },
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF78A243" },
      };
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };

      // Add available materials as examples
      selectableMaterials.forEach((material) => {
        worksheet.addRow({
          material: material.name,
          quantity: "",
          threshold: "",
        });
      });

      // If no materials available, add sample rows
      if (selectableMaterials.length === 0) {
        worksheet.addRow({
          material: "Ví dụ: Thịt bò",
          quantity: 100,
          threshold: 10,
        });
        worksheet.addRow({
          material: "Ví dụ: Rau xanh",
          quantity: 50,
          threshold: 5,
        });
      }

      // Generate buffer and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mau_import_nguyen_lieu_kho_${warehouseId}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Đã tải file mẫu!");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Không thể tạo file mẫu!");
    }
  };

  const validateImportData = (rows: ImportRow[]): ImportRow[] => {
    const seenMaterials = new Set<string>();

    return rows.map((row) => {
      const errors: string[] = [];
      let materialId: number | null = null;

      // Check material name
      if (!row.materialName || row.materialName.trim() === "") {
        errors.push("Thiếu tên nguyên liệu");
      } else {
        const normalizedName = row.materialName.trim().toLowerCase();

        // Check if material exists in available materials
        const foundMaterial = availableMaterials.find(
          (m) => m.name.toLowerCase() === normalizedName
        );

        if (!foundMaterial) {
          errors.push("Nguyên liệu không tồn tại trong hệ thống");
        } else {
          materialId = foundMaterial.id;

          // Check if already in warehouse
          if (existingMaterialIds.includes(foundMaterial.id)) {
            errors.push("Nguyên liệu đã có trong kho");
          }

          // Check duplicates in import file
          if (seenMaterials.has(normalizedName)) {
            errors.push("Nguyên liệu bị trùng trong file");
          } else {
            seenMaterials.add(normalizedName);
          }
        }
      }

      // Check quantity
      if (
        row.quantity === null ||
        row.quantity === undefined ||
        isNaN(row.quantity)
      ) {
        errors.push("Thiếu số lượng");
      } else if (row.quantity <= 0) {
        errors.push("Số lượng phải lớn hơn 0");
      }

      // Check threshold
      if (
        row.threshold === null ||
        row.threshold === undefined ||
        isNaN(row.threshold)
      ) {
        errors.push("Thiếu ngưỡng cảnh báo");
      } else if (row.threshold <= 0) {
        errors.push("Ngưỡng cảnh báo phải lớn hơn 0");
      }

      return {
        ...row,
        materialId,
        errors,
        isValid: errors.length === 0,
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        toast.error("File không có sheet nào!");
        return;
      }

      // Skip header row
      const rows: ImportRow[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const materialName = row.getCell(1).value?.toString().trim() || "";
        const quantityValue = row.getCell(2).value;
        const thresholdValue = row.getCell(3).value;

        const quantity =
          quantityValue !== null &&
          quantityValue !== undefined &&
          quantityValue !== ""
            ? parseFloat(quantityValue.toString())
            : null;
        const threshold =
          thresholdValue !== null &&
          thresholdValue !== undefined &&
          thresholdValue !== ""
            ? parseFloat(thresholdValue.toString())
            : null;

        // Skip completely empty rows
        if (!materialName && quantity === null && threshold === null) return;

        rows.push({
          materialName,
          quantity,
          threshold,
          materialId: null,
          errors: [],
          isValid: false,
        });
      });

      if (rows.length === 0) {
        toast.error("File không có dữ liệu!");
        return;
      }

      // Validate data
      const validatedRows = validateImportData(rows);
      setImportData(validatedRows);

      const validCount = validatedRows.filter((r) => r.isValid).length;
      const invalidCount = validatedRows.length - validCount;

      if (invalidCount > 0) {
        toast.warning(`Có ${invalidCount} dòng lỗi cần kiểm tra!`);
      } else {
        toast.success(`Đã đọc ${validCount} nguyên liệu hợp lệ!`);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Không thể đọc file Excel!");
    }
  };

  const handleRemoveRow = (index: number) => {
    const newData = importData.filter((_, i) => i !== index);
    // Re-validate to check for duplicates
    const revalidated = validateImportData(
      newData.map((row) => ({
        ...row,
        errors: [],
        isValid: false,
      }))
    );
    setImportData(revalidated);
  };

  const handleSubmit = async () => {
    const validRows = importData.filter((row) => row.isValid && row.materialId);

    if (validRows.length === 0) {
      toast.error("Không có nguyên liệu hợp lệ để import!");
      return;
    }

    try {
      setLoading(true);

      await addMaterialsToWarehouse(warehouseId, {
        materials: validRows.map((row) => ({
          materialId: row.materialId!,
          quantity: row.quantity!,
          threshold: row.threshold!,
        })),
      });

      toast.success(`Đã import ${validRows.length} nguyên liệu vào kho!`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to import materials:", error);
      toast.error("Không thể import nguyên liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImportData([]);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const validCount = importData.filter((r) => r.isValid).length;
  const invalidCount = importData.length - validCount;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col py-0">
        {/* Header */}
        <div className="bg-[#78A243] p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Import nguyên liệu từ Excel
                </h2>
                <p className="text-white/80 text-sm">
                  Tải file mẫu, điền thông tin và upload để import
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Download template */}
          <div className="mb-6 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[#2D1E1A] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#78A243] text-white rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Tải file mẫu
            </h3>
            <div className="flex items-center gap-4 p-4 bg-[#78A243]/10 rounded-lg border border-[#78A243]/30">
              <div className="flex-1">
                <p className="text-sm text-[#2D1E1A]">
                  File mẫu đã có sẵn danh sách{" "}
                  <strong>{selectableMaterials.length}</strong> nguyên liệu chưa
                  có trong kho. Bạn chỉ cần điền số lượng và ngưỡng cảnh báo.
                </p>
              </div>
              <Button
                onClick={handleDownloadTemplate}
                className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải file mẫu
              </Button>
            </div>
          </div>

          {/* Step 2: Upload file */}
          <div className="mb-6 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[#2D1E1A] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#78A243] text-white rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Upload file Excel
            </h3>
            <div
              className="border-2 border-dashed border-[#78A243]/30 rounded-lg p-6 text-center hover:border-[#78A243] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="h-10 w-10 text-[#78A243]/50 mx-auto mb-3" />
              {fileName ? (
                <p className="text-[#2D1E1A] font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-[#2D1E1A] font-medium">
                    Click để chọn file hoặc kéo thả vào đây
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Hỗ trợ file .xlsx, .xls
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Step 3: Preview data */}
          {importData.length > 0 && (
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-[#2D1E1A] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#78A243] text-white rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Xem trước dữ liệu
                <Badge className="ml-2 bg-green-100 text-green-700">
                  {validCount} hợp lệ
                </Badge>
                {invalidCount > 0 && (
                  <Badge className="bg-red-100 text-red-700">
                    {invalidCount} lỗi
                  </Badge>
                )}
              </h3>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                        STT
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                        Nguyên liệu
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                        Ngưỡng
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                        Xóa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {importData.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          row.isValid ? "bg-green-50/50" : "bg-red-50/50"
                        }
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#2D1E1A]">
                          {row.materialName || (
                            <span className="text-red-500 italic">Trống</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#2D1E1A]">
                          {row.quantity !== null ? (
                            row.quantity
                          ) : (
                            <span className="text-red-500 italic">Trống</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#2D1E1A]">
                          {row.threshold !== null ? (
                            row.threshold
                          ) : (
                            <span className="text-red-500 italic">Trống</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {row.isValid ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Hợp lệ
                            </Badge>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {row.errors.map((error, i) => (
                                <Badge
                                  key={i}
                                  className="bg-red-100 text-red-700 border-red-300 text-xs"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {error}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveRow(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            {importData.length > 0 && (
              <>
                Tổng: <strong>{importData.length}</strong> dòng | Hợp lệ:{" "}
                <strong className="text-green-600">{validCount}</strong> | Lỗi:{" "}
                <strong className="text-red-600">{invalidCount}</strong>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outline"
              className="px-6"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || validCount === 0 || invalidCount > 0}
              className="px-6 bg-[#78A243] hover:bg-[#78A243]/90 text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import {validCount} nguyên liệu
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
