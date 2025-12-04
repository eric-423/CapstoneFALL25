import { Card } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
    isLoading?: boolean;
}

export function AdminCard({ title, value, icon: Icon, trend, subtitle, isLoading = false }: AdminCardProps) {
    if (isLoading) {
        return (
            <Card className="p-3 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-gray-100"></div>
                    <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
                    </div>
                    <div className="w-1/4 space-y-1">
                        <div className="h-5 bg-gray-100 rounded-md w-full"></div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-3 rounded-xl bg-white border border-gray-200 hover:border-[#78A243]/50 transition-all duration-200 h-full">
            <div className="flex items-center gap-3 h-full">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#78A243]/10 text-[#78A243] rounded-lg">
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Title and Subtitle */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#2D1E1A] truncate">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-[#2D1E1A]/60 font-medium truncate">{subtitle}</p>
                    )}
                </div>

                {/* Value and Trend */}
                <div className="text-right flex-shrink-0">
                    <h3 className="text-base font-bold text-[#2D1E1A]">{value}</h3>
                    {trend && typeof trend.value === 'number' && (
                        <div
                            className={`flex items-center justify-end gap-0.5 text-xs font-bold ${trend.isPositive ? 'text-[#78A243]' : 'text-red-600'
                                }`}
                        >
                            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{Math.abs(trend.value).toFixed(1)}%</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
