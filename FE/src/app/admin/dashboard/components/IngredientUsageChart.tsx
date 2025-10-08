'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface IngredientUsageChartProps {
    data: { name: string; usage: number; unit: string }[];
}

export function IngredientUsageChart({ data }: IngredientUsageChartProps) {
    const colors = ['#EC6426', '#F8A91F', '#3B82F6', '#10B981', '#8B5CF6'];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 5 nguyên liệu sử dụng nhiều nhất</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-15}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value: number, _name: string, props) => [
                            `${value} ${props.payload?.unit || ''}`,
                            'Sử dụng',
                        ]}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '12px',
                        }}
                    />
                    <Bar dataKey="usage" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
