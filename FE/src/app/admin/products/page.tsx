"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminGuard } from "@/components/guards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UtensilsCrossed,
  Plus,
  Search,
  Loader2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { Card } from "@/components/ui/card";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import {
  getAllBranchProducts,
  getProductType,
  type Product,
  type ProductType,
  type AllBranchProductSearchParams,
} from "@/apis/product.api";
import { ProductForm } from "./components/ProductForm";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sort states
  const [sortBy, setSortBy] = useState("createdDate");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  // Filter states
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | undefined
  >();
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Load product types
  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        const types = await getProductType();
        setProductTypes(types.filter((t) => t.id !== 0));
      } catch (error) {
        console.error("Failed to load product types:", error);
      }
    };
    loadProductTypes();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: AllBranchProductSearchParams = {
        keyword: searchKeyword || undefined,
        productTypeId: selectedProductTypeId,
        isActive: isActiveFilter,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };
      const response = await getAllBranchProducts(params);
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchKeyword,
    sortBy,
    sortDirection,
    selectedProductTypeId,
    isActiveFilter,
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortDirection("ASC");
    }
    setCurrentPage(0);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return (
        <div className="flex flex-col -space-y-1">
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
      );
    }
    return sortDirection === "ASC" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#78A243]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#78A243]" />
    );
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearchKeyword("");
    setSelectedProductTypeId(undefined);
    setIsActiveFilter(undefined);
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(0);
  };

  const handleProductTypeChange = (value: string) => {
    const typeId = value ? parseInt(value) : undefined;
    setSelectedProductTypeId(typeId);
    setCurrentPage(0);
  };

  const handleStatusChange = (value: string) => {
    const nextStatus = value === "" ? undefined : value === "true";
    setIsActiveFilter(nextStatus);
    setCurrentPage(0);
  };

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Quản Lý Món Ăn"
          icon={UtensilsCrossed}
          actions={
            <Button
              onClick={handleAddProduct}
              className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Sản Phẩm
            </Button>
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
              />
            </div>
            <FilterDropdown
              label="Tất cả loại"
              title="Lọc theo loại sản phẩm"
              value={selectedProductTypeId?.toString() || ""}
              onChange={handleProductTypeChange}
              items={productTypes.map((type) => ({
                value: type.id.toString(),
                label: type.name,
              }))}
              className="w-[150px]"
            />
            <FilterDropdown
              label="Tất cả trạng thái"
              title="Lọc theo trạng thái"
              value={
                isActiveFilter === undefined ? "" : isActiveFilter.toString()
              }
              onChange={handleStatusChange}
              items={[
                { value: "true", label: "Hoạt động" },
                { value: "false", label: "Ngừng hoạt động" },
              ]}
              className="w-[150px]"
            />
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
            {(searchKeyword ||
              selectedProductTypeId ||
              isActiveFilter !== undefined ||
              minPrice ||
              maxPrice) && (
              <Button onClick={handleClearFilters} variant="ghost" size="sm">
                <X className="h-4 w-4 mr-1" />
                Xóa lọc
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end">
            <label className="text-sm text-[#2D1E1A]/80 font-medium whitespace-nowrap">
              Hiển thị:
            </label>
            <FilterDropdown
              label="Hiển thị"
              value={pageSize.toString()}
              onChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(0);
              }}
              items={[
                { value: "5", label: "5" },
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
              ]}
              showAllOption={false}
              className="w-[80px]"
            />
            <span className="text-sm text-[#2D1E1A]/80 whitespace-nowrap">
              Tổng:{" "}
              <span className="font-bold text-[#78A243]">{totalElements}</span>
            </span>
          </div>
        </div>

        {showFilters && (
          <div className="p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold mb-1 block text-[#2D1E1A]">
                  Giá từ
                </label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block text-[#2D1E1A]">
                  Giá đến
                </label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="999999999"
                  className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20"
                />
              </div>
            </div>
          </div>
        )}

        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b-2 border-grey-300">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Sản phẩm
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("productType")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Loại
                      {getSortIcon("productType")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("productPrice")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Giá bán
                      {getSortIcon("productPrice")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#78A243]/10">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-[#2D1E1A]/70"
                    >
                      <div className="flex justify-center mb-2">
                        <Loader2 className="h-6 w-6 animate-spin text-[#78A243]" />
                      </div>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-[#2D1E1A]/70"
                    >
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.productId}
                      className="hover:bg-[#EBD187]/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#78A243]/20 bg-gray-50 shrink-0">
                            {product.productImage ? (
                              <Image
                                src={product.productImage}
                                alt={product.productName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[#2D1E1A]">
                              {product.productName}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                              {product.productDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#78A243]/10 text-[#78A243] border border-[#78A243]/20">
                          {product.productType || "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#DA7339]">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.productPrice)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Chi tiết & Công thức
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#2D1E1A]/80">
                  Trang <span className="font-semibold">{currentPage + 1}</span>{" "}
                  / {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <ProductForm
          open={showProductForm}
          onOpenChange={setShowProductForm}
          product={selectedProduct}
          onSuccess={fetchProducts}
        />
      </AdminPageLayout>
    </AdminGuard>
  );
}
