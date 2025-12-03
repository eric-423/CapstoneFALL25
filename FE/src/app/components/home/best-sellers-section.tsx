"use client";

import { Product } from "@/apis/product.api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Montserrat } from "next/font/google";
import { useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTopSellingItems, SellingItem } from "@/apis/statistics.api";
import { ProductCard } from "./product-card";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

type BestSellersNewProps = {
  products?: Product[];
};

type DisplayProduct = {
  id: number;
  title: string;
  description: string;
  price: string;
  rating: number;
  image: string;
};

const BestSellersSection = ({ products }: BestSellersNewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: topSellingData, isLoading } = useQuery({
    queryKey: ["top-selling-items", 5],
    queryFn: () => getTopSellingItems(undefined, 5),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const displayProducts: DisplayProduct[] = useMemo(() => {
    if (topSellingData?.items && topSellingData.items.length > 0) {
      return topSellingData.items.map((item: SellingItem) => {
        const price =
          item.totalRevenue > 0 && item.quantitySold > 0
            ? Math.round(item.totalRevenue / item.quantitySold)
            : 0;

        return {
          id: item.itemId,
          title: item.itemName.toUpperCase(),
          description: "Món ăn ngon, đậm đà hương vị Việt Nam.",
          price: price.toLocaleString("vi-VN"),
          rating: 5,
          image: item.imageUrl || "/images/placeholder.jpg",
        };
      });
    }

    if (products && products.length > 0) {
      return products.slice(0, 5).map((product) => ({
        id: product.productId,
        title: product.productName.toUpperCase(),
        description:
          product.productDescription ||
          "Món ăn ngon, đậm đà hương vị Việt Nam.",
        price: (product.productPrice || 0).toLocaleString("vi-VN"),
        rating: 5,
        image: product.productImage || "/images/placeholder.jpg",
      }));
    }

    return [];
  }, [topSellingData, products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={`py-15 bg-[#FFFCF7] pl-5 pr-5 ${montserrat.className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            Món ăn phổ biến
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full !bg-[#F8A91F] hover:bg-[#EC6426] flex items-center justify-center transition-colors shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full !bg-[#F8A91F] hover:bg-[#EC6426] flex items-center justify-center transition-colors shadow-md"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-gray-600">Đang tải...</div>
          </div>
        ) : displayProducts.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayProducts.map((item, index) => (
              <ProductCard
                key={`${item.id}-${index}`}
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                rating={item.rating}
                image={item.image}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default BestSellersSection;
