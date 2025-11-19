'use client';

import { OrderCountStatistics } from '@/apis/statistics.api';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface OrderChannelsChartProps {
    data?: OrderCountStatistics;
}

const COLORS = ['#EC6426', '#F59E0B', '#10B981'];

export function OrderChannelsChart({ data }: OrderChannelsChartProps) {
    const chartData = [
        {
            name: 'Giao hàng',
            value: data?.shippingOrders ?? 0,
            color: COLORS[0],
        },
        {
            name: 'Mang đi',
            value: data?.pickupOrders ?? 0,
            color: COLORS[1],
        },
        {
            name: 'Tại bàn',
            value: data?.diningOrders ?? 0,
            color: COLORS[2],
        },
    ];

    const total = data?.totalOrders ?? chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        Phân bổ kênh đặt hàng
                    </h3>
                    <p className="text-sm text-gray-500">Tổng {total} đơn</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="text-white" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [
                                <span key="value" className="font-semibold text-gray-900">
                                    {value.toLocaleString('vi-VN')} đơn
                                </span>,
                                'Đơn hàng',
                            ]}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                    {chartData.map((item) => {
                        const percentage = total > 0 ? (item.value / total) * 100 : 0;
                        return (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {percentage.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {item.value.toLocaleString('vi-VN')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
