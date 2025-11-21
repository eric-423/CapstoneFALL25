'use client';

import React from 'react';
import { GraduationCap, Users, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TrainingStatsData {
    totalCourses: number;
    activeCourses: number;
    enrolledStaff: number;
    completionRate: number;
    coursesByRole: { role: string; count: number; color: string }[];
}

interface TrainingStatusCardProps {
    data: TrainingStatsData;
}

export function TrainingStatusCard({ data }: TrainingStatusCardProps) {
    const completionData = [
        { name: 'Completed', value: data.completionRate, color: '#EC6426' },
        { name: 'Remaining', value: 100 - data.completionRate, color: '#FDBA74' }, // orange-300
    ];

    return (
        <div className="bg-white/60 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">Trạng thái đào tạo</h3>
                <Link href="/admin/training" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                    Chi tiết
                </Link>
            </div>

            <div className="flex-1 grid grid-cols-[1fr_auto] gap-4 items-center">
                {/* Left Side: Stats and Role List */}
                <div className="space-y-4">
                    {/* Key Stats */}
                    <div className="flex items-center justify-around text-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-700">{data.totalCourses}</p>
                            <p className="text-xs text-blue-600 font-medium">Khóa học</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-700">{data.enrolledStaff}</p>
                            <p className="text-xs text-green-600 font-medium">Học viên</p>
                        </div>
                    </div>

                    {/* Role List */}
                    <div>
                        {data.coursesByRole.map((item) => (
                            <div key={item.role} className="flex items-center justify-between text-xs py-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="font-medium text-gray-600">{item.role}</span>
                                </div>
                                <span className="font-bold text-gray-800">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Completion Chart */}
                <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={completionData}
                                dataKey="value"
                                innerRadius="70%"
                                outerRadius="100%"
                                startAngle={90}
                                endAngle={450}
                                stroke="none"
                            >
                                <Cell fill={completionData[0].color} />
                                <Cell fill={completionData[1].color} opacity={0.3}/>
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-orange-600">{data.completionRate}%</span>
                        <span className="text-xs text-gray-500 font-medium">Hoàn thành</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
