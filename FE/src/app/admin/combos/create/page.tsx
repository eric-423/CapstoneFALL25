"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Package,
  Store,
  CheckCircle,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createCombo,
  type ComboItem,
  type CreateComboRequest,
} from "@/apis/combo.api";
import {
  searchProducts,
  type Product,
  type ProductSearchParams,
} from "@/apis/product.api";
import { useAdminContext } from "@/utils/contexts/AdminContext";
import { AdminSelect } from "../../components/AdminSelect";
import { Input } from "@/components/ui/input";
import { AdminGuard } from "@/components/guards";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../../components/AdminPageLayout";
import { uploadMediaToSupabase } from "@/components/common/upFileToSupabase";
import Image from "next/image";

const COMBO_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_COMBO_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_TRAINING_BUCKET ||
  "images_t";

export default function CreateComboPage() {
  const router = useRouter();
  const { branches } = useAdminContext();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [branchId, setBranchId] = useState<number | null>(
    branches.length > 0 ? branches[0].id : null
  );
  const [comboItems, setComboItems] = useState<ComboItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchProducts = async (branchIdParam?: number) => {
    if (!branchIdParam) return;

    try {
      setLoadingProducts(true);
      const params: ProductSearchParams = {
        branchId: branchIdParam,
        isActive: true,
        page: 0,
        size: 1000,
      };
      const data = await searchProducts(params);
      setProducts(data.content);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchProducts(branchId);
    }
  }, [branchId]);

  const handleAddItem = () => {
    if (products.length === 0) return;

    setComboItems([
      ...comboItems,
      {
        productId: products[0].productId,
        quantity: 1,
        note: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setComboItems(comboItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof ComboItem,
    value: string | number
  ) => {
    const newItems = [...comboItems];
    const current: ComboItem = { ...newItems[index] };
    if (field === "productId") {
      current.productId = Number(value);
    } else if (field === "quantity") {
      current.quantity = Number(value);
    } else if (field === "note") {
      current.note = String(value);
    }
    newItems[index] = current;
    setComboItems(newItems);
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !startDate ||
      !endDate ||
      !branchId ||
      comboItems.length === 0
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      if (selectedFile) {
        try {
          const uploadResult = await uploadMediaToSupabase({
            bucket: COMBO_BUCKET,
            file: selectedFile,
            folder: "combos",
          });
          imageUrl = uploadResult.publicUrl;
        } catch (uploadError: unknown) {
          console.error("Upload failed:", uploadError);
          const error = uploadError as Error & {
            originalError?: { message?: string };
          };
          const errorMessage =
            error?.message ||
            error?.originalError?.message ||
            "Không thể tải ảnh lên";
          if (
            errorMessage.includes("Bucket") &&
            errorMessage.includes("không tồn tại")
          ) {
            toast.error(
              `Lỗi: ${errorMessage}. Bucket hiện tại: "${COMBO_BUCKET}"`,
              { autoClose: 8000 }
            );
          } else {
            toast.error(`Không thể tải ảnh lên: ${errorMessage}`, {
              autoClose: 5000,
            });
          }
          setLoading(false);
          return;
        }
      }

      const requestData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isActive,
        branchId,
        imageUrl,
        comboItems,
      };

      await createCombo(requestData as CreateComboRequest);
      toast.success("Tạo combo mới thành công!");
      router.push("/admin/combos");
    } catch (error) {
      console.error("Failed to save combo:", error);
      toast.error("Không thể lưu combo. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    router.back();
  };

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Tạo combo mới"
          description="Thêm combo mới vào hệ thống"
          icon={Package}
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
          <Card className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-[#78A243]/20">
                  <h3 className="text-lg font-bold text-[#2D1E1A]">
                    Thông tin cơ bản
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2D1E1A] flex items-center gap-1">
                      Tên combo
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Combo cơm tấm 2 người"
                      className="w-full h-[48px] px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      Giá combo
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="110.000"
                        min="0"
                        step="1000"
                        className="w-full h-[48px] pl-5 pr-16 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                        VNĐ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    Mô tả
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: 2 phần cơm tấm sườn + 2 chanh muối"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      Hình ảnh combo
                    </label>
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="relative w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer"
                        onClick={() =>
                          document.getElementById("combo-image-upload")?.click()
                        }
                      >
                        {previewUrl ? (
                          <div className="relative w-[200px] h-[200px]">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              className="object-cover"
                              fill
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <ImageIcon className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs">Nhấn để tải ảnh</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <Input
                        id="combo-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-4 mt-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <Store className="h-4 w-4" />
                        Chi nhánh
                        <span className="text-red-500">*</span>
                      </label>
                      <AdminSelect
                        value={branchId?.toString() || ""}
                        onValueChange={(value) =>
                          setBranchId(value ? parseInt(value) : null)
                        }
                        placeholder="Chọn chi nhánh"
                        options={branches.map((branch) => ({
                          value: branch.id.toString(),
                          label: branch.name,
                          subLabel: branch.address || undefined,
                        }))}
                        triggerClassName="h-[48px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Ngày bắt đầu
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-[48px] px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Ngày kết thúc
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-[48px] px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded text-[#78A243] accent-[#78A243]"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-bold text-gray-900 cursor-pointer flex items-center gap-2"
                  >
                    Kích hoạt combo ngay sau khi tạo
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-[#78A243]/20">
                  <h3 className="text-lg font-bold text-gray-900">
                    Sản phẩm trong combo
                  </h3>
                  <span className="text-red-500 text-sm font-bold">*</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[#78A243]">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Danh sách sản phẩm
                      </p>
                      <p className="text-xs text-gray-600">
                        {comboItems.length > 0
                          ? `Đã thêm ${comboItems.length} sản phẩm`
                          : "Chưa có sản phẩm nào"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddItem}
                    size="sm"
                    disabled={!branchId || loadingProducts}
                    className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </div>

                {loadingProducts ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-semibold">
                      Đang tải danh sách sản phẩm...
                    </p>
                  </div>
                ) : comboItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      Chưa có sản phẩm nào
                    </p>
                    <p className="text-xs text-gray-500 text-center max-w-md">
                      Nhấn &quot;Thêm sản phẩm&quot; bên trên để thêm sản phẩm
                      vào combo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comboItems.map((item, index) => {
                      const product = products.find(
                        (p) => p.productId === item.productId
                      );
                      return (
                        <Card
                          key={index}
                          className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 hover:border-[#78A243] transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                              <div className="md:col-span-5 space-y-1">
                                <label className="text-xs font-bold text-gray-700">
                                  Sản phẩm
                                </label>
                                <AdminSelect
                                  value={item.productId.toString()}
                                  onValueChange={(value) =>
                                    handleItemChange(
                                      index,
                                      "productId",
                                      parseInt(value)
                                    )
                                  }
                                  options={products.map((product) => ({
                                    value: product.productId.toString(),
                                    label: product.productName,
                                    subLabel: `${product.productPrice.toLocaleString("vi-VN")}đ`,
                                  }))}
                                  triggerClassName="h-[48px]"
                                />
                              </div>

                              <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-700">
                                  Số lượng
                                </label>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "quantity",
                                      parseInt(e.target.value)
                                    )
                                  }
                                  min="1"
                                  className="w-full h-[45px] px-3 border-2 border-gray-200 rounded-lg text-sm font-semibold text-center focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20"
                                />
                              </div>

                              <div className="md:col-span-4 space-y-1">
                                <label className="text-xs font-bold text-gray-700">
                                  Ghi chú (tùy chọn)
                                </label>
                                <input
                                  type="text"
                                  value={item.note || ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "note",
                                      e.target.value
                                    )
                                  }
                                  placeholder="VD: Không hành, nhiều rau..."
                                  className="w-full h-[45px] px-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 outline-none"
                                />
                              </div>

                              <div className="md:col-span-1 space-y-1">
                                <label className="text-xs font-bold text-gray-700 opacity-0">
                                  Xóa
                                </label>
                                <Button
                                  onClick={() => handleRemoveItem(index)}
                                  variant="outline"
                                  className="w-full h-[45px] text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {product && (
                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                Đơn giá:{" "}
                                <span className="font-bold text-gray-900">
                                  {product.productPrice.toLocaleString("vi-VN")}
                                  đ
                                </span>
                              </span>
                              <span className="text-gray-600">
                                Thành tiền:{" "}
                                <span className="font-bold text-[#78A243]">
                                  {(
                                    product.productPrice * item.quantity
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              </span>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t-2 border-gray-100 p-6 flex gap-3 justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Tạo combo
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </AdminPageLayout>
    </AdminGuard>
  );
}
