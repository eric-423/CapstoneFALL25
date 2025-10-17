'use client';

import { Card } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RevenueLineChartProps {
    data: Array<{
        date: string;
        revenue: number;
        profit?: number;
        expenses?: number;
    }>;
    title?: string;
    showProfit?: boolean;
}

export function RevenueLineChart({ data, title = "Xu hướng doanh thu", showProfit = false }: RevenueLineChartProps) {
    // Format data for chart
    const chartData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        'Doanh thu': item.revenue / 1000000, // Convert to millions
        ...(showProfit && item.profit ? { 'Lợi nhuận': item.profit / 1000000 } : {}),
        ...(showProfit && item.expenses ? { 'Chi phí': item.expenses / 1000000 } : {}),
    }));

    // Custom tooltip
    type TooltipPayloadEntry = { name?: string; value?: number; color?: string; payload?: unknown };
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] | null }) => {
        if (active && payload && payload.length) {
            type ChartPayload = { name?: string; value?: number; color?: string; payload?: { date?: string } | unknown };
            const first = payload[0] as ChartPayload;
            const date = first.payload && typeof (first.payload as { date?: string }).date === 'string'
                ? (first.payload as { date?: string }).date
                : '';
            return (
                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-2xl">
                    <p className="font-bold text-gray-900 mb-2 text-sm">{date}</p>
                    {payload.map((entry, index) => {
                        const e = entry as ChartPayload;
                        return (
                            <p key={index} className="text-sm font-semibold mb-1" style={{ color: e.color }}>
                                {e.name}: {(e.value ?? 0).toFixed(1)}M đ
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>

            <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EC6426" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#EC6426" stopOpacity={0} />
                            </linearGradient>
                            {showProfit && (
                                <>
                                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </>
                            )}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            style={{ fontSize: '12px', fontWeight: '600' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px', fontWeight: '600' }}
                            tickFormatter={(value: number) => `${value}M`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
                            iconType="circle"
                        />

                        <Area
                            type="monotone"
                            dataKey="Doanh thu"
                            stroke="#EC6426"
                            strokeWidth={3}
                            fill="url(#revenueGradient)"
                            animationDuration={1000}
                        />

                        {showProfit && (
                            <>
                                <Area
                                    type="monotone"
                                    dataKey="Lợi nhuận"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="url(#profitGradient)"
                                    animationDuration={1000}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Chi phí"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fill="url(#expensesGradient)"
                                    animationDuration={1000}
                                />
                            </>
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Cao nhất</p>
                    <p className="text-lg font-bold text-[#EC6426]">
                        {Math.max(...data.map(d => d.revenue / 1000000)).toFixed(1)}M
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Thấp nhất</p>
                    <p className="text-lg font-bold text-gray-600">
                        {Math.min(...data.map(d => d.revenue / 1000000)).toFixed(1)}M
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Trung bình</p>
                    <p className="text-lg font-bold text-gray-700">
                        {(data.reduce((sum, d) => sum + d.revenue, 0) / data.length / 1000000).toFixed(1)}M
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Tổng</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent">
                        {(data.reduce((sum, d) => sum + d.revenue, 0) / 1000000).toFixed(1)}M
                    </p>
                </div>
            </div>
        </Card>
    );
}
