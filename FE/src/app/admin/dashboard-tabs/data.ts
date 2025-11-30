import {
    KPI,
    RevenuePoint,
    ChannelRevenue,
    PeakHourPoint,
    ProductSummary,
    ComboPerformance,
    PromotionPerformance,
    VoucherRevenue,
    KitchenPerformancePoint,
    StaffPerformance,
    OrderFlowPoint
} from "./types";

// --- TAB 1: OVERVIEW ---

export const overviewKpis: KPI[] = [
    { label: "Tổng Doanh Thu", value: 15000000, unit: "₫", percentChange: 25.0, trend: "UP" },
    { label: "Đơn Hàng", value: 120, percentChange: 20.0, trend: "UP" },
    { label: "Khách Hàng Mới", value: 15, percentChange: -5.0, trend: "DOWN" },
    { label: "Giá Trị Đơn TB", value: 125000, unit: "₫", percentChange: 4.2, trend: "UP" },
];

export const revenueSeries: RevenuePoint[] = [
    { time: "2024-11-20", revenue: 2500000 },
    { time: "2024-11-21", revenue: 3100000 },
    { time: "2024-11-22", revenue: 2800000 },
    { time: "2024-11-23", revenue: 4500000 },
    { time: "2024-11-24", revenue: 4200000 },
    { time: "2024-11-25", revenue: 3800000 },
    { time: "2024-11-26", revenue: 5100000 },
];

export const channelRevenue: ChannelRevenue[] = [
    { channel: "Tại bàn", revenue: 50000000, percentage: 50.0, fill: "var(--color-chart-1)" },
    { channel: "Mang về", revenue: 30000000, percentage: 30.0, fill: "var(--color-chart-2)" },
    { channel: "Giao hàng", revenue: 20000000, percentage: 20.0, fill: "var(--color-chart-3)" },
];

export const peakHours: PeakHourPoint[] = [
    { hour: "08:00", orderCount: 15 },
    { hour: "09:00", orderCount: 25 },
    { hour: "10:00", orderCount: 30 },
    { hour: "11:00", orderCount: 65 },
    { hour: "12:00", orderCount: 80 },
    { hour: "13:00", orderCount: 50 },
    { hour: "14:00", orderCount: 20 },
    { hour: "15:00", orderCount: 15 },
    { hour: "16:00", orderCount: 25 },
    { hour: "17:00", orderCount: 40 },
    { hour: "18:00", orderCount: 70 },
    { hour: "19:00", orderCount: 60 },
    { hour: "20:00", orderCount: 35 },
    { hour: "21:00", orderCount: 15 },
];

// --- TAB 2: PRODUCTS ---

export const topProducts: ProductSummary[] = [
    { productId: 101, productName: "Cơm Tấm Sườn Bì", quantitySold: 500, totalRevenue: 25000000, image: "/placeholder-food.jpg" },
    { productId: 102, productName: "Bún Bò Huế", quantitySold: 300, totalRevenue: 15000000, image: "/placeholder-food.jpg" },
    { productId: 103, productName: "Cơm Gà Xối Mỡ", quantitySold: 250, totalRevenue: 12500000, image: "/placeholder-food.jpg" },
    { productId: 104, productName: "Bánh Mì Chảo", quantitySold: 200, totalRevenue: 8000000, image: "/placeholder-food.jpg" },
    { productId: 105, productName: "Sữa Đá", quantitySold: 150, totalRevenue: 3000000, image: "/placeholder-food.jpg" },
];

export const comboPerformance: ComboPerformance[] = [
    { comboName: "Combo Sáng (Cơm + Cafe)", orders: 120, revenue: 6000000 },
    { comboName: "Combo Trưa (Bún + Trà)", orders: 95, revenue: 4750000 },
    { comboName: "Combo Gia Đình", orders: 40, revenue: 12000000 },
    { comboName: "Combo Nhậu", orders: 25, revenue: 8500000 },
];

// --- TAB 3: MARKETING ---

export const promotionPerformance: PromotionPerformance[] = [
    { code: "WELCOME50", usageCount: 120, revenueGenerated: 15000000 },
    { code: "FREESHIP", usageCount: 85, revenueGenerated: 8000000 },
    { code: "COMBO20", usageCount: 60, revenueGenerated: 12000000 },
    { code: "MEMBER10", usageCount: 45, revenueGenerated: 5000000 },
];

export const voucherRevenue: VoucherRevenue[] = [
    { type: "Voucher Tân Binh", revenue: 5000000, fill: "var(--color-chart-1)" },
    { type: "Voucher KHTT", revenue: 12000000, fill: "var(--color-chart-2)" },
    { type: "Voucher Sự Kiện", revenue: 8000000, fill: "var(--color-chart-3)" },
    { type: "Voucher Đối Tác", revenue: 3000000, fill: "var(--color-chart-4)" },
];

// --- TAB 4: OPERATIONS ---

export const kitchenPerformance: KitchenPerformancePoint[] = [
    { timeSlot: "Sáng (6h-10h)", avgPrepMinutes: 8 },
    { timeSlot: "Trưa (11h-14h)", avgPrepMinutes: 15 },
    { timeSlot: "Chiều (14h-17h)", avgPrepMinutes: 10 },
    { timeSlot: "Tối (17h-21h)", avgPrepMinutes: 18 },
];

export const staffPerformance: StaffPerformance[] = [
    { staffName: "Nguyễn Văn A", ordersHandled: 150, avgRating: 4.8 },
    { staffName: "Trần Thị B", ordersHandled: 140, avgRating: 4.9 },
    { staffName: "Lê Văn C", ordersHandled: 120, avgRating: 4.5 },
    { staffName: "Phạm Thị D", ordersHandled: 110, avgRating: 4.7 },
];

export const orderFlow: OrderFlowPoint[] = [
    { stage: "Đặt món", avgSeconds: 0 },
    { stage: "Xác nhận", avgSeconds: 45 },
    { stage: "Chế biến", avgSeconds: 900 }, // 15 mins
    { stage: "Hoàn tất", avgSeconds: 120 }, // 2 mins
];
