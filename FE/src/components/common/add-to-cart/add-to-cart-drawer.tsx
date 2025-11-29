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
import { Product } from "@/apis/product.api";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { QuantitySelector } from "../quantity-selector";
import logo from "@/assets/images/logo.png";

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

  useEffect(() => {
    setImageError(false);
    setMainQuantity(1);
    setNotes("");
  }, [product]);

  const handleQuantityChange = (value: number) => {
    setMainQuantity(Math.max(1, mainQuantity + value));
  };

  const handleAddToCart = () => {
    const isCombo = "isCombo" in product && product.isCombo;
    const cartItem: {
      productId: number;
      productName: string;
      productPrice: number;
      quantity: number;
      note: string;
      comboId?: number;
      isCombo?: boolean;
    } = {
      productId: isCombo ? 0 : product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: mainQuantity,
      note: notes,
    };

    if (isCombo) {
      cartItem.isCombo = true;
      if ("comboId" in product && typeof product.comboId === "number") {
        cartItem.comboId = product.comboId;
      }
    }

    addItem(cartItem);
    onOpenChange(false);
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
        </div>

        <div className="sticky bottom-0 bg-background border-t border-gray-200 p-4 m-2 mt-0">
          <Button
            className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white h-12 rounded-lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            {(product.productPrice * mainQuantity).toLocaleString()}đ - Thêm vào
            giỏ hàng
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
