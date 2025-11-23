'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RevenueData {
    date: string;
    revenue: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">
                    Doanh thu 7 ngày
                </h3>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400/50 to-green-600/50 text-white rounded-lg flex items-center justify-center">
                    <TrendingUp size={18} />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: -10 }}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC6426" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#EC6426" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        style={{ fontSize: '11px' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '11px' }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                        }}
                        labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '12px' }}
                        formatter={(value: number) => [
                            <span key="value" className="font-bold text-[#EC6426]">
                                {value.toLocaleString('vi-VN')} ₫
                            </span>,
                            'Doanh thu'
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#EC6426"
                        strokeWidth={2.5}
                        fill="url(#revenueGradient)"
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#EC6426', fill: 'white' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}

