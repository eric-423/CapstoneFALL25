"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { KitchenPerformancePoint } from '../../types';

interface KitchenPerformanceChartProps {
    data: KitchenPerformancePoint[];
}

export default function KitchenPerformanceChart({ data }: KitchenPerformanceChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Hiệu Suất Bếp</h3>
            <p className="text-sm text-muted-foreground mb-6">Thời gian chế biến trung bình theo khung giờ</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="timeSlot"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                            label={{ value: 'Phút', angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value} phút`, 'Thời gian TB']}
                        />
                        <ReferenceLine y={15} stroke="red" strokeDasharray="3 3" label={{ value: 'Mục tiêu (15p)', fill: 'red', fontSize: 10 }} />
                        <Bar
                            dataKey="avgPrepMinutes"
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
