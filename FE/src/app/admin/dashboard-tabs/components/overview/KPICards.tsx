import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, Users, CheckCircle } from 'lucide-react';
import { KPI } from '../../types';

interface KPICardsProps {
    kpis: KPI[];
}

const KPICard = ({ kpi }: { kpi: KPI }) => {
    const isUp = kpi.trend === "UP";
    const trendColor = isUp ? "text-green-500" : "text-red-500";
    const TrendIcon = isUp ? ArrowUp : ArrowDown;

    let Icon = DollarSign;
    if (kpi.label === "Đơn Hàng") Icon = ShoppingCart;
    if (kpi.label === "Khách Hàng Mới") Icon = Users;
    if (kpi.label === "Giá Trị Đơn TB") Icon = DollarSign;

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">{kpi.label}</p>
                    <h3 className="text-2xl font-bold text-foreground">
                        {kpi.unit}{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg bg-primary/10 text-primary`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`flex items-center text-sm font-medium ${trendColor}`}>
                    <TrendIcon size={16} className="mr-1" />
                    {Math.abs(kpi.percentChange)}%
                </span>
                <span className="text-muted-foreground text-xs">so với hôm qua</span>
            </div>
        </div>
    );
};

export default function KPICards({ kpis }: KPICardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {kpis.map((kpi, index) => (
                <KPICard key={index} kpi={kpi} />
            ))}
        </div>
    );
}
