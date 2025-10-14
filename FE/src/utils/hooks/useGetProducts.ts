import { GET_PRODUCTS_BY_BRANCH_QUERY_KEY, getProducts } from '@/apis/product.api';
import { Product } from '@/types/product.type';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

type useGetProductsProps = {
  size: number;
  productType?: number;
  branchId?: number;
};

const useGetProducts = ({ size, productType }: useGetProductsProps) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(0);

  const { data: fetchedProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: [GET_PRODUCTS_BY_BRANCH_QUERY_KEY, productType, page],
    queryFn: () => getProducts(page, size, productType),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (fetchedProducts) {
      if (fetchedProducts.number === 0) {
        setProductList(fetchedProducts.content);
      } else {
        setProductList((prev) => [...prev, ...fetchedProducts.content]);
      }
    }
  }, [fetchedProducts, productType]);

  return {
    productList,
    isLoading: isLoadingProducts,
    nextPage,
    totalElements: fetchedProducts?.totalElements,
  };
};

export default useGetProducts;
