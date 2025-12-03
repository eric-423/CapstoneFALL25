"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueByChannelItem } from '@/apis/dashboard.api';
import { Loader2, Inbox } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Helper function to format revenue
const formatRevenue = (value: number): string => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return `${value.toLocaleString()}đ`;
};

interface SalesByChannelChartProps {
    data: RevenueByChannelItem[];
    isLoading?: boolean;
}

export default function SalesByChannelChart({ data, isLoading }: SalesByChannelChartProps) {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const hasData = data && data.length > 0 && totalRevenue > 0;

    return (
        <Card className="p-5 rounded-xl bg-gradient-to-br from-white/90 to-[#EBD187]/5 backdrop-blur-sm border-[#78A243]/20 border shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-[#2D1E1A]">Nguồn Doanh Thu</h3>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />}
            </div>
            <p className="text-xs text-[#2D1E1A]/60 mb-2">Phân bố theo kênh bán hàng</p>

            {isLoading ? (
                <div className="flex-1 min-h-[200px] flex items-center justify-center bg-[#EBD187]/10 rounded-lg animate-pulse">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#78A243] mx-auto mb-2" />
                        <p className="text-sm text-[#2D1E1A]/60">Đang tải dữ liệu...</p>
                    </div>
                </div>
            ) : !hasData ? (
                <div className="flex-1 min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                        <Inbox className="h-12 w-12 text-[#78A243]/40 mx-auto mb-3" />
                        <p className="text-sm font-medium text-[#2D1E1A]/70">Chưa có dữ liệu</p>
                        <p className="text-xs text-[#2D1E1A]/50 mt-1">Dữ liệu doanh thu sẽ hiển thị tại đây</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 min-h-[180px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="55%"
                                    outerRadius="85%"
                                    paddingAngle={5}
                                    dataKey="revenue"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid rgba(120, 162, 67, 0.3)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }}
                                    formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-[#2D1E1A]/60 font-medium">Tổng</span>
                            <span className="text-base font-bold text-[#2D1E1A]">
                                {formatRevenue(totalRevenue)}
                            </span>
                        </div>
                    </div>

                    {/* Custom Legend */}
                    <div className="mt-3 space-y-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span className="text-sm font-medium text-[#2D1E1A]">{item.channel}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-[#2D1E1A]">
                                        {formatRevenue(item.revenue)}
                                    </span>
                                    <span className="text-xs text-[#2D1E1A]/50 w-12 text-right font-medium">
                                        {Number(item.percentage).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
