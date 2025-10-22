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
        price: 45000,
        originalPrice: 50000,
        productImage: '/images/com-tam-suon-nuong.jpg',
        productType: { id: 1, name: 'Cơm' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 2,
        productName: 'Cơm tấm bì chả',
        productDescription: 'Cơm tấm truyền thống với bì, chả, trứng và rau củ',
        price: 40000,
        originalPrice: 45000,
        productImage: '/images/com-tam-bi-cha.jpg',
        productType: { id: 1, name: 'Cơm' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 3,
        productName: 'Phở bò tái',
        productDescription: 'Phở bò tái thơm ngon với nước dùng đậm đà',
        price: 55000,
        originalPrice: 60000,
        productImage: '/images/pho-bo-tai.jpg',
        productType: { id: 2, name: 'Phở' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 4,
        productName: 'Phở gà',
        productDescription: 'Phở gà với thịt gà mềm ngon và nước dùng thanh đạm',
        price: 50000,
        originalPrice: 55000,
        productImage: '/images/pho-ga.jpg',
        productType: { id: 2, name: 'Phở' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 5,
        productName: 'Bún bò Huế',
        productDescription: 'Bún bò Huế đậm đà với thịt bò, giò heo và rau sống',
        price: 60000,
        originalPrice: 65000,
        productImage: '/images/bun-bo-hue.jpg',
        productType: { id: 3, name: 'Bún' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 6,
        productName: 'Bún chả',
        productDescription: 'Bún chả Hà Nội với thịt nướng thơm ngon và nước mắm đặc biệt',
        price: 45000,
        originalPrice: 50000,
        productImage: '/images/bun-cha.jpg',
        productType: { id: 3, name: 'Bún' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 7,
        productName: 'Cháo gà',
        productDescription: 'Cháo gà nóng hổi với thịt gà mềm và rau thơm',
        price: 35000,
        originalPrice: 40000,
        productImage: '/images/chao-ga.jpg',
        productType: { id: 4, name: 'Cháo' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 8,
        productName: 'Mì Quảng',
        productDescription: 'Mì Quảng đặc sản với tôm, thịt và rau củ tươi ngon',
        price: 50000,
        originalPrice: 55000,
        productImage: '/images/mi-quang.jpg',
        productType: { id: 5, name: 'Mì' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 9,
        productName: 'Nước cam',
        productDescription: 'Nước cam tươi ngon, giàu vitamin C',
        price: 15000,
        originalPrice: 18000,
        productImage: '/images/nuoc-cam.jpg',
        productType: { id: 6, name: 'Nước uống' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 10,
        productName: 'Trà đá',
        productDescription: 'Trà đá mát lạnh, giải nhiệt mùa hè',
        price: 5000,
        originalPrice: 7000,
        productImage: '/images/tra-da.jpg',
        productType: { id: 6, name: 'Nước uống' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 11,
        productName: 'Chè đậu đỏ',
        productDescription: 'Chè đậu đỏ ngọt ngào, mát lạnh',
        price: 20000,
        originalPrice: 25000,
        productImage: '/images/che-dau-do.jpg',
        productType: { id: 7, name: 'Tráng miệng' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        productId: 12,
        productName: 'Bánh flan',
        productDescription: 'Bánh flan mềm mịn, thơm ngon',
        price: 25000,
        originalPrice: 30000,
        productImage: '/images/banh-flan.jpg',
        productType: { id: 7, name: 'Tráng miệng' },
        branch: { id: 1, name: 'Chi nhánh 1' },
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const getProductsByType = (productTypeId: number): Product[] => {
    if (productTypeId === 0) {
        return mockProducts;
    }
    return mockProducts.filter(product => product.productType.id === productTypeId);
};

export const getProductTypes = (): ProductType[] => {
    return mockProductTypes;
};
