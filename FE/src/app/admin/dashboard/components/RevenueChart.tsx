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
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        Doanh thu 7 ngày qua
                    </h3>
                    <p className="text-sm text-gray-500">Theo dõi xu hướng doanh thu hàng ngày</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={24} />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC6426" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EC6426" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        style={{ fontSize: '13px', fontWeight: 600 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '13px', fontWeight: 600 }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}
                        formatter={(value: number) => [
                            <span key="value" className="font-bold text-primary">
                                {value.toLocaleString('vi-VN')} ₫
                            </span>,
                            'Doanh thu'
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#EC6426"
                        strokeWidth={3}
                        fill="url(#revenueGradient)"
                        dot={{ fill: '#EC6426', strokeWidth: 2, r: 5, stroke: 'white' }}
                        activeDot={{ r: 8, strokeWidth: 3, stroke: 'white', fill: '#EC6426' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}
