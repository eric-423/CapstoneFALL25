import { Button } from '@/components/ui/button';
import { ProductType } from '@/apis/product.api';

import { Dispatch, SetStateAction } from 'react';

type ProductTypeListProps = {
    productType: ProductType;
    productTypes: ProductType[];
    setProductType: Dispatch<SetStateAction<ProductType>>;
    resetAndRefetch: () => void;
};

const ProductTypeList = ({ productTypes, productType, setProductType, resetAndRefetch }: ProductTypeListProps) => {
    const handleCategoryClick = (category: ProductType) => {

        setProductType(category);
        setTimeout(() => {
            resetAndRefetch();
        }, 0);

    };

    return (
        <div>
            <h3 className='text-sm uppercase text-gray-500 font-medium mb-3'>Thực đơn</h3>
            <ul className='space-y-2'>
                {productTypes?.map((category, index) => (
                    <li key={index}>
                        <Button
                            variant={'ghost'}
                            onClick={() => handleCategoryClick(category)}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors focus:bg-primary/20 ${productType.id == category.id ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-primary/10'
                                }`}
                        >
                            <span>{category.name}</span>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductTypeList;