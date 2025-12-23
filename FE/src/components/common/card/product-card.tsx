import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import { Product } from "@/apis/product.api";
import { contentOverflow } from "@/utils/contentOverflow";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddToCartDialog } from "../add-to-cart/add-to-cart-dialog";
import { AddToCartDrawer } from "../add-to-cart/add-to-cart-drawer";
type ProductCardProps = {
  item: Product;
  descriptionOverflow?: number;
};

export const ProductCard = ({
  item,
  descriptionOverflow = 40,
}: ProductCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/menu/products/${item.productId}`);
  };

  return (
    <>
      <Card
        className={`group p-0 overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center relative cursor-pointer ${!item?.inStock ? "opacity-50 pointer-events-none" : ""}`}
        onClick={handleCardClick}
      >
        {!item?.inStock && (
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
        <div className="relative h-48 overflow-hidden ">
          <Image
            src={item.productImage || "/placeholder.svg"}
            alt={item.productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="p-5 ">
          <h3 className="text-lg font-bold text-black mb-2 line-clamp-1 min-h-[1.5rem] break-words">
            {item.productName}
          </h3>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-1">
            {contentOverflow(item.productDescription, descriptionOverflow)}
          </p>



          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-black">
              {item.productPrice.toLocaleString()}đ
            </span>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-200 hover:text-orange-500 hover:border-orange-500 font-semibold rounded-full px-4 transition-colors"
              onClick={() => setDialogOpen(true)}
              disabled={!item?.inStock}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Card>
      {dialogOpen && !isMobile && (
        <AddToCartDialog
          product={item}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {dialogOpen && isMobile && (
        <AddToCartDrawer
          product={item}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
