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
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Trạng thái đào tạo</h3>
                <Link
                    href="/admin/training"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    Chi tiết →
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">Khóa học</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{data.totalCourses}</p>
                    <p className="text-xs text-blue-500 mt-1">{data.activeCourses} đang hoạt động</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Học viên</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{data.enrolledStaff}</p>
                    <p className="text-xs text-green-500 mt-1">Tổng tham gia</p>
                </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">Tỷ lệ hoàn thành</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{data.completionRate}%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${data.completionRate}%` }}
                    />
                </div>
            </div>

            {/* Courses by Role */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Học viên theo vai trò</h4>
                <div className="space-y-2">
                    {data.coursesByRole.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-700">{item.role}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
