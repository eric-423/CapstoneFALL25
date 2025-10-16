'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_TRAINING_COURSES } from '@/utils/mocks/data/training.mock';
import { TrainingCourse, StaffRole } from '@/utils/types/training.type';
import {
    GraduationCap,
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    Clock,
    CheckCircle,
    BookOpen,
    Eye,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AddTrainingDialog } from '@/app/admin/training/components/AddTrainingDialog';

export default function TrainingPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredCourses = MOCK_TRAINING_COURSES.filter((course) => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const totalCourses = MOCK_TRAINING_COURSES.length;
    const publishedCourses = MOCK_TRAINING_COURSES.filter((c) => c.status === 'PUBLISHED').length;
    const totalEnrolled = MOCK_TRAINING_COURSES.reduce((sum, c) => sum + c.enrolledCount, 0);
    const totalCompleted = MOCK_TRAINING_COURSES.reduce((sum, c) => sum + c.completedCount, 0);
    const completionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

    const statuses = [
        { value: 'all', label: 'Tất cả', count: totalCourses },
        { value: 'PUBLISHED', label: 'Đã xuất bản', count: publishedCourses },
        {
            value: 'DRAFT',
            label: 'Nháp',
            count: MOCK_TRAINING_COURSES.filter((c) => c.status === 'DRAFT').length,
        },
        {
            value: 'ARCHIVED',
            label: 'Lưu trữ',
            count: MOCK_TRAINING_COURSES.filter((c) => c.status === 'ARCHIVED').length,
        },
    ];

    const getRoleColor = (role: StaffRole) => {
        const colors = {
            CHEF: 'from-orange-500 to-red-500',
            BRANCH_MANAGER: 'from-blue-500 to-cyan-500',
            STAFF: 'from-green-500 to-emerald-500',
            ALL: 'from-purple-500 to-indigo-500',
        };
        return colors[role];
    };

    const getRoleText = (role: StaffRole) => {
        const text = {
            CHEF: 'Bếp trưởng',
            BRANCH_MANAGER: 'Quản lý',
            STAFF: 'Nhân viên',
            ALL: 'Tất cả',
        };
        return text[role];
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                        <GraduationCap className="text-white" size={28} strokeWidth={2.5} />
                                    </div>
                                    Quản Lý Khóa Đào Tạo
                                </h1>
                                <p className="text-gray-600 text-lg">Tạo và quản lý khóa học cho nhân viên</p>
                            </div>
                            <AddTrainingDialog />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Tổng khóa học
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {totalCourses}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <GraduationCap className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Đã xuất bản
                                    </p>
                                    <p className="text-4xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                                        {publishedCourses}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <CheckCircle className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Học viên
                                    </p>
                                    <p className="text-4xl font-bold text-purple-600 group-hover:scale-105 transition-transform">
                                        {totalEnrolled}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <Users className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Tỷ lệ hoàn thành
                                    </p>
                                    <p className="text-4xl font-bold text-orange-600 group-hover:scale-105 transition-transform">
                                        {completionRate}%
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <BookOpen className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                                strokeWidth={2.5}
                            />
                            <Input
                                placeholder="Tìm kiếm khóa học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 border-2 border-gray-200 rounded-xl focus:border-primary text-base"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {statuses.map((status) => (
                                <Button
                                    key={status.value}
                                    onClick={() => setSelectedStatus(status.value)}
                                    variant={selectedStatus === status.value ? 'default' : 'outline'}
                                    className={`rounded-xl font-semibold whitespace-nowrap transition-all ${selectedStatus === status.value
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                        : 'border-2 border-gray-200 text-gray-600 hover:border-primary'
                                        }`}
                                >
                                    {status.label}
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20">
                                        {status.count}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredCourses.map((course) => {
                            const courseCompletionRate =
                                course.enrolledCount > 0
                                    ? Math.round((course.completedCount / course.enrolledCount) * 100)
                                    : 0;

                            return (
                                <Card
                                    key={course.id}
                                    className="bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group"
                                >
                                    <div className="flex gap-6 p-6">
                                        {/* Thumbnail */}
                                        <div className="relative w-48 h-48 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                                            {course.thumbnail ? (
                                                <Image
                                                    src={course.thumbnail}
                                                    alt={course.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <GraduationCap size={48} className="text-gray-400" strokeWidth={1.5} />
                                                </div>
                                            )}
                                            {course.status === 'PUBLISHED' && (
                                                <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-xs font-bold shadow-lg">
                                                    Live
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                        {course.name}
                                                    </h3>
                                                    {course.recipeName && (
                                                        <p className="text-sm text-primary font-semibold mb-1 flex items-center gap-1">
                                                            <BookOpen size={14} strokeWidth={2.5} />
                                                            Công thức: {course.recipeName}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                                                </div>
                                            </div>

                                            {/* Roles */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {course.assignedRoles.map((role) => (
                                                    <span
                                                        key={role}
                                                        className={`px-3 py-1.5 bg-gradient-to-r ${getRoleColor(
                                                            role
                                                        )} text-white text-xs font-bold rounded-xl shadow-md`}
                                                    >
                                                        {getRoleText(role)}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border border-blue-100">
                                                    <Clock size={16} className="text-blue-500 mx-auto mb-1" strokeWidth={2.5} />
                                                    <p className="text-xs text-gray-500 font-semibold">{course.duration}p</p>
                                                </div>
                                                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-transparent rounded-xl border border-purple-100">
                                                    <Users size={16} className="text-purple-500 mx-auto mb-1" strokeWidth={2.5} />
                                                    <p className="text-xs text-gray-500 font-semibold">{course.enrolledCount}</p>
                                                </div>
                                                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-transparent rounded-xl border border-green-100">
                                                    <CheckCircle
                                                        size={16}
                                                        className="text-green-500 mx-auto mb-1"
                                                        strokeWidth={2.5}
                                                    />
                                                    <p className="text-xs text-gray-500 font-semibold">{courseCompletionRate}%</p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            {course.status === 'PUBLISHED' && course.enrolledCount > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-bold text-gray-500">Tiến độ</span>
                                                        <span className="text-xs font-bold text-gray-900">
                                                            {course.completedCount}/{course.enrolledCount}
                                                        </span>
                                                    </div>
                                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${courseCompletionRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-auto pt-4 border-t-2 border-gray-100">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all"
                                                >
                                                    <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                                    Sửa
                                                </Button>
                                                {course.status === 'DRAFT' && (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                    >
                                                        <Send size={16} className="mr-1" strokeWidth={2.5} />
                                                        Xuất bản
                                                    </Button>
                                                )}
                                                {course.status === 'PUBLISHED' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-xl transition-all"
                                                    >
                                                        <Eye size={16} className="mr-1" strokeWidth={2.5} />
                                                        Xem
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
