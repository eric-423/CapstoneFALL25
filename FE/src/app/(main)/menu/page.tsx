"use client";

import image from "@/assets/images/Home - Banner.jpg";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import StyledHeading from "@/components/common/styled-heading";
import { Button } from "@/components/ui/button";
import useScrollTop from "@/utils/hooks/useScrollTop";
import useGetProductSearch from "@/utils/hooks/useGetProductSearch";
import {
  GET_TOP_SELLING_QUERY_KEY,
  Product,
  ProductType,
  getTopSellingProducts,
} from "@/apis/product.api";
import { getCustomerInformation } from "@/apis/user.api";
import {
  Branch as ApiBranch,
  CustomerInformation,
  GET_BRANCHES_QUERY_KEY,
  GET_BRANCHES_STALE_TIME,
  getBranches,
  getNearbyBranches,
  NearbyBranch,
} from "@/apis/branch.api";
import { useAuth } from "@/utils/hooks";
import { useSampleProductTypes } from "@/utils/hooks/useSampleData";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import BranchList from "./components/branch-list";
import FeaturedProduct from "./components/featured-product";
import ProductList from "./components/product-list";
import ProductTypeList from "./components/product-type-list";

type Branch = {
  branchId: number;
  branchName: string;
  address: string;
  phone: string;
  isActive: boolean;
  distanceText?: string;
};

export default function MenuPage() {
  useScrollTop();
  const { user } = useAuth();
  const [productType, setProductType] = useState<ProductType>({
    id: 0,
    name: "Tất cả",
  });
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [pageAnimating, setPageAnimating] = useState(false);

  const { productTypes, isLoading: isLoadingProductTypes } =
    useSampleProductTypes();
  const { data: branchesData = [], isLoading: isLoadingBranchesData } =
    useQuery<ApiBranch[]>({
      queryKey: [GET_BRANCHES_QUERY_KEY],
      queryFn: () => getBranches(),
      staleTime: GET_BRANCHES_STALE_TIME,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const {
    data: customerInformationData = [],
    isLoading: isLoadingCustomerInfos,
  } = useQuery({
    queryKey: ["customer-informations", user?.id],
    queryFn: () => getCustomerInformation(user?.id ?? 0),
    enabled: Boolean(user?.id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const customerInformations = useMemo(() => {
    if (Array.isArray(customerInformationData?.data))
      return customerInformationData.data;
    if (Array.isArray(customerInformationData)) return customerInformationData;
    return [];
  }, [customerInformationData]);

  const primaryAddress = useMemo(() => {
    if (!customerInformations.length) return "";
    const defaultInfo = customerInformations.find(
      (info: CustomerInformation) => info.isDefault
    );
    return (defaultInfo ?? customerInformations[0])?.address || "";
  }, [customerInformations]);

  const { data: nearbyBranchesData = [], isLoading: isLoadingNearbyBranches } =
    useQuery({
      queryKey: ["nearby-branches", primaryAddress],
      queryFn: () => getNearbyBranches(primaryAddress, 20),
      enabled: Boolean(primaryAddress),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const nearbyBranches = useMemo(() => {
    if (!Array.isArray(nearbyBranchesData)) return [];
    return nearbyBranchesData.map(
      (branch: NearbyBranch) =>
        ({
          branchId: branch.branchId,
          branchName: branch.name,
          address: branch.address,
          phone: branch.phoneNumber,
          isActive: true,
          distanceText: branch.distanceText,
        }) as Branch
    );
  }, [nearbyBranchesData]);

  const apiBranches = useMemo(() => {
    if (!Array.isArray(branchesData)) return [];
    return branchesData.map(
      (branch): Branch => ({
        branchId: branch.id,
        branchName: branch.name,
        address: branch.address ?? "",
        phone: branch.phone ?? "",
        isActive: branch.active,
      })
    );
  }, [branchesData]);

  const displayBranches = useMemo(() => {
    if (nearbyBranches.length) {
      return nearbyBranches;
    }
    return apiBranches;
  }, [apiBranches, nearbyBranches]);

  const {
    products: productList,
    isLoading: isLoadingProducts,
    resetAndRefetch,
    page,
    goToPage,
    totalPages,
  } = useGetProductSearch({
    size: 12,
    productTypeId: productType.id === 0 ? undefined : productType.id,
    branchId: selectedBranch?.branchId || 1,
    isActive: true,
    appendPages: false,
  });

  const { data: topSellingData } = useQuery({
    queryKey: [GET_TOP_SELLING_QUERY_KEY, selectedBranch?.branchId],
    queryFn: () => getTopSellingProducts(selectedBranch?.branchId || 1, 1),
    enabled: Boolean(selectedBranch?.branchId),
    refetchOnWindowFocus: false,
  });

  const featuredProduct = useMemo<Product | null>(() => {
    const topItem = topSellingData?.data?.topItems?.[0];
    if (!topItem) return null;
    const estimatedPrice =
      topItem.quantitySold && topItem.quantitySold > 0
        ? Math.round(topItem.revenue / topItem.quantitySold)
        : topItem.revenue || 0;
    return {
      productId: topItem.id,
      productName: topItem.name,
      productDescription: `Đã bán ${topItem.quantitySold} phần trong tuần qua`,
      productImage: topItem.imageUrl,
      productPrice: estimatedPrice,
      productType: "Best Seller",
    } as Product;
  }, [topSellingData]);

  const isLoadingBranches =
    isLoadingBranchesData ||
    isLoadingProductTypes ||
    isLoadingCustomerInfos ||
    isLoadingNearbyBranches;

  useEffect(() => {
    if (isLoadingBranches) return;
    if (!displayBranches.length) return;

    setSelectedBranch((prev) => {
      if (
        prev &&
        displayBranches.some((branch) => branch.branchId === prev.branchId)
      ) {
        return prev;
      }
      const firstBranch = displayBranches[0];
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedBranch", JSON.stringify(firstBranch));
      }
      return firstBranch;
    });
  }, [displayBranches, isLoadingBranches]);

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .getElementById("hero-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [productType, selectedBranch, scrollToTop]);

  useEffect(() => {
    setPageAnimating(true);
    const timer = setTimeout(() => setPageAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [page]);

  const paginationPages = useMemo(() => {
    if (totalPages <= 1) return [];

    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const firstPage = 0;
    const lastPage = totalPages - 1;
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages - 2, page + 1);

    pages.push(firstPage);

    if (start > 1) {
      pages.push("ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(lastPage);
    return pages;
  }, [page, totalPages]);

  const handlePageChange = (targetPage: number) => {
    if (targetPage === page) return;
    goToPage(targetPage);
  };

  const handlePrevPage = () => {
    if (page === 0) return;
    goToPage(page - 1);
  };

  const handleNextPage = () => {
    if (page >= totalPages - 1) return;
    goToPage(page + 1);
  };

  useEffect(() => {
    scrollToTop();
  }, [page, scrollToTop]);

  return (
    <div className="min-h-screen">
      {isLoadingBranches ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div
            id="hero-section"
            className="relative h-64 md:h-80 overflow-hidden"
          >
            <Image
              src={image}
              alt="Tấm Tắc Menu"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <StyledHeading text="Thực đơn Tấm Tắc" />
                </h1>
                <p className="text-white/90 max-w-2xl mx-auto px-4">
                  <span className="text-background font-medium">Tấm Tắc</span>{" "}
                  là chuỗi hệ thống cơm tấm với mong muốn mang đến cho sinh viên
                  những bữa cơm tấm chất lượng với giá cả hợp lý, đảm bảo vệ
                  sinh an toàn thực phẩm
                </p>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-10 md:px-10 pt-8 py-20">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Danh mục</h2>
                  <div className="space-y-6">
                    <ProductTypeList
                      productTypes={productTypes || []}
                      productType={productType}
                      setProductType={setProductType}
                      resetAndRefetch={resetAndRefetch}
                    />
                    <div>
                      <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">
                        Cửa hàng
                      </h3>
                      <BranchList
                        branches={displayBranches}
                        selectedBranch={selectedBranch}
                        setSelectedBranch={setSelectedBranch}
                        resetAndRefetch={resetAndRefetch}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-3/4" id="menu-content">
                {featuredProduct && productType.id === 0 && page === 0 && (
                  <FeaturedProduct product={featuredProduct} />
                )}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">
                      {selectedBranch?.branchName ? (
                        <>
                          {selectedBranch.branchName}{" "}
                          <span className="font-normal text-base">
                            - {productType.name}
                          </span>
                        </>
                      ) : (
                        productType.name
                      )}
                    </h2>
                  </div>
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner className="my-10 h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div
                        className={`transition-all duration-500 ${pageAnimating ? "animate-slide-up" : ""}`}
                      >
                        <ProductList products={productList} />
                      </div>
                      {totalPages > 1 && (
                        <div className="mt-10 flex flex-col items-center gap-4">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                              className="rounded-xl font-semibold px-4 py-2 h-10 bg-[#EC6426]/30 text-[#D95714] hover:bg-[#EC6426]/50 transition-colors disabled:bg-[#F7D7BF] disabled:text-white disabled:cursor-not-allowed"
                              disabled={page === 0}
                              onClick={handlePrevPage}
                            >
                              Trước
                            </Button>
                            {paginationPages.map((item, idx) =>
                              item === "ellipsis" ? (
                                <span
                                  key={`ellipsis-${idx}`}
                                  className="px-2 text-primary font-semibold"
                                >
                                  ...
                                </span>
                              ) : (
                                <Button
                                  key={item}
                                  className={`h-10 w-10 rounded-xl font-semibold transition-colors duration-200 ${
                                    item === page
                                      ? "bg-[#EC6426] text-white shadow-lg"
                                      : "bg-[#EC6426]/30 text-[#EC6426] hover:bg-[#EC6426]/50"
                                  }`}
                                  onClick={() => handlePageChange(item)}
                                >
                                  {item + 1}
                                </Button>
                              )
                            )}
                            <Button
                              className="rounded-xl font-semibold px-4 py-2 h-10 bg-[#EC6426]/30 text-[#D95714] hover:bg-[#EC6426]/50 transition-colors disabled:bg-[#F7D7BF] disabled:text-white disabled:cursor-not-allowed"
                              disabled={page >= totalPages - 1}
                              onClick={handleNextPage}
                            >
                              Sau
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Trang{" "}
                            <span className="font-semibold text-primary">
                              {page + 1}
                            </span>{" "}
                            / {totalPages}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
