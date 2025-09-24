// Mock data cho products và menu items
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    category: string;
    tags: string[];
    isPopular: boolean;
    isFeatured: boolean;
    isNew: boolean;
    isAvailable: boolean;
    rating: number;
    reviewCount: number;
    ingredients?: string[];
    allergens?: string[];
    spicyLevel?: 1 | 2 | 3 | 4 | 5;
    preparationTime: number; // minutes
    calories?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
}export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    productCount: number;
}

export const categories: Category[] = [
    {
        id: 'com-tam',
        name: 'Cơm Tấm',
        description: 'Cơm tấm truyền thống với sườn nướng, chả trứng',
        image: '/images/best-seller.svg',
        productCount: 12
    },
    {
        id: 'com-dia',
        name: 'Cơm Dĩa',
        description: 'Cơm dĩa với thịt nướng, xào và nhiều topping',
        image: '/images/best-seller.svg',
        productCount: 10
    },
    {
        id: 'com-nieu',
        name: 'Cơm Niêu',
        description: 'Cơm niêu đất nung thơm ngon đặc biệt',
        image: '/images/best-seller.svg',
        productCount: 6
    },
    {
        id: 'mon-nuong',
        name: 'Món Nướng',
        description: 'Các món nướng than hoa thơm lừng',
        image: '/images/best-seller.svg',
        productCount: 8
    },
    {
        id: 'mon-xao',
        name: 'Món Xào',
        description: 'Món xào tươi ngon hàng ngày',
        image: '/images/best-seller.svg',
        productCount: 7
    },
    {
        id: 'drinks',
        name: 'Thức Uống',
        description: 'Nước uống, trà và café',
        image: '/images/best-seller.svg',
        productCount: 12
    }
];

export const products: Product[] = [
    // BEST SELLERS từ Figma
    {
        id: 'com-suon-nuong-mem',
        name: 'Cơm Sườn Nướng Mềm',
        description: 'Sườn nướng cơm nướng, đầng cạng cơm nướng và mọi chao',
        price: 135000,
        originalPrice: 150000,
        discount: 10,
        image: '/images/best-seller.svg',
        category: 'com-tam',
        tags: ['bestseller', 'popular', 'grilled'],
        isPopular: true,
        isFeatured: true,
        isNew: false,
        isAvailable: true,
        rating: 4.8,
        reviewCount: 245,
        ingredients: ['Cơm tấm', 'Sườn nướng', 'Đậu phộng', 'Mắm ruốc', 'Rau sống'],
        preparationTime: 15,
        calories: 680,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    },
    {
        id: 'combo-suon-bi-cha',
        name: 'Combo - Sườn Bì Chả',
        description: 'Cơm tấm nướng bì, chả trứng - Cánh gà chiên - Nước uống tự chọn',
        price: 89000,
        image: '/images/best-seller.svg',
        category: 'com-tam',
        tags: ['combo', 'popular', 'value'],
        isPopular: true,
        isFeatured: true,
        isNew: false,
        isAvailable: true,
        rating: 4.7,
        reviewCount: 189,
        ingredients: ['Cơm tấm', 'Sườn nướng', 'Bì', 'Chả trứng', 'Cánh gà chiên'],
        preparationTime: 18,
        calories: 750,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    },
    {
        id: 'combo-suon-bi-cha-special',
        name: 'Combo - Sườn Bì Chả Đặc Biệt',
        description: 'Cánh sườn nướng bì, chả trứng - Cánh gà chiên - Nước uống tự chọn',
        price: 99000,
        image: '/images/best-seller.svg',
        category: 'com-tam',
        tags: ['combo', 'premium', 'bestseller'],
        isPopular: true,
        isFeatured: true,
        isNew: false,
        isAvailable: true,
        rating: 4.9,
        reviewCount: 156,
        ingredients: ['Cơm tấm', 'Sườn nướng đặc biệt', 'Bì', 'Chả trứng', 'Cánh gà chiên'],
        preparationTime: 20,
        calories: 820,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    },

    // WHY CHOOSE SECTION
    {
        id: 'nguyen-lieu-tuoi-ngon',
        name: 'Nguyên Liệu Tươi Ngon',
        description: 'Cam kết sử dụng nguyên liệu tươi ngon, chất lượng cao nhất',
        price: 0, // Không bán, chỉ để hiển thị
        image: '/images/why-1.svg',
        category: 'feature',
        tags: ['quality', 'fresh', 'premium'],
        isPopular: false,
        isFeatured: false,
        isNew: false,
        isAvailable: false,
        rating: 5.0,
        reviewCount: 0,
        preparationTime: 0,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    },
    {
        id: 'cong-thuc-doc-quyen',
        name: 'Công Thức Độc Quyền',
        description: 'Công thức độc quyền được truyền qua nhiều thế hệ',
        price: 0,
        image: '/images/why-2.svg',
        category: 'feature',
        tags: ['secret', 'traditional', 'authentic'],
        isPopular: false,
        isFeatured: false,
        isNew: false,
        isAvailable: false,
        rating: 5.0,
        reviewCount: 0,
        preparationTime: 0,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    },
    {
        id: 'gia-ca-phai-chang',
        name: 'Giá Cả Phải Chăng',
        description: 'Chất lượng cao với mức giá hợp lý, phù hợp mọi gia đình',
        price: 0,
        image: '/images/why-3.svg',
        category: 'feature',
        tags: ['affordable', 'value', 'family'],
        isPopular: false,
        isFeatured: false,
        isNew: false,
        isAvailable: false,
        rating: 5.0,
        reviewCount: 0,
        preparationTime: 0,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    },

    // Thêm các món khác
    {
        id: 'com-tam-suon-nuong',
        name: 'Cơm Tấm Sườn Nướng',
        description: 'Cơm tấm truyền thống với sườn nướng thơm lừng',
        price: 75000,
        image: '/images/best-seller.svg',
        category: 'com-tam',
        tags: ['traditional', 'grilled'],
        isPopular: true,
        isFeatured: false,
        isNew: false,
        isAvailable: true,
        rating: 4.6,
        reviewCount: 203,
        ingredients: ['Cơm tấm', 'Sườn nướng', 'Dưa leo', 'Cà chua', 'Nước mắm'],
        preparationTime: 12,
        calories: 520,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true
    },
    {
        id: 'com-tam-bi-cha',
        name: 'Cơm Tấm Bì Chả',
        description: 'Cơm tấm với bì và chả trứng đặc sản miền Nam',
        price: 65000,
        image: '/images/best-seller.svg',
        category: 'com-tam',
        tags: ['traditional', 'southern'],
        isPopular: false,
        isFeatured: false,
        isNew: false,
        isAvailable: true,
        rating: 4.5,
        reviewCount: 156,
        ingredients: ['Cơm tấm', 'Bì', 'Chả trứng', 'Dưa leo', 'Nước mắm'],
        preparationTime: 10,
        calories: 480,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true
    }
];// Helper functions
export const getFeaturedProducts = (): Product[] => {
    return products.filter(product => product.isFeatured);
};

export const getPopularProducts = (): Product[] => {
    return products.filter(product => product.isPopular);
};

export const getNewProducts = (): Product[] => {
    return products.filter(product => product.isNew);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
    return products.filter(product => product.category === categoryId);
};

export const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
};

export const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
};