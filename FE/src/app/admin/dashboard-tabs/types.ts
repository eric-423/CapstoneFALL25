export type Trend = 'UP' | 'DOWN' | 'FLAT';

export interface KPI {
    label: string;
    value: number;
    unit?: string;
    percentChange: number;
    trend: Trend;
}

export interface RevenuePoint {
    time: string;          // '2024-11-20'
    revenue: number;
}

export interface ChannelRevenue {
    channel: string;       // 'Tại bàn'
    revenue: number;
    percentage: number;
    fill?: string;
}

export interface PeakHourPoint {
    hour: string;          // '08:00'
    orderCount: number;
}

export interface ProductSummary {
    productId: number;
    productName: string;
    quantitySold: number;
    totalRevenue: number;
    image?: string;
    category?: string;
}

export interface ComboPerformance {
    comboName: string;
    orders: number;
    revenue: number;
}

export interface PromotionPerformance {
    code: string;
    name?: string;
    usageCount: number;
    revenueGenerated: number;
    discountTotal?: number;
}

export interface VoucherRevenue {
    type: string;          // 'Voucher tân binh'
    revenue: number;
    fill?: string;
}

export interface KitchenPerformancePoint {
    timeSlot: string;      // 'Lunch', 'Dinner' hoặc '11:00–12:00'
    avgPrepMinutes: number;
}

export interface StaffPerformance {
    staffName: string;
    ordersHandled: number;
    avgRating?: number;
}

export interface OrderFlowPoint {
    stage: string;         // 'Created', 'Confirmed', ...
    avgSeconds: number;
}
