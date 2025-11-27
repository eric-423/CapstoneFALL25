import { Button } from "@/components/ui/button";
import { ProductType } from "@/apis/product.api";
import { Montserrat } from "next/font/google";
import { Dispatch, SetStateAction } from "react";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

type ProductTypeListProps = {
  productType: ProductType;
  productTypes: ProductType[];
  setProductType: Dispatch<SetStateAction<ProductType>>;
  resetAndRefetch: () => void;
};

const ProductTypeList = ({
  productTypes,
  productType,
  setProductType,
  resetAndRefetch,
}: ProductTypeListProps) => {
  const handleCategoryClick = (category: ProductType) => {
    setProductType(category);
    setTimeout(() => {
      resetAndRefetch();
    }, 0);
  };

  return (
    <div
      className={`w-full overflow-x-auto scrollbar-hide ${montserrat.className}`}
    >
      <div className="flex gap-3 pb-2 justify-center">
        {productTypes?.map((category, index) => (
          <Button
            key={index}
            variant={"ghost"}
            onClick={() => handleCategoryClick(category)}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-base h-12 min-h-[48px] transition-all duration-200 ${
              productType.id == category.id
                ? "bg-orange-500 text-white font-medium shadow-sm border-2 border-orange-500"
                : "bg-white border border-gray-200 text-gray-700  border-2 border-orange-500"
            }`}
          >
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductTypeList;
