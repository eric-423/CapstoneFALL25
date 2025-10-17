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
}

export function DashboardCard({ title, value, icon: Icon, trend, subtitle }: DashboardCardProps) {
    return (
        <Card className="relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl h-full">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#EC6426]/20 via-transparent to-[#F8A91F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative p-6 flex flex-col h-full min-h-[200px]">
                <div className="flex items-start justify-between gap-4 flex-1">
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* Title */}
                        <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider line-clamp-2">{title}</p>

                        {/* Value */}
                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 group-hover:text-[#EC6426] transition-colors duration-300 leading-tight break-words">
                            {value}
                        </h3>

                        {/* Trend area - always reserve space */}
                        <div className="min-h-[36px] flex items-end">
                            {trend ? (
                                <div className="flex flex-col gap-1 w-full">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${trend.isPositive
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                        }`}>
                                        {trend.isPositive ? (
                                            <TrendingUp size={14} strokeWidth={2.5} />
                                        ) : (
                                            <TrendingDown size={14} strokeWidth={2.5} />
                                        )}
                                        <span className="text-xs font-bold">
                                            {Math.abs(trend.value)}%
                                        </span>
                                    </div>
                                    {subtitle && (
                                        <span className="text-xs text-gray-500 font-medium">{subtitle}</span>
                                    )}
                                </div>
                            ) : (
                                <div className="h-9"></div>
                            )}
                        </div>
                    </div>

                    {/* Icon with gradient background */}
                    <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Icon className="text-white" size={26} strokeWidth={2.5} />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                    </div>
                </div>

                {/* Decorative line */}
                <div className="h-1 w-full bg-gradient-to-r from-[#EC6426] via-[#F8A91F] to-transparent rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-300 mt-4"></div>
            </div>
        </Card>
    );
}
