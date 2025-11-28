import {
  Combo,
  ComboSearchParams,
  ComboSearchResponse,
  searchCombos,
} from "@/apis/combo.api";

import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

const GET_COMBO_SEARCH_QUERY_KEY = "GET_COMBO_SEARCH_QUERY_KEY";

type useGetComboSearchProps = {
  size: number;
  branchId?: number;
  keyword?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "startDate" | "endDate";
  sortDirection?: "ASC" | "DESC";
  appendPages?: boolean;
};

const useGetComboSearch = ({
  size,
  branchId,
  keyword,
  isActive,
  minPrice,
  maxPrice,
  sortBy,
  sortDirection,
  appendPages = true,
}: useGetComboSearchProps) => {
  const queryClient = useQueryClient();
  const [comboList, setComboList] = useState<Combo[]>([]);
  const [page, setPage] = useState<number>(0);

  const normalizedBranchId = branchId ?? 1;
  const normalizedKeyword = keyword ?? "";
  const normalizedIsActive = isActive ?? true;
  const normalizedMinPrice = minPrice ?? 0;
  const normalizedMaxPrice = maxPrice ?? 1000000000;
  const normalizedSortBy = sortBy ?? "name";
  const normalizedSortDirection = sortDirection ?? "ASC";

  const {
    data: fetchedCombos,
    isLoading: isLoadingCombos,
    refetch,
    dataUpdatedAt,
  } = useQuery<ComboSearchResponse>({
    queryKey: [
      GET_COMBO_SEARCH_QUERY_KEY,
      normalizedBranchId,
      normalizedKeyword,
      normalizedIsActive,
      normalizedMinPrice,
      normalizedMaxPrice,
      page,
      size,
      normalizedSortBy,
      normalizedSortDirection,
    ],
    queryFn: () => {
      const params: ComboSearchParams = {
        branchId: normalizedBranchId,
        keyword: normalizedKeyword || undefined,
        isActive: normalizedIsActive,
        minPrice: normalizedMinPrice,
        maxPrice: normalizedMaxPrice,
        sortBy: normalizedSortBy,
        sortDirection: normalizedSortDirection,
        page,
        size,
      };
      return searchCombos(params);
    },
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
    setComboList([]);
    await queryClient.invalidateQueries({
      queryKey: [GET_COMBO_SEARCH_QUERY_KEY],
      refetchType: "active",
    });
  };

  useEffect(() => {
    if (!fetchedCombos) {
      return;
    }

    if (!appendPages) {
      setComboList(fetchedCombos.content);
      return;
    }

    const currentPage = fetchedCombos.pageNumber;
    if (currentPage === 0) {
      setComboList(fetchedCombos.content);
    } else {
      setComboList((prev) => [...prev, ...fetchedCombos.content]);
    }
  }, [appendPages, fetchedCombos, dataUpdatedAt]);

  useEffect(() => {
    setPage(0);
    setComboList([]);
    queryClient.invalidateQueries({
      queryKey: [GET_COMBO_SEARCH_QUERY_KEY],
      refetchType: "active",
    });
  }, [
    normalizedBranchId,
    normalizedKeyword,
    normalizedIsActive,
    normalizedMinPrice,
    normalizedMaxPrice,
    normalizedSortBy,
    normalizedSortDirection,
    queryClient,
  ]);

  return {
    combos: comboList,
    isLoading: isLoadingCombos,
    nextPage,
    prevPage,
    goToPage,
    page,
    hasMore: fetchedCombos ? !fetchedCombos.last : false,
    totalElements: fetchedCombos?.totalElements || 0,
    totalPages: fetchedCombos?.totalPages || 0,
    refetch,
    resetAndRefetch,
  };
};

export default useGetComboSearch;

