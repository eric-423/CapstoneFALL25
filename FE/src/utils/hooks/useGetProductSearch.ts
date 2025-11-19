import { GET_PRODUCT_SEARCH_QUERY_KEY, getProduct, Product, ProductResponse, SortBy } from '@/apis/product.api';

import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

type useGetProductSearchProps = {
  size: number;
  productTypeId?: number;
  branchId?: number;
  keyword?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
  sortDirection?: 'ASC' | 'DESC';
  appendPages?: boolean;
};

const useGetProductSearch = ({
  size,
  productTypeId,
  branchId,
  keyword,
  isActive,
  minPrice,
  maxPrice,
  sortBy,
  sortDirection,
  appendPages = true,
}: useGetProductSearchProps) => {
  const queryClient = useQueryClient();
  const [productList, setProductList] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(0);

  // Không normalize productTypeId nếu nó là undefined (cho category "Tất cả")
  const normalizedProductTypeId = productTypeId;
  const normalizedBranchId = branchId ?? 1;
  const normalizedKeyword = keyword ?? '';
  const normalizedIsActive = isActive ?? true;
  const normalizedMinPrice = minPrice ?? 0;
  const normalizedMaxPrice = maxPrice ?? 1000000000;
  const normalizedSortBy = sortBy ?? 'name';
  const normalizedSortDirection = sortDirection ?? 'ASC';

  const {
    data: fetchedProducts,
    isLoading: isLoadingProducts,
    refetch,
    dataUpdatedAt,
  } = useQuery<ProductResponse>({
    queryKey: [
      GET_PRODUCT_SEARCH_QUERY_KEY,
      normalizedBranchId,
      normalizedKeyword,
      normalizedProductTypeId,
      normalizedIsActive,
      normalizedMinPrice,
      normalizedMaxPrice,
      page,
      size,
      normalizedSortBy,
      normalizedSortDirection,
    ],
    queryFn: () =>
      getProduct(
        normalizedBranchId,
        normalizedKeyword,
        normalizedIsActive,
        normalizedMinPrice,
        normalizedMaxPrice,
        page,
        size,
        normalizedSortBy,
        normalizedSortDirection,
        normalizedProductTypeId,
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const goToPage = (pageNumber: number) => {
    setPage(Math.max(0, pageNumber));
  };

  const resetAndRefetch = async () => {
    setPage(0);
    setProductList([]);
    // Invalidate queries để đảm bảo refetch với tham số mới
    await queryClient.invalidateQueries({
      queryKey: [GET_PRODUCT_SEARCH_QUERY_KEY],
      refetchType: 'active',
    });
  };

  useEffect(() => {
    if (!fetchedProducts) {
      return;
    }

    if (!appendPages) {
      setProductList(fetchedProducts.data.content);
      return;
    }

    const currentPage = fetchedProducts.data.number;
    if (currentPage === 0) {
      setProductList(fetchedProducts.data.content);
    } else {
      setProductList((prev) => [...prev, ...fetchedProducts.data.content]);
    }
  }, [appendPages, fetchedProducts, dataUpdatedAt]);

  // Reset page và productList khi các tham số thay đổi (trừ page)
  // và invalidate queries để trigger refetch
  useEffect(() => {
    setPage(0);
    setProductList([]);
    // Invalidate queries với tất cả các tham số để đảm bảo refetch
    // Sử dụng refetchType: 'active' để refetch ngay các queries đang active
    queryClient.invalidateQueries({
      queryKey: [GET_PRODUCT_SEARCH_QUERY_KEY],
      refetchType: 'active',
    });
  }, [
    normalizedBranchId,
    normalizedKeyword,
    normalizedProductTypeId,
    normalizedIsActive,
    normalizedMinPrice,
    normalizedMaxPrice,
    normalizedSortBy,
    normalizedSortDirection,
    queryClient,
  ]);

  return {
    products: productList,
    isLoading: isLoadingProducts,
    nextPage,
    prevPage,
    goToPage,
    page,
    hasMore: fetchedProducts ? !fetchedProducts.data.last : false,
    totalElements: fetchedProducts?.data.totalElements || 0,
    totalPages: fetchedProducts?.data.totalPages || 0,
    refetch,
    resetAndRefetch,
  };
};

export default useGetProductSearch;

