import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import { Combo } from "@/apis/combo.api";
import { contentOverflow } from "@/utils/contentOverflow";
import { Star } from "lucide-react";
import { useState } from "react";
import { AddToCartDialog } from "../add-to-cart/add-to-cart-dialog";
import { AddToCartDrawer } from "../add-to-cart/add-to-cart-drawer";
import logo from "@/assets/images/logo.png";
import Image from "next/image";
type ComboCardProps = {
  item: Combo;
  descriptionOverflow?: number;
};

export const ComboCard = ({
  item,
  descriptionOverflow = 40,
}: ComboCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const productLikeItem = {
    productId: 0,
    productName: item.name,
    productDescription: item.description,
    productImage: "/placeholder.svg",
    productPrice: item.price,
    productType: "Combo",
    inStock: item.active,
    comboId: item.comboId,
    isCombo: true,
  };

  return (
    <>
      <Card
        className={`group p-0 overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center relative ${!item?.active ? "opacity-50 pointer-events-none" : ""}`}
      >
        {!item?.active && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
            <div
              className="absolute bg-red-600 text-white font-bold text-xl px-16 py-2 shadow-2xl whitespace-nowrap"
              style={{
                transform: "rotate(-12deg) translateX(-50%) translateY(-50%)",
                top: "50%",
                left: "50%",
                letterSpacing: "3px",
              }}
            >
              HẾT HÀNG
            </div>
          </div>
        )}
        <div className="relative h-48 overflow-hidden bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={logo}
              alt="logo"
              fill
              sizes="100px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-black mb-2 line-clamp-2 min-h-[3.5rem] break-words">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 mb-3 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {contentOverflow(item.description, descriptionOverflow)}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xl font-bold text-black">
              {item.price.toLocaleString()}đ
            </span>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-200 hover:text-orange-500 hover:border-orange-500 font-semibold rounded-full px-4 transition-colors"
              onClick={() => setDialogOpen(true)}
              disabled={!item?.active}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Card>
      {dialogOpen && !isMobile && (
        <AddToCartDialog
          product={productLikeItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {dialogOpen && isMobile && (
        <AddToCartDrawer
          product={productLikeItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
