// Mock data for Finance page charts

// Branch names for revenue tracking
export const branches = [
    { id: 'branch1', name: 'Chi nhánh Trung tâm', color: '#EC6426' },
    { id: 'branch2', name: 'Chi nhánh Thủ Đức', color: '#10b981' },
    { id: 'branch3', name: 'Chi nhánh Quận 1', color: '#3b82f6' },
    { id: 'branch4', name: 'Chi nhánh Bình Thạnh', color: '#f59e0b' },
];

// Generate revenue data for different time periods with branch breakdown
export const generateRevenueData = (period: 'day' | 'week' | 'month' | 'year') => {
    const baseRevenue = 150000000; // 150M base

    const generateDataPoint = (date: Date, multiplier: number) => {
        const totalRevenue = baseRevenue * multiplier + Math.random() * (80000000 * multiplier);
        return {
            date: date.toISOString(),
            revenue: totalRevenue,
            // Distribute revenue across branches (with some variation)
            'Chi nhánh Trung tâm': totalRevenue * (0.35 + Math.random() * 0.1),
            'Chi nhánh Thủ Đức': totalRevenue * (0.25 + Math.random() * 0.1),
            'Chi nhánh Quận 1': totalRevenue * (0.22 + Math.random() * 0.08),
            'Chi nhánh Bình Thạnh': totalRevenue * (0.18 + Math.random() * 0.07),
        };
    };

    switch (period) {
        case 'day':
            // Last 7 days
            return Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return generateDataPoint(date, 1);
            });

        case 'week':
            // Last 4 weeks
            return Array.from({ length: 4 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (3 - i) * 7);
                return generateDataPoint(date, 7);
            });

        case 'month':
            // Last 12 months
            return Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (11 - i));
                return generateDataPoint(date, 30);
            });

        case 'year':
            // Last 5 years
            return Array.from({ length: 5 }, (_, i) => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - (4 - i));
                return generateDataPoint(date, 365);
            });

        default:
            return [];
    }
};

// Expense breakdown data
export const expenseBreakdownData = [
    { name: 'Nguyên liệu thực phẩm', value: 45000000, color: '#EC6426' },
    { name: 'Nhân sự', value: 35000000, color: '#F8A91F' },
    { name: 'Tiện ích (điện, nước)', value: 15000000, color: '#1A3F22' },
    { name: 'Thuê mặt bằng', value: 20000000, color: '#632713' },
    { name: 'Marketing', value: 8000000, color: '#10b981' },
    { name: 'Khác', value: 7000000, color: '#3b82f6' },
];

// Revenue comparison data (Month over Month)
export const revenueComparisonData = {
    currentMonth: {
        revenue: 4500000000, // 4.5B
        profit: 1575000000,  // 1.575B
        expenses: 2925000000, // 2.925B
    },
    lastMonth: {
        revenue: 4200000000, // 4.2B
        profit: 1470000000,  // 1.47B
        expenses: 2730000000, // 2.73B
    },
    growth: {
        revenue: 7.1,
        profit: 7.1,
        expenses: 7.1,
    }
};

// Top performing products/categories
export const topProductsData = [
    { name: 'Phở Bò đặc biệt', revenue: 450000000, orders: 3500 },
    { name: 'Bún Chả Hà Nội', revenue: 380000000, orders: 3200 },
    { name: 'Cơm Tấm Sài Gòn', revenue: 350000000, orders: 3100 },
    { name: 'Bánh Mì Pate', revenue: 280000000, orders: 4500 },
    { name: 'Cà Phê Sữa Đá', revenue: 220000000, orders: 5500 },
];

// Payment methods distribution
export const paymentMethodsData = [
    { name: 'Tiền mặt', value: 1800000000, percentage: 40 },
    { name: 'VNPay', value: 1350000000, percentage: 30 },
    { name: 'MoMo', value: 900000000, percentage: 20 },
    { name: 'Thẻ ngân hàng', value: 450000000, percentage: 10 },
];

// Branch performance comparison
export const branchComparisonData = [
    {
        branch: 'Chi nhánh Trung tâm',
        revenue: 1500000000,
        profit: 525000000,
        orders: 12000,
        rating: 4.8
    },
    {
        branch: 'Chi nhánh Thủ Đức',
        revenue: 1200000000,
        profit: 420000000,
        orders: 10000,
        rating: 4.7
    },
    {
        branch: 'Chi nhánh Quận 1',
        revenue: 1100000000,
        profit: 385000000,
        orders: 9500,
        rating: 4.9
    },
    {
        branch: 'Chi nhánh Bình Thạnh',
        revenue: 900000000,
        profit: 315000000,
        orders: 8000,
        rating: 4.6
    },
];
