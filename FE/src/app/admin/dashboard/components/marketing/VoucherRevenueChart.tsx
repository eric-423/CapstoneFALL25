import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { VoucherRevenueItem } from '@/apis/dashboard.api';
import { Loader2, Inbox, Ticket } from 'lucide-react';

// Admin color palette for chart segments
const CHART_COLORS = ['#78A243', '#DA7339', '#EBD187', '#6B8E23', '#CD853F'];

// Helper function to format revenue
const formatRevenue = (value: number): string => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return `${value.toLocaleString()}đ`;
};

interface VoucherRevenueChartProps {
    data: VoucherRevenueItem[];
    isLoading?: boolean;
}

export default function VoucherRevenueChart({ data, isLoading }: VoucherRevenueChartProps) {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const hasData = data && data.length > 0 && totalRevenue > 0;

    return (
        <div className="bg-gradient-to-br from-white/80 to-[#EBD187]/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-[#78A243]/20 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-[#78A243]/10">
                    <Ticket className="h-4 w-4 text-[#78A243]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2D1E1A]">Doanh Thu Voucher</h3>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />}
            </div>
            <p className="text-sm text-[#2D1E1A]/60 mb-4">Tỷ trọng doanh thu theo loại Voucher</p>

            {isLoading ? (
                <div className="flex-1 min-h-0 flex items-center justify-center bg-gradient-to-br from-[#EBD187]/10 to-[#78A243]/5 rounded-lg animate-pulse">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#78A243] mx-auto mb-2" />
                        <p className="text-sm text-[#2D1E1A]/60">Đang tải dữ liệu...</p>
                    </div>
                </div>
            ) : !hasData ? (
                <div className="flex-1 min-h-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#EBD187]/30 to-[#78A243]/10 flex items-center justify-center mb-3">
                            <Inbox className="h-8 w-8 text-[#78A243]/60" />
                        </div>
                        <p className="text-sm font-medium text-[#2D1E1A]/70">Chưa có dữ liệu voucher</p>
                        <p className="text-xs text-[#2D1E1A]/50 mt-1">Doanh thu voucher sẽ hiển thị tại đây</p>
                    </div>
                </div>
            ) : (
                <>

                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                    nameKey="type"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        borderColor: '#78A243',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-sm text-[#2D1E1A]/60 font-medium">Tổng</span>
                            <span className="text-lg font-bold text-[#78A243]">
                                {formatRevenue(totalRevenue)}
                            </span>
                        </div>
                    </div>

                    {/* Custom Legend */}
                    <div className="mt-4 space-y-3">
                        {data.map((item, index) => {
                            const percentage = totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(2) : '0.00';
                            return (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#78A243]/5 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.fill || CHART_COLORS[index % CHART_COLORS.length] }}
                                        />
                                        <span className="text-sm font-medium text-[#2D1E1A]">{item.type}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-[#2D1E1A]">
                                            {formatRevenue(item.revenue)}
                                        </span>
                                        <span className="text-xs text-[#2D1E1A]/60 w-12 text-right">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
