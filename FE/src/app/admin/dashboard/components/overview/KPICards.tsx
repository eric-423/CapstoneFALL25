import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, Users, TrendingUp, Inbox } from 'lucide-react';
import { DashboardKPIItem } from '@/apis/dashboard.api';
import { Card } from '@/components/ui/card';

interface KPICardsProps {
    kpis: DashboardKPIItem[];
    isLoading?: boolean;
    showTrend?: boolean; // Only show trend when date range is 1 day
}

const KPICard = ({ kpi, showTrend }: { kpi: DashboardKPIItem; showTrend?: boolean }) => {
    const isUp = kpi.trend === "UP";
    const trendColor = isUp ? "text-[#78A243]" : "text-red-600";
    const TrendIcon = isUp ? ArrowUp : ArrowDown;

    let Icon = DollarSign;
    let iconBg = "from-[#78A243]/20 to-[#DA7339]/20";
    let iconColor = "text-[#78A243]";

    if (kpi.label === "Đơn Hàng") {
        Icon = ShoppingCart;
        iconBg = "from-[#DA7339]/20 to-[#EBD187]/20";
        iconColor = "text-[#DA7339]";
    }
    if (kpi.label === "Khách Hàng Mới") {
        Icon = Users;
        iconBg = "from-[#EBD187]/30 to-[#78A243]/20";
        iconColor = "text-[#2D1E1A]";
    }
    if (kpi.label === "Giá Trị Đơn TB") {
        Icon = TrendingUp;
        iconBg = "from-[#78A243]/20 to-[#78A243]/30";
        iconColor = "text-[#78A243]";
    }

    return (
        <Card className="p-4 rounded-xl bg-gradient-to-br from-white/80 to-[#EBD187]/10 backdrop-blur-sm border-[#78A243]/20 border shadow-sm hover:shadow-md hover:from-white hover:to-[#EBD187]/20 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[#2D1E1A]/70 mb-1">{kpi.label}</p>
                    <h3 className="text-2xl font-bold text-[#2D1E1A]">
                        {kpi.unit}{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                    </h3>
                    {showTrend && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className={`flex items-center text-sm font-semibold ${trendColor}`}>
                                <TrendIcon size={14} className="mr-0.5" />
                                {Math.abs(kpi.percentChange)}%
                            </span>
                            <span className="text-[#2D1E1A]/50 text-xs">so với hôm qua</span>
                        </div>
                    )}
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${iconBg}`}>
                    <Icon size={22} className={iconColor} strokeWidth={2} />
                </div>
            </div>
        </Card>
    );
};

export default function KPICards({ kpis, isLoading, showTrend }: KPICardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="p-4 rounded-xl bg-gradient-to-br from-white/80 to-[#EBD187]/10 border-[#78A243]/20 border animate-pulse">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#EBD187]/30 rounded w-20" />
                                <div className="h-7 bg-[#EBD187]/40 rounded w-28" />
                                {showTrend && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="h-4 bg-[#78A243]/20 rounded w-12" />
                                        <div className="h-3 bg-[#EBD187]/30 rounded w-16" />
                                    </div>
                                )}
                            </div>
                            <div className="w-10 h-10 bg-[#EBD187]/30 rounded-xl" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!kpis || kpis.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="p-6 rounded-xl bg-gradient-to-br from-white/80 to-[#EBD187]/10 border-[#78A243]/20 border flex flex-col items-center justify-center min-h-[100px]">
                        <Inbox className="h-8 w-8 text-[#78A243]/40 mb-2" />
                        <p className="text-sm text-[#2D1E1A]/50 font-medium">Chưa có dữ liệu</p>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
                <KPICard key={index} kpi={kpi} showTrend={showTrend} />
            ))}
        </div>
    );
}
