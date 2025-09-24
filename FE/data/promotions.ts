// Mock data cho promotions và offers
export interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    discountType: 'percentage' | 'fixed' | 'buy-get';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    code?: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isFeatured: boolean;
    usageLimit?: number;
    usedCount: number;
    applicableProducts?: string[]; // product IDs
    applicableCategories?: string[]; // category IDs
    termsAndConditions: string[];
}

export interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
    isFirstTimeOnly?: boolean;
}

export const promotions: Promotion[] = [
    {
        id: 'grand-opening',
        title: 'Grand Opening - Giảm 30%',
        description: 'Chào mừng khai trương! Giảm ngay 30% cho tất cả món ăn trong tuần đầu tiên.',
        image: '/images/promotions/grand-opening.jpg',
        discountType: 'percentage',
        discountValue: 30,
        maxDiscountAmount: 100000,
        startDate: new Date('2024-09-20'),
        endDate: new Date('2024-09-27'),
        isActive: true,
        isFeatured: true,
        usageLimit: 1000,
        usedCount: 234,
        termsAndConditions: [
            'Áp dụng cho tất cả món ăn',
            'Không áp dụng cùng với khuyến mãi khác',
            'Giảm tối đa 100.000đ',
            'Có hiệu lực từ 20/09 đến 27/09/2024'
        ]
    },
    {
        id: 'pho-special',
        title: 'Tuần lễ Phở - Mua 2 tặng 1',
        description: 'Mua 2 tô phở bất kỳ, tặng ngay 1 tô phở có giá trị thấp nhất.',
        image: '/images/promotions/pho-week.jpg',
        discountType: 'buy-get',
        discountValue: 1,
        startDate: new Date('2024-09-23'),
        endDate: new Date('2024-09-30'),
        isActive: true,
        isFeatured: true,
        applicableCategories: ['pho'],
        usageLimit: 500,
        usedCount: 67,
        termsAndConditions: [
            'Chỉ áp dụng cho danh mục Phở',
            'Tặng món có giá trị thấp nhất',
            'Không áp dụng cùng với khuyến mãi khác',
            'Có hiệu lực từ 23/09 đến 30/09/2024'
        ]
    },
    {
        id: 'weekend-special',
        title: 'Cuối tuần vui vẻ - Giảm 20%',
        description: 'Thỏa sức thưởng thức cuối tuần với ưu đãi giảm 20% tất cả món ăn.',
        image: '/images/promotions/weekend-special.jpg',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 200000,
        maxDiscountAmount: 80000,
        startDate: new Date('2024-09-21'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        isFeatured: false,
        usageLimit: undefined, // Unlimited
        usedCount: 456,
        termsAndConditions: [
            'Chỉ áp dụng thứ 7 và Chủ nhật',
            'Đơn hàng tối thiểu 200.000đ',
            'Giảm tối đa 80.000đ',
            'Có thể sử dụng nhiều lần'
        ]
    },
    {
        id: 'student-discount',
        title: 'Ưu đãi sinh viên - Giảm 15%',
        description: 'Sinh viên xuất trình thẻ sinh viên được giảm 15% tất cả món ăn.',
        image: '/images/promotions/student-discount.jpg',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscountAmount: 50000,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        isFeatured: false,
        usageLimit: 1,
        usedCount: 123,
        termsAndConditions: [
            'Chỉ áp dụng cho sinh viên có thẻ sinh viên',
            'Mỗi thẻ chỉ sử dụng 1 lần/ngày',
            'Giảm tối đa 50.000đ',
            'Không áp dụng cùng với khuyến mãi khác'
        ]
    },
    {
        id: 'combo-deal',
        title: 'Combo tiết kiệm - Chỉ 150k',
        description: 'Combo gồm 1 món chính + 1 thức uống + 1 tráng miệng chỉ với 150.000đ.',
        image: '/images/promotions/combo-deal.jpg',
        discountType: 'fixed',
        discountValue: 150000,
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-10-15'),
        isActive: true,
        isFeatured: true,
        applicableProducts: ['pho-bo-tai', 'bun-bo-hue', 'com-tam-suon-nuong'],
        usageLimit: 200,
        usedCount: 89,
        termsAndConditions: [
            'Combo gồm: 1 món chính + 1 thức uống + 1 tráng miệng',
            'Áp dụng cho các món được chỉ định',
            'Giá cố định 150.000đ',
            'Có hiệu lực từ 15/09 đến 15/10/2024'
        ]
    }
];

export const coupons: Coupon[] = [
    {
        id: 'welcome10',
        code: 'WELCOME10',
        title: 'Chào mừng thành viên mới',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 100000,
        maxDiscountAmount: 30000,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 1,
        usedCount: 0,
        isFirstTimeOnly: true
    },
    {
        id: 'save50k',
        code: 'SAVE50K',
        title: 'Tiết kiệm 50k',
        description: 'Giảm ngay 50.000đ cho đơn hàng từ 300.000đ',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderValue: 300000,
        startDate: new Date('2024-09-20'),
        endDate: new Date('2024-10-20'),
        isActive: true,
        usageLimit: 100,
        usedCount: 23,
        isFirstTimeOnly: false
    },
    {
        id: 'freeship',
        code: 'FREESHIP',
        title: 'Miễn phí vận chuyển',
        description: 'Miễn phí ship cho đơn hàng từ 200.000đ',
        discountType: 'fixed',
        discountValue: 25000,
        minOrderValue: 200000,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        usageLimit: undefined,
        usedCount: 167,
        isFirstTimeOnly: false
    }
];

// Helper functions
export const getActivePromotions = (): Promotion[] => {
    const now = new Date();
    return promotions.filter(promotion =>
        promotion.isActive &&
        promotion.startDate <= now &&
        promotion.endDate >= now
    );
};

export const getFeaturedPromotions = (): Promotion[] => {
    return getActivePromotions().filter(promotion => promotion.isFeatured);
};

export const getActiveCoupons = (): Coupon[] => {
    const now = new Date();
    return coupons.filter(coupon =>
        coupon.isActive &&
        coupon.startDate <= now &&
        coupon.endDate >= now
    );
};

export const validateCoupon = (code: string): Coupon | null => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return null;

    const now = new Date();
    if (!coupon.isActive || coupon.startDate > now || coupon.endDate < now) {
        return null;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return null;
    }

    return coupon;
};

export const getPromotionById = (id: string): Promotion | undefined => {
    return promotions.find(promotion => promotion.id === id);
};

export const getCouponByCode = (code: string): Coupon | undefined => {
    return coupons.find(coupon => coupon.code === code);
};