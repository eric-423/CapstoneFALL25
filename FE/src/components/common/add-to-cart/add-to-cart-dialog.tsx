"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/utils/contexts/cart/CartContext";
import { Product, getPairedProducts } from "@/apis/product.api";
import { ShoppingBag, X, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { QuantitySelector } from "../quantity-selector";
import logo from "@/assets/images/logo.png";
import { CartItem } from "@/utils/contexts/cart/cart.type";

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product & { isCombo?: boolean; comboId?: number };
}

export function AddToCartDialog({
  open,
  onOpenChange,
  product,
}: AddToCartDialogProps) {
  const { addItem } = useCart();
  const [mainQuantity, setMainQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [imageError, setImageError] = useState(false);
  const [relatedQuantities, setRelatedQuantities] = useState<Record<number, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: relatedProducts = [], isLoading: isLoadingRelated } = useQuery<Product[]>({
    queryKey: ["paired-products", product.productId],
    queryFn: async () => {
      try {
        const result = await getPairedProducts(product.productId);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("Error fetching paired products:", error);
        return [];
      }
    },
    enabled: open && !!product.productId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setImageError(false);
    setMainQuantity(1);
    setNotes("");
    setRelatedQuantities({});
  }, [product]);

  useEffect(() => {
    if (relatedProducts.length > 0 && open) {
      const quantities: Record<number, number> = {};
      relatedProducts.forEach((relatedProduct) => {
        quantities[relatedProduct.productId] = 0;
      });
      setRelatedQuantities(quantities);
    }
  }, [relatedProducts, open]);

  const maxQuantity = product.quantityInBranch ?? Infinity;

  const handleQuantityChange = (value: number) => {
    const newQuantity = mainQuantity + value;
    if (value > 0 && newQuantity > maxQuantity) {
      // Don't allow exceeding max quantity
      return;
    }
    setMainQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
  };

  const handleAddToCart = () => {
    const isCombo = "isCombo" in product && product.isCombo;

    const cartItem = {
      productId: isCombo ? 0 : product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: mainQuantity,
      note: notes,
      ...(isCombo && "comboId" in product && product.comboId
        ? { comboId: product.comboId }
        : {}),
      ...(isCombo ? { isCombo: true } : {}),
    };
    addItem(cartItem as CartItem);

    relatedProducts.forEach((relatedProduct) => {
      const quantity = relatedQuantities[relatedProduct.productId] || 0;
      if (quantity > 0) {
        const relatedCartItem: CartItem = {
          productId: relatedProduct.productId,
          productName: relatedProduct.productName,
          productPrice: relatedProduct.productPrice,
          quantity: quantity,
          note: "",
        };
        addItem(relatedCartItem);
      }
    });

    onOpenChange(false);
  };

  const handleRelatedQuantityChange = (productId: number, delta: number) => {
    const relatedProduct = relatedProducts.find(p => p.productId === productId);
    if (!relatedProduct) return;

    const current = relatedQuantities[productId] || 0;
    const maxQuantity = relatedProduct.quantityInBranch ?? Infinity;
    let newQuantity = current + delta;

    if (delta > 0 && newQuantity > maxQuantity) {
      return;
    }

    newQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));

    if (newQuantity === 0) {
      setRelatedQuantities((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setRelatedQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
  };

  const calculateTotalPrice = () => {
    const mainPrice = product.productPrice * mainQuantity;
    const relatedPrice = relatedProducts.reduce((total, relatedProduct) => {
      const quantity = relatedQuantities[relatedProduct.productId] || 0;
      return total + (relatedProduct.productPrice * quantity);
    }, 0);
    return mainPrice + relatedPrice;
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (relatedProducts.length > 0) {
      setTimeout(() => {
        checkScrollPosition();
      }, 100);
    }
  }, [relatedProducts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-[#FFFCF7] overflow-hidden rounded-xl gap-1 max-h-[97vh]">
        <div className="sticky top-0 z-10 bg-[#FFFCF7] pt-4 px-6">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl font-bold">Thêm món ăn</DialogTitle>
            <DialogClose className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <Separator className="mb-4" />
        </div>

        <div className="px-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 mb-2">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={
                  imageError || !product.productImage
                    ? logo
                    : product.productImage
                }
                alt={product.productName}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={product.productImage?.startsWith("http")}
                onError={() => setImageError(true)}
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg">{product.productName}</h3>

              {product.quantityInBranch !== undefined && product.quantityInBranch !== null && (
                <div className="text-xs text-gray-500 mb-2">
                  Số lượng còn lại: {product.quantityInBranch}
                </div>
              )}

              <div className="text-sm mt-1 mb-1">
                {product.productDescription}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">
                    {product.productPrice.toLocaleString()}đ
                  </span>
                </div>
                <QuantitySelector
                  value={mainQuantity}
                  onDecrease={() => handleQuantityChange(-1)}
                  onIncrease={() => handleQuantityChange(1)}
                  maxValue={maxQuantity}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Ghi chú</h3>
            <Textarea
              value={notes}
              placeholder="Ghi Chú"
              className="resize-none h-15 mb-1"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>


          {
            relatedProducts.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg">Sản phẩm liên quan</h3>
                  {relatedProducts.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleScrollLeft}
                        disabled={!canScrollLeft}
                        className="h-8 w-8 rounded-full bg-[#F8A91F] hover:bg-[#EC6426] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md"
                        title="Cuộn trái"
                      >
                        <ChevronLeft className="h-4 w-4 text-black" />
                      </button>
                      <button
                        type="button"
                        onClick={handleScrollRight}
                        disabled={!canScrollRight}
                        className="h-8 w-8 rounded-full bg-[#F8A91F] hover:bg-[#EC6426] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md"
                        title="Cuộn phải"
                      >
                        <ChevronRight className="h-4 w-4 text-black" />
                      </button>
                    </div>
                  )}
                </div>



                {isLoadingRelated ? (
                  <div className="text-sm text-gray-500 py-4">Đang tải sản phẩm liên quan...</div>
                ) : relatedProducts.length > 0 ? (
                  <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollPosition}
                    className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {relatedProducts.map((relatedProduct) => {
                      const quantity = relatedQuantities[relatedProduct.productId] || 0;
                      const maxRelatedQuantity = relatedProduct.quantityInBranch ?? Infinity;
                      const isMaxReached = quantity >= maxRelatedQuantity;
                      return (
                        <div
                          key={relatedProduct.productId}
                          className={`flex-shrink-0 w-40 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${!relatedProduct.inStock ? "opacity-50" : ""
                            }`}
                        >
                          <div className="relative w-full h-32 bg-gray-100">
                            <Image
                              src={relatedProduct.productImage || logo}
                              alt={relatedProduct.productName}
                              fill
                              className="object-cover"
                              sizes="160px"
                              unoptimized={relatedProduct.productImage?.startsWith("http")}
                              onError={() => setImageError(true)}
                            />
                            {!relatedProduct.inStock && (
                              <div className="absolute top-2 right-2 bg-[#F8A91F] text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                                Hết hàng
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                              {relatedProduct.productName}
                            </h4>
                            <p className="text-xs text-primary font-bold mb-2">
                              {relatedProduct.productPrice.toLocaleString()}đ
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRelatedQuantityChange(relatedProduct.productId, -1)}
                                disabled={quantity <= 0}
                                className="h-7 w-7 p-0 rounded-full border-gray-300"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-sm min-w-[20px] text-center">
                                {quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRelatedQuantityChange(relatedProduct.productId, 1)}
                                disabled={!relatedProduct.inStock || isMaxReached}
                                className="h-7 w-7 p-0 rounded-full border-gray-300"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-4">Chưa có sản phẩm liên quan</div>
                )}
              </div>
            )
          }



        </div>

        <div className="sticky bottom-0 bg-[#FFFCF7] border-t border-gray-200 p-4 m-2 mt-0">
          <Button
            className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white h-12 rounded-lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            {calculateTotalPrice().toLocaleString()}đ - Thêm vào giỏ hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  );
}
