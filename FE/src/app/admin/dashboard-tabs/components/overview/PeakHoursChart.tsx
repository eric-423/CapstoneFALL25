"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PeakHourPoint } from '../../types';

interface PeakHoursChartProps {
    data: PeakHourPoint[];
}

export default function PeakHoursChart({ data }: PeakHoursChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Khung Giờ Vàng</h3>
            <p className="text-sm text-muted-foreground mb-6">Lượng đơn hàng trung bình theo giờ</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="hour"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px'
                            }}
                            formatter={(value: number) => [value, 'Đơn hàng']}
                        />
                        <Bar
                            dataKey="orderCount"
                            fill="var(--primary)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
