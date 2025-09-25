import { ProductCard } from '@/components/common/card';
import { Product } from '@/types/product.type';

type BestSellerListProps = {
  products: Product[];
};

const BestSellerList = ({ products = [] }: BestSellerListProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {products?.map((item) => <ProductCard item={item} key={item.productId} descriptionOverflow={60} />)}
    </div>
  );
};

export default BestSellerList;
