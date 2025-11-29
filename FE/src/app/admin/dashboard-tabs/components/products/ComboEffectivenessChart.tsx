"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ComboPerformance } from '../../types';

interface ComboEffectivenessChartProps {
    data: ComboPerformance[];
}

export default function ComboEffectivenessChart({ data }: ComboEffectivenessChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Hiệu Quả Combo</h3>
            <p className="text-sm text-muted-foreground mb-6">So sánh số lượng bán và doanh thu của các Combo</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="comboName"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }}
                            width={120}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="orders" name="Số lượng bán" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="revenue" name="Doanh thu" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
