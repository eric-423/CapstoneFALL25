"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getProductById,
  Product,
  getProductsByBranch,
  getProductNutrients,
  ProductNutrient,
} from "@/apis/product.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  Flame,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AddToCartDialog } from "@/components/common/add-to-cart/add-to-cart-dialog";
import { AddToCartDrawer } from "@/components/common/add-to-cart/add-to-cart-drawer";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/common/card/product-card";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      try {
        const result = await getProductById(productId);
        return result;
      } catch (err) {
        console.error("Error fetching product:", err);
        throw err;
      }
    },
    enabled: !!productId && !isNaN(productId),
    retry: 1,
  });

  const { data: relatedProducts = [], isLoading: isLoadingRelated } = useQuery<Product[]>({
    queryKey: ["same-type-products", product?.productId, product?.productTypeId],
    queryFn: async () => {
      if (!product?.productTypeId) return [];
      try {
        let branchId = 1;
        if (typeof window !== "undefined") {
          const branchIdFromCookie = JSON.parse(localStorage.getItem("selectedBranch") as string)?.branchId;
          branchId = branchIdFromCookie || 1;
        }

        const products = await getProductsByBranch(product.productTypeId, branchId, 0, 100);

        return products.filter((p: Product) => p.productId !== product.productId);
      } catch (error) {
        console.error("Error fetching same type products:", error);
        return [];
      }
    },
    enabled: !!product?.productId && !!product?.productTypeId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: nutrients = [] } = useQuery<ProductNutrient[]>({
    queryKey: ["product-nutrients", productId],
    queryFn: async () => {
      try {
        const result = await getProductNutrients(productId);
        return result;
      } catch (err) {
        console.error("Error fetching product nutrients:", err);
        return [];
      }
    },
    enabled: !!productId && !isNaN(productId),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner />
          <p className="text-sm text-gray-600">
            Đang tải thông tin sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-600 mb-4">
              Sản phẩm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.push("/menu")} variant="default">
              Quay lại menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const itemsPerPage = isMobile ? 2 : 4;
  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage) || 1;
  const startIndex = currentPage * itemsPerPage;
  const visibleProducts = relatedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#FFFCF7] py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-orange-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="max-w-6xl mx-auto bg-[#FFFCF7] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-stretch">
          <div className="relative w-full md:w-72 lg:w-80 aspect-[4/3] rounded-xl overflow-hidden bg-white">
            {product.productImage ? (
              <Image
                src={product.productImage}
                alt={product.productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 40vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-600 text-white font-bold text-lg px-4 py-2 rounded-lg">
                  HẾT HÀNG
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-600">
                  {product.productPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <Separator />

            {product.productDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-800">Mô tả</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.productDescription}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {product.productType && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>
                    <span className="font-semibold">Loại:</span>{" "}
                    {product.productType}
                  </span>
                </div>
              )}
              {product.calories !== undefined && product.calories > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>
                    <span className="font-semibold">Calories:</span>{" "}
                    {product.calories.toLocaleString("vi-VN")} kcal
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                {product.inStock ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-semibold">
                      Còn hàng
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-semibold">Hết hàng</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-auto mx-auto">
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-4 rounded-full"
                onClick={() => setDialogOpen(true)}
                disabled={!product.inStock}
              >
                {product.inStock ? "Thêm vào giỏ" : "Sản phẩm đã hết hàng"}
              </Button>
            </div>
          </div>
        </div>

        {nutrients.length > 0 && (
          <div className="mt-10 ">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 ">
              Thông tin dinh dưỡng
            </h2>
            <Card className="bg-white">
              <CardContent className="p-6 pt-3 ">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 ">
                          Chất dinh dưỡng
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-800 ">
                          Hàm lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {nutrients.map((nutrient) => (
                        <tr
                          key={nutrient.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-700 ">
                            {nutrient.name}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900 font-medium ">
                            {nutrient.amount.toLocaleString("vi-VN", {
                              maximumFractionDigits: 2,
                            })}{" "}
                            {nutrient.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Sản phẩm cùng loại
          </h2>
          {isLoadingRelated ? (
            <p className="text-sm text-gray-500">
              Đang tải sản phẩm cùng loại...
            </p>
          ) : relatedProducts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Hiện chưa có sản phẩm cùng loại.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {totalPages > 1 && (
                  <button
                    title="Quay lại"
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(0, page - 1))
                    }
                    disabled={currentPage === 0}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F8A91F] hover:bg-[#EC6426] flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </button>
                )}

                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {visibleProducts.map((item) => (
                      <ProductCard key={item.productId} item={item} />
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <button
                    title="Tiếp theo"
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages - 1, page + 1)
                      )
                    }
                    disabled={currentPage >= totalPages - 1}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F8A91F] hover:bg-[#EC6426] flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {dialogOpen && !isMobile && (
        <AddToCartDialog
          product={product}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {dialogOpen && isMobile && (
        <AddToCartDrawer
          product={product}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
