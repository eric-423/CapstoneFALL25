import { Card } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
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

export function DashboardCard({ title, value, icon: Icon, trend, subtitle, isLoading = false }: DashboardCardProps) {
    return (
        <Card className="relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl h-full">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#EC6426]/20 via-transparent to-[#F8A91F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative p-3 flex flex-col h-full min-h-[120px]">
                <div className="flex items-start justify-between gap-2 flex-1">
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* Title */}
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide line-clamp-2">{title}</p>

                        {/* Value */}
                        {isLoading ? (
                            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-1 animate-pulse"></div>
                        ) : (
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#EC6426] transition-colors duration-300 leading-tight break-words">
                                {value}
                            </h3>
                        )}

                        {/* Trend area - compact */}
                        <div className="min-h-[24px] flex items-end">
                            {trend ? (
                                <div className="flex flex-col gap-0.5 w-full">
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full w-fit ${trend.isPositive
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                        }`}>
                                        {trend.isPositive ? (
                                            <TrendingUp size={12} strokeWidth={2.5} />
                                        ) : (
                                            <TrendingDown size={12} strokeWidth={2.5} />
                                        )}
                                        <span className="text-xs font-bold">
                                            {Math.abs(trend.value)}%
                                        </span>
                                    </div>
                                    {subtitle && (
                                        <span className="text-xs text-gray-500 font-medium truncate">{subtitle}</span>
                                    )}
                                </div>
                            ) : subtitle ? (
                                <span className="text-xs text-gray-500 font-medium truncate">{subtitle}</span>
                            ) : (
                                <div className="h-6"></div>
                            )}
                        </div>
                    </div>

                    {/* Icon with gradient background - smaller */}
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300">
                            <Icon className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Decorative line - thinner */}
                <div className="h-0.5 w-full bg-gradient-to-r from-[#EC6426] via-[#F8A91F] to-transparent rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-300 mt-2"></div>
            </div>
        </Card>
    );
}
