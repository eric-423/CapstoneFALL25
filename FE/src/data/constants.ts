// App constants và configuration
export const APP_CONFIG = {
  name: 'TẤM TẮC',
  tagline: 'Cơm Tấm Tắc - Tắm ngon, Tắc nhỏ!',
  description: 'Thưởng hiệu cơm tấm hàng đầu dành cho sinh viên',
  version: '1.0.0',
  author: 'TamTech Team',
  keywords: ['cơm tấm', 'sinh viên', 'ngon', 'rẻ', 'delivery', 'franchise']
};export const CONTACT_INFO = {
    phone: '028 1234 5678',
    email: 'info@tamtechcomtam.com',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    workingHours: '6:00 - 22:00 (Tất cả các ngày)',
    socialMedia: {
        facebook: 'https://facebook.com/tamtechcomtam',
        instagram: 'https://instagram.com/tamtechcomtam',
        youtube: 'https://youtube.com/tamtechcomtam',
        tiktok: 'https://tiktok.com/@tamtechcomtam'
    }
};

// API endpoints (mock for development)
export const API_ENDPOINTS = {
    base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        profile: '/auth/profile',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        verifyOtp: '/auth/verify-otp'
    },
    products: {
        list: '/products',
        detail: '/products/:id',
        search: '/products/search',
        categories: '/products/categories',
        featured: '/products/featured',
        popular: '/products/popular'
    },
    cart: {
        get: '/cart',
        add: '/cart/add',
        update: '/cart/update',
        remove: '/cart/remove',
        clear: '/cart/clear'
    },
    orders: {
        create: '/orders',
        list: '/orders',
        detail: '/orders/:id',
        cancel: '/orders/:id/cancel',
        track: '/orders/:id/track'
    },
    promotions: {
        list: '/promotions',
        validate: '/promotions/validate',
        apply: '/promotions/apply'
    },
    blog: {
        list: '/blog',
        detail: '/blog/:slug',
        categories: '/blog/categories',
        search: '/blog/search'
    },
    user: {
        profile: '/user/profile',
        addresses: '/user/addresses',
        orders: '/user/orders',
        favorites: '/user/favorites'
    }
};

// Application constants
export const CONSTANTS = {
    // Pagination
    ITEMS_PER_PAGE: 12,
    BLOG_POSTS_PER_PAGE: 6,

    // Cart
    MAX_QUANTITY_PER_ITEM: 99,
    MIN_ORDER_VALUE: 50000, // 50k VND

    // Delivery
    DELIVERY_FEE: 25000, // 25k VND
    FREE_DELIVERY_THRESHOLD: 200000, // 200k VND
    MAX_DELIVERY_DISTANCE: 10, // 10km

    // Timing
    PREPARATION_TIME_BUFFER: 10, // 10 minutes
    DELIVERY_TIME_ESTIMATE: 30, // 30 minutes

    // Payment
    SUPPORTED_PAYMENT_METHODS: ['cash', 'card', 'banking', 'momo', 'zalopay'],

    // Images
    PLACEHOLDER_IMAGE: '/images/placeholder.jpg',
    AVATAR_PLACEHOLDER: '/images/avatar-placeholder.png',

    // Local Storage Keys
    STORAGE_KEYS: {
        cart: 'tamtech_cart',
        user: 'tamtech_user',
        preferences: 'tamtech_preferences',
        recentSearches: 'tamtech_recent_searches'
    },

    // Cookie names
    COOKIES: {
        token: 'tamtech_token',
        refreshToken: 'tamtech_refresh_token',
        cartId: 'tamtech_cart_id'
    },

    // Regex patterns
    PATTERNS: {
        phone: /^(\+84|0)[3|5|7|8|9][0-9]{8}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    },

    // Status constants
    ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        PREPARING: 'preparing',
        READY: 'ready',
        DELIVERING: 'delivering',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    } as const,

    PAYMENT_STATUS: {
        PENDING: 'pending',
        PAID: 'paid',
        FAILED: 'failed',
        REFUNDED: 'refunded'
    } as const,

    USER_ROLES: {
        CUSTOMER: 'customer',
        ADMIN: 'admin',
        MANAGER: 'manager',
        CHEF: 'chef',
        DELIVERY: 'delivery'
    } as const
};

// Message templates
export const MESSAGES = {
    SUCCESS: {
        LOGIN: 'Đăng nhập thành công!',
        REGISTER: 'Đăng ký tài khoản thành công!',
        ADD_TO_CART: 'Đã thêm món ăn vào giỏ hàng!',
        ORDER_PLACED: 'Đặt hàng thành công!',
        PROFILE_UPDATED: 'Cập nhật thông tin thành công!'
    },
    ERROR: {
        GENERIC: 'Có lỗi xảy ra. Vui lòng thử lại!',
        NETWORK: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet!',
        INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng!',
        PRODUCT_NOT_FOUND: 'Không tìm thấy món ăn!',
        OUT_OF_STOCK: 'Món ăn này hiện đã hết hàng!',
        INVALID_COUPON: 'Mã giảm giá không hợp lệ hoặc đã hết hạn!',
        MINIMUM_ORDER: `Đơn hàng tối thiểu ${CONSTANTS.MIN_ORDER_VALUE.toLocaleString()}đ!`
    },
    VALIDATION: {
        REQUIRED_FIELD: 'Trường này là bắt buộc',
        INVALID_EMAIL: 'Email không hợp lệ',
        INVALID_PHONE: 'Số điện thoại không hợp lệ',
        PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 8 ký tự',
        PASSWORDS_NOT_MATCH: 'Mật khẩu xác nhận không khớp'
    }
};

// Hero Section Data từ Figma
export const HERO_SECTION = {
  title: 'Cơm Tấm Tắc',
  subtitle: 'Tắm ngon, Tắc nhỏ!',
  description: 'Thưởng hiệu cơm tấm hàng đầu dành cho sinh viên',
  orderForm: {
    placeholder: {
      location: 'Chọn cửa hàng',
      time: 'Thời gian nhận hàng',
      guests: 'Số lượng khách'
    },
    submitText: 'Đặt bàn'
  }
};

// Why Choose Section từ Figma
export const WHY_CHOOSE_FEATURES = [
  {
    id: 'nguyen-lieu-tuoi-ngon',
    title: 'Nguyên Liệu Tươi Ngon',
    subtitle: 'AN TOÀN',
    description: 'Cam kết sử dụng nguyên liệu tươi ngon, an toàn vệ sinh thực phẩm',
    image: '/images/features/nguyen-lieu-tuoi-ngon.jpg',
    icon: '🥬'
  },
  {
    id: 'cong-thuc-doc-quyen',
    title: 'Công Thức Độc Quyền',
    subtitle: 'NGON CHẤT XỊN',
    description: 'Công thức độc quyền được nghiên cứu và phát triển riêng',
    image: '/images/features/cong-thuc-doc-quyen.jpg',
    icon: '👨‍🍳'
  },
  {
    id: 'gia-ca-phai-chang',
    title: 'Giá Cả Phải Chăng',
    subtitle: 'SINH VIÊN YÊU THÍCH',
    description: 'Chất lượng cao với mức giá hợp lý, đặc biệt dành cho sinh viên',
    image: '/images/features/gia-ca-phai-chang.jpg',
    icon: '💰'
  }
];

// Franchise Section từ Figma
export const FRANCHISE_INFO = {
  title: 'CHUYỂN CƠM TẤM',
  description: 'HỘI XUÂN LÃNG CÚC 2025 - TY ĐỊNH TY XUA...',
  ctaText: 'Đặc biệt',
  benefits: [
    'Hỗ trợn toàn diện từ A-Z',
    'Đào tạo nhân viên chuyên nghiệp', 
    'Marketing và quảng cáo hiệu quả',
    'Hệ thống quản lý hiện đại'
  ]
};

// Newsletter Section từ Figma  
export const NEWSLETTER_SECTION = {
  title: 'HỆ THỐNG NHƯỢNG QUYỀN',
  subtitle: 'ĐĂNG KÝ NHƯỢNG QUYỀN',
  description: 'Hãy để lại thông tin để được tư vấn về cơ hội kinh doanh cùng TẤM TẮC',
  form: {
    fields: [
      { name: 'fullName', placeholder: 'Họ và tên', required: true },
      { name: 'email', placeholder: 'Email', required: true },
      { name: 'phone', placeholder: 'Số điện thoại', required: true },
      { name: 'city', placeholder: 'Tỉnh thành', required: true },
      { name: 'message', placeholder: 'Lời nhắn', required: false, type: 'textarea' }
    ],
    submitText: 'Gửi thông tin'
  }
};
// Navigation menu items từ Figma
export const MENU_ITEMS = [
  {
    title: 'Về Tấm Tắc',
    href: '/about',
    icon: 'info'
  },
  {
    title: 'Đặt Hàng',
    href: '/menu',
    icon: 'utensils'
  },
  {
    title: 'Thực đơn hôm AI',
    href: '/menu-ai',
    icon: 'sparkles'
  },
  {
    title: 'Chuyển Cơm Tấm',
    href: '/franchise',
    icon: 'store'
  },
  {
    title: 'Nhượng Quyền',
    href: '/franchise',
    icon: 'handshake'
  },
  {
    title: 'Cửa Hàng',
    href: '/stores',
    icon: 'map-pin'
  }
];// SEO and meta data
export const SEO = {
  defaultTitle: 'TẤM TẮC - Cơm Tấm Tắc, Tắm ngon Tắc nhỏ!',
  defaultDescription: 'Thưởng hiệu cơm tấm hàng đầu dành cho sinh viên. Ngon, rẻ, nhanh, tiện lợi. Đặt hàng online ngay!',
  defaultKeywords: 'cơm tấm, sinh viên, ngon rẻ, đặt hàng online, giao hàng nhanh, nhượng quyền',
  ogImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image',
  favicon: '/favicon.ico'
};// Theme configuration
export const THEME = {
    colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e42',
        success: '#22c55e',
        warning: '#facc15',
        error: '#ef4444'
    },
    breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
    }
};

// Export types for TypeScript
export type OrderStatus = typeof CONSTANTS.ORDER_STATUS[keyof typeof CONSTANTS.ORDER_STATUS];
export type PaymentStatus = typeof CONSTANTS.PAYMENT_STATUS[keyof typeof CONSTANTS.PAYMENT_STATUS];
export type UserRole = typeof CONSTANTS.USER_ROLES[keyof typeof CONSTANTS.USER_ROLES];