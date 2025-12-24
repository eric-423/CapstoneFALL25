import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import { Combo } from "@/apis/combo.api";
import { contentOverflow } from "@/utils/contentOverflow";
import { useState } from "react";
import { AddToCartDialog } from "../add-to-cart/add-to-cart-dialog";
import { AddToCartDrawer } from "../add-to-cart/add-to-cart-drawer";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
  const imageSrc =
    (item as Combo & { imageUrl?: string }).imageUrl || "/placeholder.svg";

  return (
    <>
      <Card
        className={`group p-0 overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center relative flex flex-col h-full cursor-pointer ${!item?.active ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => router.push(`/menu/combos/${item.comboId}`)}
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
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 flex flex-col p-5">
          <h3 className="text-lg font-bold text-black mb-2 line-clamp-1 min-h-[1.5rem] break-words truncate">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 min-h-[42px]">
            {contentOverflow(item.description, descriptionOverflow)}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-xl font-bold text-black">
              {item.price.toLocaleString()}đ
            </span>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-200 hover:text-orange-500 hover:border-orange-500 font-semibold rounded-full px-4 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
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
