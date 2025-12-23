"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/utils/contexts/cart/CartContext";
import { Product, getPairedProducts } from "@/apis/product.api";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QuantitySelector } from "../quantity-selector";
import logo from "@/assets/images/logo.png";
import { CartItem } from "@/utils/contexts/cart/cart.type";

interface AddToCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function AddToCartDrawer({
  open,
  onOpenChange,
  product,
}: AddToCartDrawerProps) {
  const { addItem } = useCart();
  const [mainQuantity, setMainQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [imageError, setImageError] = useState(false);
  const [relatedQuantities, setRelatedQuantities] = useState<Record<number, number>>({});

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["paired-products", product.productId],
    queryFn: () => getPairedProducts(product.productId),
    enabled: open && !!product.productId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setImageError(false);
    setMainQuantity(1);
    setNotes("");
    setRelatedQuantities({});
  }, [product]);

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
    const cartItem: CartItem = {
      productId: isCombo ? 0 : product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: mainQuantity,
      note: notes,
      ...(isCombo ? { isCombo: true } : {}),
      ...(isCombo && "comboId" in product && typeof product.comboId === "number"
        ? { comboId: product.comboId }
        : {}),
    };

    addItem(cartItem);

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
    setRelatedQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + delta);
      if (newQuantity === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  // Calculate total price including related products
  const calculateTotalPrice = () => {
    const mainPrice = product.productPrice * mainQuantity;
    const relatedPrice = relatedProducts.reduce((total, relatedProduct) => {
      const quantity = relatedQuantities[relatedProduct.productId] || 0;
      return total + (relatedProduct.productPrice * quantity);
    }, 0);
    return mainPrice + relatedPrice;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-[500px] p-0 bg-background overflow-hidden rounded-xl gap-1">
        <div className="sticky top-0 z-10 bg-background pt-4 px-6">
          <div className="flex items-center justify-between mb-2">
            <DrawerTitle className="text-xl font-bold">Thêm món ăn</DrawerTitle>
            <DrawerClose className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </div>
          <Separator className="mb-4" />
        </div>

        <div className="px-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 mb-6">
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
              placeholder="Đối với combo hãy ghi chú cả topping đặc biệt ở đây, hoặc tụi mình sẽ tự chọn cho bạn"
              className="resize-none h-24 mb-1"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Sản phẩm liên quan</h3>
              <div
                className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {relatedProducts.map((relatedProduct) => {
                  const quantity = relatedQuantities[relatedProduct.productId] || 0;
                  return (
                    <div
                      key={relatedProduct.productId}
                      className="flex-shrink-0 w-40 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
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
                            disabled={!relatedProduct.inStock}
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
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background border-t border-gray-200 p-4 m-2 mt-0">
          <Button
            className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white h-12 rounded-lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            {calculateTotalPrice().toLocaleString()}đ - Thêm vào giỏ hàng
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
