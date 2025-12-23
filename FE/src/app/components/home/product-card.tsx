"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductById, Product } from "@/apis/product.api";
import { AddToCartDialog } from "@/components/common/add-to-cart/add-to-cart-dialog";
import { AddToCartDrawer } from "@/components/common/add-to-cart/add-to-cart-drawer";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  index: number;
};

export function ProductCard({
  id,
  title,
  description,
  price,
  image,
  index,
}: ProductCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const { data: product } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: dialogOpen && id > 0,
    staleTime: 5 * 60 * 1000,
  });

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/menu/products/${id}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <>
      <motion.div
        className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow text-center cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={handleCardClick}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-black mb-2 line-clamp-2 min-h-[1.5rem]">{title}</h3>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-black">{price}đ</span>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-200 hover:text-orange-500 hover:border-orange-500 font-semibold rounded-full px-4 transition-colors"
              onClick={handleAddToCartClick}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </motion.div>
      {dialogOpen && product && !isMobile && (
        <AddToCartDialog
          product={product}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {dialogOpen && product && isMobile && (
        <AddToCartDrawer
          product={product}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
