"use client";

import {
  GET_BRANCHES_QUERY_KEY,
  GET_BRANCHES_STALE_TIME,
  getBranches,
} from "@/apis/branch.api";
import { GET_PRODUCTS_QUERY_KEY, getProducts } from "@/apis/product.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

const HeroSection = lazy(() =>
  import("@/app/components/home/hero-section").then((m) => ({
    default: m.default,
  }))
);
const WhyChooseUsSection = lazy(() =>
  import("@/app/components/home/why-choose-us-section").then((m) => ({
    default: m.default,
  }))
);
const BestSellersSection = lazy(() =>
  import("@/app/components/home/best-sellers-section").then((m) => ({
    default: m.default,
  }))
);
const FranchiseSection = lazy(() =>
  import("@/app/components/home/franchise-section").then((m) => ({
    default: m.default,
  }))
);

export default function Home() {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [GET_PRODUCTS_QUERY_KEY],
    queryFn: () => getProducts(),
    select: (data) => data.content.slice(0, 3),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: branches = [], isLoading: isLoadingBranches } = useQuery({
    queryKey: [GET_BRANCHES_QUERY_KEY],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <main className="min-h-screen bg-background overflow-x-hidden">
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <HeroSection />
        </Suspense>
        {isLoadingProducts || isLoadingBranches ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <BestSellersSection products={products} />
            </Suspense>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <WhyChooseUsSection />
            </Suspense>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <FranchiseSection />
            </Suspense>
          </>
        )}
      </main>
    </>
  );
}
