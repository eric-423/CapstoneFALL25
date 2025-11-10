import { useState, useEffect } from 'react';
import { sampleData, getProductsByType, searchProducts } from '@/data';
import { Product } from '@/apis/product.api';
import { ProductType } from '@/apis/product.api';
import { useSampleData as useSampleDataFlag } from '@/utils/configs/environment';

interface UseSampleProductsProps {
  size?: number;
  productType?: number;
  branchId?: number;
  searchQuery?: string;
}

export const useSampleProducts = ({ 
  size = 10, 
  productType = 0, 
  searchQuery 
}: UseSampleProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredProducts = [...sampleData.products];

      // Filter by search query
      if (searchQuery) {
        filteredProducts = searchProducts(searchQuery);
      }

      // Filter by product type
      if (productType > 0) {
        const selectedType = sampleData.productTypes.find(type => type.id === productType);
        if (selectedType) {
          filteredProducts = getProductsByType(selectedType.name);
        }
      }

      // Pagination
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      if (page === 0) {
        setProducts(paginatedProducts);
      } else {
        setProducts(prev => [...prev, ...paginatedProducts]);
      }

      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [productType, searchQuery, page, size]);

  const nextPage = () => {
    setPage(prev => prev + 1);
  };

  const reset = () => {
    setPage(0);
    setProducts([]);
  };

  return {
    products,
    isLoading,
    nextPage,
    reset,
    hasMore: products.length < sampleData.products.length,
    totalElements: sampleData.products.length,
  };
};

export const useSampleProductTypes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // Thêm "Tất cả" vào đầu danh sách với id: 0
      setProductTypes([{ id: 0, name: 'Tất cả' }, ...sampleData.productTypes]);
      setIsLoading(false);
    }, 300);
  }, []);

  return {
    productTypes,
    isLoading,
  };
};

export const useSampleBranches = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [branches, setBranches] = useState(sampleData.branches);

  useEffect(() => {
    setTimeout(() => {
      setBranches(sampleData.branches);
      setIsLoading(false);
    }, 300);
  }, []);

  return {
    branches,
    isLoading,
  };
};

export default useSampleProducts;
