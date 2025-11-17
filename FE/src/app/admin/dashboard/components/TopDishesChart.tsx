import { SellingItem } from '@/apis/statistics.api';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopDishesChartProps {
    data?: SellingItem[];
}

const COLORS = ['#EC6426', '#F8A91F', '#FF9F43', '#FFC107', '#FFD54F'];

export function TopDishesChart({ data = [] }: TopDishesChartProps) {
    return (
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        Top 5 món bán chạy
                    </h3>
                    <p className="text-sm text-gray-500">Món ăn được yêu thích nhất</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="text-white" size={24} />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data} layout="vertical">
                    <defs>
                        {COLORS.map((color, index) => (
                            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={color} stopOpacity={1} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                    <XAxis
                        type="number"
                        stroke="#9ca3af"
                        style={{ fontSize: '13px', fontWeight: 600 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="itemName"
                        stroke="#9ca3af"
                        style={{ fontSize: '13px', fontWeight: 600 }}
                        width={140}
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
                                {value} đơn
                            </span>,
                            'Đã bán'
                        ]}
                        cursor={{ fill: 'rgba(236, 100, 38, 0.05)' }}
                    />
                    <Bar dataKey="quantitySold" radius={[0, 12, 12, 0]} barSize={32}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#gradient-${index})`}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
