import { Product } from '@/apis/product.api';
import { ProductType } from '@/apis/product.api';

export const mockProductTypes: ProductType[] = [
    { id: 0, name: 'Tất cả' },
    { id: 1, name: 'Cơm' },
    { id: 2, name: 'Phở' },
    { id: 3, name: 'Bún' },
    { id: 4, name: 'Cháo' },
    { id: 5, name: 'Mì' },
    { id: 6, name: 'Nước uống' },
    { id: 7, name: 'Tráng miệng' }
];

export const mockProducts: Product[] = [
    {
        productId: 1,
        productName: 'Cơm tấm sườn nướng',
        productDescription: 'Cơm tấm với sườn nướng thơm ngon, bì, chả, trứng và rau củ tươi ngon',
        productPrice: 45000,
        productImage: '/images/com-tam-suon-nuong.jpg',
        productType: 'Cơm',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 2,
        productName: 'Cơm tấm bì chả',
        productDescription: 'Cơm tấm truyền thống với bì, chả, trứng và rau củ',
        productPrice: 40000,
        productImage: '/images/com-tam-bi-cha.jpg',
        productType: 'Cơm',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 3,
        productName: 'Phở bò tái',
        productDescription: 'Phở bò tái thơm ngon với nước dùng đậm đà',
        productPrice: 55000,
        productImage: '/images/pho-bo-tai.jpg',
        productType: 'Phở',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 4,
        productName: 'Phở gà',
        productDescription: 'Phở gà với thịt gà mềm ngon và nước dùng thanh đạm',
        productPrice: 50000,
        productImage: '/images/pho-ga.jpg',
        productType: 'Phở',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 5,
        productName: 'Bún bò Huế',
        productDescription: 'Bún bò Huế đậm đà với thịt bò, giò heo và rau sống',
        productPrice: 60000,
        productImage: '/images/bun-bo-hue.jpg',
        productType: 'Bún',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 6,
        productName: 'Bún chả',
        productDescription: 'Bún chả Hà Nội với thịt nướng thơm ngon và nước mắm đặc biệt',
        productPrice: 45000,
        productImage: '/images/bun-cha.jpg',
        productType: 'Bún',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 7,
        productName: 'Cháo gà',
        productDescription: 'Cháo gà nóng hổi với thịt gà mềm và rau thơm',
        productPrice: 35000,
        productImage: '/images/chao-ga.jpg',
        productType: 'Cháo',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 8,
        productName: 'Mì Quảng',
        productDescription: 'Mì Quảng đặc sản với tôm, thịt và rau củ tươi ngon',
        productPrice: 50000,
        productImage: '/images/mi-quang.jpg',
        productType: 'Mì',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 9,
        productName: 'Nước cam',
        productDescription: 'Nước cam tươi ngon, giàu vitamin C',
        productPrice: 15000,
        productImage: '/images/nuoc-cam.jpg',
        productType: 'Nước uống',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 10,
        productName: 'Trà đá',
        productDescription: 'Trà đá mát lạnh, giải nhiệt mùa hè',
        productPrice: 5000,
        productImage: '/images/tra-da.jpg',
        productType: 'Nước uống',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 11,
        productName: 'Chè đậu đỏ',
        productDescription: 'Chè đậu đỏ ngọt ngào, mát lạnh',
        productPrice: 20000,
        productImage: '/images/che-dau-do.jpg',
        productType: 'Tráng miệng',
        rating: 5,
        productQuantity: 100
    },
    {
        productId: 12,
        productName: 'Bánh flan',
        productDescription: 'Bánh flan mềm mịn, thơm ngon',
        productPrice: 25000,
        productImage: '/images/banh-flan.jpg',
        productType: 'Tráng miệng',
        rating: 5,
        productQuantity: 100
    }
];

export const getProductsByType = (productTypeId: number): Product[] => {
    if (productTypeId === 0) return mockProducts;
    const typeName = mockProductTypes.find(t => t.id === productTypeId)?.name;
    if (!typeName) return [];
    return mockProducts.filter(product => product.productType === typeName);
};

export const getProductTypes = (): ProductType[] => {
    return mockProductTypes;
};
