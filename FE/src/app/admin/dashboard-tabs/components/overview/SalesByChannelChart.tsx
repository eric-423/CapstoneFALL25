"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChannelRevenue } from '../../types';

interface SalesByChannelChartProps {
    data: ChannelRevenue[];
}

export default function SalesByChannelChart({ data }: SalesByChannelChartProps) {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-1">Nguồn Doanh Thu</h3>
            <p className="text-sm text-muted-foreground mb-4">Phân bố theo kênh bán hàng</p>

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
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm text-muted-foreground font-medium">Tổng</span>
                    <span className="text-lg font-bold text-foreground">
                        {(totalRevenue / 1000000).toFixed(0)}M
                    </span>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-4 space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-sm font-medium text-foreground">{item.channel}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-foreground">
                                ₫{(item.revenue / 1000000).toFixed(1)}M
                            </span>
                            <span className="text-xs text-muted-foreground w-8 text-right">
                                {item.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
