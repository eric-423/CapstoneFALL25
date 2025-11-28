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
    { name: 'Cơm tấm sườn nướng', sales: 145 },
    { name: 'Cơm tấm sườn bì chả', sales: 132 },
    { name: 'Cơm tấm đặc biệt', sales: 118 },
    { name: 'Cơm tấm sườn trứng', sales: 95 },
    { name: 'Cơm tấm gà nướng', sales: 87 },
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
    { name: 'Gạo tấm', usage: 150, unitId: 1, unitName: 'kg' },
    { name: 'Sườn heo', usage: 85, unitId: 1, unitName: 'kg' },
    { name: 'Trứng gà', usage: 720, unitId: 2, unitName: 'piece' },
    { name: 'Nước mắm', usage: 25, unitId: 3, unitName: 'l' },
    { name: 'Dưa leo', usage: 45, unitId: 1, unitName: 'kg' },
];

// ... (rest of the file)

// New: Low Stock Alerts
export const lowStockAlertsData = [
    { id: 1, name: 'Bì heo', quantity: 10, unitId: 1, unitName: 'kg', severity: 'high' as const },
    { id: 2, name: 'Cà chua', quantity: 8, unitId: 1, unitName: 'kg', severity: 'medium' as const },
    { id: 3, name: 'Ớt', quantity: 3, unitId: 1, unitName: 'kg', severity: 'high' as const },
    { id: 4, name: 'Hành lá', quantity: 5, unitId: 1, unitName: 'kg', severity: 'low' as const },
];

export const recentRecipesData = [
    {
        id: 1,
        name: 'Phở bò tái nạm',
        calories: 450,
        price: 55000,
        image: '/images/pho-bo.jpg',
        createdAt: '2 giờ trước',
    },
    {
        id: 2,
        name: 'Bún chả Hà Nội',
        calories: 520,
        price: 60000,
        image: '/images/bun-cha.jpg',
        createdAt: '5 giờ trước',
    },
    {
        id: 3,
        name: 'Gỏi cuốn tôm thịt',
        calories: 180,
        price: 15000,
        image: '/images/goi-cuon.jpg',
        createdAt: '1 ngày trước',
    },
    {
        id: 4,
        name: 'Cơm tấm sườn bì',
        calories: 650,
        price: 45000,
        image: '/images/com-tam.jpg',
        createdAt: '2 ngày trước',
    },
];

export const trainingStatsData = {
    totalCourses: 12,
    activeCourses: 8,
    enrolledStaff: 45,
    completionRate: 78,
    coursesByRole: [
        { role: 'Đầu bếp', count: 5, color: '#EC6426' },
        { role: 'Phục vụ', count: 3, color: '#3B82F6' },
        { role: 'Pha chế', count: 2, color: '#10B981' },
        { role: 'Quản lý', count: 2, color: '#8B5CF6' },
    ],
};
