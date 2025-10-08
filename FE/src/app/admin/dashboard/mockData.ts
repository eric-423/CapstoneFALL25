// Mock data for dashboard components

export const kpiData = {
    revenueToday: {
        value: '12,500,000',
        trend: { value: 12.5, isPositive: true },
        subtitle: 'so với hôm qua',
    },
    totalOrders: {
        value: 156,
        trend: { value: 8.3, isPositive: true },
        subtitle: 'so với hôm qua',
    },
    activeBranches: {
        value: 5,
        trend: undefined,
        subtitle: undefined,
    },
    newCustomers: {
        value: 24,
        trend: { value: 15.2, isPositive: true },
        subtitle: 'trong tuần',
    },
};

export const revenueData = [
    { date: '20/01', revenue: 8500000 },
    { date: '21/01', revenue: 9200000 },
    { date: '22/01', revenue: 8800000 },
    { date: '23/01', revenue: 10500000 },
    { date: '24/01', revenue: 11200000 },
    { date: '25/01', revenue: 10800000 },
    { date: '26/01', revenue: 12500000 },
];

export const topDishesData = [
    { name: 'Phở bò đặc biệt', sales: 145 },
    { name: 'Bún chả Hà Nội', sales: 132 },
    { name: 'Cơm tấm sườn', sales: 118 },
    { name: 'Bánh mì thịt', sales: 95 },
    { name: 'Gỏi cuốn tôm', sales: 87 },
];

export const branchRevenueData = [
    { name: 'Chi nhánh Quận 1', value: 25000000 },
    { name: 'Chi nhánh Quận 3', value: 20000000 },
    { name: 'Chi nhánh Quận 5', value: 18000000 },
    { name: 'Chi nhánh Quận 7', value: 15000000 },
    { name: 'Chi nhánh Thủ Đức', value: 12000000 },
];

export const recentOrders = [
    { id: '1234', branch: 'Quận 1', amount: 250000, status: 'completed' as const, time: '10:30' },
    { id: '1235', branch: 'Quận 3', amount: 180000, status: 'processing' as const, time: '10:25' },
    { id: '1236', branch: 'Quận 5', amount: 320000, status: 'completed' as const, time: '10:20' },
    { id: '1237', branch: 'Quận 7', amount: 150000, status: 'pending' as const, time: '10:15' },
    { id: '1238', branch: 'Thủ Đức', amount: 280000, status: 'completed' as const, time: '10:10' },
    { id: '1239', branch: 'Quận 1', amount: 420000, status: 'processing' as const, time: '10:05' },
    { id: '1240', branch: 'Quận 3', amount: 190000, status: 'completed' as const, time: '10:00' },
    { id: '1241', branch: 'Quận 5', amount: 310000, status: 'cancelled' as const, time: '09:55' },
];

// New: Ingredient Usage Data
export const ingredientUsageData = [
    { name: 'Gạo tấm', usage: 150, unit: 'kg' },
    { name: 'Thịt heo', usage: 85, unit: 'kg' },
    { name: 'Trứng gà', usage: 720, unit: 'quả' },
    { name: 'Nước mắm', usage: 25, unit: 'l' },
    { name: 'Rau dưa', usage: 45, unit: 'kg' },
];

// New: Supplier Distribution Data
export const supplierDistributionData = [
    { name: 'Nhà cung cấp A', value: 45, color: '#EC6426' },
    { name: 'Nhà cung cấp B', value: 30, color: '#F8A91F' },
    { name: 'Nhà cung cấp C', value: 25, color: '#3B82F6' },
];

// New: Recent Recipes
export const recentRecipesData = [
    {
        id: 1,
        name: 'Phở Bò Đặc Biệt',
        calories: 520,
        price: 65000,
        image: '/images/recipes/pho-bo.jpg',
        createdAt: '2 ngày trước',
    },
    {
        id: 2,
        name: 'Bún Chả Hà Nội',
        calories: 450,
        price: 55000,
        image: '/images/recipes/bun-cha.jpg',
        createdAt: '3 ngày trước',
    },
    {
        id: 3,
        name: 'Cơm Tấm Sườn',
        calories: 620,
        price: 50000,
        image: '/images/recipes/com-tam.jpg',
        createdAt: '5 ngày trước',
    },
];

// New: Training Stats
export const trainingStatsData = {
    totalCourses: 6,
    activeCourses: 4,
    enrolledStaff: 120,
    completionRate: 75,
    coursesByRole: [
        { role: 'Chef', count: 35, color: '#F97316' },
        { role: 'Manager', count: 25, color: '#3B82F6' },
        { role: 'Staff', count: 60, color: '#10B981' },
    ],
};

// New: Recent Activities
export const recentActivitiesData = [
    {
        id: 1,
        type: 'recipe' as const,
        message: 'Admin đã thêm công thức mới: Cơm Tấm Sườn',
        timestamp: '10 phút trước',
        icon: 'BookOpen',
    },
    {
        id: 2,
        type: 'training' as const,
        message: 'Khóa học "Nghệ thuật nướng" đã được xuất bản',
        timestamp: '30 phút trước',
        icon: 'GraduationCap',
    },
    {
        id: 3,
        type: 'ingredient' as const,
        message: 'Nhà cung cấp A đã nhập: +20kg gạo tấm',
        timestamp: '1 giờ trước',
        icon: 'Package',
    },
    {
        id: 4,
        type: 'alert' as const,
        message: 'Cảnh báo: Tôm sú sắp hết hàng (12kg còn lại)',
        timestamp: '2 giờ trước',
        icon: 'AlertTriangle',
    },
    {
        id: 5,
        type: 'order' as const,
        message: 'Chi nhánh Quận 1: 45 đơn hàng mới',
        timestamp: '3 giờ trước',
        icon: 'ShoppingBag',
    },
];

// New: Low Stock Alerts
export const lowStockAlertsData = [
    { id: 1, name: 'Tôm sú', quantity: 12, unit: 'kg', threshold: 5, severity: 'high' as const },
    { id: 2, name: 'Cà chua', quantity: 8, unit: 'kg', threshold: 15, severity: 'medium' as const },
    { id: 3, name: 'Ớt', quantity: 3, unit: 'kg', threshold: 5, severity: 'high' as const },
    { id: 4, name: 'Chanh', quantity: 6, unit: 'kg', threshold: 10, severity: 'low' as const },
];
