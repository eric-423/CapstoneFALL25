"use client";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import StyledHeading from "@/components/common/styled-heading";
import { Button } from "@/components/ui/button";
import useScrollTop from "@/utils/hooks/useScrollTop";
import useGetProductSearch from "@/utils/hooks/useGetProductSearch";
import useGetComboSearch from "@/utils/hooks/useGetComboSearch";
import {
  GET_TOP_SELLING_QUERY_KEY,
  Product,
  ProductType,
  getTopSellingProducts,
  getProductType,
  GET_PRODUCT_TYPE_QUERY_KEY,
  GET_PRODUCT_TYPE_STALE_TIME,
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
import { setCookie } from "@/utils/cookies.client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import ProductList from "./components/product-list";
import ComboList from "./components/combo-list";
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
  const searchParams = useSearchParams();
  const [productType, setProductType] = useState<ProductType>({
    id: 0,
    name: "Tất cả",
  });
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [pageAnimating, setPageAnimating] = useState(false);

  const { data: productTypes = [], isLoading: isLoadingProductTypes } =
    useQuery({
      queryKey: [GET_PRODUCT_TYPE_QUERY_KEY],
      queryFn: () => getProductType(),
      staleTime: GET_PRODUCT_TYPE_STALE_TIME,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  // Thêm Combo vào danh sách productTypes
  const allProductTypes = useMemo(() => {
    const comboType: ProductType = {
      id: -1,
      name: "Combo",
    };
    return [comboType, ...productTypes];
  }, [productTypes]);

  // Đọc category từ query params và set productType
  useEffect(() => {
    if (productTypes.length > 0) {
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        const categoryId = parseInt(categoryParam, 10);
        const foundCategory = productTypes.find(
          (type) => type.id === categoryId
        );
        if (foundCategory) {
          setProductType(foundCategory);
        }
      }
    }
  }, [searchParams, productTypes]);
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

  const isComboMode = productType.id === -1;

  const {
    products: productList,
    isLoading: isLoadingProducts,
    resetAndRefetch: resetAndRefetchProducts,
    page: productPage,
    goToPage: goToProductPage,
    totalPages: productTotalPages,
  } = useGetProductSearch({
    size: 12,
    productTypeId:
      productType.id === 0
        ? undefined
        : productType.id === -1
          ? undefined
          : productType.id,
    branchId: selectedBranch?.branchId || 1,
    isActive: true,
    appendPages: false,
  });

  const {
    combos: comboList,
    isLoading: isLoadingCombos,
    resetAndRefetch: resetAndRefetchCombos,
    page: comboPage,
    goToPage: goToComboPage,
    totalPages: comboTotalPages,
  } = useGetComboSearch({
    size: 12,
    branchId: selectedBranch?.branchId || 1,
    isActive: true,
    appendPages: false,
  });

  const isLoading = isComboMode ? isLoadingCombos : isLoadingProducts;
  const page = isComboMode ? comboPage : productPage;
  const totalPages = isComboMode ? comboTotalPages : productTotalPages;
  const goToPage = isComboMode ? goToComboPage : goToProductPage;

  const resetAndRefetch = useCallback(async () => {
    await Promise.all([resetAndRefetchProducts(), resetAndRefetchCombos()]);
  }, [resetAndRefetchProducts, resetAndRefetchCombos]);

  const { data: topSellingData } = useQuery({
    queryKey: [GET_TOP_SELLING_QUERY_KEY, selectedBranch?.branchId],
    queryFn: () => getTopSellingProducts(selectedBranch?.branchId || 1, 1),
    enabled: Boolean(selectedBranch?.branchId),
    refetchOnWindowFocus: false,
  });

  const isLoadingBranches =
    isLoadingBranchesData ||
    isLoadingProductTypes ||
    isLoadingCustomerInfos ||
    isLoadingNearbyBranches;

  useEffect(() => {
    if (isLoadingBranches) return;
    if (!displayBranches.length) return;

    // Kiểm tra branch từ query params trước
    const branchParam = searchParams.get("branch");
    if (branchParam) {
      const branchId = parseInt(branchParam, 10);
      const foundBranch = displayBranches.find((b) => b.branchId === branchId);
      if (foundBranch) {
        setSelectedBranch(foundBranch);
        if (typeof window !== "undefined") {
          localStorage.setItem("selectedBranch", JSON.stringify(foundBranch));
          const expiresDate = new Date();
          expiresDate.setFullYear(expiresDate.getFullYear() + 1);
          setCookie("branchId", foundBranch.branchId.toString(), expiresDate);
        }
        return;
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedBranch");
      if (stored) {
        try {
          const branch = JSON.parse(stored) as Branch;
          if (displayBranches.some((b) => b.branchId === branch.branchId)) {
            setSelectedBranch(branch);
            const expiresDate = new Date();
            expiresDate.setFullYear(expiresDate.getFullYear() + 1);
            setCookie("branchId", branch.branchId.toString(), expiresDate);
            return;
          }
        } catch (e) {
          console.error("Error parsing stored branch:", e);
        }
      }
    }

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
        const expiresDate = new Date();
        expiresDate.setFullYear(expiresDate.getFullYear() + 1);
        setCookie("branchId", firstBranch.branchId.toString(), expiresDate);
      }
      return firstBranch;
    });
  }, [displayBranches, isLoadingBranches, searchParams]);

  useEffect(() => {
    const handleBranchChange = (event: CustomEvent) => {
      const branch = event.detail as Branch;
      setSelectedBranch(branch);
      const expiresDate = new Date();
      expiresDate.setFullYear(expiresDate.getFullYear() + 1);
      setCookie("branchId", branch.branchId.toString(), expiresDate);
      resetAndRefetch();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "branchChanged",
        handleBranchChange as EventListener
      );
      return () => {
        window.removeEventListener(
          "branchChanged",
          handleBranchChange as EventListener
        );
      };
    }
  }, [resetAndRefetch]);

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
    <div className="min-h-screen bg-[#FFFCF7]">
      {isLoadingBranches ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div
            id="hero-section"
            className="relative min-h-[200px] md:h-64 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#FFFCF7] flex items-center justify-center pt-16 md:pt-20 pb-8 md:pb-10 px-4">
              <div className="text-center w-full max-w-4xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2D1E1A] mb-3 md:mb-4 px-2 leading-tight">
                  <StyledHeading text="Thực đơn Tấm Tắc" />
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-1.5xl text-black/90 max-w-2xl mx-auto px-2">
                  <span className="text-orange-500 font-medium">Tấm Tắc</span>{" "}
                  là chuỗi hệ thống cơm tấm với mong muốn mang đến cho sinh viên
                  những bữa cơm tấm chất lượng với giá cả hợp lý, đảm bảo vệ
                  sinh an toàn thực phẩm
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-6 md:pt-8 py-6 md:py-10 bg-[#FFFCF7]">
            <div className="w-full mb-6 flex justify-center">
              <ProductTypeList
                productTypes={allProductTypes || []}
                productType={productType}
                setProductType={setProductType}
                resetAndRefetch={resetAndRefetch}
              />
            </div>
            <div className="w-full" id="menu-content">
              <div>
                <div className="flex items-center justify-between mt-8 md:mt-15 mb-6 md:mb-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
                    {selectedBranch?.branchName ? (
                      <>
                        <span className="break-words">
                          {selectedBranch.branchName}
                        </span>{" "}
                        -{" "}
                        <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-orange-500 break-words">
                          {productType.name}
                        </span>
                      </>
                    ) : (
                      <span className="break-words">{productType.name}</span>
                    )}
                  </h2>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner className="my-10 h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div
                      className={`transition-all duration-500 ${pageAnimating ? "animate-slide-up" : ""}`}
                    >
                      {isComboMode ? (
                        <ComboList combos={comboList} />
                      ) : (
                        <ProductList products={productList} />
                      )}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <Button
                            className="rounded-full font-semibold px-5 py-2 h-11 bg-[#EC6426]/30 text-orange-500 hover:bg-[#EC6426]/50 hover:shadow-md transition-all duration-200 disabled:bg-[#F7D7BF] disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={page === 0}
                            onClick={handlePrevPage}
                          >
                            Trước
                          </Button>
                          {paginationPages.map((item, idx) =>
                            item === "ellipsis" ? (
                              <span
                                key={`ellipsis-${idx}`}
                                className="px-3 text-gray-400 font-semibold text-lg"
                              >
                                ...
                              </span>
                            ) : (
                              <Button
                                key={item}
                                className={`h-11 w-11 rounded-full font-semibold transition-all duration-200 ${
                                  item === page
                                    ? "bg-[#EC6426] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 scale-105"
                                    : "bg-[#EC6426]/30 text-[#EC6426] hover:bg-[#EC6426]/50 hover:shadow-md border-2 border-transparent hover:border-[#EC6426]/30"
                                }`}
                                onClick={() => handlePageChange(item)}
                              >
                                {item + 1}
                              </Button>
                            )
                          )}
                          <Button
                            className="rounded-full font-semibold px-5 py-2 h-11 bg-[#EC6426]/30 text-[#D95714] hover:bg-[#EC6426]/50 hover:shadow-md transition-all duration-200 disabled:bg-[#F7D7BF] disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={page >= totalPages - 1}
                            onClick={handleNextPage}
                          >
                            Sau
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Trang{" "}
                          <span className="font-semibold text-[#EC6426] text-base">
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
        </>
      )}
    </div>
  );
}
