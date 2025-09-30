'use client';

import { GET_BRANCHES_QUERY_KEY, GET_BRANCHES_STALE_TIME, getBranches } from '@/apis/branch.api';
import { GET_PRODUCTS_QUERY_KEY, getProducts } from '@/apis/product.api';
import { LoadingSpinner } from '@/components/common/loading-spinner';

import HeroSection from '@/pages/Home/components/hero-section';
import WhyChooseUsSection from '@/pages/Home/components/why-choose-us-section';
import BestSellersSection from '@/pages/Home/components/best-sellers-section';
import ComTamSpecialtySection from '@/pages/Home/components/com-tam-specialty-section';
import FranchiseSection from '@/pages/Home/components/franchise-section';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [GET_PRODUCTS_QUERY_KEY],
    queryFn: () => getProducts(),
    select: (data) => data.content.slice(0, 3),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: [GET_BRANCHES_QUERY_KEY],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoadingProducts || isLoadingBranches ? (
        <div className='flex items-center justify-center min-h-screen'>
          <LoadingSpinner />
        </div>
      ) : (
        <main className='min-h-screen bg-background overflow-x-hidden'>
          {/* Hero Section */}
          <HeroSection />

          {/* Why Choose Us Section */}
          <WhyChooseUsSection />

          {/* Best Sellers Section */}
          <BestSellersSection products={products} />

          {/* Com Tam Specialty Section */}
          <ComTamSpecialtySection />

          {/* Franchise Section */}
          <FranchiseSection />
        </main>
      )}
    </>
  );
}
