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
        { name: 'Giao hàng', value: data?.shippingOrders ?? 0, color: COLORS[0] },
        { name: 'Mang đi', value: data?.pickupOrders ?? 0, color: COLORS[1] },
        { name: 'Tại bàn', value: data?.diningOrders ?? 0, color: COLORS[2] },
    ].filter(item => item.value > 0); // Filter out empty channels

    const total = data?.totalOrders ?? chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="p-4 bg-[#FDE3CF]/70 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">
                    Kênh đặt hàng
                </h3>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400/50 to-orange-600/50 text-white rounded-lg flex items-center justify-center">
                    <ShoppingCart size={18} />
                </div>
            </div>

            {total > 0 ? (
                <div className="flex-1 grid grid-cols-2 gap-4 items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="65%"
                                outerRadius="100%"
                                paddingAngle={4}
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`${value.toLocaleString('vi-VN')} đơn`, 'Đơn hàng']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                }}
                                labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2 flex flex-col justify-center">
                        {chartData.map((item) => {
                            const percentage = total > 0 ? (item.value / total) * 100 : 0;
                            return (
                                <div key={item.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="font-medium text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-800">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                    <ShoppingCart size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Không có dữ liệu đơn hàng</p>
                </div>
            )}
        </Card>
    );
}

