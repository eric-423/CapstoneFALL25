import { ProductCard } from '@/components/common/card';
import { Product } from '@/types/product.type';

type ProductListProps = {
  products: Product[];
};

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {products.map((product) => (
        <ProductCard key={product.productId} item={product} />
      ))}
    </div>
  );
};

export default ProductList;
